import React, { useState } from 'react';
import '../styles/Chat.scss';
import { List } from '@mui/material';

export const SupportedsListPage = () => {

  return (
    <div className="supporteds-list-page">
        <h1>רשימת נתמכים</h1>

        <List>
            <div>
                <h2>שם מלא</h2>
                <h3>תגובה אחרוונה
                    <span>00:00</span>
                </h3>
                <span>1</span>
                <span>^</span>
            </div>
        </List>

        <h2>שיחות שהסתיימו</h2>

        <div>איתור נתמך נוסף</div>

        <div>אני צריך תומך</div>
    </div>
  );
};
