import { createContext } from 'react';

const LoadingContext = createContext({
  setIsLoading: (isLoading: boolean) => {}
});

export default LoadingContext;
