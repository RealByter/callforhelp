import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/connection';
import { useAuthState } from 'react-firebase-hooks/auth';
import OrBackground from '../assets/OrBackground.svg';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { getRealtimeLastMessage, getUnreadMessagesCount } from '../helpers/chatFunctions';
import { Message } from '../firebase/message';
import { getCurrDateIsrael, isYesterday } from '../helpers/dateFunctions';

export interface ChatItemProps {
  name: string,
  isEnded: boolean,
  chatId: string
};

export const ChatItem: React.FC<ChatItemProps> = ({ name, isEnded, chatId }: ChatItemProps) => {

  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [lastMessage, setLastMessage] = useState<Message>(); // needed for the unreadMessages accuracy
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState("");


  useEffect(() => {
    // redirect if user not logged in
    if (!userLoading && !user) navigate('/');
  }, [user, userLoading, navigate]);


  useEffect(() => {
    if (!user) return;
    if (!name) return; // needed because if !name => no supporter yet

    let unsubscribe = getRealtimeLastMessage(chatId, (message: Message) => {
      setLastMessage(message);

      if (message) {
        setLastMessageTimestamp(formatLastMessageTimestamp(message.date));
      }
    })

    return (() => {
      unsubscribe();
    });
  }, [user, name])


  useEffect(() => {
    if (!user) return;

    (async () => {
      const count = await getUnreadMessagesCount(user!.uid, chatId);
      setUnreadMessages(count);
    })();

  }, [lastMessage])


  const formatLastMessageTimestamp = (timestamp: string) => {
    const curr = getCurrDateIsrael();
    const currDate = curr.toLocaleDateString();
    const other = new Date(timestamp);
    const otherDate = other.toLocaleDateString();
    const otherTime = other.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

    if (otherDate === currDate) // if date is today
    {
      return otherTime;
    }
    else if (isYesterday(otherDate, currDate)) {
      return "אתמול";
    }
    else {
      return otherDate.replace("/", ".").replace("/", "."); // twice in orderto replace all
    }
  }

  const onItemClick = () => {
    navigate({
      pathname: '/chat',
      search: createSearchParams({ chatId: chatId }).toString()
    })
  }

  return (
    <li className='chat-item' onClick={onItemClick} tabIndex={0}>
      <div className='content'>
        <span className='name'>{name}</span>
        {lastMessageTimestamp &&
          <span className='last-message'>תגובה אחרונה <span>{lastMessageTimestamp}</span></span>}
      </div>

      <div className='rest'>
        {unreadMessages && !isEnded ?
          <div className='notification'>
            <img src={OrBackground} alt="notification-icon" />
            <span className='unread-messages'>{unreadMessages}</span>
          </div> : null}

        <svg
          className="arrow"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none">
          <path d="M10 12L6 8L10 4" stroke="#0E1C74" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </li>
  );
};
