import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon, Close as CloseIcon } from '@mui/icons-material';

const ImageUpload = ({ images, onChange }) => {
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    onChange([...images, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);

    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography component="legend" gutterBottom>이미지 첨부</Typography>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        style={{ display: 'none' }}
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<PhotoCameraIcon />}
        >
          이미지 선택
        </Button>
      </label>

      {previewUrls.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {previewUrls.map((url, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                width: 100,
                height: 100
              }}
            >
              <img
                src={url}
                alt={`미리보기 ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  bgcolor: 'background.paper'
                }}
                onClick={() => removeImage(index)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload; 