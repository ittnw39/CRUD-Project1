import React from 'react';
import PropTypes from 'prop-types';
import { DialogContent, List } from '@mui/material';
import TextLoadingSpinner from '../common/TextLoadingSpinner';
import CosmeticListItem from '../CosmeticListItem';

const SearchDialogContent = ({ isLoading, cosmetics, onSelect, onClose }) => {
  return (
    <DialogContent>
      {isLoading ? (
        <TextLoadingSpinner />
      ) : (
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {cosmetics.map((cosmetic) => (
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
  );
};

SearchDialogContent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  cosmetics: PropTypes.arrayOf(
    PropTypes.shape({
      cosmeticReportSeq: PropTypes.number.isRequired,
      itemName: PropTypes.string.isRequired,
      entpName: PropTypes.string.isRequired,
      spf: PropTypes.string,
      pa: PropTypes.string,
      waterProofingName: PropTypes.string,
      averageRating: PropTypes.number
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default SearchDialogContent; 