import PropTypes from 'prop-types';

import Button from '../Button';
import CardWithTitle from '../CardWithTitle';

export default function PasswordResetSent({ handleBack, email }) {
  return (
    <CardWithTitle title='Reset Link Sent'>
      <div className='flex flex-col gap-3 mt-3 mb-7 px-5'>
        <p>Please check <b>{email}</b> for a password reset link, it is valid for 1 hour.</p>
        <p>Check your spam folder and allow up to 15 minutes for the email to arrive before trying to resend.</p>
      </div>
      
      <div className='flex justify-center'>
        <Button
          onClick={handleBack}
          variant='small'
        >Back</Button>
      </div>
    </CardWithTitle>
  );
}

PasswordResetSent.propTypes = {
  handleBack: PropTypes.func,
  email: PropTypes.string
};