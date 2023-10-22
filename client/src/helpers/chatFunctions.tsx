import {
  Timestamp,
  addDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import { Chat } from '../firebase/chat';
import { collections } from '../firebase/connection';
import { Socket } from 'socket.io-client';

export type Role = 'supporter' | 'supportee';
export const getRoleFieldName = (role: Role) =>
  role === 'supporter' ? 'supporterId' : 'supporteeId';
export const getOppositeRoleFieldName = (role: Role) =>
  role === 'supporter' ? 'supporteeId' : 'supporterId';

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

export const finishChat = async (socket: Socket, chatId: string) => {
  socket.emit('stop chat', { chatID: chatId });
  try {
    await updateDoc(doc(collections.chats, chatId), { status: 'ended' });
  } catch (err) {
    console.log('err: ', err);
  }
};
