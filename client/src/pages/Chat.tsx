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
import {
  createChat,
  findChatToFill,
  finishChat,
  getNameById,
  getOppositeRoleFieldName,
  joinChatFirebase
} from '../helpers/chatFunctions';

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
  const [chatId, setChatId] = useState(
    Array.isArray(location.state.chatId) ? location.state.chatId[0].id : location.state.chatId
  );
  const [messagesData, loadingMessages, error] = useCollectionDataOnce(
    query(collections.messages, where('chatId', '==', chatId))
  );
  const [messages, setMessages] = useState<IMessageData[]>([]);
  const [didChatEnd, setDidChatEnd] = useState<boolean>(false);
  const [companionName, setCompanionName] = useState(
    (Array.isArray(location.state.companionName)
      ? location.state.companionName[0]
      : location.state.companionName) || ''
  );
  const [user, loading] = useAuthState(auth);
  const { socket } = useSocketCtx();
  const scrollingRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // redirect if user not logged in
    if (!loading) {
      if (!user) navigate('/');
      else socket.emit('join-chat', { chatIds: chatId, username: user.displayName });
    }
    if (error) {
      console.log(error);
    }
  }, [loading, user, navigate, error, socket, chatId]);

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
    socket.emit('send message', { msg: message, chatID: chatId, messageDate }, undefined, () => {
      const newMsgData = {
        content: message,
        senderId: user!.uid,
        chatId: chatId,
        date: messageDate,
        status: 'received'
      };
      (async function () {
        await addDoc(collections.messages, newMsgData);
      })();
    });
    addToMsgList(message, user!.uid || '', messageDate, 'received');
  };

  // add new msg to msg list
  const addToMsgList = (
    message: string,
    senderId: string,
    date: string,
    status: 'sent' | 'loading' | 'received' | 'read'
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
    socket.emit('block chat', { chatID: chatId });
    try {
      await updateDoc(doc(collections.chats, chatId), { status: 'blocked' });
    } catch (err) {
      console.log('err: ', err);
    }
    navigate('/selection');
  };

  // go back to the page of all chats
  const goBackToChatsPage = () => {
    navigate('/supportedsList', { state: { companionName, chatId: chatId, role: location.state.role } });
  };

  // request to change partner
  const changeChatRoom = async () => {
    finishChat(socket, chatId);

    const role = location.state.role;
    const userId = user!.uid;

    const chatToFill = await findChatToFill(role, userId);

    if (chatToFill) {
      await joinChatFirebase(userId, role, chatToFill.id);
      const companionName = await getNameById(chatToFill[getOppositeRoleFieldName(role)]!);
      setCompanionName(companionName);
      setChatId(chatToFill.id);
    } else {
      const chat = await createChat(userId, role);
      setCompanionName('');
      setChatId(chat.id);
    }
  };

  // finish current chat
  const endChat = () => {
    finishChat(socket, chatId);
    goBackToChatsPage();
  };

  useEffect(() => {
    // join the socket room of the current room
    const joinChatRoom = () => {
      socket.emit('join-chat', { chatID: chatId });
    };

    // receive msg using socket
    const receiveMsg = (data: IGetMsgData) => {
      const { chatID, message, messageDate } = data;
      if (chatID === chatId) {
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
  }, [socket, chatId]);

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
          messages!
            .sort((a, b) => {
              const aDate = new Date(a.date);
              const bDate = new Date(b.date);
              return aDate.getTime() - bDate.getTime();
            })
            .map((m, index) => (
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
