import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';
import Header from '../components/Header';
import React from 'react';
import { signInWithEmailAndPassword } from '@firebase/auth';
import ErrorModal, { ErrorInfo } from '../components/ErrorModal';
import { signInErrors } from '../consts/errorMessages';

const SignInPage = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [error, setError] = useState<ErrorInfo>();

  const handleFormSubmit = async ({ email, password }: FormOptions) => {
    try {
      await signInWithEmailAndPassword(auth, email!, password!);
    } catch (e) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        setError(signInErrors.invalidCredentials);
      } else {
        setError(signInErrors.generalError);
      }
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/selection');
    }
  }, [user, navigate]);

  return (
    <>
      {error ? <ErrorModal {...error} onClose={() => setError(undefined)} /> : <></>}
      <Header>התחברות</Header>
      <Form submitLabel="כניסה" email password onSubmit={handleFormSubmit} />
    </>
  );
};

export default SignInPage;
