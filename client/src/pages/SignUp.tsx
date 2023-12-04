import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, collections } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';
import Header from '../components/Header';
import { deleteDoc, doc, setDoc } from '@firebase/firestore';
import { createUserWithEmailAndPassword, deleteUser, updateProfile } from '@firebase/auth';
import { connectionError, signUpErrors } from '../consts/errorMessages';
import BackButton from '../components/BackButton';
import useLoadingContext from '../context/loading/useLoadingContext';
import useErrorContext from '../context/Error/useErrorContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [stage, setStage] = useState<'start' | 'updating' | 'end'>('start'); // This is used for auth state
  const setIsLoading = useLoadingContext(); // And this is used to prevent the user from clicking the sign up button multiple times
  const setError = useErrorContext();

  const handleFormSubmit = async ({ name, email, password }: FormOptions) => {
    setIsLoading(true);
    setStage('updating');
    try {
      const user = await createUserWithEmailAndPassword(auth, email!, password!);

      if (user) {
        try {
          await setDoc(doc(collections.users, user.user.uid), { name: name!, acceptedTerms: true });
        } catch (e: unknown) {
          await deleteUser(user.user);
          throw e;
        }
        try {
          await updateProfile(user.user, { displayName: name });
        } catch (e: unknown) {
          await deleteDoc(doc(collections.users, user.user.uid));
          await deleteUser(user.user);
          throw e;
        }
        setStage('end');
      }
    } catch (e: unknown) {
      const error = e as { code: string };
      if (error.code === 'auth/email-already-in-use') {
        setError(signUpErrors.userAlreadyExists);
      } else if (error.code === 'auth/network-request-failed') {
        setError(connectionError.continue);
      } else {
        setError(signUpErrors.generalError);
      }
      setStage('start');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Only redirect if the user existed before creating the user and after creating the user and assigning him the username
    if (user && stage !== 'updating') {
      navigate('/selection', { replace: true });
    }
  }, [user, navigate, stage]);

  return (
    <div style={{overflow: "hidden"}}> /* solves overflow created by virtual keyboard */
      <BackButton to="/" />
      <Header>הרשמה עם אימייל</Header>
      <Form name password email onSubmit={handleFormSubmit} submitLabel="להרשמה" />
    </div>
  );
};

export default SignUpPage;
