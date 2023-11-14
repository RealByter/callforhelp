import { useAuthState } from 'react-firebase-hooks/auth';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../firebase/connection';
import { assignSupporter, finishChat } from '../helpers/chatFunctions';
import { useEffect } from 'react';
import { Chat } from '../components/Chat';

export const SupporterChatPage = () => {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('chatId');
  const [user, userLoading] = useAuthState(auth);
  const navigate = useNavigate();

  const goBackToChatsList = () => {
    navigate('/chats');
  };

  const endChat = () => {
    finishChat(chatId!);
    goBackToChatsList();
  };

  const findAdditionalSupportee = () => {
    assignSupporter(user!.uid);
  };

  const tryToFindAnotherSupportee = async (existingChatId: string) => {
    const newChatId = await assignSupporter(user!.uid, existingChatId);
    if (newChatId !== existingChatId)
      navigate({
        pathname: '/supporter-chat',
        search: createSearchParams({ chatId: newChatId }).toString()
      });
  };

  useEffect(() => {
    if (!chatId) navigate('/chats');
  }, [chatId, navigate]);

  useEffect(() => {
    // redirect if user not logged in
    if (!userLoading && !user) navigate('/');
  }, [userLoading, user, navigate]);

  let page = <></>;
  if (chatId && !userLoading)
    page = (
      <Chat
        chatId={chatId!}
        userId={user!.uid}
        role="supporter"
        endChat={endChat}
        secondaryAction={findAdditionalSupportee}
        goBack={() => navigate('/chats')}
        tryToFind={tryToFindAnotherSupportee}
      />
    );

  return page;
};
