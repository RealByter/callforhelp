import React, { useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

export interface ChatItemProps {
    name: string,
    lastMessageTiming: string,
    unreadMessages: number,
    isEnded: boolean,
    chatId: number
};

export const ChatItem: React.FC<ChatItemProps> = ({
    name, lastMessageTiming, unreadMessages, isEnded, chatId}: ChatItemProps) => {

    const OnItemClick = (chatId: number) => {
        // go into the right chat
        console.log(chatId);
    }

    return (
    <div className='chat-item' onClick={() => OnItemClick(chatId)}>        
        <div className='content'>
            <span className='name'>{name}</span>
            <span className='last-message'>תגובה אחרונה <span>{lastMessageTiming}</span>
            </span>
        </div>

        <div className='rest'>
            {unreadMessages && !isEnded ? <span className='unread-messages'>{unreadMessages}</span> : null}
            <KeyboardArrowLeftIcon />
        </div>
    </div>
  );
};