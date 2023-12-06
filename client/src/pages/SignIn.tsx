import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';
import Header from '../components/Header';
import { signInWithEmailAndPassword } from '@firebase/auth';
import ErrorModal, { ErrorInfo } from '../components/ErrorModal';
import { FIREBASE_ERRORS, signInErrors, connectionError } from '../consts/errorMessages';
import BackButton from '../components/BackButton';
import useLoadingContext from '../context/loading/useLoadingContext';
import useErrorContext from '../context/Error/useErrorContext';

const SignInPage = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const setIsLoading = useLoadingContext();
  const setError = useErrorContext();

  const handleFormSubmit = async ({ email, password }: FormOptions) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email!, password!);
    } catch (e: unknown) {
      const error = e as { code: string };
      if (error.code === FIREBASE_ERRORS.notFound || error.code === FIREBASE_ERRORS.wrongPassword) {
        setError(signInErrors.invalidCredentials);
      } else if (error.code === 'auth/network-request-failed') {
        setError(connectionError.continue);
      } else {
        setError(signInErrors.generalError);
      }
    }
    setIsLoading(false);
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
