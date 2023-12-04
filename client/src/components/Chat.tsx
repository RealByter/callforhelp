import { useEffect, useRef, useState } from 'react';
import { ChatTopBar } from './ChatTopBar';
import { Role, getNameById, getOppositeRoleFieldName } from '../helpers/chatFunctions';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { addDoc, doc, query, where } from 'firebase/firestore';
import { collections } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import { Message } from './Message';
import { ChatBox } from './ChatBox';
import SupporteeWaiting from './SupporteeWaiting';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import useLoadingContext from '../context/loading/useLoadingContext';

type ChatProps = {
  chatId: string;
  userId: string;
  role: Role;
  endChat: () => void;
  secondaryAction: () => void;
  goBack: () => void;
  tryToFind?: (existingChatId: string) => void;
};

export const Chat: React.FC<ChatProps> = ({
  chatId,
  userId,
  role,
  endChat,
  secondaryAction,
  goBack,
  tryToFind
}) => {
  const [messages, messagesLoading] = useCollectionData(query(collections.messages, where('chatId', '==', chatId)));
  const [chat, chatLoading] = useDocumentData(doc(collections.chats, chatId || 'empty'));
  const [companionName, setCompanionName] = useState('');
  const navigate = useNavigate();
  const scrollingRef = useRef(null);
  const isKeyboardOpen = useDetectKeyboardOpen();
  useLoadingContext(chatLoading || messagesLoading);

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
      senderId: userId,
      chatId: chatId,
      date: messageDate,
      status: 'received'
    };
    await addDoc(collections.messages, newMsgData);
  };

  const noMessages = messages ? messages.length === 0 : true;

  useEffect(() => {
    if (!chatLoading && !chat) navigate('/selection');
  }, [chat, chatLoading, navigate]);

  useEffect(() => {
    const getData = async () => {
      const compName = await getNameById(chat![getOppositeRoleFieldName(role)]!);
      setCompanionName(compName);
      if (!compName) if (tryToFind) await tryToFind(chat!.id);
    };

    if (chat) {
      if (chat.supporteeId !== userId && chat.supporterId !== userId) {
        navigate('/selection');
      }
      getData();
    }
  }, [chat, userId, navigate, role, tryToFind]);

  useEffect(() => {
    // scroll to bottom of the chat when getting a new msg
    if (scrollingRef.current) {
      (scrollingRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  let page = <></>; // should be replaced with loading state once we have it
  if (!chatLoading && chat) {
    if (role === 'supportee' && !chat.supporterId) page = <SupporteeWaiting />;
    page = (
      <div className="chat-page">
        <ChatTopBar
          isMinimized={isKeyboardOpen || false}
          isChatEnded={chat?.status === 'ended'}
          companionName={companionName}
          isSupporter={role === 'supporter'}
          userId={userId}
          endChat={endChat}
          secondaryAction={secondaryAction}
          goBackToChatsPage={goBack}
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
                  isSender={m.senderId === userId}
                  content={m.content}
                  messageId={m.id}
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
  }

  return page;
};
