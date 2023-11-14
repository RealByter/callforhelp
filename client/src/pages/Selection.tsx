import { useEffect } from 'react';
import Choice from '../components/Choice';
import Header from '../components/Header';
import { auth } from '../firebase/connection';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const Selection: React.FC = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, navigate, loading]);

  return (
    <>
      <Header>היי {user?.displayName}</Header>
      <div>
        <Choice
          paragraphText="מרגיש/ה שאת/ה צריכ/ה לשוחח עם מישהו?"
          linkText="אני צריכ/ה תמיכה"
          to="/supportee-chat"
        />
        <Choice
          paragraphText="יש גם אפשרות לתמוך ולהיות שם עבור מי שצריכ/ה"
          linkText="אני רוצה לתמוך"
          to="/chats"
        />
      </div>
    </>
  );
};

export default Selection;
