import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@mui/material';
import SearchDialogHeader from './SearchDialogHeader';
import SearchDialogContent from './SearchDialogContent';
import SearchDialogFooter from './SearchDialogFooter';
import useSearchDialog from '../../hooks/useSearchDialog';

const SearchDialog = ({ open, onClose, onSelect }) => {
  const {
    searchTerm,
    isLoading,
    filteredCosmetics,
    handleSearchChange
  } = useSearchDialog();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <SearchDialogHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      <SearchDialogContent
        isLoading={isLoading}
        cosmetics={filteredCosmetics}
        onSelect={onSelect}
        onClose={onClose}
      />
      <SearchDialogFooter onClose={onClose} />
    </Dialog>
  );
};

SearchDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default SearchDialog; 