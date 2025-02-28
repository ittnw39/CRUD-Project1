import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
  Stack
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

const CosmeticListItem = ({ cosmetic, onClick }) => {
  return (
    <ListItem
      button
      onClick={onClick}
      sx={{
        border: '1px solid #eee',
        borderRadius: 1,
        mb: 1,
        '&:hover': {
          backgroundColor: '#f5f5f5'
        }
      }}
    >
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1">{cosmetic.itemName}</Typography>
            {cosmetic.averageRating > 0 && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <StarIcon sx={{ color: '#ffd700', fontSize: '1rem' }} />
                <Typography variant="body2" color="text.secondary">
                  {cosmetic.averageRating.toFixed(1)}
                </Typography>
              </Stack>
            )}
          </Box>
        }
        secondary={
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              브랜드: {cosmetic.entpName}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {cosmetic.spf && (
                <Chip
                  size="small"
                  label={`SPF ${cosmetic.spf}`}
                  variant="outlined"
                />
              )}
              {cosmetic.pa && (
                <Chip
                  size="small"
                  label={`PA ${cosmetic.pa}`}
                  variant="outlined"
                />
              )}
              {cosmetic.waterProofingName && (
                <Chip
                  size="small"
                  label={cosmetic.waterProofingName}
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>
        }
      />
    </ListItem>
  );
};

CosmeticListItem.propTypes = {
  cosmetic: PropTypes.shape({
    itemName: PropTypes.string.isRequired,
    entpName: PropTypes.string.isRequired,
    spf: PropTypes.string,
    pa: PropTypes.string,
    waterProofingName: PropTypes.string,
    averageRating: PropTypes.number
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

export default CosmeticListItem; 