import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from "react-toastify";

import Slide from '@mui/material/Slide';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Button from '../Button';

export default function AddScanner({ handleNewScanner }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [scannerId, setScannerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    setModalVisible(false);
    setScannerId('');
  }

  const handleOpen = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    const pattern = /^P\d{9}$/;
    if (pattern.test(scannerId)) {
      setIsLoading(true);

      const wasSuccessful = await handleNewScanner(scannerId);
      if (wasSuccessful) {
        toast.success('Scanner added successfully!')
        handleClose();
      }

      setIsLoading(false);
    } else {
      toast.error('Id must match the pattern of "P#########"');
    }
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
            <div className='shadow-lg m-5 bg-white rounded-2xl p-9 flex flex-col gap-2 items-center'>
              <p>Use the device identity to add a scanner to your account.</p>
              <TextField
                placeholder='P#########'
                label='Scanner ID'
                value={scannerId}
                onChange={(e) => setScannerId(e.target.value)}
                variant='outlined'
              />
              <div className='flex gap-1.5'>
                <Button onClick={handleSubmit} className='w-[115px] flex justify-center items-center'>
                  {isLoading ? <CircularProgress  size='30px' style={{ color: 'white' }} /> : "Submit"}
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
              </div>
            </div>
          </div>
        </Slide>
      </Modal>
      <Button onClick={handleOpen} variant='small'>Add Scanner To Account</Button>
    </>
  );
}

AddScanner.propTypes = {
  handleNewScanner: PropTypes.func
};