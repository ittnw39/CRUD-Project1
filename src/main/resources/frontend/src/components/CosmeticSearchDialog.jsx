import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import useCosmeticStore from '../store/cosmeticStore';
import useSearch from '../hooks/useSearch';
import TextLoadingSpinner from './common/TextLoadingSpinner';
import CosmeticListItem from './CosmeticListItem';

const CosmeticSearchDialog = ({ open, onClose, onSelect }) => {
  const { cosmetics } = useCosmeticStore();
  const {
    searchTerm,
    isLoading,
    handleSearch,
    filteredItems: filteredCosmetics
  } = useSearch(cosmetics);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>화장품 검색</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="화장품 이름 또는 브랜드 검색"
          type="text"
          fullWidth
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        {isLoading ? (
          <TextLoadingSpinner />
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredCosmetics.map((cosmetic) => (
              <CosmeticListItem
                key={cosmetic.cosmeticReportSeq}
                cosmetic={cosmetic}
                onClick={() => {
                  onSelect(cosmetic);
                  onClose();
                }}
              />
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
      </DialogActions>
    </Dialog>
  );
};

CosmeticSearchDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default CosmeticSearchDialog; 