import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

import { useAuth } from '../../contexts/authContext';

import Button from '../Button';
import CardWithTitle from '../CardWithTitle';

export default function Recovery() {
  const { recover } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRecover = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      toast.error('Email and password are required');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
  
    const verificationResults = await recover(window.location.search, password);
    if (verificationResults) {
      navigate('/');
      toast.success('Recovery successful!');
    }
  };

  return (
    <CardWithTitle title='Account Recovery'>
      <p>Choose a new password for your account.</p>

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
        />
      </div>

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
        />
      </div>


      <Button
        onClick={handleRecover}
        variant='small'
        className='mb-6'
      >Recover Account</Button>
    </CardWithTitle>
  );
}