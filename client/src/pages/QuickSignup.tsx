import LoginButton from '../components/LoginButton';
import classes from './QuickSignup.module.scss';
import GoogleLogo from '../assets/logo_googleg_48dp.svg';
import FacebookLogo from '../assets/FacebookLogo.png';
import MailLogo from '../assets/Mail.svg';
import OrBackground from '../assets/OrBackground.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSignInWithFacebook, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, collections } from '../firebase/connection';
import { User } from '@firebase/auth';
import { doc, setDoc, getDoc } from '@firebase/firestore';
import React from 'react';
import Header from '../components/Header';

const QuickSignup: React.FC = () => {
  const navigate = useNavigate();
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [signInWithFacebook] = useSignInWithFacebook(auth);

  const createUserDocument = async (user: User) => {
    if (user) {
      const oldUser = await getDoc(doc(collections.users, user.uid));
      if (!oldUser.exists()) {
        await setDoc(doc(collections.users, user.uid), {
          name: user.displayName as string,
          acceptedTerms: false
        });
        navigate('/selection');
      }
    }
  };

  const signInWithGoogleHandler = async () => {
    const user = await signInWithGoogle();
    await handleUserCreation(user?.user);
  };

  const signInWithFacebookHandler = async () => {
    const user = await signInWithFacebook();
    await handleUserCreation(user?.user);
  };

  return (
    <>
      <Header>הרשמה מהירה</Header>
      <div className={classes.wrapper}>
        <div className={classes.page}>
          <div className={classes.social}>
            <LoginButton onClick={signInWithGoogleHandler}>
              <img src={GoogleLogo} alt="Google Logo" />
              להרשמה עם גוגל
            </LoginButton>
            <LoginButton onClick={signInWithFacebookHandler}>
              <img src={FacebookLogo} alt="Facebook Logo" width={25} height={24} />
              להרשמה עם פייסבוק
            </LoginButton>
          </div>
          <div className={classes.separator}>
            <div className={classes.line} />
            <div className={classes.or}>
              <span>או</span>
              <img src={OrBackground} alt="" />
            </div>
            <div className={classes.line} />
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
            <NavLink to="/signin" className={classes.highlight}>
              להתחברות
            </NavLink>
          </p>
        </div>
      </div>
    </>
  );
};

export default QuickSignup;
