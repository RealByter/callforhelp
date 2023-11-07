import React, { useState, useEffect } from 'react';
import { ChatItem, ChatItemProps } from '../components/ChatItem';
// import SwitchRoleLink from '../components/SwitchRoleLink';
import { auth } from '../firebase/connection';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DocumentData,
  FirestoreError,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  doc,
  onSnapshot,
  Query,
  QuerySnapshot,
  SnapshotOptions,
  SnapshotListenOptions,
  collection
} from 'firebase/firestore';
import { collections } from '../firebase/connection';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  Role,
  getUserChats,
  getNameById,
  getOppositeRoleFieldName,
  getChatLastMessage,
  getNumOfUnreadMessagesInChat,
  temp
} from '../helpers/chatFunctions';

// todo: remeve unnedded imports

// todo: handle loading

export const SupporteesListPage = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);

  const [chatsData, setChatsData] = useState<ChatItemProps[]>([]);

  const activeChats = chatsData?.filter((chat) => !chat.isEnded);
  const endedChats = chatsData?.filter((chat) => chat.isEnded);

  // const [activeChats, setActiveChats] = useState<ChatItemProps[]>([]);
  // const [endedChats, setEndedChats] = useState<ChatItemProps[]>([]);


  useEffect(() => {
    // redirect if user not logged in
    if (!userLoading && !user) navigate('/');
  }, [user, userLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    let userId = user!.uid; 
    let role = "supporter";
    let otherRole = "supportee";

    temp(user!.uid, "supporter", async (querySnapshot) => {
      const queryData = querySnapshot.docs.map((doc) => doc.data());
      const userChats = queryData.filter((doc) => doc[otherRole] !== userId && doc[otherRole] !== null);

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
      for (let i = 0; i < userChats.length; i++) {
        if (userChats[i].status == "blocked") continue;

        res.push({
          name: names[i],
          lastMessageSentAt: lastMessages[i][0]?.date,
          unreadMessages: unreadMessages[i],
          isEnded: userChats[i].status == "ended",
          chatId: userChats[i].id
        });
      }
      setChatsData(res);
    });

    // const getData = async () => {
      // get chats from firebase 
      // if (!user) return;

      // let res = await findUserChatsData(user!.uid, "supporter"); // todo: location.state.role
      // setChatsData(res);

      // const tempChats = [];
      // const tempEndedChats = [];

      // for (let i = 0; i < chatsData.length; i++) {
      //   let chat = chatsData[i];
      //   chat.isEnded ? tempEndedChats.push(chat) : tempChats.push(chat);
      // }

      // setActiveChats(tempChats);
      // setEndedChats(tempEndedChats);
    // };

    // getData();
  }, [user, activeChats, endedChats]);


  // const findUserChatsData = async (userId: string, role: Role): Promise<ChatItemProps[]> => { // todo: move to chatFunctions
  //   const userChats = await getUserChats(userId, role);
  //   if (!userChats.length) return [];

  //   const names = await Promise.all(
  //     userChats.map((chat) => {
  //       return getNameById(chat[getOppositeRoleFieldName(role)] as string)
  //     })
  //   );

  //   const unreadMessages = await Promise.all(
  //     userChats.map((chat) => {
  //       return getNumOfUnreadMessagesInChat(userId, chat.id);
  //     })
  //   );

  //   const lastMessages = await Promise.all(
  //     userChats.map((chat) => {
  //       return getChatLastMessage(chat.id);
  //     })
  //   );

  //   // format the data
  //   let res = [];
  //   for (let i = 0; i < userChats.length; i++) {
  //     if (userChats[i].status == "blocked") continue;

  //     res.push({
  //       name: names[i],
  //       lastMessageSentAt: lastMessages[i][0]?.date,
  //       unreadMessages: unreadMessages[i],
  //       isEnded: userChats[i].status == "ended",
  //       chatId: userChats[i].id
  //     });
  //   }

  //   // setChatsData(res);
  //   return res;
  // }

  const OnButtonClick = () => {
    // todo: find another supportee
  }

  return (
    <div className="supportees-list-page">

      <div className='content'>
        <h1>רשימת נתמכים</h1>

        {/* sort by date */}
        <div className='chats'>
          {activeChats.length === 0 ?
            <span className='loading' >אין שיחות פעילות</span> :
            activeChats.map((chat) =>
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
          {endedChats.length === 0 ?
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
        {/* <SwitchRoleLink /> */}
        <a className='switch-role-link' href="FindSupporter">אני צריך תומך</a>
      </div>
    </div>
  );
};
