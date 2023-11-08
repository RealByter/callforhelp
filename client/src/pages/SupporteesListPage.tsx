import React, { useState, useEffect } from 'react';
import { ChatItem, ChatItemProps } from '../components/ChatItem';
// import SwitchRoleLink from '../components/SwitchRoleLink';
import { auth } from '../firebase/connection';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { Role, getRealtimeUserChats} from '../helpers/chatFunctions';

// todo: remeve unnedded imports

// todo: handle loading

export const SupporteesListPage = () => {
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);

  const unsubscribeSnapshotsFuncs: { [key: string]: any } = {};
  const [chatsData, setChatsData] = useState<ChatItemProps[]>([]);

  const activeChats = chatsData?.filter((chat) => !chat.isEnded);
  const endedChats = chatsData?.filter((chat) => chat.isEnded);


  useEffect(() => {
    // redirect if user not logged in
    if (!userLoading && !user) navigate('/');
  }, [user, userLoading, navigate]);


  useEffect(() => {
    if (!user) return;

    // todo: make more generic
    let role : Role = "supporter";

    let unsubscribe = getRealtimeUserChats(user!.uid, role, async (userChats) => {

      // format the data
      let res = [];
      for (let i = 0; i < userChats.length; i++) {
        if (userChats[i].status == "blocked") continue;

        res.push({
          name: userChats[i].supporteeName,
          isEnded: userChats[i].status == "ended",
          chatId: userChats[i].id
        });
      }
      console.log(res);
      setChatsData(res);
    });

    return () => {
      Object.values(unsubscribeSnapshotsFuncs).forEach((unsubscribeChat, index) => unsubscribeChat());
      unsubscribe();
    }

  }, [user]);


  const OnButtonClick = () => {
    // todo: find another supportee
  }

  return (
    <div className="supportees-list-page">

      <div className='content'>
        <h1>רשימת נתמכים</h1>
        
        <div className='chats'>
          {activeChats.length === 0 ?
            <span className='loading' >אין שיחות פעילות</span> :
            activeChats.map((chat) =>
              <ChatItem
                key={chat.chatId}
                name={chat.name}
                isEnded={chat.isEnded}
                chatId={chat.chatId} />
            )}
        </div>

        <h2>שיחות שהסתיימו</h2>

        <div className='ended-chats'>
          {endedChats.length === 0 ?
            <span className='loading' >אין שיחות שהסתיימו</span> :
            endedChats.map((chat) =>
              <ChatItem
                key={chat.chatId}
                name={chat.name}
                isEnded={chat.isEnded}
                chatId={chat.chatId} />
            )}
        </div>
      </div>

      <div className='footer'>
        <span className='locate-supportee' onClick={OnButtonClick}>איתור נתמך נוסף</span>
        {/* <SwitchRoleLink /> */}
        <a className='switch-role-link' href="FindSupporter">אני צריך תומך</a>
      </div>
    </div>
  );
};
