import React, { useState, useEffect } from 'react';
import { ChatItem, ChatItemProps } from '../components/ChatItem';
import SwitchRoleLink from '../components/SwitchRoleLink';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, collections } from '../firebase/connection';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Role,
  getUserChats,
  getNameById,
  getOppositeRoleFieldName,
  getChatLastMessage,
  getNumOfUnreadMessagesInChat
} from '../helpers/chatFunctions';
import { MOCK_CHATS } from '../mock-data/chats-mock-data';

export const SupporteesListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  // const [chatsData, loadingChats, error] = useCollectionDataOnce(
  //   query(collections.chats, where('supporterId', '==', user!.uid))
  // ); // todo: move to useEffect

  const [chatsData, setChatsData] = useState<ChatItemProps[]>([]);

  const [endedChats, setEndedChats] = useState<ChatItemProps[]>([]);
  const [chats, setChats] = useState<ChatItemProps[]>([]);
  const chatsIsEmpty = chats.length === 0;
  const endedChatsIsEmpty = endedChats.length === 0;

  useEffect(() => {
    // get chats from firebase 

    // sort by time and date (and write "yesterday" if the date is of yesterday)
    const tempChats = [];
    const tempEndedChats = [];

    for (let i = 0; i < MOCK_CHATS.length; i++) {
      let chat = MOCK_CHATS[i];
      chat.isEnded ? tempEndedChats.push(chat) : tempChats.push(chat);
    }

    setChats(tempChats);
    setEndedChats(tempEndedChats);
  }, []);

  useEffect(() => {
    // redirect if user not logged in
    if (!loading) {
      if (!user) navigate('/');
    }
    // if (error) {
    //   console.log(error);
    // }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      findUserChatsData(user!.uid, location.state.role);
    }
  }, [user])

  const findUserChatsData = async (userId: string, role: Role): Promise<ChatItemProps[]> => {
    const userChats = await getUserChats(userId, role);
    if (!userChats.length) return [];

    const names = await Promise.all(
      userChats.map((chat) => {
        return getChatLastMessage(chat.id);
        // return getNumOfUnreadMessagesInChat(userId, chat.id);
        // return getNameById(chat[getOppositeRoleFieldName(role)] as string)
      })
    );

    console.log(names);
    // setChatsData(names);

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
            <span className='loading' >טוען...</span> :
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
            <span className='loading' >טוען...</span> :
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
