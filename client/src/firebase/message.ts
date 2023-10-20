import { FirestoreDataConverter } from 'firebase/firestore';
import { z } from "zod";

export type messageStatusType = "sent" | "received" | "loading";

const statusEnum: z.ZodType<messageStatusType> = z.enum(['sent', 'received', 'loading']);

const messageSchema = z.object({
    id: z.string().optional(),
    content: z.string(),
    senderId: z.string(),
    chatId: z.string(),
    status: statusEnum.default('sent'),
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
