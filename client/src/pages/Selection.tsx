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

type Role = 'supporter' | 'supportee';
const getRoleFieldName = (role: Role) => (role === 'supporter' ? 'supporterId' : 'supporteeId');
const getOppositeRoleFieldName = (role: Role) => role === "supporter" ? "supporteeId" : "supporterId";

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

    const getCompanionName = async (companionId: string): Promise<string> => {
      const userSnapshot = await getDoc(doc(collections.users, companionId));

      if (!userSnapshot.exists()) {
        throw new Error(`Companion with the id ${companionId} wasn't found`);
      } else {
        return userSnapshot.data().name;
      }
    }
  
    const createChat = async (userId: string, role: Role): Promise<Chat> => {
      const newChatValues = {
        createdAt: Timestamp.now(),
        [getRoleFieldName(role)]: userId,
        [getOppositeRoleFieldName(role)]: null
      };
  
      const chatRef = await addDoc(collections.chats, newChatValues);
  
      return {...newChatValues, id: chatRef.id} as Chat;
    };
  
    const joinChatFirebase = async (userId: string, role: Role, chatId: string) => {
      await updateDoc(doc(collections.chats, chatId), {
        [getRoleFieldName(role)]: userId
      });
    };
  
    const joinChatRooms = (chats: Chat | Chat[], username: string, companionName?: string | String[]) => {
      const chatIds = Array.isArray(chats) ? chats.map((chat) => chat.id) : chats.id;
      socket.emit('join-chat', chatIds, username);
      navigate('/room', {state: { companionName }});
    }

    const joinChat = async (userId: string, role: Role) => {
      const [myName, myChats] = await Promise.all([getCompanionName(userId), findMyChats(userId, role)]);

      if (myChats.length !== 0) {
        const myCompanions = await Promise.all(myChats.map((chat) => getCompanionName(chat[getOppositeRoleFieldName(role)] as string)));
        joinChatRooms(myChats, myName, myCompanions);
      } else {
        const chatToFill = await findChatToFill(role);

        if (chatToFill) {
          await joinChatFirebase(userId, role, chatToFill.id);
          joinChatRooms(chatToFill, myName);
        } else {
          const chat = await createChat(userId, role);
          joinChatRooms(chat, myName);
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
