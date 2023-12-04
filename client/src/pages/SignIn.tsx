import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';
import Header from '../components/Header';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { connectionError, signInErrors } from '../consts/errorMessages';
import BackButton from '../components/BackButton';
import useErrorContext from '../context/Error/useErrorContext';

const SignInPage = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const setError = useErrorContext();

  const handleFormSubmit = async ({ email, password }: FormOptions) => {
    try {
      await signInWithEmailAndPassword(auth, email!, password!);
    } catch (e: unknown) {
      const error = e as { code: string };
      console.log(error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError(signInErrors.invalidCredentials);
      } else if (error.code === 'auth/network-request-failed') {
        setError(connectionError.continue);
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
    <div style={{overflow: "hidden"}}> /* solves overflow created by virtual keyboard */
      <BackButton to="/" />
      <Header>התחברות</Header>
      <Form submitLabel="כניסה" email password onSubmit={handleFormSubmit} />
    </div>
  );
};

export default SignInPage;
