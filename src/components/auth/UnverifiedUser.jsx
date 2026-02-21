import { useAuth } from '../../contexts/authContext';

import Button from '../Button';
import CardWithTitle from '../CardWithTitle';

export default function UnverifiedUser() {
  const { logout, resendVerification } = useAuth();

  return (
    <CardWithTitle title='User is not verified'>
      <p className='m-3'>The account that you are trying to use is unverified. Please check your email for a verification link in order to complete registration and gain access to this tool.</p>

      <div className='flex gap-2 w-fit mx-auto'>
        <Button
          onClick={resendVerification}
          variant='small'
        >
          Resend Verification Link
        </Button>
        
        <Button
          onClick={logout}
          variant='small'
        >
          Log Out
        </Button>
      </div>
    </CardWithTitle>
  );
}