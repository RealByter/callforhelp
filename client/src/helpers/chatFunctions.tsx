import {
  Timestamp,
  addDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  and
} from 'firebase/firestore';
import { Chat } from '../firebase/chat';
import { Message } from '../firebase/message';
import { collections } from '../firebase/connection';
import { Socket } from 'socket.io-client';
// import { ChatItemProps } from '../components/ChatItem'; // move

export type Role = 'supporter' | 'supportee';
export const getRoleFieldName = (role: Role) =>
  role === 'supporter' ? 'supporterId' : 'supporteeId';
export const getOppositeRoleFieldName = (role: Role) =>
  role === 'supporter' ? 'supporteeId' : 'supporterId';

// export const findUserChatsData = async (userId: string, role: Role): Promise<ChatItemProps[]> => {
//   const roleFieldName = getRoleFieldName(role);
//   const queryUserChats = query(
//     collections.chats,
//     where(roleFieldName, '==', userId),
//     orderBy('createdAt')
//   );
//   const querySnapshot = await getDocs(queryUserChats);
//   // const queryData = querySnapshot.docs.map((doc) => doc.data());
  
//   querySnapshot.docs.forEach((doc) => {
//     let user = doc.data();

//   });


//   return queryData;
// };


export const getUserChats = async (userId: string, role: Role): Promise<Chat[]> => {
  const roleFieldName = getRoleFieldName(role);
  const queryUserChats = query(
    collections.chats,
    where(roleFieldName, '==', userId),
    orderBy('createdAt')
  );
  const querySnapshot = await getDocs(queryUserChats);
  const queryData = querySnapshot.docs.map((doc) => doc.data());

  // console.log("queryData", queryData);

  return queryData;
};

export const getNumOfUnreadMessagesInChat = async (userId: string, chatId: string): Promise<Number> => {
  const queryChatMessages = query(
    collections.messages,
    and(where("chatId", '==', chatId),
      where("senderId", '!=', userId),
      where("status", '==', 'received')),
  );
  const querySnapshot = await getDocs(queryChatMessages);
  const queryData = querySnapshot.docs.map((doc) => doc.data());

  return queryData.length;
};

export const getChatLastMessage = async (chatId: string): Promise<Message[]> => {
  const queryChatMessages = query(
    collections.messages,
    where("chatId", '==', chatId),
    orderBy('date', "desc"),
    limit(1)
  );
  const querySnapshot = await getDocs(queryChatMessages);
  const queryData = querySnapshot.docs.map((doc) => doc.data());

  return queryData;
};

export const findChatToFill = async (role: Role, userId: string): Promise<Chat | null> => {
  const roleFieldName = getRoleFieldName(role);
  const oppositeRoleFieldName = getOppositeRoleFieldName(role);
  const queryChatToFill = query(
    collections.chats,
    where(roleFieldName, '==', null),
    orderBy('createdAt'),
    limit(1)
  );
  const querySnapshot = await getDocs(queryChatToFill);
  const queryData = querySnapshot.docs.map((doc) => doc.data());
  const filteredQueryData = queryData.filter((doc) => doc[oppositeRoleFieldName] !== userId);

  if (filteredQueryData.length === 0) {
    return null;
  } else {
    return filteredQueryData[0];
  }
};

export const createChat = async (userId: string, role: Role): Promise<Chat> => {
  const newChatValues = {
    createdAt: Timestamp.now(),
    [getRoleFieldName(role)]: userId,
    [getOppositeRoleFieldName(role)]: null,
    status: 'active'
  };

  const chatRef = await addDoc(collections.chats, newChatValues);

  return { ...newChatValues, id: chatRef.id } as Chat;
};

export const joinChatFirebase = async (userId: string, role: Role, chatId: string) => {
  await updateDoc(doc(collections.chats, chatId), {
    [getRoleFieldName(role)]: userId
  });
};

export const getNameById = async (companionId: string): Promise<string> => {
  if (companionId) {
    const userSnapshot = await getDoc(doc(collections.users, companionId));
    if (!userSnapshot.exists()) {
      throw new Error(`Companion with the id ${companionId} wasn't found`);
    } else {
      return userSnapshot.data().name;
    }
  } else {
    return '';
  }
};

export const finishChat = async (socket: Socket, chatId: string) => {
  socket.emit('stop chat', { chatID: chatId });
  try {
    await updateDoc(doc(collections.chats, chatId), { status: 'ended' });
  } catch (err) {
    console.log('err: ', err);
  }
};
