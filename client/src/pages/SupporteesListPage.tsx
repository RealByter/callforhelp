import React, { useState, useEffect } from 'react';
import { ChatItem, ChatItemProps } from '../components/ChatItem';
import SwitchRoleLink from '../components/SwitchRoleLink';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Role,
  getUserChats,
  getNameById,
  getOppositeRoleFieldName,
  getChatLastMessage,
  getNumOfUnreadMessagesInChat
} from '../helpers/chatFunctions';

export const SupporteesListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const [chatsData, setChatsData] = useState<ChatItemProps[]>([]);

  const [endedChats, setEndedChats] = useState<ChatItemProps[]>([]);
  const [chats, setChats] = useState<ChatItemProps[]>([]);
  
  const chatsIsEmpty = chats.length === 0;
  const endedChatsIsEmpty = endedChats.length === 0;

  useEffect(() => {
    // get chats from firebase 
    if (user) {
      findUserChatsData(user!.uid, location.state.role);
    }
    
    const tempChats = [];
    const tempEndedChats = [];

    for (let i = 0; i < chatsData.length; i++) {
      let chat = chatsData[i];
      chat.isEnded ? tempEndedChats.push(chat) : tempChats.push(chat);
    }

    setChats(tempChats);
    setEndedChats(tempEndedChats);
  }, [user]);


  useEffect(() => {
    // redirect if user not logged in
    if (!loading) {
      if (!user) navigate('/');
    }
    // todo: handle errors & loading
    // if (error) {
    //   console.log(error);
    // }
  }, [loading, user, navigate]);

  
  const findUserChatsData = async (userId: string, role: Role): Promise<ChatItemProps[]> => {
    const userChats = await getUserChats(userId, role);
    if (!userChats.length) return [];

    const names = await Promise.all(
      userChats.map((chat) => {
        return getNameById(chat[getOppositeRoleFieldName(role)] as string)
      })
    );

    const unreadMessages = await Promise.all(
      userChats.map((chat) => {
        return getNumOfUnreadMessagesInChat(userId, chat.id);
      })
    );

    const lastMessages = await Promise.all(
      userChats.map((chat) => {
        return getChatLastMessage(chat.id);
      })
    );

    // format the data
    let res = [];    
    for (let i = 0; i < userChats.length; i++)
    {
      res.push({
        name: names[i],
        lastMessageSentAt: lastMessages[i][0]?.date,
        unreadMessages: unreadMessages[i],
        isEnded: userChats[i].status == "ended",
        chatId: userChats[i].id
      });
    }

    setChatsData(res);
    return [];
  }

  const OnButtonClick = () => {
    // find another supportee
  }

  return (
    <div className="supportees-list-page">

      <div className='content'>
        <h1>רשימת נתמכים</h1>

        {/* sort by date */}
        <div className='chats'>
          {chatsIsEmpty ?
            <span className='loading' >אין שיחות פעילות</span> :
            chats.map((chat) =>
              <ChatItem
                key={chat.chatId}
                name={chat.name}
                lastMessageSentAt={chat.lastMessageSentAt}
                unreadMessages={chat.unreadMessages}
                isEnded={chat.isEnded}
                chatId={chat.chatId} />
            )}
        </div>

        <h2>שיחות שהסתיימו</h2>

        <div className='ended-chats'>
          {endedChatsIsEmpty ?
            <span className='loading' >אין שיחות שהסתיימו</span> :
            endedChats.map((chat) =>
              <ChatItem
                key={chat.chatId}
                name={chat.name}
                lastMessageSentAt={chat.lastMessageSentAt}
                unreadMessages={chat.unreadMessages}
                isEnded={chat.isEnded}
                chatId={chat.chatId} />
            )}
        </div>
      </div>

      <div className='footer'>
        <span className='locate-supportee' onClick={OnButtonClick}>איתור נתמך נוסף</span>
        <SwitchRoleLink />
      </div>
    </div>
  );
};
