import { createContext, useContext, useEffect, useState } from "react";

import authService from "../services/authService";
import { useLoading } from "./loadingContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState(null);

  const { updateLoading } = useLoading();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    updateLoading(['userInfo'],[]);

    const response = await authService.getUser();

    if (response?.error) {
      setUserAuth(null);
      updateLoading([],['userData']);
    } else {
      setUserAuth(response);
    }

    updateLoading([], ['userInfo', 'userAuth']);
  }

  const login = async (email, password) => {
    updateLoading(['userAuth'], []);
    
    const response = await authService.login(email, password);

    let result;
    if (response?.error) {
      result = response;
    } else {
      await checkUser();
      result = { success: true };
    }

    updateLoading([], ['userAuth']);
    return result;
  };

  const register = async (email, password) => {
    const response = await authService.register(email, password);

    if (response?.error) {
      return response;
    }

    return login(email, password); // Auto login after register
  };

  const logout = async () => {
    await authService.logout();
    setUserAuth(null);
  }

  return (
    <AuthContext.Provider value={{
      userAuth,
      login,
      register,
      logout
    }}>{ children }</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);