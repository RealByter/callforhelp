import { FirestoreDataConverter, Timestamp } from 'firebase/firestore';

interface Chat {
  id: string;
  supporterId?: string;
  supporteeId?: string;
  createdAt: Timestamp;
}

const chatFirestoreConverter: FirestoreDataConverter<Chat> = {
  toFirestore(chat) {
    const { id, supporteeId, supporterId, createdAt, ...rest } = chat;

    if (id) {
      return { id, supporteeId, supporterId, createdAt, ...rest };
    } else {
      return { supporteeId, supporterId, createdAt, ...rest };
    }
  },
  fromFirestore(snapshot, options) {
    const { supporteeId, supporterId, createdAt } = snapshot.data(options);

    return { id: snapshot.id, supporteeId, supporterId, createdAt };
  }
};

export { chatFirestoreConverter };
export type { Chat };
