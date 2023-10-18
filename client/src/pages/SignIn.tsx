import { useEffect } from 'react';
import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';
import Header from '../components/Header';

const SignInPage = () => {
  const navigate = useNavigate();
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [user] = useAuthState(auth);

  const handleFormSubmit = async ({ email, password }: FormOptions) => {
    signInWithEmailAndPassword(email as string, password as string);
  };

  useEffect(() => {    
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <>
      <Header>התחברות</Header>
      <Form submitLabel="כניסה" email password onSubmit={handleFormSubmit} />
    </>
  );
};

export default SignInPage;
