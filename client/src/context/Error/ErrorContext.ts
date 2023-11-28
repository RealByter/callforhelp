import { createContext } from 'react';
import { ErrorType } from './ErrorContextProvider';

const ErrorContext = createContext({ setError: (error: ErrorType) => {} });

export default ErrorContext;
