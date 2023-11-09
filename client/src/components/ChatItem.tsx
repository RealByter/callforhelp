import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/connection';
import { useAuthState } from 'react-firebase-hooks/auth';
import OrBackground from '../assets/OrBackground.svg';
import { createSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { getRealtimeLastMessageTimestamp, getUnreadMessagesCount } from '../helpers/chatFunctions';

export interface ChatItemProps {
  name: string,
  isEnded: boolean,
  chatId: string
};

export const ChatItem: React.FC<ChatItemProps> = ({ name, isEnded, chatId }: ChatItemProps) => {

  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [plainTimestamp, setPlainTimestamp] = useState(""); // needed for the unreadMessages accuracy
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState("");


  useEffect(() => {
    // redirect if user not logged in
    if (!userLoading && !user) navigate('/');
  }, [user, userLoading, navigate]);


  useEffect(() => {
    if (!user) return;
    if (!name) return; // needed because if !name => no supporter yet

    let unsubscribe = getRealtimeLastMessageTimestamp(chatId, (timestamp: string) => {
      if (timestamp) {
        setLastMessageTimestamp(FormatLastMessageTimestamp(timestamp));
        setPlainTimestamp(timestamp);
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

  }, [plainTimestamp])


  const FormatLastMessageTimestamp = (timestamp: string) => {
    let currDateAndTime = FormatDateAndTime(new Date().toISOString());
    let dateAndTime = FormatDateAndTime(timestamp);

    if (dateAndTime.date === currDateAndTime.date) // if date is today
    {
      return dateAndTime.time;
    }
    else if (IsYesterday(dateAndTime.date, currDateAndTime.date)) {
      return "אתמול";
    }
    else {
      return dateAndTime.date;
    }
  }

  const FormatDateAndTime = (dateAndTime: string) => {
    let arr = dateAndTime.split("T");
    let res = { date: arr[0], time: arr[1] };
    res.date = res.date.split("-").join(".");
    res.time = res.time.slice(0, 5);
    return res;
  }

  const IsYesterday = (date: string, today: string) => {
    let dateArr = date.split(".");
    let todayArr = today.split(".");

    const year = 0;
    const month = 1;
    const day = 2;

    if (dateArr[year] === todayArr[year] &&
      dateArr[month] === todayArr[month] &&
      Number(dateArr[day]) == Number(todayArr[day]) - 1)
      return true;

    return false;
  }

  const OnItemClick = () => {
    navigate({
      pathname: '/chat',
      search: createSearchParams({ chatId: chatId }).toString()
    })
  }

  return (
    <li className='chat-item' onClick={OnItemClick} tabIndex={0}>
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
