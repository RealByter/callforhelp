import React, { useEffect } from 'react';
import { ChatItem } from '../components/ChatItem';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, collections } from '../firebase/connection';
import { query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

export const ChatsListPage = () => {
  const [user, userLoading] = useAuthState(auth);
  const [chats, chatsLoading] = useCollectionData(
    query(collections.chats, where('supporterId', '==', userLoading || !user ? 'empty' : user?.uid))
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && !user) navigate('/');
  }, [user, userLoading, navigate]);

  const activeChats = chats?.filter((chat) => chat.status === 'active');
  const endedChats = chats?.filter((chat) => chat.status === 'ended');

  return (
    <div className="supporteds-list-page">
      <div className="content">
        <h1>רשימת נתמכים</h1>

        {/* sort by date */}
        <div className="chats">
          {chatsLoading || activeChats?.length === 0 ? (
            <span className="loading">טוען...</span>
          ) : (
            activeChats?.map((chat) => (
              <ChatItem
                key={chat.id}
                name={chat.supporteeName || 'מחפש'}
                isEnded={false}
                chatId={chat.id}
              />
            ))
          )}
        </div>

        <h2>שיחות שהסתיימו</h2>

        <div className="ended-chats">
          {chatsLoading || endedChats?.length === 0 ? (
            <span className="loading">טוען...</span>
          ) : (
            endedChats?.map((chat) => (
              <ChatItem
                key={chat.id}
                name={chat.supporteeName || 'לא נמצא'}
                isEnded={true}
                chatId={chat.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
