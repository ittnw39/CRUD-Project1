import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const ErrorAlert = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="error" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorAlert; 