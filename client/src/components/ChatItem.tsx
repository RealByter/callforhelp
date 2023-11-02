import React, { useState, useEffect } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import OrBackground from '../assets/OrBackground.svg';
import { createSearchParams, useNavigate, useLocation } from 'react-router-dom';

export interface ChatItemProps {
  name: string,
  lastMessageSentAt: string,
  unreadMessages: number,
  isEnded: boolean,
  chatId: string
};

export const ChatItem: React.FC<ChatItemProps> = ({
  name, lastMessageSentAt, unreadMessages, isEnded, chatId }: ChatItemProps) => {

  const location = useLocation();
  const navigate = useNavigate();
  const [formattedTimeOrDate, setFormattedTimeOrDate] = useState("");

  useEffect(() => {
    if (!lastMessageSentAt) return;

    let currDateAndTime = FormatDateAndTime(new Date().toISOString());
    let dateAndTime = FormatDateAndTime(lastMessageSentAt);

    if (dateAndTime.date === currDateAndTime.date) // if date is today
    {
      setFormattedTimeOrDate(dateAndTime.time);
    }
    else if (IsYesterday(dateAndTime.date, currDateAndTime.date)) {
      setFormattedTimeOrDate("אתמול");
    }
    else {
      setFormattedTimeOrDate(dateAndTime.date);
    }
  }, []);

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
    // navigate('/chat', { state: { companionName: name, chatId, role: location.state?.role } });
  }

  return (
    <div className='chat-item' onClick={OnItemClick}>
      <div className='content'>
        <span className='name'>{name}</span>
        {lastMessageSentAt &&
          <span className='last-message'>תגובה אחרונה <span>{formattedTimeOrDate}</span></span>}
      </div>

      <div className='rest'>
        {unreadMessages && !isEnded ?
          <div className='notification'>
            <img src={OrBackground} alt="notification-icon" />
            <span className='unread-messages'>{unreadMessages}</span>
          </div> : null}
        <KeyboardArrowLeftIcon />
      </div>
    </div>

    // <li
    // className={`chat-item ${isEnded && 'chat-item-ended'}`}
    // onClick={() =>
    //   navigate({
    //     pathname: '/chat',
    //     search: createSearchParams({ chatId: chatId }).toString()
    //   })
    // }
    // tabIndex={0}>
    // <p className="name">{name}</p>
    // <svg
    //   className="arrow"
    //   xmlns="http://www.w3.org/2000/svg"
    //   width="16"
    //   height="16"
    //   viewBox="0 0 16 16"
    //   fill="none">
    //   <path d="M10 12L6 8L10 4" stroke="#0E1C74" strokeLinecap="round" strokeLinejoin="round" />
    // </svg>
    // </li>
  );
};
