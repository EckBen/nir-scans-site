import { createContext, useContext, useState } from "react";
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import authService from "../services/authService";
import databaseService from "../services/databaseService";
import { useLoading } from "./loadingContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState(null);
  
  const { updateLoading } = useLoading();

  const getUser = async (isOnMount=false) => {
    updateLoading(['userInfo'],[]);

    const response = await authService.getUser(isOnMount);
    if (response?.error) {
      setUserAuth(null);
      updateLoading([],['userData']);
    } else {
      setUserAuth(response);
    }

    updateLoading([], ['userInfo', 'userAuth']);
  };

  const login = async (email, password) => {
    updateLoading(['userAuth'], []);

    const response = await authService.login(email, password);

    let result;
    if (response?.error) {
      result = false;
    } else {
      await getUser();
      result = true;
    }

    updateLoading([], ['userAuth']);
    return result;
  };

  const register = async (email, password) => {
    updateLoading(['userRegister'], []);
 
    // Register the user
    const registerResponse = await authService.register(email, password);
    if (registerResponse?.error) {
      updateLoading([], ['userRegister']);
      return false;
    }

    // Log the user in
    const loginResponse = await authService.login(email, password);
    if (loginResponse?.error) {
      updateLoading([], ['userRegister']);
      return false;
    }

    // Create user in user database
    await databaseService.createDocument(
      'users',
      { authID: registerResponse.$id },
      registerResponse.$id
    );
    
    // Get the user data
    await getUser();

    // Send a verification email
    const verificationSent = await authService.sendVerification();
    if (verificationSent?.error) {
      updateLoading([], ['userRegister']);
      return false;
    }

    // Return...if we get to this point registration was successful
    updateLoading([], ['userRegister']);
    return true;
  };

  const logout = async () => {
    await authService.logout();
    setUserAuth(null);
  };

  const resendVerification = async () => {
    const verificationSent = await authService.sendVerification();
    if (verificationSent?.error) {
      return false;
    }

    toast.success('Verification email sent successfully!');
    return true;
  };

  const verify = async (searchParams) => {
    updateLoading(['userVerify'], []);
    
    const urlParams = new URLSearchParams(searchParams);
    const secret = urlParams.get('secret');
    const userId = urlParams.get('userId');

    const response = await authService.verify(userId, secret);

    updateLoading([], ['userVerify']);
    return response?.error ? false : true;
  };

  const changePassword = async (newPassword, currentPassword) => {
    updateLoading(['updatePassword'], []);
    
    const response = await authService.updatePassword(newPassword, currentPassword);

    updateLoading([], ['updatePassword']);
    return response?.error ? false : true;
  };

  const sendRecoveryLink = async (email) => {
    updateLoading(['sendRecoveryLink'], []);
    
    const response = await authService.sendRecoveryLink(email);

    updateLoading([], ['sendRecoveryLink']);
    return response?.error ? false : true;
  };

  const recover = async (searchParams, password) => {
    updateLoading(['userRecover'], []);
    
    const urlParams = new URLSearchParams(searchParams);
    const secret = urlParams.get('secret');
    const userId = urlParams.get('userId');

    const response = await authService.updateRecovery(userId, secret, password);

    updateLoading([], ['userRecover']);
    return response?.error ? false : true;
  };

  return (
    <AuthContext.Provider value={{
      userAuth,
      login,
      register,
      logout,
      resendVerification,
      getUser,
      verify,
      changePassword,
      sendRecoveryLink,
      recover
    }}>{ children }</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node,
}