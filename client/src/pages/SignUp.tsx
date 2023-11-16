import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';
import Header from '../components/Header';
import React from 'react';
import ErrorModal, { ErrorInfo } from '../components/ErrorModal';
import { signUpErrors } from '../consts/errorMessages';
import BackButton from '../components/BackButton';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [error, setError] = useState<ErrorInfo>();

  const handleFormSubmit = async ({ name, email, password }: FormOptions) => {
    try {
      const functions = getFunctions();
      const signUp = httpsCallable(functions, 'signUp');
      await signUp({ password, email, name });
      await signInWithEmailAndPassword(auth, email!, password!);
    } catch (e: unknown) {
      const error = e as { message: string };
      if (error.message === 'User with email already exists') {
        setError(signUpErrors.userAlreadyExists);
      } else {
        setError(signUpErrors.generalError);
      }
    }
  };

  useEffect(() => {
    // Only redirect if the user existed before creating the user and after creating the user and assigning him the username
    if (user) {
      navigate('/selection', { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      {error ? <ErrorModal {...error} onClose={() => setError(undefined)} /> : <></>}
      <BackButton to="/" />
      <Header>הרשמה עם אימייל</Header>
      <Form name password email onSubmit={handleFormSubmit} submitLabel="להרשמה" />
    </>
  );
};

export default SignUpPage;
