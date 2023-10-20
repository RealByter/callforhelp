import { useEffect, useState } from 'react';
import { useAuthState, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, collections } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';
import Header from '../components/Header';
import { doc, setDoc } from '@firebase/firestore';
import React from 'react';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const [user] = useAuthState(auth);
  const [stage, setStage] = useState<'start' | 'updating' | 'end'>('start');

  const handleFormSubmit = async ({ name, email, password }: FormOptions) => {
    setStage('updating');
    const user = await createUserWithEmailAndPassword(email as string, password as string);
    if (user) {
      await setDoc(doc(collections.users, user.user.uid), { name: name!, acceptedTerms: true });
      setStage('end');
    }
  };

  useEffect(() => {
    // Only redirect if the user existed before creating the user and after creating the user and assigning him the username
    if (user && stage !== 'updating') {
      navigate('/');
    }
  }, [user, navigate, stage]);

  return (
    <>
      <Header>הרשמה עם אימייל</Header>
      <Form name password email onSubmit={handleFormSubmit} submitLabel="להרשמה" />
    </>
  );
};

export default SignUpPage;
