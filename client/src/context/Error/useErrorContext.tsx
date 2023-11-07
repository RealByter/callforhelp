import { useContext, useEffect } from 'react';
import ErrorContext from './ErrorContext';
import { ErrorType } from './ErrorContextProvider';

const useErrorContext = (error: ErrorType) => {
  const setError = useContext(ErrorContext).setError;

  useEffect(() => {
    if(error)
      setError(error)
  }, [error, setError])
};

export default useErrorContext;
