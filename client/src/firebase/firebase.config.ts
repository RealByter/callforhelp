import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//TODO: these should be stored on a secret management provider
const firebaseConfig = {
  apiKey: "AIzaSyB9OQYLjp1ajEWyYihT3aruZCZ8WxPHzAA",
  authDomain: "call-for-help-fc402.firebaseapp.com",
  projectId: "call-for-help-fc402",
  storageBucket: "call-for-help-fc402.appspot.com",
  messagingSenderId: "682171514687",
  appId: "1:682171514687:web:eab16f27bd41bfb8fd1d8a",
  measurementId: "G-7FEXZ7PZQG"
};

const firebase: FirebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const firestore = getFirestore(firebase);

export { auth, firestore };