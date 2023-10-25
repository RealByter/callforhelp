import React, { useState, useEffect } from 'react';
import { ChatItem, ChatItemProps } from '../components/ChatItem';
import SwitchRoleLink from '../components/SwitchRoleLink';
import { useNavigate, useLocation } from 'react-router-dom';
import { MOCK_CHATS } from '../mock-data/chats-mock-data';

export const SupporteesListPage = () => {
  const location = useLocation();
  // const [chatId, setChatId] = useState(
  //   Array.isArray(location.state.chatId) ? location.state.chatId[0].id : location.state.chatId
  // );

  const [endedChats, setEndedChats] = useState<ChatItemProps[]>([]);
  const [chats, setChats] = useState<ChatItemProps[]>([]);
  const chatsIsEmpty = chats.length === 0;
  const endedChatsIsEmpty = endedChats.length === 0;

  // happends once on mount
  useEffect(() => {
    // get chats from firebase 
    console.log(location.state);


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
                lastMessageTiming={chat.lastMessageTiming}
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
                lastMessageTiming={chat.lastMessageTiming}
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