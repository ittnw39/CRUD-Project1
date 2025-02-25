import React, { useState } from 'react';
import {
  Box,
  Chip,
  TextField,
  Typography
} from '@mui/material';

const TagInput = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
        setInputValue('');
      }
    }
  };

  const handleDelete = (tagToDelete) => {
    onChange(tags.filter(tag => tag !== tagToDelete));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography component="legend" gutterBottom>태그</Typography>
      <TextField
        fullWidth
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="태그를 입력하고 Enter 또는 쉼표를 누르세요"
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => handleDelete(tag)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
};

export default TagInput; 