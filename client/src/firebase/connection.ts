import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, collection } from 'firebase/firestore';
import { chatFirestoreConverter } from './chat';
import { userFirestoreConverter } from './user';
import { messageFirestoreConverter } from './message';

const DEV_AUTH_HOST = 'http://127.0.0.1:9099';
const DEV_FIRESTORE_HOST = '127.0.0.1';
const DEV_FIRESTORE_PORT = 8080;

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'default',
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'localhost:9099',
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// };
const firebaseConfig = {
  apiKey: "AIzaSyCvoVkNgx38i-WtODOuOqVqbtjFNasbcgY",
  authDomain: "callforhelp-37002.firebaseapp.com",
  databaseURL: "https://callforhelp-37002-default-rtdb.firebaseio.com",
  projectId: "callforhelp-37002",
  storageBucket: "callforhelp-37002.appspot.com",
  messagingSenderId: "57290554385",
  appId: "1:57290554385:web:02923873f7aaf45b5385b0",
  measurementId: "G-WWWPNZ017T"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

// if (import.meta.env.DEV) {
//   connectAuthEmulator(auth, DEV_AUTH_HOST);
//   connectFirestoreEmulator(firestore, DEV_FIRESTORE_HOST, DEV_FIRESTORE_PORT);
// }



const collections = {
  chats: collection(firestore, 'chats').withConverter(chatFirestoreConverter),
  users: collection(firestore, 'users').withConverter(userFirestoreConverter),
  messages: collection(firestore, 'messages').withConverter(messageFirestoreConverter)
};

export { auth, collections };
