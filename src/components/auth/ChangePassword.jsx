import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from "react-toastify";

import Slide from '@mui/material/Slide';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '../Button';

export default function ChangePassword({ handleChangePassword }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    setModalVisible(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  }

  const handleOpen = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
      toast.error('All three fields are required');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New password and Confirm New Password fields do not match');
      return;
    }
    
    setIsLoading(true);

    const wasSuccessful = await handleChangePassword(newPassword, currentPassword);
    if (wasSuccessful) {
      toast.success('Password changed successfully!');
      handleClose();
    }

    setIsLoading(false);
  };

  return (
    <>
      <Modal
        open={modalVisible}
        onClose={handleClose}
        closeAfterTransition
      >
        <Slide in={modalVisible}>
          <div className='flex-1 justify-center items-center max-w-sm m-auto mt-[25vh]'>
            <div className='shadow-lg m-5 bg-white rounded-2xl p-9 flex flex-col items-center'>
              <p>Input your current password and the new password that you desire.</p>
              
              <div className='flex flex-col gap-3 mt-3 mb-5'>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                    Current Password
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="password"
                    placeholder="******************"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    id='currentPassword'
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="password"
                    placeholder="******************"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    id='newPassword'
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmNewPassword">
                    Confirm New Password
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="password"
                    placeholder="******************"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    id='confirmNewPassword'
                  />
                </div>
              </div>

              <div className='flex gap-1.5'>
                <Button onClick={handleSubmit} className='w-[115px] flex justify-center items-center !mb-0'>
                  {isLoading ? <CircularProgress  size='30px' style={{ color: 'white' }} /> : "Submit"}
                </Button>
                <Button onClick={handleClose} className='!mb-0'>Cancel</Button>
              </div>
            </div>
          </div>
        </Slide>
      </Modal>
      <Button onClick={handleOpen} variant='small'>Change Password</Button>
    </>
  );
}

ChangePassword.propTypes = {
  handleChangePassword: PropTypes.func
};