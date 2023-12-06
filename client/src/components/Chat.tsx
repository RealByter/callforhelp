import { useEffect, useRef, useState, useCallback } from 'react';
import { ChatTopBar } from './ChatTopBar';
import { Role, getNameById, getOppositeRoleFieldName } from '../helpers/chatFunctions';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { addDoc, doc, query, where } from 'firebase/firestore';
import { collections } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import { Message } from './Message';
import { ChatBox } from './ChatBox';
import SupporteeWaiting from './SupporteeWaiting';
import useLoadingContext from '../context/loading/useLoadingContext';
import { getCurrDateIsrael } from '../helpers/dateFunctions';
import { useInView } from 'react-intersection-observer';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import CircleSharpIcon from '@mui/icons-material/CircleSharp';

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
  const [newMsgs, setNewMsgs] = useState(0);
  const navigate = useNavigate();
  useLoadingContext(chatLoading || messagesLoading);

  // for the scrolling behaviour
  const ref = useRef();
  const { ref: inViewRef, inView } = useInView();
  const isInitScroll = useRef(true);

  const setRefs = useCallback(
    (node) => {
      ref.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  const sendMsg = async (message: string) => {
    const messageDate = getCurrDateIsrael().toISOString();
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
    if (!ref.current) return;
    const scrollElemrnt = ref.current as HTMLElement;

    let isUserRecentSender = false;

    if (messages) {
      let recentMsg = messages[messages.length - 1];
      isUserRecentSender = recentMsg.senderId == userId;
    }

    // on page launch
    if (isInitScroll.current) {
      scrollElemrnt.scrollIntoView({ behavior: 'instant' });
      isInitScroll.current = false;
      return;
    }

    // if the user scrolled up and did not sent the last message
    if (!inView && !isUserRecentSender) {
      // console.log(newMsgs)
      setNewMsgs(newMsgs + 1);
      return;
    };

    // if the user scrolled up and sent the last message
    if (!inView) {
      scrollElemrnt.scrollIntoView({ behavior: 'instant' });
    }

    // scroll to bottom when a new msg is received    
    scrollElemrnt.scrollIntoView({ behavior: 'smooth' });

  }, [messages?.length]); // for some reason for the dependency array [messages] the effect was launched twice for every message that was sent

  useEffect(() => {
    // resets the count when the user scrolls down
    if (inView) setNewMsgs(0);
  }, [inView])

  const scrollDown = () => {
    if (!ref.current) return;
    const scrollElemrnt = ref.current as HTMLElement;

    scrollElemrnt.scrollIntoView({ behavior: 'smooth' });
  }

  let page = <></>; // todo: should be replaced with loading state once we have it
  if (!chatLoading && chat) {
    if (role === 'supportee' && !chat.supporterId) page = <SupporteeWaiting />;
    page = (
      <div className="chat-page">
        <ChatTopBar
          isChatEnded={chat?.status === 'ended'}
          companionName={companionName}
          isSupporter={role === 'supporter'}
          userId={userId}
          endChat={endChat}
          secondaryAction={secondaryAction}
          goBackToChatsPage={goBack}
        />

        <div className="messages">
          {noMessages ?
            <span className="no-msg">{companionName ? 'עוד אין הודעות' : 'עוד אין שותף'}</span>
            :
            (messages && messages
              .sort((a, b) => {
                const aDate = new Date(a.date);
                const bDate = new Date(b.date);
                return aDate.getTime() - bDate.getTime();
              })
              .map((m, index) =>
              <div key={index} ref={index == messages.length - 2 ? setRefs : null}> {/* the scrolling ref is set to the message before last*/}
                  <Message
                    isSender={m.senderId === userId}
                    content={m.content}
                    messageId={m.id}
                    messageDate={m.date}
                    messageState={m.status}
                  />
                </div>)
            )}

          {!inView &&
            <div className='parent'>
              <div className='scroll-button' onClick={scrollDown}>
                <CircleSharpIcon className='circle' fontSize='large' />
                <KeyboardDoubleArrowDownIcon className='arrow' />
              </div>
              {newMsgs != 0 && <span className='new-msgs'>{newMsgs}</span>}
            </div>}
        </div>

        <ChatBox sendChatMsg={sendMsg} disabled={!companionName || chat?.status === 'ended'} />
      </div>
    );
  }

  return page;
};
