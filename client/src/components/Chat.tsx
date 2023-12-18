import { useEffect, useMemo, useRef, useState } from 'react';
import { ChatTopBar } from './ChatTopBar';
import { Role, getNameById, getOppositeRoleFieldName } from '../helpers/chatFunctions';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { addDoc, doc, query, where, limit, orderBy, getDocs, startAfter, DocumentData } from 'firebase/firestore';
import { collections } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import { Message } from './Message';
import { ChatBox } from './ChatBox';
import SupporteeWaiting from './SupporteeWaiting';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import useLoadingContext from '../context/loading/useLoadingContext';
import InfiniteScroll from 'react-infinite-scroll-component';
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
  status: "received" | "sent" | "read";
  content: string;
  senderId: string;
  date: string;
  id?: string | undefined;
}
export const Chat: React.FC<ChatProps> = ({
  chatId,
  userId,
  role,
  endChat,
  secondaryAction,
  goBack,
  tryToFind
}) => {
  const [messages, setMessages] = useState<MessageData[]>()
  const [lastVissible, setLastVisible] = useState<DocumentData>({})
  const [chat, chatLoading] = useDocumentData(doc(collections.chats, chatId || 'empty'));
  const [newLimit, setNewLimit] = useState<number>(0);
  const [stopOrContinue, setStopOrContinue] = useState(true)
  const [companionName, setCompanionName] = useState('');
  const [ifHasMore, setIfHasMore] = useState<boolean>(true);
  const navigate = useNavigate();
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const isKeyboardOpen = useDetectKeyboardOpen();
  useLoadingContext(chatLoading || undefined);

  const addNewLimit = async (newLim: number) => {
    setNewLimit(prevLimit =>  prevLimit + newLim);
  }
  const handleIfHasMore = () => {
    setIfHasMore(true)
  }

  useMemo(() => {
    const fetchMessages = async () => {
      const messagesQuery = query(collections.messages, where('chatId', '==', chatId), orderBy('date', 'desc'), startAfter(lastVissible), limit(12));
      const snapShLast = await getDocs(messagesQuery);
      if (snapShLast.docs.length > 0) {
        const newMessages = snapShLast.docs.map(doc => ({ id: doc.id, ...doc.data() as MessageData }));
        setMessages(prevMess => [...prevMess || [], ...newMessages]);
        if(snapShLast.docs){
            setLastVisible(snapShLast.docs[snapShLast.docs.length - 1]);
         }
      }
      addNewLimit(12)  
    };

    if(ifHasMore && stopOrContinue){
      setIfHasMore(false)
      fetchMessages();

    }
  }, [ifHasMore, stopOrContinue, chatId, lastVissible]);

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
    setMessages(prevMess => [newMsgData as MessageData, ...prevMess || []])
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
    if(messages && messages?.length < newLimit){
      setStopOrContinue(false);
    }
  }, [messages, stopOrContinue, newLimit]);
  
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
                  flexDirection: 'column-reverse',
                }}
              >
              <InfiniteScroll
                dataLength={messages ? messages?.length : 0} 
                next={() => handleIfHasMore()}
                style={{ display: 'flex', flexDirection: 'column-reverse' }}
                inverse={true}
                hasMore={stopOrContinue}
                loader={<h4></h4>}
                scrollableTarget="scrollableDiv"
              >
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
