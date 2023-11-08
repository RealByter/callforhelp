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
  getRealtimeUserChats,
  getRealtimeAdditionalChatData
} from '../helpers/chatFunctions';

// todo: remeve unnedded imports

// todo: handle loading

export const SupporteesListPage = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);

  const unsubscribeSnapshotsFuncs: { [key: string]: any } = {};
  // const [userChats, setUserChats] = useState<any>([]);
  const [chatsData, setChatsData] = useState<ChatItemProps[]>([]);
  const [additionalChatData, setAdditionalChatData] = useState<{ [key: string]: { [key: string]: string } }>({});

  const activeChats = chatsData?.filter((chat) => !chat.isEnded);
  const endedChats = chatsData?.filter((chat) => chat.isEnded);
  const [a, setA] = useState(0);


  useEffect(() => {
    // redirect if user not logged in
    if (!userLoading && !user) navigate('/');
  }, [user, userLoading, navigate]);


  useEffect(() => {
    if (!user) return;

    let userId = user!.uid;
    let role = "supporter";
    let otherRole = "supportee";

    let unsubscribe = getRealtimeUserChats(user!.uid, "supporter", async (snapshot) => {

      let changes = snapshot.docChanges();

      for (let i = 0; i < changes.length; i++) {
        let change = changes[i];
        let changeData = change.doc.data();

        if (change.type === "added") {
          unsubscribeSnapshotsFuncs[changeData.chatId] = getRealtimeAdditionalChatData(changeData.id, (chatSnapshot) => {
            const chatSnapshotData = chatSnapshot.docs.map((doc) => doc.data());
            console.log("chatSnapshotData", chatSnapshotData);

            setAdditionalChatData(additionalChatData => {
              return {
                ...additionalChatData,
                [chatSnapshotData[0].chatId]: { "lastMessageSentAt": chatSnapshotData[0].date }
              }
            });
          })
        }
        // if (change.type === "modified") {
        // }
        if (change.type === "removed") {
          unsubscribeSnapshotsFuncs[changeData.chatId]();
        }
      }

      const queryData = snapshot.docs.map((doc) => doc.data());
      const userChats = queryData.filter((doc) => doc[otherRole] !== userId && doc[otherRole] !== null);

      // const unreadMessages = await Promise.all(
      //   userChats.map((chat) => {
      //     return getNumOfUnreadMessagesInChat(userId, chat.id);
      //   })
      // );

      // format the data
      let res = [];
      for (let i = 0; i < userChats.length; i++) {
        if (userChats[i].status == "blocked") continue;

        res.push({
          name: userChats[i].supporteeName,
          lastMessageSentAt: "", //lastMessages[i][0]?.date,
          unreadMessages: 0, //unreadMessages[i],
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
                lastMessageSentAt={additionalChatData[chat.chatId]?.lastMessageSentAt}
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
                lastMessageSentAt={additionalChatData[chat.chatId]?.lastMessageSentAt}
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
