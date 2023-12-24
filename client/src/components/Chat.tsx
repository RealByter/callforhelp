import { useEffect, useRef, useState, useCallback } from 'react';
import { ChatTopBar } from './ChatTopBar';
import { Role, getNameById, getOppositeRoleFieldName } from '../helpers/chatFunctions';
import { useDocumentData, useCollection } from 'react-firebase-hooks/firestore';
import {
  addDoc,
  doc,
  query,
  where,
  limit,
  orderBy,
  getDocs,
  startAfter,
  endBefore,
  DocumentData
} from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { collections, firestore } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import { Message } from './Message';
import { ChatBox } from './ChatBox';
import SupporteeWaiting from './SupporteeWaiting';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import useLoadingContext from '../context/loading/useLoadingContext';
import InfiniteScroll from 'react-infinite-scroll-component';

const MESSAGES_PER_LOAD = 12;

type ChatProps = {
  chatId: string;
  userId: string;
  role: Role;
  endChat: () => void;
  secondaryAction: () => void;
  goBack: () => void;
  tryToFind?: (existingChatId: string) => void;
};

type MessageData = {
  chatId: string;
  status: 'received' | 'sent' | 'read';
  content: string;
  senderId: string;
  date: string;
  id?: string | undefined;
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
  const [messages, setMessages] = useState<MessageData[]>();
  const [lastVisible, setLastVisible] = useState<DocumentData>({});
  const [firstVisible, setFirstVisible] = useState<DocumentData>({});
  const [newMessagesList] = useCollection(
    query(
      firstVisible ? collections.messages : collection(firestore, 'empty'),
      where('chatId', '==', chatId),
      orderBy('date', 'desc'),
      endBefore(firstVisible)
    )
  );
  const [chat, chatLoading] = useDocumentData(doc(collections.chats, chatId || 'empty'));
  const [infiniteScroll, setInfiniteScroll] = useState(true);
  const [companionName, setCompanionName] = useState('');
  const navigate = useNavigate();
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const isKeyboardOpen = useDetectKeyboardOpen();
  useLoadingContext(chatLoading || undefined);

  const fetchMessages = useCallback(async () => {
    const messagesQuery = query(
      collections.messages,
      where('chatId', '==', chatId),
      orderBy('date', 'desc'),
      startAfter(lastVisible),
      limit(MESSAGES_PER_LOAD)
    );
    const snapShLast = await getDocs(messagesQuery);
    if (snapShLast.docs.length > 0) {
      if (!messages) {
        setFirstVisible(snapShLast.docs[0]);
      }

      const newMessages = snapShLast.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as MessageData)
      }));
      setMessages((prevMess) => [...(prevMess || []), ...newMessages]);
      setLastVisible(snapShLast.docs[snapShLast.docs.length - 1]);
    }
    if (snapShLast.docs.length < MESSAGES_PER_LOAD) {
      setInfiniteScroll(false);
    }
  }, [chatId, lastVisible, messages]);

  useEffect(() => {
    if (!messages) {
      fetchMessages();
    }
  }, [fetchMessages, messages]);

  useEffect(() => {
    if (newMessagesList && newMessagesList.docs.length > 0) {
      setFirstVisible(newMessagesList.docs[0]);
      const newMessages = newMessagesList.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as MessageData)
        }))
        .filter( // to avoid updating the messages twice when sending a message but still allowing the user to get the message on a different device simultaneously
          (message) =>
            new Date(message.date).getTime() >
            new Date(messages && messages.length > 0 ? messages[0].date : 0).getTime()
        );

      setMessages((prevMess) => [...newMessages, ...(prevMess || [])]);
    }
  }, [newMessagesList, messages]);

  // get current date in IOS string
  const getCurrDateIsrael = () => {
    const here = new Date();
    const invDate = new Date(here.toLocaleString('en-US', { timeZone: 'Israel' }));
    const diff = here.getTime() - invDate.getTime();
    return new Date(here.getTime() - diff).toISOString();
  };

  const sendMsg = async (message: string) => {
    const messageDate = getCurrDateIsrael();
    const newMsgData: MessageData = {
      content: message,
      senderId: userId,
      chatId: chatId,
      date: messageDate,
      status: 'received'
    };
    setMessages((prevMess) => [newMsgData as MessageData, ...(prevMess || [])]);
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
            <div
              id="scrollableDiv"
              style={{
                height: '100vh',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse'
              }}>
              <InfiniteScroll
                dataLength={messages ? messages?.length : 0}
                next={fetchMessages}
                style={{ display: 'flex', flexDirection: 'column-reverse' }}
                inverse={true}
                hasMore={infiniteScroll}
                loader={<h4></h4>}
                scrollableTarget="scrollableDiv">
                {messages?.map((m, index) => (
                  <div key={index}>
                    <Message
                      key={index}
                      isSender={m.senderId === userId}
                      content={m.content}
                      messageId={m.id}
                      messageDate={m.date}
                      messageState={m.status}
                    />
                    <div ref={endOfMessagesRef} />
                  </div>
                ))}
              </InfiniteScroll>
            </div>
          )}
        </div>

        <ChatBox sendChatMsg={sendMsg} disabled={!companionName || chat?.status === 'ended'} />
      </div>
    );
  }

  return page;
};
