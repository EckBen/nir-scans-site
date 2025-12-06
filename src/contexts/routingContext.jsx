// import { router, usePathname } from "expo-router";
import { createContext, useContext, useState } from "react";

const CustomRoutingContext = createContext();

export const CustomRoutingProvider = ({ children }) => {
  // const pathname = usePathname();
  console.log('Wishlist: pathname');
  const [pastRoutes, setPastRoutes] = useState(() => {
    const initPastRoutes = ['/'];
    console.log('Wishlist: init pathname');
    // if (pathname !== '/') initPastRoutes.push(pathname);
    return initPastRoutes;
  });

  const navigateTo = (newRoute) => {
    setPastRoutes([...pastRoutes, newRoute]);
    console.log('Wishlist: route to ', newRoute)
    // router.push(newRoute);
  };

  const goBack = () => {
    const historyLength = pastRoutes.length;
    if (historyLength > 1) {
      const newRoutes = [...pastRoutes];
      newRoutes.pop();
      const goToRoute = newRoutes[newRoutes.length - 1];
      setPastRoutes(newRoutes);
      console.log('Wishlist: route to ', newRoute)
      // router.push(goToRoute);
    }
  }
  
  return (
    <CustomRoutingContext.Provider value={{
      pastRoutes,
      navigateTo,
      goBack
    }}>{ children }</CustomRoutingContext.Provider>
  );
};

export const useCustomRouting = () => useContext(CustomRoutingContext);