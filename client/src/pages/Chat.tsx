import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Message } from '../components/Message';
import { useSocketCtx } from '../context/socket/useSocketCtx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { doc, query, where, addDoc } from '@firebase/firestore';
import { ChatTopBar } from '../components/ChatTopBar';
import { ChatBox } from '../components/ChatBox';
import { auth, collections } from '../firebase/connection';
import { messageStatusType } from '../firebase/message';
import { updateDoc } from 'firebase/firestore';

/*
  TODO - take care of the disconnect events
  TODO - take care of cases in which the chat id doesnt exist
  TODO - leave socket room on exiting
*/

interface IGetMsgData {
  chatID: string;
  message: string;
  messageDate: string;
}

interface IMessageData {
  senderId: string;
  content: string;
  date: string;
  status: messageStatusType;
}

export const Chat = () => {
  const location = useLocation();
  const thisChatId = Array.isArray(location.state.chatId)
    ? location.state.chatId[0].id
    : location.state.chatId;
  const [messagesData, loadingMessages, error] = useCollectionDataOnce(
    query(collections.messages, where('chatId', '==', thisChatId))
  );
  const [messages, setMessages] = useState<IMessageData[]>([]);
  const [didChatEnd, setDidChatEnd] = useState<boolean>(false);
  const thisCompanionName = Array.isArray(location.state.companionName)
    ? location.state.companionName[0]
    : location.state.companionName;
  const [companionName, setCompanionName] = useState(thisCompanionName || '');
  const [user, loading] = useAuthState(auth);
  const { socket } = useSocketCtx();
  const scrollingRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // redirect if user not logged in
    if (!loading) {
      if (!user) navigate('/');
      else socket.emit('join-chat', { chatIds: thisChatId, username: user.displayName });
    }
    if (error) {
      console.log(error);
    }
  }, [loading, user, navigate, error, socket, thisChatId]);

  useEffect(() => {
    if (messagesData && !loadingMessages) {
      setMessages(
        messagesData.map((message) => {
          return {
            senderId: message.senderId,
            content: message.content,
            date: message.date,
            status: message.status
          };
        })
      );
    }
  }, [messagesData, loadingMessages]);

  useEffect(() => {
    // scroll to bottom of the chat when getting a new msg
    if (scrollingRef.current) {
      (scrollingRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // get current date in IOS string
  const getCurrDateIsrael = () => {
    const here = new Date();
    const invDate = new Date(here.toLocaleString('en-US', { timeZone: 'Israel' }));
    const diff = here.getTime() - invDate.getTime();
    return new Date(here.getTime() - diff).toISOString();
  };

  // send msg using socket
  const sendMsg = (message: string) => {
    const messageDate = getCurrDateIsrael();
    socket.emit(
      'send message',
      { msg: message, chatID: thisChatId, messageDate },
      undefined,
      () => {
        const newMsgData = {
          content: message,
          senderId: user!.uid,
          chatId: thisChatId,
          date: messageDate,
          status: 'received'
        };
        (async function () {
          await addDoc(collections.messages, newMsgData);
        })();
      }
    );
    addToMsgList(message, user!.uid || '', messageDate, 'received');
  };

  // add new msg to msg list
  const addToMsgList = (
    message: string,
    senderId: string,
    date: string,
    status: 'sent' | 'loading' | 'received'
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        content: message,
        senderId,
        date,
        status
      }
    ]);
  };

  // finish the chat (permanently) using socket
  const closeChat = () => {
    setDidChatEnd(true);
    //some ending chat architecture - maybe alert, maybe redirect
  };

  // block the chat
  const blockSupporter = async () => {
    socket.emit('block chat', { chatID: thisChatId });
    try {
      await updateDoc(doc(collections.chats, thisChatId), { status: 'blocked' });
    } catch (err) {
      console.log('err: ', err);
    }
  };

  // go back to the page of all chats
  const goBackToChatsPage = () => {
    navigate('/selection');
  };

  // request to change partner
  const changeChatRoom = () => {
    // there is nothing to do for now
  };

  // finish current chat
  const endChat = async () => {
    socket.emit('stop chat', { chatID: thisChatId });
    try {
      await updateDoc(doc(collections.chats, thisChatId), { status: 'ended' });
    } catch (err) {
      console.log('err: ', err);
    }
    goBackToChatsPage();
  };

  useEffect(() => {
    // join the socket room of the current room
    const joinChatRoom = () => {
      socket.emit('join-chat', { chatID: thisChatId });
    };

    // receive msg using socket
    const receiveMsg = (data: IGetMsgData) => {
      const { chatID, message, messageDate } = data;
      if (chatID === thisChatId) {
        //will be useless if entering only the current chat room
        addToMsgList(message, '', messageDate, 'received'); //need to get senderId
      }
    };

    // take care of all the socket events
    socket.on('connect', joinChatRoom);
    socket.on('get message', receiveMsg);
    socket.on('close chat', closeChat);
    socket.on('chat blocked', closeChat);
    socket.on('user-joined', (username: string) => {
      setCompanionName(username);
    });
    return () => {
      socket.off('get message');
      socket.off('user-joined');
      socket.off('close chat');
      socket.off('chat blocked');
      socket.off('connect', joinChatRoom);
    };
  }, [socket, thisChatId]);

  const noMessages = messages?.length === 0;

  return (
    <div className="chat-page">
      <ChatTopBar
        isChatEnded={didChatEnd}
        companionName={companionName}
        isSupporter={location.state.role === 'supporter'}
        endChat={endChat}
        changeChatRoom={changeChatRoom}
        goBackToChatsPage={goBackToChatsPage}
      />

      <div className="messages">
        {noMessages ? (
          <span className="no-msg">{companionName ? 'עוד אין הודעות' : 'עוד אין שותף'}</span>
        ) : (
          messages!.map((m, index) => (
            <React.Fragment key={index}>
              <Message
                isSender={m.senderId === user!.uid}
                content={m.content}
                messageDate={m.date}
                messageState={m.status}
              />
            </React.Fragment>
          ))
        )}
        <span ref={scrollingRef}></span>
      </div>

      <ChatBox sendChatMsg={sendMsg} blockSupporter={blockSupporter} />
    </div>
  );
};
