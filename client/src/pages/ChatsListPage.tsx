import { useState, useEffect } from 'react';
import { Chat } from '../firebase/chat';
import { ChatItem } from '../components/ChatItem';
import { auth } from '../firebase/connection';
import { useAuthState } from 'react-firebase-hooks/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Role,
  getRealtimeUserChats,
  assignSupporter,
  checkIfHasActive
} from '../helpers/chatFunctions';
import Button from '../components/Button';
import SupporterWaiting from '../components/SupporterWaiting';

export const ChatsListPage = () => {
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsLoading, setChatLoading] = useState(true);

  const activeChats = chats?.filter((chat) => chat.status != 'ended');
  const endedChats = chats?.filter((chat) => chat.status == 'ended');

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

    // redirect if user not logged in
    if (!userLoading) {
      if (user) joinAsSupporter;
      else navigate('/');
    }
  }, [user, userLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    // todo: make more generic
    const role: Role = 'supporter';

    const unsubscribe = getRealtimeUserChats(user!.uid, role, async (chatsData: Chat[]) => {
      setChatLoading(false);
      setChats(chatsData);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const IsSearchingForSupportee = () => {
    return !!chats?.find((chat) => !chat.supporteeId);
  };

  let mainContent = (
    <div className="chats-list-page">
      <h1>רשימת נתמכים</h1>

      <ul className="content">
        {activeChats.length === 0 ? (
          <span className="loading">אין שיחות פעילות</span>
        ) : (
          activeChats.map((chat) => (
            <ChatItem
              key={chat.id}
              name={chat.supporteeName}
              isEnded={false}
              chatId={chat.id}
            />
          ))
        )}

        {endedChats.length > 0 && (
          <>
            <h2>שיחות שהסתיימו</h2>

            {endedChats.map((chat) => (
              <ChatItem
                key={chat.id}
                name={chat.supporteeName || 'לא נמצא תומך'}
                isEnded={true}
                chatId={chat.id}
              />
            ))}
          </>
        )}
      </ul>

      <div className="footer">
        <Button
          className="new-supportee"
          onClick={() => assignSupporter(user!.uid)}
          disabled={IsSearchingForSupportee()}>
          איתור נתמך נוסף
        </Button>
        <NavLink className="selection-link" to="/selection">
          חזרה לעמוד בחירה
        </NavLink>
      </div>
    </div>
  );

  if (chatsLoading) mainContent = <></>; // should be replaced with loading state once we have it
  else if (!chats!.find((chat) => chat.supporteeId)) mainContent = <SupporterWaiting />;

  return mainContent;
};
