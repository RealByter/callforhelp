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
  where
} from 'firebase/firestore';
import { Chat } from '../firebase/chat';
import { collections } from '../firebase/connection';

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
    where('status', '==', 'active'),
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

export const finishChat = async (chatId: string) => {
  try {
    await updateDoc(doc(collections.chats, chatId), { status: 'ended' });
  } catch (err) {
    console.log('err: ', err);
  }
};
