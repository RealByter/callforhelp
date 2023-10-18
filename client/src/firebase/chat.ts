import { FirestoreDataConverter, Timestamp } from 'firebase/firestore';
import { z } from "zod"

const chatSchema = z.object({
  id: z.string(),
  supporterId: z.string().optional(),
  supporteeId: z.string().optional(),
  createdAt: z.instanceof(Timestamp),
});

type Chat = z.infer<typeof chatSchema>;

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
