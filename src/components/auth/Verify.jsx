import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

import { useAuth } from '../../contexts/authContext';

import Button from '../Button';
import CardWithTitle from '../CardWithTitle';

export default function Verify() {
  const { userAuth, verify, resendVerification } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const verificationResults = await verify(window.location.search);
      if (verificationResults) {
        navigate('/');
        toast.success('Verification successful!');
      }
    })();
  },[]);

  return (
    <CardWithTitle title='Unable to verify user'>
      <p className='m-3'>There was a problem when trying to verify the user.</p>
      
      {userAuth === null && <p className='m-3'>Please make sure you have logged in.</p>}
      
      <p className='m-3'>Then close this window and try clicking the verification link again or clicking the button below to send a new verification link.</p>

      <div className='flex gap-2 w-fit mx-auto'>
        <Button
          onClick={resendVerification}
          variant='small'
        >
          Resend Verification Link
        </Button>

        {userAuth === null &&
          <Button
            onClick={() => navigate('/login')}
            variant='small'
          >
            Log In
          </Button>
        }
      </div>
    </CardWithTitle>
  );
}