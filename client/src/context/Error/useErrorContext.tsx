import { useContext } from 'react';
import ErrorContext from './ErrorContext';

const useErrorContext = () => useContext(ErrorContext).setError;

export default useErrorContext;
