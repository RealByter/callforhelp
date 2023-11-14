import { useEffect } from 'react';
import { ChatItem } from '../components/ChatItem';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, collections } from '../firebase/connection';
import { orderBy, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { assignSupporter } from '../helpers/chatFunctions';
import SupporterWaiting from '../components/SupporterWaiting';

export const ChatsListPage = () => {
  const [user, userLoading] = useAuthState(auth);
  const [chats, chatsLoading] = useCollectionData(
    query(
      collections.chats,
      where('supporterId', '==', userLoading || !user ? 'empty' : user?.uid),
      orderBy('createdAt', 'desc')
    )
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && !user) navigate('/');
  }, [user, userLoading, navigate]);

  const activeChats = chats?.filter((chat) => chat.status === 'active');
  const endedChats = chats?.filter((chat) => chat.status === 'ended');

  let mainContent = (
    <>
      <h2 className="header">רשימת נתמכים</h2>
      <ul className="list">
        {activeChats?.map((chat) => (
          <ChatItem
            key={chat.id}
            name={chat.supporteeName || 'מחפשים...'}
            isEnded={false}
            chatId={chat.id}
          />
        ))}
        {endedChats && endedChats.length > 0 ? (
          <>
            <p className="chats-ended">שיחות שהסתיימו</p>
            {endedChats?.map((chat) => (
              <ChatItem
                key={chat.id}
                name={chat.supporteeName || 'לא נמצא'}
                isEnded={true}
                chatId={chat.id}
              />
            ))}
          </>
        ) : (
          <></>
        )}
      </ul>
    </>
  );
  
  if (chatsLoading) mainContent = <></>;
  else if (!chats![chats!.length - 1].supporteeId) mainContent = <SupporterWaiting />;

  return (
    <div className="chats-list">
      {mainContent}
      <div className="new-supportee">
        <Button
          onClick={() => assignSupporter(user!.uid)}
          disabled={chatsLoading || !!chats?.find((chat) => !chat.supporteeId)}>
          איתור נתמך נוסף
        </Button>
      </div>
      <NavLink className="selection-link" to="/selection">
        חזרה לעמוד בחירה
      </NavLink>
    </div>
  );
};
