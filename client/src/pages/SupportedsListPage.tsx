import React, { useState, useEffect } from 'react';
import { ChatItem, ChatItemProps } from '../components/ChatItem';
import SwitchRoleLink from '../components/SwitchRoleLink';
import { useSocketCtx } from '../context/socket/useSocketCtx';
import { MOCK_CHATS } from '../mock-data/chats-mock-data';

export const SupportedsListPage = () => {
  const [endedChats, setEndedChats] = useState<ChatItemProps[]>([]);
  const [chats, setChats] = useState<ChatItemProps[]>([]);
  const chatsIsEmpty = chats.length === 0;
  const endedChatsIsEmpty = endedChats.length === 0;
  const { socket } = useSocketCtx();

  useEffect(() => {
    let chatIds: string[] = [];
    if (chats.length) {
      chats.forEach((chat) => chatIds.push(chat.chatId));
      socket.emit("join-chat", { chatIds: chatIds });
    }
  }, [socket, chats])

  // happends once on mount
  useEffect(() => {
    // get chats from firebase
    // sort by time and date (and write "yesterday" if the date is of yesterday)
    const tempChats: ChatItemProps[] = [];
    const tempEndedChats: ChatItemProps[] = [];

    for (let i = 0; i < MOCK_CHATS.length; i++) {
      let chat = MOCK_CHATS[i] as unknown as ChatItemProps;
      chat.isEnded ? tempEndedChats.push(chat) : tempChats.push(chat);
    }

    setChats(tempChats);
    setEndedChats(tempEndedChats);

  }, []);

  const OnButtonClick = () => {
    // find another supported
  }

  return (
    <div className="supporteds-list-page">

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
        <span className='locate-supported' onClick={OnButtonClick}>איתור נתמך נוסף</span>
        <SwitchRoleLink />
      </div>
    </div>
  );
};
