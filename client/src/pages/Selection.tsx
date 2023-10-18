import Choice from '../components/Choice';
import Header from '../components/Header';

const Selection: React.FC = () => {
  return (
    <>
      <Header>היי שם משתמש</Header>
      <div>
        <Choice
          paragraphText="מרגיש/ה שאת/ה צריכ/ה לשוחח עם מישהו?"
          buttonText="אני צריכ/ה תמיכה"
          onClick={() => {}} // This is where we start the assignment process
        />
        <Choice
          paragraphText="יש גם אפשרות לתמוך ולהיות שם עבור מי שצריכ/ה"
          buttonText="אני רוצה לתמוך"
          onClick={() => {}} // This is where we start the assignment process
        />
      </div>
    </>
  );
};

export default Selection;
