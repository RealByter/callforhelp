import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, collections } from './firebase/connection';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import TermsAndConditionsPopup from './components/TermsAndConditionsPopup';
import React from 'react';
import UserOptions from './components/UserOptions';

type AuthenticationWrapperProps = {
  children: React.ReactNode;
};

const AuthenticationWrapper: React.FC<AuthenticationWrapperProps> = ({ children }) => {
  const [user] = useAuthState(auth);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (user) {
      getDoc(doc(collections.users, user.uid)).then((res) => {
        if (!res.data()?.acceptedTerms) {
          setShowTerms(true);
        }
      });
    }
  }, [user]);

  const handleAcceptance = async () => {
    await updateDoc(doc(collections.users, user!.uid), { acceptedTerms: true });
    setShowTerms(false);
  };

  return (
    <>
      {showTerms && <TermsAndConditionsPopup agreeNeeded onClose={handleAcceptance} />}
      {user && <UserOptions />}
      {children}
    </>
  );
};

export default AuthenticationWrapper;
