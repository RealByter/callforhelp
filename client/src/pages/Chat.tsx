import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom';
import useDetectKeyboardOpen from "use-detect-keyboard-open";
import { Message } from '../components/Message';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, query, where, addDoc } from '@firebase/firestore';
import { ChatTopBar } from '../components/ChatTopBar';
import { ChatBox } from '../components/ChatBox';
import { auth, collections } from '../firebase/connection';
import {
  Role,
  assignSupportee,
  assignSupporter,
  finishChat,
  getNameById,
  getOppositeRoleFieldName
} from '../helpers/chatFunctions';
import { getCurrDateIsrael } from '../helpers/dateFunctions';
import SupporteeWaiting from '../components/SupporteeWaiting';

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
  const [chat, chatLoading] = useDocumentData(doc(collections.chats, chatId || 'empty'));
  const [role, setRole] = useState<Role>(); // should be of use later
  const [companionName, setCompanionName] = useState('');
  const [user, userLoading] = useAuthState(auth);
  const scrollingRef = useRef(null);
  const navigate = useNavigate();
  const isKeyboardOpen = useDetectKeyboardOpen();

  useEffect(() => {
    // redirect if user not logged in
    if (!userLoading && !user) {
      navigate('/');
    }
    if (error) {
      console.log(error);
    }
  }, [userLoading, user, navigate, error]);

  useEffect(() => {
    if (!chatId) navigate('/selection');
  }, [chatId, navigate]);

  useEffect(() => {
    if (!chatLoading && !chat) navigate('/selection');
  }, [chat, chatLoading, navigate]);

  useEffect(() => {
    const getData = async () => {
      const userRole = chat!.supporteeId === user!.uid ? 'supportee' : 'supporter';
      setRole(userRole);
      const compName = await getNameById(chat![getOppositeRoleFieldName(userRole)]!); // todo: getName from chatObj instead?
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

  const sendMsg = async (message: string) => {
    const messageDate = getCurrDateIsrael().toISOString();
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
    if (role === 'supportee') navigate('/selection');
    else navigate('/chats');
  };

  // request to change partner
  const changeSupporter = async () => {
    finishChat(chatId!);

    setSearchParams(
      createSearchParams({ chatId: await assignSupportee(user!.uid, user!.displayName!) })
    );
    setCompanionName('');
  };

  // finish current chat
  const endChat = () => {
    finishChat(chatId!);
    goBackToChatsPage();
  };

  const noMessages = messages ? messages.length === 0 : true;

  let page = (
    <div className="chat-page">
      <ChatTopBar
        isMinimized={isKeyboardOpen}
        isChatEnded={chat?.status === 'ended'}
        companionName={companionName}
        isSupporter={role === 'supporter'}
        userId={user?.uid}
        endChat={endChat}
        changeSupporter={changeSupporter}
        findAdditionalSupportee={() => assignSupporter(user!.uid)}
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
                messageId={m.id}
                isSender={m.senderId === user!.uid}
                content={m.content}
                messageDate={m.date}
                messageState={m.status}
              />
            ))
        )}
        <span ref={scrollingRef}></span>
      </div>

      <ChatBox sendChatMsg={sendMsg} disabled={!companionName || chat?.status === 'ended'} />
    </div>
  );

  if (!role) page = <></>;
  else if (role === 'supportee' && !chat?.supporterId) page = <SupporteeWaiting />;

  return page;
};
