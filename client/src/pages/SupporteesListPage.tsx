import React, { useState, useEffect } from 'react';
import { Chat } from '../firebase/chat';
import { ChatItem } from '../components/ChatItem';
// import SwitchRoleLink from '../components/SwitchRoleLink';
import { auth } from '../firebase/connection';
import { useAuthState } from 'react-firebase-hooks/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import { Role, getRealtimeUserChats, assignSupporter } from '../helpers/chatFunctions';
import Button from '../components/Button';

// todo: remove unnedded imports

// todo: handle loading

export const SupporteesListPage = () => {
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);

  const unsubscribeSnapshotsFuncs: { [key: string]: any } = {};
  const [chats, setChats] = useState<Chat[]>([]); // todo: type

  const activeChats = chats?.filter((chat) => chat.status != "ended");
  const endedChats = chats?.filter((chat) => chat.status == "ended");


  useEffect(() => {
    // redirect if user not logged in
    if (!userLoading && !user) navigate('/');
  }, [user, userLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    // todo: make more generic
    let role: Role = "supporter";

    let unsubscribe = getRealtimeUserChats(user!.uid, role, async (chatsData: Chat[]) => {
      setChats(chatsData);
    });

    return () => {
      Object.values(unsubscribeSnapshotsFuncs).forEach((unsubscribeChat, index) => unsubscribeChat());
      unsubscribe();
    }

  }, [user]);


  const IsSearchingForSupportee = () => {
    return !!chats?.find((chat) => !chat.supporteeId);
  }

  return (
    <div className="supportees-list-page">

      <h1>רשימת נתמכים</h1>

      <ul className='content'>
        <div className='chats'>
          {activeChats.length === 0 ?
            <span className='loading' >אין שיחות פעילות</span> :
            activeChats.map((chat) =>
              <ChatItem
                key={chat.id}
                name={chat.supporteeName || 'מחפשים לך תומך...'}
                isEnded={false}
                chatId={chat.id} />
            )}
        </div>

        {endedChats.length > 0 &&
          <>
            <h2>שיחות שהסתיימו</h2>

            <div className='ended-chats'>
              {endedChats.map((chat) =>
                <ChatItem
                  key={chat.id}
                  name={chat.supporteeName || 'לא נמצא תומך'}
                  isEnded={true}
                  chatId={chat.id} />
              )}
            </div>
          </>}

      </ul>

      <div className='footer'>

        <Button className='new-supportee' onClick={() => assignSupporter(user!.uid)} disabled={IsSearchingForSupportee()}>איתור נתמך נוסף</Button>
        <NavLink className="selection-link" to="/selection">חזרה לעמוד בחירה</NavLink>

        {/* <SwitchRoleLink /> */}
        {/* <a className='switch-role-link' href="FindSupporter">אני צריך תומך</a> */}
      </div>
    </div >
  );
};
