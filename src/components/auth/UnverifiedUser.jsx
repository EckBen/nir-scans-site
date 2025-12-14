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


// Then do verify page (flow here needs to include logged in check/login) and functionality
// Then test verify functionality
// Then check all auth data flows
//    register --> unverified, nowhere else
//    logged in, unverified --> unverified, nowhere else
//    verify --> verify page, makes sure it works then redirects to /
//    logged in, verified --> any route directly, except unverified or verify

// check data for new user
// have home replaced with AddScanner
// have tables empty
// if attempt to go to /samples/some-id, redirect to empty samples table for home/AddScanner