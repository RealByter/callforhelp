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
  assignSupportee,
  assignSupporter,
  finishChat,
  getNameById,
  getOppositeRoleFieldName
} from '../helpers/chatFunctions';
import SupporteeWaiting from '../components/SupporteeWaiting';

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

  const [msgDiff, setMsgDiff] = useState<number>(0);
  const [msgLength, setMsgLength] = useState<number>(messages?.length || 0);

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
      const compName = await getNameById(chat![getOppositeRoleFieldName(userRole)]!);
      setCompanionName(compName);
    };

    if (chat) {
      if (chat.supporteeId !== user?.uid && chat.supporterId !== user?.uid) navigate('/selection');
      getData();
    }
  }, [chat, user, navigate]);

  useEffect(() => {
    // check if the scrolling element is in viewport
    function isInViewport(element: HTMLElement) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        (rect.bottom - 50) <= (window.innerHeight || document.documentElement.clientHeight)
      );
    }
    if (scrollingRef.current) {
      if (isInViewport(scrollingRef.current)) {
        scrollToBottom('smooth');
        setMsgDiff(0);
      } else {
        // if now in viewport - add button to scroll down
        setMsgLength(prev => {
          const diff = (messages?.length || 0) - prev;
          setMsgDiff(prev => prev + diff);
          return messages?.length || 0;
        })
      }
    }
  }, [messages]);

  useEffect(() => {
    // immediately scroll down when entering the page
    if (scrollingRef.current) {
      scrollToBottom('instant');
    }
  }, [scrollingRef.current]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const element = e.currentTarget;
    if (element.scrollHeight - element.scrollTop - 1 <= element.clientHeight) {
      setMsgDiff(0);
    }
  };

  const scrollToBottom = (behavior: 'smooth' | 'instant' | 'auto') => {
    (scrollingRef.current as HTMLElement).scrollIntoView({ behavior });
    setMsgLength(messages.length);
  }

  const scrollDownClick = () => {
    if (scrollingRef.current) {
      scrollToBottom('smooth');
    }
  };

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
        isChatEnded={chat?.status === 'ended'}
        companionName={companionName}
        isSupporter={role === 'supporter'}
        userId={user?.uid}
        endChat={endChat}
        changeSupporter={changeSupporter}
        findAdditionalSupportee={() => assignSupporter(user!.uid)}
        goBackToChatsPage={goBackToChatsPage}
      />

      <div className="messages" onScroll={handleScroll}>
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
      <div className="has-messages"
        onClick={scrollDownClick}
        style={{ display: msgDiff ? "flex" : "none" }}>{msgDiff}</div>

      <ChatBox sendChatMsg={sendMsg} disabled={!companionName || chat?.status === 'ended'} />
    </div>
  );

  if (!role) page = <></>;
  else if (role === 'supportee' && !chat?.supporterId) page = <SupporteeWaiting />;

  return page;
};
