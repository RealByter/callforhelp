import { FirestoreDataConverter, Timestamp } from 'firebase/firestore';

interface Chat {
  id: string;
  supporterId?: string;
  supporteeId?: string;
  createdAt: Timestamp;
}

const chatFirestoreConverter: FirestoreDataConverter<Chat> = {
  toFirestore(chat) {
    return chat;
  },
  fromFirestore(snapshot, options) {
    const { supporteeId, supporterId, createdAt } = snapshot.data(options);

    return { id: snapshot.id, supporteeId, supporterId, createdAt };
  }
};

export { chatFirestoreConverter };
export type { Chat };
