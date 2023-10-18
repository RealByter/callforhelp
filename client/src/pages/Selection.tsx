import { useState, useEffect } from 'react';
import Choice from '../components/Choice';
import Header from '../components/Header';

const Selection: React.FC = () => {
  const [role, setRole] = useState<"supporter" | "supportee" | null>(null);

  useEffect(() => {
    if (role) {
      // attempt to join chat
      console.log(role);
    }
  }, [role]);

  return (
    <>
      <Header>היי שם משתמש</Header>
      <div>
        <Choice
          paragraphText="מרגיש/ה שאת/ה צריכ/ה לשוחח עם מישהו?"
          buttonText="אני צריכ/ה תמיכה"
          onClick={() => setRole("supportee")} // This is where we start the assignment process
        />
        <Choice
          paragraphText="יש גם אפשרות לתמוך ולהיות שם עבור מי שצריכ/ה"
          buttonText="אני רוצה לתמוך"
          onClick={() => setRole("supporter")} // This is where we start the assignment process
        />
      </div>
    </>
  );
};

export default Selection;
