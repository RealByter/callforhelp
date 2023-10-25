import React, { useState } from 'react';
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

    const OnItemClick = () => {
        // todo: go into the right chat
        // navigate('/chat', { state: { companionName: myCompanions, chatId: myChats, role } });
    }

    return (
        <div className='chat-item' onClick={OnItemClick}>
            <div className='content'>
                <span className='name'>{name}</span>
                <span className='last-message'>תגובה אחרונה <span>{lastMessageSentAt}</span>
                </span>
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