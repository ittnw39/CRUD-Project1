import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const TextLoadingSpinner = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="40px"
    >
      <Typography variant="body1" color="text.secondary">
        검색 중입니다{dots}
      </Typography>
    </Box>
  );
};

export default TextLoadingSpinner; 