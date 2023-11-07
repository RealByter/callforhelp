import React, { useState } from 'react';
import ErrorContext from './ErrorContext';
import ErrorModal from '../../components/ErrorModal';

export type ErrorType = {
  title: string;
  content: string;
};

type ErrorContextProviderProps = {
  children: React.ReactNode;
};

const ErrorContextProvider: React.FC<ErrorContextProviderProps> = ({ children }) => {
  const [error, setError] = useState<ErrorType>();

  return (
    <ErrorContext.Provider value={{ setError }}>
      {error ? <ErrorModal {...error} onClose={() => setError(undefined)} /> : <></>}
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContextProvider;
