import { useEffect, useRef, useState } from 'react';
import { ChatTopBar } from './ChatTopBar';
import { Role, assignSupportee, assignSupporter, finishChat, getNameById, getOppositeRoleFieldName } from '../helpers/chatFunctions';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { addDoc, doc, query, where } from 'firebase/firestore';
import { collections } from '../firebase/connection';
import { SetURLSearchParams, createSearchParams, useNavigate } from 'react-router-dom';
import { Message } from './Message';
import { ChatBox } from './ChatBox';

type ChatProps = {
  chatId: string;
  userId: string;
  displayName: string;
  setSearchParams: SetURLSearchParams;
};

export const Chat: React.FC<ChatProps> = ({ chatId, userId, setSearchParams, displayName }) => {
  const [messages] = useCollectionData(
    query(collections.messages, where('chatId', '==', chatId))
  );
  const [chat, chatLoading] = useDocumentData(doc(collections.chats, chatId || 'empty'));
  const [role, setRole] = useState<Role>(); // should be of use later
  const [companionName, setCompanionName] = useState('');
  const navigate = useNavigate();
  const scrollingRef = useRef(null);

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

  // go back to the page of all chats
  const goBackToChatsPage = () => {
    if (role === 'supportee') navigate('/selection');
    else navigate('/chats');
  };

  // request to change partner
  const changeSupporter = async () => {
    finishChat(chatId!);

    setSearchParams(
      createSearchParams({ chatId: await assignSupportee(userId, displayName) })
    );
    setCompanionName('');
  };

  // finish current chat
  const endChat = () => {
    finishChat(chatId!);
    goBackToChatsPage();
  };

  const noMessages = messages ? messages.length === 0 : true;

  useEffect(() => {
    const getData = async () => {
      const userRole = chat!.supporteeId === userId ? 'supportee' : 'supporter';
      setRole(userRole);
      const compName = await getNameById(chat![getOppositeRoleFieldName(userRole)]!);
      setCompanionName(compName);
    };

    if (chat) {
      if (chat.supporteeId !== userId && chat.supporterId !== userId) navigate('/selection');
      getData();
    }
  }, [chat, userId, navigate]);

  useEffect(() => {
    // scroll to bottom of the chat when getting a new msg
    if (scrollingRef.current) {
      (scrollingRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-page">
      <ChatTopBar
        isChatEnded={chat?.status === 'ended'}
        companionName={companionName}
        isSupporter={role === 'supporter'}
        userId={userId}
        endChat={endChat}
        changeSupporter={changeSupporter}
        findAdditionalSupportee={() => assignSupporter(userId)}
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
                isSender={m.senderId === userId}
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
};
