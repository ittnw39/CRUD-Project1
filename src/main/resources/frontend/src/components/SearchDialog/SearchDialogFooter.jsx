import React from 'react';
import PropTypes from 'prop-types';
import { DialogActions, Button } from '@mui/material';

const SearchDialogFooter = ({ onClose }) => {
  return (
    <DialogActions>
      <Button onClick={onClose}>취소</Button>
    </DialogActions>
  );
};

SearchDialogFooter.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default SearchDialogFooter; 