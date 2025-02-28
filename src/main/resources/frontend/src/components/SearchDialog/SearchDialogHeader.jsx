import React from 'react';
import PropTypes from 'prop-types';
import { DialogTitle, TextField } from '@mui/material';

const SearchDialogHeader = ({ searchTerm, onSearchChange }) => {
  return (
    <>
      <DialogTitle>화장품 검색</DialogTitle>
      <TextField
        autoFocus
        margin="dense"
        label="화장품 이름 또는 브랜드 검색"
        type="text"
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ mb: 2, px: 3 }}
      />
    </>
  );
};

SearchDialogHeader.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired
};

export default SearchDialogHeader; 