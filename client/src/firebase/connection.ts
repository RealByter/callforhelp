import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, collection } from 'firebase/firestore';
import { chatFirestoreConverter } from './chat';
import { userFirestoreConverter } from './user';
import { messageFirestoreConverter } from './message';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

const DEV_AUTH_HOST = 'http://127.0.0.1:9099';
const DEV_FIRESTORE_HOST = '127.0.0.1';
const DEV_FIRESTORE_PORT = 8080;
const DEV_FUNCTIONS_HOST = '127.0.0.1';
const DEV_FUNCTIONS_PORT = 5001;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'default',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'localhost:9099',
  // if i forget: find a way to set the correct project id with the firebase emulators
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID === 'your-project-id'
      ? 'callforhelp-37002'
      : import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const functions = getFunctions(app);

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, DEV_AUTH_HOST);
  connectFirestoreEmulator(firestore, DEV_FIRESTORE_HOST, DEV_FIRESTORE_PORT);
  connectFunctionsEmulator(functions, DEV_FUNCTIONS_HOST, DEV_FUNCTIONS_PORT);
}

const collections = {
  chats: collection(firestore, 'chats').withConverter(chatFirestoreConverter),
  users: collection(firestore, 'users').withConverter(userFirestoreConverter),
  messages: collection(firestore, 'messages').withConverter(messageFirestoreConverter)
};

export { auth, functions, collections };
