import React, { useEffect, useRef, useState } from 'react';
import { Message, IMessageProps } from '../components/Message';
import { MOCK_MESSAGES } from '../mock-data/chat-mock-data';
import { useSocketCtx } from '../context/socket/useSocketCtx';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChatTopBar } from '../components/ChatTopBar';
import { ChatBox } from '../components/ChatBox';

/*
  TODO - also - take care of the disconnect events
  TODO - also - take care of cases in which the chat id doesnt exist
  TODO - leave socket room on exiting
*/

interface IGetMsgData {
  chatID: string,
  message: string,
  messageID: string,
  messageDate: string
}

interface IMsg extends IMessageProps {
  id: number | string
}

export const Chat = () => {
  const [msg, setMsg] = useState<IMsg[]>(MOCK_MESSAGES);
  const [didChatEnd, setDidChatEnd] = useState(false);
  const [isSupporter, setIsSupporter] = useState(true); //in the future - pars of location params
  const scrollingRef = useRef(null);
  const { socket } = useSocketCtx();
  const navigate = useNavigate();
  const { chatId: thisChatId } = useParams();
  // const location = useLocation(); //currently using params but we will use location
  const msgIsEmpty = (msg.length === 0);

  useEffect(() => {
    // connect to chat room on entrance
    joinChatRoom();
  }, [])

  useEffect(() => {
    // take care of all the socket events
    socket.on("reconnect", joinChatRoom); //reconnecting
    socket.on("get message", receiveMsg);
    socket.on("close chat", closeChat);
    socket.on("chat blocked", closeChat);
    return () => {
      socket.off("get message");
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

  // send msg using socket
  const sendMsg = (message: string) => {
    socket.emit("send message", { msg: message, chatID: thisChatId }, undefined, (messageID: string, messageDateISOString: string) => {
      addToMsgList(message, true, messageID, messageDateISOString);
      return;
    });
  };

  // receive msg using socket
  const receiveMsg = (data: IGetMsgData) => {
    const { chatID, message, messageID, messageDate } = data;
    if (chatID == thisChatId) { //will be useless if entering only the current chat room
      addToMsgList(message, false, messageID, messageDate);
    }
  }

  // add new msg to msg list
  const addToMsgList = (message: string, isSender: boolean, messageID: string, date: string) => {
    setMsg((prev) => ([...prev, {
      id: messageID || (prev.length + 1),
      content: message,
      isSender,
      messageDate: date
    }]));
  }

  // finish the chat (permanently) using socket
  const closeChat = () => {
    setDidChatEnd(true);
    //some ending chat architecture - maybe alert, maybe redirect
  }

  // block the chat
  const blockSupporter = () => {
    socket.emit("block chat", { chatID: thisChatId });
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
  const endChat = () => {
    socket.emit("stop chat", { chatID: thisChatId });
    //alert?
    goBackToChatsPage();
  }

  return (
    <div className="chat-page">
      <ChatTopBar
        isChatEnded={didChatEnd}
        isSupporter={isSupporter}
        endChat={endChat}
        changeChatRoom={changeChatRoom}
        goBackToChatsPage={goBackToChatsPage} />

      <div className="messages">
        {msgIsEmpty ? (
          <span className="no-msg">עוד אין הודעות</span>
        ) : (
            msg.map((m) => (
              <React.Fragment key={m.id}>
                <Message
                  isSender={m.isSender}
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
