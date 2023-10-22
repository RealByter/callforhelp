import { useState, useEffect } from 'react';
import Choice from '../components/Choice';
import Header from '../components/Header';
import {
  limit,
  orderBy,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc,
  updateDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { auth, collections } from '../firebase/connection';
import { Chat } from '../firebase/chat';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useSocketCtx } from '../context/socket/useSocketCtx';
import React from 'react';

type Role = 'supporter' | 'supportee';
const getRoleFieldName = (role: Role) => (role === 'supporter' ? 'supporterId' : 'supporteeId');
const getOppositeRoleFieldName = (role: Role) =>
  role === 'supporter' ? 'supporteeId' : 'supporterId';

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
    const findChatToFill = async (role: Role): Promise<Chat | null> => {
      const roleFieldName = getRoleFieldName(role);
      const oppositeRoleFieldName = getOppositeRoleFieldName(role);
      const queryChatToFill = query(
        collections.chats,
        where(roleFieldName, '==', null),
        orderBy('createdAt'),
        limit(1)
      );
      const querySnapshot = await getDocs(queryChatToFill);
      const queryData = querySnapshot.docs.map((doc) => doc.data());
      const filteredQueryData = queryData.filter((doc) => doc[oppositeRoleFieldName] !== user!.uid);

      if (filteredQueryData.length === 0) {
        return null;
      } else {
        return filteredQueryData[0];
      }
    };

    const findMyChats = async (userId: string, role: Role): Promise<Chat[]> => {
      const roleFieldName = getRoleFieldName(role);
      const queryMyChats = query(collections.chats, where(roleFieldName, '==', userId));

      const querySnapshot = await getDocs(queryMyChats);
      const data = querySnapshot.docs.map((chatSnapshot) => chatSnapshot.data());
      const filteredData = data.filter(doc => doc.status === 'active');

      return filteredData;
    };

    const getNameById = async (companionId: string): Promise<string> => {
      if (companionId) {
        const userSnapshot = await getDoc(doc(collections.users, companionId));
        if (!userSnapshot.exists()) {
          throw new Error(`Companion with the id ${companionId} wasn't found`);
        } else {
          return userSnapshot.data().name;
        }
      } else {
        return ''
      }
    };

    const createChat = async (userId: string, role: Role): Promise<Chat> => {
      const newChatValues = {
        createdAt: Timestamp.now(),
        [getRoleFieldName(role)]: userId,
        [getOppositeRoleFieldName(role)]: null,
        status: 'active'
      };

      const chatRef = await addDoc(collections.chats, newChatValues);

      return { ...newChatValues, id: chatRef.id } as Chat;
    };

    const joinChatFirebase = async (userId: string, role: Role, chatId: string) => {
      await updateDoc(doc(collections.chats, chatId), {
        [getRoleFieldName(role)]: userId
      });
    };

    const joinChat = async (userId: string, role: Role) => {
      const myChats = await findMyChats(userId, role);

      if (myChats.length !== 0) {
        const myCompanions = await Promise.all(
          myChats.map((chat) => getNameById(chat[getOppositeRoleFieldName(role)] as string))
        );
        navigate('/chat', { state: { companionName: myCompanions, chatId: myChats, role } });
      } else {
        const chatToFill = await findChatToFill(role);

        if (chatToFill) {
          await joinChatFirebase(userId, role, chatToFill.id);
          const companionName = await getNameById(chatToFill[getOppositeRoleFieldName(role)]!);
          navigate('/chat', { state: { companionName, chatId: chatToFill.id, role } });
        } else {
          const chat = await createChat(userId, role);
          navigate('/chat', { state: { chatId: chat.id, role } });
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
