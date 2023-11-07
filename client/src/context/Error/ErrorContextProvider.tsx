import React, { useState } from 'react';
import ErrorContext from './ErrorContext';
import ErrorModal from '../../components/ErrorModal';
import { useNavigate } from 'react-router-dom';

export type ErrorType = {
  title: string;
  content: string;
  refresh: boolean;
};

type ErrorContextProviderProps = {
  children: React.ReactNode;
};

const ErrorContextProvider: React.FC<ErrorContextProviderProps> = ({ children }) => {
  const [error, setError] = useState<ErrorType>();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (error?.refresh) navigate(window.location.pathname);
    else setError(undefined);
  };

  return (
    <ErrorContext.Provider value={{ setError }}>
      {error ? <ErrorModal {...error} onClose={handleContinue} /> : <></>}
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContextProvider;
