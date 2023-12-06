import {
  Timestamp,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  and,
  onSnapshot,
  getCountFromServer
} from 'firebase/firestore';
import { Chat } from '../firebase/chat';
import { Message } from '../firebase/message';
import { collections } from '../firebase/connection';

export type Role = 'supporter' | 'supportee';
export type RoleFieldName = 'supporterId' | 'supporteeId';

export const getOppositeRole = (role: Role): Role =>
  role === 'supporter' ? 'supportee' : 'supporter';
export const getRoleFieldName = (role: Role): RoleFieldName =>
  role === 'supporter' ? 'supporterId' : 'supporteeId';
export const getOppositeRoleFieldName = (role: Role): RoleFieldName =>
  role === 'supporter' ? 'supporteeId' : 'supporterId';

const OnSnapshotError = (error: unknown) => {
  // todo: handle errors
  console.log('error', error);
};

export const getRealtimeUserChats = (userId: string, role: Role, cb: (result: Chat[]) => void) => {
  const roleFieldName = getRoleFieldName(role);
  const queryUserChats = query(
    collections.chats,
    where(roleFieldName, '==', userId),
    orderBy('createdAt')
  );

  const unsubscribe = onSnapshot(
    queryUserChats,
    (snapshot) => {
      const queryData = snapshot.docs.map((doc) => doc.data());
      cb(queryData);
    },
    OnSnapshotError
  );
  return unsubscribe;
};

export const getRealtimeLastMessage = (chatId: string, cb: (result: Message) => void) => {
  const queryChatMessages = query(
    collections.messages,
    where('chatId', '==', chatId),
    orderBy('date', 'desc'),
    limit(1)
  );

  const unsubscribe = onSnapshot(
    queryChatMessages,
    (snapshot) => {
      const snapshotData = snapshot.docs.map((doc) => doc.data());
      cb(snapshotData[0]);
    },
    OnSnapshotError
  );
  return unsubscribe;
};

export const getUnreadMessagesCount = async (userId: string, chatId: string): Promise<number> => {
  const queryChatMessages = query(
    collections.messages,
    and(
      where('chatId', '==', chatId),
      where('senderId', '!=', userId),
      where('status', '==', 'received')
    )
  );
  const snapshot = await getCountFromServer(queryChatMessages);
  return snapshot.data().count;
};

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

export const assignSupporter = async (userId: string, existingChatId?: string) => {
  const chatToFill = await findChatToFill('supporter', userId);

  if (chatToFill) {
    if (existingChatId)
      deleteDoc(doc(collections.chats, existingChatId)).then(async () => {
        // using 'then' here is probably stupid but i fear that the chat item will be deleted before it would join the already existing searching chat
        await joinChatFirebase(userId, 'supporter', chatToFill.id);
      });
    else await joinChatFirebase(userId, 'supporter', chatToFill.id);

    return chatToFill.id;
  } else if (!existingChatId) {
    const newChat = await createChat(userId, 'supporter');
    return newChat.id;
  } else {
    return existingChatId;
  }
};

export const assignSupportee = async (userId: string, name: string, existingChatId?: string) => {
  const chatToFill = await findChatToFill('supportee', userId);

  if (chatToFill) {
    if (existingChatId) await deleteDoc(doc(collections.chats, existingChatId));
    await joinChatFirebase(userId, 'supportee', chatToFill.id, name);
    return chatToFill.id;
  } else {
    if (!existingChatId) {
      const chat = await createChat(userId, 'supportee', name);
      return chat.id;
    } else {
      return existingChatId;
    }
  }
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

export const checkIfHasActive = async (userId: string) => {
  const activeChat = await getDocs(
    query(
      collections.chats,
      where('supporterId', '==', userId),
      where('status', '==', 'active'),
      limit(1)
    )
  );

  return activeChat.size; // either 1 or 0 => true or false
};
