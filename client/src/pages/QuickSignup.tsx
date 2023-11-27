import LoginButton from '../components/LoginButton';
import GoogleLogo from '../assets/logo_googleg_48dp.svg';
import FacebookLogo from '../assets/FacebookLogo.png';
import MailLogo from '../assets/Mail.svg';
import OrBackground from '../assets/OrBackground.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  useAuthState,
  useSignInWithFacebook,
  useSignInWithGoogle
} from 'react-firebase-hooks/auth';
import { auth, collections } from '../firebase/connection';
import { User } from '@firebase/auth';
import { doc, setDoc, getDoc } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ErrorModal, { ErrorInfo } from '../components/ErrorModal';
import { quickSignupErrors } from '../consts/errorMessages';
import useLoadingContext from '../context/loading/useLoadingContext';

const QuickSignup: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<ErrorInfo>();
  const [stage, setStage] = useState<'start' | 'updating' | 'end'>('start');
  const [user] = useAuthState(auth);
  const setIsLoading = useLoadingContext(loading);

  const createUserDocument = async (user?: User) => {
    if (user) {
      const oldUser = await getDoc(doc(collections.users, user.uid));
      if (!oldUser.exists()) {
        await setDoc(doc(collections.users, user.uid), {
          name: user.displayName as string,
          acceptedTerms: false
        });
      }
      setStage('end');
    }
  };

  const signInWithGoogleHandler = async () => {
    try {
      setStage('updating');
      const result = await signInWithPopup()
      await createUserDocument(user?.user);
    } catch (e) {
      setError(quickSignupErrors.signUpWithGoogle);
      setStage('start');
    }
  };

  const signInWithFacebookHandler = async () => {
    try {
      setStage('updating');
      const user = await signInWithFacebook();
      await createUserDocument(user?.user);
    } catch (e) {
      setError(quickSignupErrors.signUpWithFacebook);
      setStage('start');
    }
  };

  useEffect(() => {
    if (user && stage != 'updating') navigate('/selection', { replace: true });
  }, [user, navigate, stage]);

  return (
    <>
      {error ? <ErrorModal {...error} onClose={() => setError(undefined)} /> : <></>}
      <Header>הרשמה מהירה</Header>
      <div className="quick-signup-wrapper">
        <div className="page">
          <div className="social">
            <LoginButton onClick={signInWithGoogleHandler}>
              <img src={GoogleLogo} alt="Google Logo" />
              להרשמה עם גוגל
            </LoginButton>
            <LoginButton onClick={signInWithFacebookHandler}>
              <img src={FacebookLogo} alt="Facebook Logo" width={25} height={24} />
              להרשמה עם פייסבוק
            </LoginButton>
          </div>
          <div className="separator">
            <div className="line" />
            <div className="or">
              <span>או</span>
              <img src={OrBackground} alt="" />
            </div>
            <div className="line" />
          </div>
          <LoginButton
            onClick={() => {
              navigate('/signup');
            }}>
            <img src={MailLogo} alt="Mail Logo" />
            להרשמה עם אימייל
          </LoginButton>
          <p dir="rtl">
            כבר יש לך חשבון?{' '}
            <NavLink to="/signin" className="highlight">
              להתחברות
            </NavLink>
          </p>
        </div>
      </div>
    </>
  );
};

export default QuickSignup;
