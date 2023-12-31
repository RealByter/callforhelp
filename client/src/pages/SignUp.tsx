import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, collections } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';
import Header from '../components/Header';
import { FIREBASE_ERRORS, signUpErrors, connectionError } from '../consts/errorMessages';
import BackButton from '../components/BackButton';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import useLoadingContext from '../context/loading/useLoadingContext';
import useErrorContext from '../context/Error/useErrorContext';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const setIsLoading = useLoadingContext();
  const setError = useErrorContext();
  const handleFormSubmit = async ({ name, email, password }: FormOptions) => {
    /* 
    Apparently you need to be on the Blaze plan (pay-as-you-go) in order to upload
    firebase functions to the cloud so for now i'm removing the precautions  
    */
    const user = await createUserWithEmailAndPassword(auth, email!, password!);
    await setDoc(doc(collections.users, user.user.uid), { name: name!, acceptedTerms: true });
    await updateProfile(user.user, { displayName: name! });
    // try {
    //   const functions = getFunctions();
    //   const signUp = httpsCallable(functions, 'signUp');
    //   await signUp({ password, email, name });
    //   await signInWithEmailAndPassword(auth, email!, password!);
    // } catch (e: unknown) {
    //   const error = e as { message: string; code: string };

    //   if (error.code === FIREBASE_ERRORS.alreadyExists) {
    //     setError(signUpErrors.userAlreadyExists);
    //   } else if (error.code === FIREBASE_ERRORS.invalidArgument.code) {
    //     setError({ title: FIREBASE_ERRORS.invalidArgument.title, content: error.message });
    //   } else if (error.code === FIREBASE_ERRORS.failedPrecondition.code) {
    //     setError({ title: FIREBASE_ERRORS.failedPrecondition.title, content: error.message });
    //   } else if (error.code === 'auth/network-request-failed') {
    //     setError(connectionError.continue);
    //   } else {
    //     setError(signUpErrors.generalError);
    //   }
    // }
    setIsLoading(false);
  };

  useEffect(() => {
    // Only redirect if the user existed before creating the user and after creating the user and assigning him the username
    if (user) {
      navigate('/selection', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div style={{ overflow: 'hidden' }}>
      {' '}
      {/* solves overflow created by virtual keyboard */}
      <BackButton to="/" />
      <Header>הרשמה עם אימייל</Header>
      <Form name password email onSubmit={handleFormSubmit} submitLabel="להרשמה" />
    </div>
  );
};

export default SignUpPage;
