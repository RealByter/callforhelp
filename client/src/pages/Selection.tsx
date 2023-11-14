import { useState, useEffect } from 'react';
import Choice from '../components/Choice';
import Header from '../components/Header';
import { auth } from '../firebase/connection';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useSocketCtx } from '../context/socket/useSocketCtx';
import React from 'react';
import { Role, assignSupporter, checkIfHasActive } from '../helpers/chatFunctions';

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
    const joinAsSupporter = async () => {
      try {
        const hasActiveChat = await checkIfHasActive(user!.uid);
        if (!hasActiveChat) assignSupporter(user!.uid);
        navigate('/chats');
      } catch (e: unknown) {
        const error = e as { code: string };
        console.log(error);
      }
    };

    if (role) {
      if (role === 'supportee') navigate('/supportee-chat');
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
