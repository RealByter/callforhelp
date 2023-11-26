import { useContext, useEffect } from 'react';
import LoadingContext from './LoadingContext';

const useLoadingContext = (isLoading: boolean) => {
  const setIsLoading = useContext(LoadingContext).setIsLoading;

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  return setIsLoading;
};

export default useLoadingContext;
