import { FirestoreDataConverter } from 'firebase/firestore';
import { z } from "zod";

export type messageStatusType = "sent" | "received" | "loading";

const statusEnum: z.ZodType<messageStatusType> = z.enum(['sent', 'SENT', 'received', 'RECEIVED', 'loading', 'LOADING']);

const messageSchema = z.object({
    id: z.string().optional(),
    content: z.string(),
    senderId: z.string(), //need to add relations
    chatId: z.string(), //need to add relations
    status: statusEnum.default('SENT'),
    date: z.string(), //IOS string
});

type Message = z.infer<typeof messageSchema>;

const messageFirestoreConverter: FirestoreDataConverter<Message> = {
    toFirestore(message) {
        return message;
    },
    fromFirestore(snapshot, options) {
        const rawData = { id: snapshot.id, ...snapshot.data(options) };

        return messageSchema.parse(rawData);
    }
};

export { messageFirestoreConverter };
export type { Message };
