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
  doc
} from 'firebase/firestore';
import { auth, collections } from '../firebase/connection';
import { Chat } from '../firebase/chat';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useSocketCtx } from '../context/socket/useSocketCtx';

type Role = 'supporter' | 'supportee';
const getRoleFieldName = (role: Role) => (role === 'supporter' ? 'supporterId' : 'supporteeId');

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

  const findChatToFill = async (role: Role): Promise<Chat | null> => {
    const roleFieldName = getRoleFieldName(role);
    const queryChatToFill = query(
      collections.chats,
      where(roleFieldName, '==', null),
      orderBy('createdAt'),
      limit(1)
    );
    const querySnapshot = await getDocs(queryChatToFill);

    if (querySnapshot.size === 0) {
      return null;
    } else {
      return querySnapshot.docs[0].data();
    }
  };

  const findMyChats = async (userId: string, role: Role): Promise<Chat[]> => {
    const roleFieldName = getRoleFieldName(role);
    const queryMyChats = query(collections.chats, where(roleFieldName, '==', userId));
    const querySnapshot = await getDocs(queryMyChats);

    return querySnapshot.docs.map((chatSnapshot) => chatSnapshot.data());
  };

  const createChat = async (userId: string, role: Role): Promise<Chat> => {
    const newChatValues = {
      id: '', // because the id is empty, firestore is still going to generate an id by itself
      createdAt: Timestamp.now(),
      [getRoleFieldName(role)]: userId,
      [role === 'supportee' ? 'supporterId' : 'supporteeId']: null
    };

    const chatRef = await addDoc(collections.chats, newChatValues);

    return {...newChatValues, id: chatRef.id};
  };

  const joinChatFirebase = async (userId: string, role: Role, chatId: string) => {
    await updateDoc(doc(collections.chats, chatId), {
      [getRoleFieldName(role)]: userId
    });
  };

  const joinChatRooms = (chats: Chat | Chat[], username: string) => {
    const chatIds = Array.isArray(chats) ? chats.map((chat) => chat.id) : chats.id;
    socket.emit('join-chat', chatIds, username);
    navigate('/room');
  }

  useEffect(() => {
    const joinChat = async (userId: string, role: Role) => {
      const myChats = await findMyChats(userId, role);

      if (myChats.length !== 0) {
        joinChatRooms(myChats, user!.displayName!);
      } else {
        const chatToFill = await findChatToFill(role);

        if (chatToFill) {
          await joinChatFirebase(userId, role, chatToFill.id);
          joinChatRooms(chatToFill, user!.displayName!);
        } else {
          const chat = await createChat(userId, role);
          joinChatRooms(chat, user!.displayName!);
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
