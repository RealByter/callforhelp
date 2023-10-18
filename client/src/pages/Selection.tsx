import { useState, useEffect } from 'react';
import Choice from '../components/Choice';
import Header from '../components/Header';
import { limit, orderBy, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { collections } from '../firebase/connection';
import { Chat } from '../firebase/chat';

type Role = "supporter" | "supportee";

const Selection: React.FC = () => {
  const [role, setRole] = useState<Role | null>(null);

  const findChatToFill = async (role: Role): Promise<Chat | null> => {
    const roleFieldName = role === "supporter" ? "supporterId" : "supporteeId";
    const queryChatToFill = query(collections.chats, where(roleFieldName, "==", null), orderBy("createdAt"), limit(1));
    const querySnapshot = await getDocs(queryChatToFill);

    if (querySnapshot.size === 0) {
      return null;
    } else {
      return querySnapshot.docs[0].data();
    }
  }

  const findMyChats = async (userId: string, role: Role): Promise<Chat[]> => {
    return [];
  }

  const createChat = async (userId: string, role: Role): Promise<Chat> => {
    return {id: "", createdAt: Timestamp.now()}
  }

  const joinChat = async (userId: string, role: Role) => {
    const myChats = await findMyChats(userId, role);

    if (myChats.length != 0) {
      // ask the socket to join the room
    } else {
      const chat = await findChatToFill(role) || await createChat(userId, role);
      // ask the socket to join the created room
    }
  }

  useEffect(() => {
    if (role) {
      joinChat("adadwa", role);
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
