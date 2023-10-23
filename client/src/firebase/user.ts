import { FirestoreDataConverter } from 'firebase/firestore';
import { z } from 'zod';

const userSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  acceptedTerms: z.boolean()
});

type User = z.infer<typeof userSchema>;

const userFirestoreConverter: FirestoreDataConverter<User> = {
  toFirestore(user) {
    return user;
  },
  fromFirestore(snapshot, options) {
    const rawData = { id: snapshot.id, ...snapshot.data(options) };

    return userSchema.parse(rawData);
  }
};

export { userFirestoreConverter };
export type { User };
