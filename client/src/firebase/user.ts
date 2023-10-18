import { FirestoreDataConverter } from 'firebase/firestore';

interface User {
  id?: string;
  name: string;
  role?: 'supporter' | 'supportee';
}

const userFirestoreConverter: FirestoreDataConverter<User> = {
  toFirestore(user) {
    const { id, role, name, ...rest } = user;

    if (id) {
      return { id, role, name, ...rest };
    } else {
      return { role, name, ...rest };
    }
  },
  fromFirestore(snapshot, options) {
    const { role, name } = snapshot.data(options);

    return { id: snapshot.id, role, name };
  }
};

export { userFirestoreConverter };
export type { User };
