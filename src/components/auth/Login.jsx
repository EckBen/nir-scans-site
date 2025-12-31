import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';

import { useAuth } from '../../contexts/authContext';
import { useLoading } from "../../contexts/loadingContext";

import Button from '../Button';
import CardWithTitle from '../CardWithTitle';
import PasswordResetSent from './PasswordResetSent';

export default function Login() {
  const { login, register, userAuth, sendRecoveryLink } = useAuth();
  const { isLoading } = useLoading();
  const navigate = useNavigate();

  const [showResetSent, setShowResetSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (userAuth !== null) {
      if (userAuth.emailVerification) {
        navigate('/');
      } else {
        navigate('/unverified-user');
      }
    }
  }, [userAuth]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Email and password are required');
      return false;
    }

    const response = await login(email, password);
    if (response?.error) {
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Email and password are required');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const response = await register(email, password);
    if (response?.error) {
      return;
    }
  };

  const handleAuth = async () => {
    if (isRegistering) {
      const registerResults = await handleRegister();
      if (registerResults) {
        navigate('/unverified-user');
      }
    } else {
      const loginResults = await handleLogin();
      if (loginResults) {
        navigate('/');
      }
    }
  };

  const handleSendRecoveryLink = async () => {
    if (!email.trim()) {
      toast.error('Email is required to reset password');
      return;
    } else {
      const results = await sendRecoveryLink(email);
      if (results) {
        setShowResetSent(true);
      }
    }
  };

  if (showResetSent) {
    return (
      <PasswordResetSent
        handleBack={() => setShowResetSent(false)}
        email={email}
      />
    );
  } else {
    return (
      <CardWithTitle title={isRegistering ? 'Sign Up' : 'Log In'}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            id='email'
            onKeyDown={(e) => e.key === 'Enter' ? handleAuth() : null}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="******************"
            value={password}
            onChange={e => setPassword(e.target.value)}
            id='password'
            onKeyDown={(e) => e.key === 'Enter' ? handleAuth() : null}
          />
        </div>

        {isRegistering && 
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="******************"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              id='confirmPassword'
              onKeyDown={(e) => e.key === 'Enter' ? handleAuth() : null}
            />
          </div>
        }
        
        <div className='h-11'>
          {isLoading ? (
            <div className='mx-auto w-fit'>
              <CircularProgress />
            </div>
          ) : (
            <Button
                onClick={handleAuth}
                variant='small'
                className='mb-6'
            >
              {isRegistering ? 'Sign Up' : 'Log In'}
            </Button>
          )}
        </div>
        
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center justify-between">
            <p>{isRegistering ? 'Already have an account?' : "Don't have an account?"}</p>
            <Button
              onClick={() => setIsRegistering(!isRegistering)}
              variant='anchor'
              >
              {isRegistering ? 'Log In' : "Sign up"}
            </Button>
          </div>

          {!isRegistering &&
            <div className="flex flex-col items-center">
              <p>Forgot password?</p>
              <Button
                onClick={handleSendRecoveryLink}
                variant='anchor'
              >
                Reset Password
              </Button>
            </div>
          }
        </div>
      </CardWithTitle>
    );
  }
}