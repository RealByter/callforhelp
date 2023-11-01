import { FirestoreDataConverter, Timestamp } from 'firebase/firestore';
import { z } from 'zod';

type chatStatus = 'active' | 'ended' | 'blocked';

const statusEnum: z.ZodType<chatStatus> = z.enum(['active', 'ended', 'blocked']);

const chatSchema = z.object({
  id: z.string(),
  supporterId: z.string().nullable(),
  supporteeId: z.string().nullable(),
  createdAt: z.instanceof(Timestamp),
  status: statusEnum.default('active'),
  supporteeName: z.string().nullable()
});

type Chat = z.infer<typeof chatSchema>;

const chatFirestoreConverter: FirestoreDataConverter<Chat> = {
  toFirestore(chat) {
    return chat;
  },
  fromFirestore(snapshot, options) {
    const rawData = { id: snapshot.id, ...snapshot.data(options) };

    return chatSchema.parse(rawData);
  }
};

export { chatFirestoreConverter };
export type { Chat };
