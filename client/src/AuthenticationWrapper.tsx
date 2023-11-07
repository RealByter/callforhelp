import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, collections } from './firebase/connection';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import TermsAndConditionsPopup from './components/TermsAndConditionsPopup';
import React from 'react';
import useErrorContext from './context/Error/useErrorContext';
import { connectionError } from './consts/errorMessages';

type AuthenticationWrapperProps = {
  children: React.ReactNode;
};

const AuthenticationWrapper: React.FC<AuthenticationWrapperProps> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const [showTerms, setShowTerms] = useState(false);
  console.log(error);
  console.log(user);
  console.log(loading);

  const setError = useErrorContext(error && connectionError.refresh);

  useEffect(() => {
    if (user) {
      getDoc(doc(collections.users, user.uid))
        .then((res) => {
          if (!res.data()?.acceptedTerms) {
            setShowTerms(true);
          }
        })
        .catch(() => setError(connectionError.refresh));
    }
  }, [user, setError]);

  const handleAcceptance = async () => {
    await updateDoc(doc(collections.users, user!.uid), { acceptedTerms: true });
    setShowTerms(false);
  };

  return (
    <>
      {showTerms && <TermsAndConditionsPopup agreeNeeded onClose={handleAcceptance} />}
      {children}
    </>
  );
};

export default AuthenticationWrapper;
