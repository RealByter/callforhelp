import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Message } from '../components/Message';
import { MOCK_MESSAGES } from '../mock-data/chat-mock-data';
import { useSocketCtx } from '../context/socket/useSocketCtx';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  doc,
  setDoc,
  limit,
  query,
  where,
  getDocs,
  addDoc
} from '@firebase/firestore';
import { ChatTopBar } from '../components/ChatTopBar';
import { ChatBox } from '../components/ChatBox';
import { auth, collections } from '../firebase/connection';
import { messageStatusType } from '../firebase/message';

/*
  TODO - take care of the disconnect events
  TODO - take care of cases in which the chat id doesnt exist
  TODO - leave socket room on exiting
*/

interface IGetMsgData {
  chatID: string,
  message: string,
  messageDate: string
}

interface IMessageData {
  senderId: string,
  content: string,
  messageDate: string,
  status: messageStatusType
}

type UserType = 'supporter' | 'supportee'

export const Chat = () => {
  const [msg, setMsg] = useState<IMessageData[]>(MOCK_MESSAGES);
  const [chatData, setChatData] = useState<any>([]);
  const [hasCompanion, setHasCompanion] = useState<boolean>(true);
  const [didChatEnd, setDidChatEnd] = useState<boolean>(false);
  const [userType, setUserTpe] = useState<UserType>('supporter'); //in the future - location.state
  const [user, loading] = useAuthState(auth);
  const { socket } = useSocketCtx();
  const scrollingRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const msgIsEmpty = (msg.length === 0);
  const thisChatId = location.state?.chatId?.[0];

  useEffect(() => {
    // get data
    (async function getData () {
      getChatData();
      getMessages();
    })();
  }, [location.state])

  useEffect(() => {
    // redirect if user not logged in
    if (!loading && !user) navigate("/");
  }, [])

  useEffect(() => {
    // take care of all the socket events
    socket.on("connect", joinChatRoom);
    socket.on("get message", receiveMsg);
    socket.on("close chat", closeChat);
    socket.on("chat blocked", closeChat);
    socket.on('user-joined', (username: string) => {
      console.log('username: ', username);
      setHasCompanion(true);
    });
    return () => {
      socket.off("get message");
      socket.off('user-joined');
      socket.off("close chat");
      socket.off("chat blocked");
      socket.off("connect", joinChatRoom);
    };
  }, [socket]);

  useEffect(() => {
    // scroll to bottom of the chat when getting a new msg
    scrollingRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msg]);

  // join the socket room of the current room
  const joinChatRoom = () => {
    socket.emit("join-chat", { chatID: thisChatId });
  }

  const getChatData = async () => {
    const thisChatId = location.state?.chatId?.[0];
    const queryChatData = query(
      collections.chats,
      where('id', '==', thisChatId),
      limit(1)
    );
    const querySnapshot = await getDocs(queryChatData);
    console.log('querySnapshot: ', querySnapshot);

    if (querySnapshot.size === 0) {
      // navigate("/");
      // alert there is no such chat
    } else {
      // if there is no companion - setHasCompanion(false);
      console.log('querySnapshot.docs[0].data(): ', querySnapshot.docs[0].data());
      setChatData(querySnapshot.docs[0].data()); //need to be formatted
    }
  }

  const getMessages = async () => {
    // get all previous messages
  }

  // get current date in IOS string
  const getCurrDateIsrael = () => {
    const here = new Date();
    const invDate = new Date(here.toLocaleString('en-US', { timeZone: "Israel" }));
    const diff = here.getTime() - invDate.getTime();
    return (new Date(here.getTime() - diff)).toISOString();
  }

  // send msg using socket
  const sendMsg = (message: string) => {
    const messageDate = getCurrDateIsrael();
    socket.emit("send message", { msg: message, chatID: thisChatId, messageDate }, undefined, () => {
      const newMsgData = {
        content: message,
        senderId: user.uid,
        chatId: thisChatId,
        date: messageDate
      };
      (async function () {
        await addDoc(collections.messages, newMsgData);
      })();
    });
    addToMsgList(message, user.uid || "", messageDate);
  };

  // receive msg using socket
  const receiveMsg = (data: IGetMsgData) => {
    const { chatID, message, messageDate } = data;
    if (chatID == thisChatId) { //will be useless if entering only the current chat room
      addToMsgList(message, "", messageDate); //need to get senderId
    }
  }

  // add new msg to msg list
  const addToMsgList = (message: string, senderId: string, date: string) => {
    setMsg((prev) => ([...prev, {
      content: message,
      senderId,
      messageDate: date,
      status: 'sent'
    }]));
  }

  // finish the chat (permanently) using socket
  const closeChat = () => {
    setDidChatEnd(true);
    //some ending chat architecture - maybe alert, maybe redirect
  }

  // block the chat
  const blockSupporter = async () => {
    socket.emit("block chat", { chatID: thisChatId });
    try {
      await setDoc(doc(collections.chats, thisChatId), { status: 'BLOCKED' });
    } catch (err) {
      console.log('err: ', err);
    }
  }

  // go back to the page of all chats
  const goBackToChatsPage = () => {
    navigate("/");
  }

  // request to change partner
  const changeChatRoom = () => {
    // there is nothing to do for now
  }

  // finish current chat
  const endChat = async () => {
    socket.emit("stop chat", { chatID: thisChatId });
    try {
      await setDoc(doc(collections.chats, thisChatId), { status: 'ENDED' });
    } catch (err) {
      console.log('err: ', err);
    }
    goBackToChatsPage();
  }

  return (
    <div className="chat-page">
      <ChatTopBar
        isChatEnded={didChatEnd}
        companionName={""}
        isSupporter={userType === "supporter"} //maybe - if chatData.supporterId === user.uid
        endChat={endChat}
        changeChatRoom={changeChatRoom}
        goBackToChatsPage={goBackToChatsPage} />

      <div className="messages">
        {msgIsEmpty ? (
          <span className="no-msg">{hasCompanion ? "עוד אין הודעות" : "עוד אין שותף"}</span> 
          //add the 'there is no supporter yet' part
        ) : (
            msg.map((m, index) => (
              <React.Fragment key={index}>
                <Message
                  isSender={m.senderId === user?.uid}
                  content={m.content}
                  messageDate={m.messageDate} />
              </React.Fragment>
            ))
          )}
        <span ref={scrollingRef}></span>
      </div>

      <ChatBox sendChatMsg={sendMsg} blockSupporter={blockSupporter} />
    </div>
  );
};
