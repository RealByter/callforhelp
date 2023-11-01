import { useState, useEffect } from 'react';
import Choice from '../components/Choice';
import Header from '../components/Header';
import { query, where, getDocs } from 'firebase/firestore';
import { auth, collections } from '../firebase/connection';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useSocketCtx } from '../context/socket/useSocketCtx';
import React from 'react';
import {
  Role,
  checkIfHasActive,
  createChat,
  findChatToFill,
  joinChatFirebase
} from '../helpers/chatFunctions';

// const findMyChats = async (userId: string, role: Role): Promise<Chat[]> => {
//   const roleFieldName = getRoleFieldName(role);
//   const queryMyChats = query(
//     collections.chats,
//     where(roleFieldName, '==', userId),
//     where('status', '==', 'active')
//   );

//   const querySnapshot = await getDocs(queryMyChats);
//   const data = querySnapshot.docs.map((chatSnapshot) => chatSnapshot.data());
//   const filteredData = data.filter((doc) => doc.status === 'active');

//   return filteredData;
// };

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
    const joinAsSupportee = async () => {
      const existingChatSnapshot = await getDocs(
        query(
          collections.chats,
          where('supporteeId', '==', user!.uid),
          where('status', '==', 'active')
        )
      );

      if (existingChatSnapshot.size > 0) {
        const existingChatId = existingChatSnapshot.docs[0].id;
        navigate({
          pathname: '/chat',
          search: createSearchParams({ chatId: existingChatId }).toString()
        });
      } else {
        const chatToFill = await findChatToFill('supportee', user!.uid);

        if (chatToFill) {
          await joinChatFirebase(user!.uid, 'supportee', chatToFill.id, user!.displayName!);
          navigate({
            pathname: '/chat',
            search: createSearchParams({ chatId: chatToFill.id }).toString()
          });
        } else {
          const chat = await createChat(user!.uid, 'supportee', user!.displayName!);
          navigate({
            pathname: '/chat',
            search: createSearchParams({ chatId: chat.id }).toString()
          });
        }
      }
    };

    const joinAsSupporter = async () => {
      const hasActiveChat = await checkIfHasActive(user!.uid);
      if (!hasActiveChat) {
        const chatToFill = await findChatToFill('supporter', user!.uid);

        if (chatToFill) await joinChatFirebase(user!.uid, 'supporter', chatToFill.id);
        else await createChat(user!.uid, 'supporter');
      }
      navigate('/chats');
    };

    if (role) {
      if (role === 'supportee') joinAsSupportee();
      else joinAsSupporter();
    }
  }, [role, user, socket, navigate]);

  return (
    <>
      <Header>היי {user?.displayName}</Header>
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
