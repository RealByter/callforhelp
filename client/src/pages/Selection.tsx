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
  assignSupportee,
  assignSupporter,
  checkIfHasActive,
} from '../helpers/chatFunctions';

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
        navigate({
          pathname: '/chat',
          search: createSearchParams({ chatId: existingChatSnapshot.docs[0].id }).toString()
        });
      } else {
        navigate({
          pathname: '/chat',
          search: createSearchParams({
            chatId: await assignSupportee(user!.uid, user!.displayName!)
          }).toString()
        });
      }
    };

    const joinAsSupporter = async () => {
      const hasActiveChat = await checkIfHasActive(user!.uid);
      if (!hasActiveChat) assignSupporter(user!.uid);
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
