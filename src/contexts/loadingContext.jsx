import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingArray, setLoadingArray] = useState(['userAuth', 'userInfo', 'userData']);

  const updateLoading = (newItems=[], removeItems=[]) => {
    setLoadingArray((prevState) => {
      let currentLoading = [...prevState];
      newItems.forEach(item => {
        if (!currentLoading.includes(item)) {
          currentLoading = [...currentLoading, item];
        }
      });
  
      removeItems.forEach(item => {
        if (currentLoading.includes(item)) {
          currentLoading = currentLoading.filter(ci => ci !== item);
        }
      });

      return currentLoading;
    });
  };
  
  return (
    <LoadingContext.Provider value={{
      isLoading: loadingArray.length > 0,
      updateLoading,
    }}>{ children }</LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);