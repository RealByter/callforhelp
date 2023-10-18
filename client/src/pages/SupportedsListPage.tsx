import React, { useState } from 'react';
import '../styles/SupportedsListPage.scss';
import { List } from '@mui/material';
import ChatItem from '../components/ChatItem';
import SwitchRoleLink from '../components/SwitchRoleLink';

export const SupportedsListPage = () => {

  return (
    <div className="supporteds-list-page">
        
        <div className='content'>
           <h1>רשימת נתמכים</h1>

          <List className='chats'>
              <ChatItem />
              <ChatItem />
          </List>

          <h2>שיחות שהסתיימו</h2>

          <List className='ended-chats'>
              <ChatItem />
              <ChatItem />
              <ChatItem />
              <ChatItem />
              <ChatItem />
              <ChatItem />
          </List>
        </div>

        <div className='footer'>
          <span className='locate-supported'>איתור נתמך נוסף</span>
          <SwitchRoleLink />
        </div>
    </div>
  );
};
