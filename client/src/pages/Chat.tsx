import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom';
import { Message } from '../components/Message';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, query, where, addDoc } from '@firebase/firestore';
import { ChatTopBar } from '../components/ChatTopBar';
import { ChatBox } from '../components/ChatBox';
import { auth, collections } from '../firebase/connection';
import {
  Role,
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

export const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = searchParams.get('chatId');
  const [messages, , error] = useCollectionData(
    query(collections.messages, where('chatId', '==', chatId))
  );
  const [chat] = useDocumentData(doc(collections.chats, chatId || 'empty'));
  const [role, setRole] = useState<Role>(); // should be of use later
  const [companionName, setCompanionName] = useState('');
  const [user, loading] = useAuthState(auth);
  const scrollingRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // redirect if user not logged in
    if (!loading && !user) {
      navigate('/');
    }
    if (error) {
      console.log(error);
    }
  }, [loading, user, navigate, error]);

  useEffect(() => {
    if (!chatId) navigate('/selection');
  }, [chatId, navigate]);

  useEffect(() => {
    const getData = async () => {
      const userRole = chat!.supporteeId === user!.uid ? 'supportee' : 'supporter';
      setRole(userRole);
      const compName = await getNameById(chat![getOppositeRoleFieldName(userRole)]!);
      setCompanionName(compName);
    };

    if (chat) {
      if (chat.supporteeId !== user?.uid && chat.supporterId !== user?.uid) navigate('/selection');
      getData();
    }
  }, [chat, user, navigate]);

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

  const sendMsg = async (message: string) => {
    const messageDate = getCurrDateIsrael();
    const newMsgData = {
      content: message,
      senderId: user!.uid,
      chatId: chatId,
      date: messageDate,
      status: 'received'
    };
    await addDoc(collections.messages, newMsgData);
  };

  // go back to the page of all chats
  const goBackToChatsPage = () => {
    navigate('/selection');
  };

  // request to change partner
  const changeChatRoom = async () => {
    finishChat(chatId!);

    const userId = user!.uid;

    const chatToFill = await findChatToFill(role!, userId);

    if (chatToFill) {
      await joinChatFirebase(userId, role!, chatToFill.id);
      const companionName = await getNameById(chatToFill[getOppositeRoleFieldName(role!)]!);
      setCompanionName(companionName);
      setSearchParams(createSearchParams({ chatId: chatToFill.id }));
    } else {
      const chat = await createChat(userId, role!);
      setCompanionName('');
      setSearchParams(createSearchParams({ chatId: chat.id }));
    }
  };

  // finish current chat
  const endChat = () => {
    finishChat(chatId!);
    goBackToChatsPage();
  };

  const noMessages = messages ? messages.length === 0 : true;

  return (
    <div className="chat-page">
      <ChatTopBar
        isChatEnded={chat?.status === 'ended'}
        companionName={companionName}
        isSupporter={role === 'supporter'}
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
              <Message
                key={index}
                isSender={m.senderId === user!.uid}
                content={m.content}
                messageDate={m.date}
                messageState={m.status}
              />
            ))
        )}
        <span ref={scrollingRef}></span>
      </div>

      <ChatBox sendChatMsg={sendMsg} blockSupporter={() => {}} />
    </div>
  );
};
