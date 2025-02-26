import React, { useState } from 'react';
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

const CosmeticSearchDialog = ({ open, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { cosmetics } = useCosmeticStore();

  const filteredCosmetics = cosmetics.filter(cosmetic =>
    cosmetic.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cosmetic.entpName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {filteredCosmetics.map((cosmetic) => (
            <ListItem
              key={cosmetic.cosmeticReportSeq}
              button
              onClick={() => {
                onSelect(cosmetic);
                onClose();
              }}
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
                primary={cosmetic.itemName}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      브랜드: {cosmetic.entpName}
                    </Typography>
                    {cosmetic.spf && (
                      <Typography variant="body2" color="text.secondary">
                        SPF: {cosmetic.spf}
                      </Typography>
                    )}
                    {cosmetic.pa && (
                      <Typography variant="body2" color="text.secondary">
                        PA: {cosmetic.pa}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CosmeticSearchDialog; 