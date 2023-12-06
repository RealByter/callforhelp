import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/connection';
import { useAuthState } from 'react-firebase-hooks/auth';
import OrBackground from '../assets/OrBackground.svg';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { assignSupporter, getRealtimeLastMessage, getUnreadMessagesCount } from '../helpers/chatFunctions';
import { Message } from '../firebase/message';
import { formatLastMessageTimestamp } from '../helpers/dateFunctions';

export interface ChatItemProps {
  name: string | null;
  isEnded: boolean;
  chatId: string;
}

export const ChatItem: React.FC<ChatItemProps> = ({ name, isEnded, chatId }) => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [lastMessage, setLastMessage] = useState<Message>(); // needed for the unreadMessages accuracy
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState('');

  useEffect(() => {    
    if (!user) return;
    if (!name) { // if !name => no supporter yet      
      assignSupporter(user.uid, chatId);
    } else {
      const unsubscribe = getRealtimeLastMessage(chatId, (message: Message) => {
        setLastMessage(message);

        if (message) {
          setLastMessageTimestamp(formatLastMessageTimestamp(message.date));
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user, name, chatId]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const count = await getUnreadMessagesCount(user!.uid, chatId);
      setUnreadMessages(count);
    })();
  }, [lastMessage, chatId, user]);

  const onItemClick = () => {
    navigate({
      pathname: '/supporter-chat',
      search: createSearchParams({ chatId: chatId }).toString()
    });
  };

  return (
    <li className={`chat-item ${isEnded && 'chat-item-ended'}`} onClick={onItemClick} tabIndex={0}>
      <div className="content">
        <span className="name">{name || (isEnded ? 'לא נמצא נתמך' : 'מחפשים לך נתמך...')}</span>
        {lastMessageTimestamp && (
          <span className="last-message">
            תגובה אחרונה <span>{lastMessageTimestamp}</span>
          </span>
        )}
      </div>

      <div className="rest">
        {unreadMessages && !isEnded ? (
          <div className="notification">
            <img src={OrBackground} alt="notification-icon" />
            <span className="unread-messages">{unreadMessages >= 10 ? '9+' : unreadMessages}</span>
          </div>
        ) : null}
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
