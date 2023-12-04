import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';
import Header from '../components/Header';
import React from 'react';
import { signInWithEmailAndPassword } from '@firebase/auth';
import ErrorModal, { ErrorInfo } from '../components/ErrorModal';
import { FIREBASE_ERRORS, signInErrors } from '../consts/errorMessages';
import BackButton from '../components/BackButton';

const SignInPage = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [error, setError] = useState<ErrorInfo>();

  const handleFormSubmit = async ({ email, password }: FormOptions) => {
    try {
      await signInWithEmailAndPassword(auth, email!, password!);
    } catch (e: unknown) {
      const error = e as { code: string };
      if (error.code === FIREBASE_ERRORS.notFound || error.code === FIREBASE_ERRORS.wrongPassword) {
        setError(signInErrors.invalidCredentials);
      } else {
        setError(signInErrors.generalError);
      }
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/selection', { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      {error ? <ErrorModal {...error} onClose={() => setError(undefined)} /> : <></>}
      <BackButton to="/" />
      <Header>התחברות</Header>
      <Form submitLabel="כניסה" email password onSubmit={handleFormSubmit} />
    </>
  );
};

export default SignInPage;
