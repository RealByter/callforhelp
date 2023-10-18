import Choice from '../components/Choice';
import Header from '../components/Header';
import { collections } from '../firebase/connection';
import { useCollectionOnce } from "react-firebase-hooks/firestore"

const Selection: React.FC = () => {
  const [snapshot] = useCollectionOnce(collections.chats);

  console.log(snapshot?.docs.map((chat) => chat.data()))

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
