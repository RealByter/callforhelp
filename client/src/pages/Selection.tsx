import { useState, useEffect } from 'react';
import Choice from '../components/Choice';
import Header from '../components/Header';
import { query, where, getDocs } from 'firebase/firestore';
import { auth, collections } from '../firebase/connection';
import { Chat } from '../firebase/chat';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useSocketCtx } from '../context/socket/useSocketCtx';
import React from 'react';
import {
  Role,
  createChat,
  findChatToFill,
  getRoleFieldName,
  joinChatFirebase
} from '../helpers/chatFunctions';

const findMyChats = async (userId: string, role: Role): Promise<Chat[]> => {
  const roleFieldName = getRoleFieldName(role);
  const queryMyChats = query(collections.chats, where(roleFieldName, '==', userId));

  const querySnapshot = await getDocs(queryMyChats);
  const data = querySnapshot.docs.map((chatSnapshot) => chatSnapshot.data());
  const filteredData = data.filter((doc) => doc.status === 'active');

  return filteredData;
};

const Selection: React.FC = () => {
  const { socket } = useSocketCtx();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, navigate, loading]);

  useEffect(() => {
    const joinChat = async (userId: string, role: Role) => {
      const myChats = await findMyChats(userId, role);

      if (myChats.length !== 0) {
        navigate({
          pathname: '/chat',
          search: createSearchParams({ chatId: myChats[0].id }).toString()
        });
      } else {
        const chatToFill = await findChatToFill(role, user!.uid);

        if (chatToFill) {
          await joinChatFirebase(userId, role, chatToFill.id);
          navigate({
            pathname: '/chat',
            search: createSearchParams({ chatId: chatToFill.id }).toString()
          });
        } else {
          const chat = await createChat(userId, role);
          navigate({
            pathname: '/chat',
            search: createSearchParams({ chatId: chat.id }).toString()
          });
        }
      }
    };

    if (role) {
      joinChat(user!.uid, role);
    }
  }, [role, user, socket, navigate]);

  return (
    <>
      <Header>היי שם משתמש</Header>
      <div>
        <Choice
          paragraphText="מרגיש/ה שאת/ה צריכ/ה לשוחח עם מישהו?"
          buttonText="אני צריכ/ה תמיכה"
          onClick={() => setRole('supportee')}
        />
        <Choice
          paragraphText="יש גם אפשרות לתמוך ולהיות שם עבור מי שצריכ/ה"
          buttonText="אני רוצה לתמוך"
          onClick={() => setRole('supporter')}
        />
      </div>
    </>
  );
};

export default Selection;
