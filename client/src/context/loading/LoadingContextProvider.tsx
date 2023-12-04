import { useState } from 'react';
import LoadingContext from './LoadingContext';
import LoadingModal from '../../components/LoadingModal';

type LoadingContextProviderProps = {
  children: React.ReactNode;
};

const LoadingContextProvider: React.FC<LoadingContextProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ setIsLoading }}>
      {isLoading ? <LoadingModal /> : <></>}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContextProvider;
