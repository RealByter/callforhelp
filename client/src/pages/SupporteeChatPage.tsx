import { useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { query, where } from '@firebase/firestore';
import { auth, collections } from '../firebase/connection';
import { assignSupportee, finishChat } from '../helpers/chatFunctions';
import { getDocs } from 'firebase/firestore';
import { Chat } from '../components/Chat';
import SupporteeWaiting from '../components/SupporteeWaiting';

/*
  TODO - take care of the disconnect events
  TODO - take care of cases in which the chat id doesnt exist
*/

export const SupporteeChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = searchParams.get('chatId');
  const [user, userLoading] = useAuthState(auth);
  const navigate = useNavigate();

  const goBackToSelection = () => {
    navigate('/selection');
  };

  const changeSupporter = async () => {
    finishChat(chatId!);
    setSearchParams(
      createSearchParams({ chatId: await assignSupportee(user!.uid, user!.displayName!) })
    );
  };

  const endChat = () => {
    finishChat(chatId!);
    goBackToSelection();
  };

  const tryToFindSupporter = useCallback(
    async (existingChatId: string) => {
      const newChatId = await assignSupportee(user!.uid, user!.displayName!, existingChatId);
      if (newChatId !== existingChatId)
        navigate({
          pathname: '/supportee-chat',
          search: createSearchParams({ chatId: newChatId }).toString()
        });
    },
    [navigate, user]
  );

  useEffect(() => {
    const joinAsSupportee = async () => {
      try {
        const existingChatSnapshot = await getDocs(
          query(
            collections.chats,
            where('supporteeId', '==', user!.uid),
            where('status', '==', 'active')
          )
        );

        if (existingChatSnapshot.size > 0) {
          const existingChat = existingChatSnapshot.docs[0].data();

          if (!existingChat.supporterId) {
            tryToFindSupporter(existingChat.id);
          } else {
            setSearchParams(createSearchParams({ chatId: existingChat.id }).toString());
          }
        } else {
          setSearchParams(
            createSearchParams({
              chatId: await assignSupportee(user!.uid, user!.displayName!)
            }).toString()
          );
        }
      } catch (e: unknown) {
        const error = e as { code: string };
        console.log(error);
      }
    };

    // redirect if user not logged in
    if (!userLoading) {
      if (!user) navigate('/');
      else if (!chatId) joinAsSupportee();
    }
  }, [userLoading, user, navigate, chatId, setSearchParams, tryToFindSupporter]);

  let page = <SupporteeWaiting />;
  if (chatId && user)
    page = (
      <Chat
        role="supportee"
        chatId={chatId}
        userId={user!.uid}
        endChat={endChat}
        secondaryAction={changeSupporter}
        goBack={goBackToSelection}
        tryToFind={tryToFindSupporter}
      />
    );

  return page;
};
