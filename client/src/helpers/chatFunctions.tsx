import {
  DocumentSnapshot,
  QuerySnapshot,
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
    where(oppositeRoleFieldName, '!=', userId),
    orderBy(oppositeRoleFieldName), // required
    where('status', '==', 'active'),
    orderBy('createdAt'),
    limit(1)
  );
  const querySnapshot = await getDocs(queryChatToFill);

  throwErrorIfOffline(querySnapshot);

  if (querySnapshot.size === 0) {
    return null;
  } else {
    return querySnapshot.docs[0].data();
  }
};

export const createChat = async (
  userId: string,
  role: Role,
  supporteeName?: string
): Promise<Chat> => {
  const newChatValues = {
    createdAt: Timestamp.now(),
    [getRoleFieldName(role)]: userId,
    [getOppositeRoleFieldName(role)]: null,
    status: 'active'
  };

  if (role === 'supportee' && supporteeName) newChatValues.supporteeName = supporteeName;
  else newChatValues.supporteeName = null;

  const chatRef = await addDoc(collections.chats, newChatValues);

  return { ...newChatValues, id: chatRef.id } as Chat;
};

export const joinChatFirebase = async (
  userId: string,
  role: Role,
  chatId: string,
  supporteeName?: string
) => {
  const updates = { [getRoleFieldName(role)]: userId };
  if (role === 'supportee' && supporteeName) updates.supporteeName = supporteeName;

  await updateDoc(doc(collections.chats, chatId), updates);
};

export const assignSupporter = async (userId: string) => {
  const chatToFill = await findChatToFill('supporter', userId);

  if (chatToFill) await joinChatFirebase(userId, 'supporter', chatToFill.id);
  else await createChat(userId, 'supporter');
};

export const assignSupportee = async (userId: string, name: string) => {
  const chatToFill = await findChatToFill('supportee', userId);

  if (chatToFill) {
    await joinChatFirebase(userId, 'supportee', chatToFill.id, name);
    return chatToFill.id;
  } else {
    const chat = await createChat(userId, 'supportee', name);
    return chat.id;
  }
};

export const getNameById = async (companionId: string): Promise<string> => {
  if (companionId) {
    const userSnapshot = await getDoc(doc(collections.users, companionId));
    throwErrorIfOffline(userSnapshot);
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

export const checkIfHasActive = async (userId: string) => {
  const activeChat = await getDocs(
    query(
      collections.chats,
      where('supporterId', '==', userId),
      where('status', '==', 'active'),
      limit(1)
    )
  );

  throwErrorIfOffline(activeChat);

  return activeChat.size; // either 1 or 0 => true or false
};

export const throwErrorIfOffline = (snapshot: QuerySnapshot | DocumentSnapshot) => {
  console.log(navigator.onLine);
  
  // if (snapshot.empty && snapshot.metadata.fromCache)
  // {
  //   if(snapshot instanceof QuerySnapshot && snapshot.empty)
  //     throw { code: 'firestore/network-request-failed' };
  //   else if (snapshot instanceof DocumentSnapshot && snapshot)
  // }
};
