import React, { useState, useEffect } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import OrBackground from '../assets/OrBackground.svg';

export interface ChatItemProps {
    name: string,
    lastMessageSentAt: string,
    unreadMessages: number,
    isEnded: boolean,
    chatId: string
};

export const ChatItem: React.FC<ChatItemProps> = ({
    name, lastMessageSentAt, unreadMessages, isEnded, chatId }: ChatItemProps) => {

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
        // todo: go into the right chat
        // navigate('/chat', { state: { companionName: myCompanions, chatId: myChats, role } });
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
    );
};