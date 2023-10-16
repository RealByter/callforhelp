import React, { useState } from 'react';
import '../styles/Chat.scss';
import { List } from '@mui/material';
import ChatItem from '../components/ChatItem';
import SwitchRoleLink from '../components/SwitchRoleLink';

export const SupportedsListPage = () => {

  return (
    <div className="supporteds-list-page">
        <h1>רשימת נתמכים</h1>

        <List>
            <ChatItem />
            <ChatItem />
        </List>

        <h2>שיחות שהסתיימו</h2>

        <List>
            <ChatItem />
            <ChatItem />
        </List>

        <div>איתור נתמך נוסף</div>

        <SwitchRoleLink />
    </div>
  );
};
