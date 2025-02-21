import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Rating,
  Typography,
  Chip,
  IconButton,
  Stack,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';

const PostForm = ({
  initialData = {
    title: '',
    content: '',
    rating: 0,
    tags: [],
    images: []
  },
  postType,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState(initialData);
  const [tagInput, setTagInput] = useState('');
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (value) => {
    setFormData(prev => ({
      ...prev,
      rating: value
    }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput('');
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviewImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviewImages(prev => [...prev, ...newPreviewImages]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleImageDelete = (index) => {
    URL.revokeObjectURL(previewImages[index].preview);
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="제목"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        label="내용"
        name="content"
        value={formData.content}
        onChange={handleChange}
        required
        multiline
        rows={10}
        sx={{ mb: 3 }}
      />

      {postType === 'REVIEW' && (
        <Box sx={{ mb: 3 }}>
          <Typography component="legend">별점</Typography>
          <Rating
            name="rating"
            value={formData.rating}
            onChange={(_, value) => handleRatingChange(value)}
            size="large"
          />
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography component="legend" gutterBottom>
          태그
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {formData.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleTagDelete(tag)}
            />
          ))}
        </Box>
        <TextField
          fullWidth
          placeholder="태그 입력 후 Enter (예: #스킨케어)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleTagInputKeyPress}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography component="legend" gutterBottom>
          이미지
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCameraIcon />}
          >
            이미지 업로드
            <input
              type="file"
              hidden
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
          </Button>
        </Stack>
        {previewImages.length > 0 && (
          <ImageList cols={3} rowHeight={164} gap={8}>
            {previewImages.map((image, index) => (
              <ImageListItem key={index}>
                <img
                  src={image.preview}
                  alt={`미리보기 ${index + 1}`}
                  loading="lazy"
                  style={{ height: '100%', objectFit: 'cover' }}
                />
                <ImageListItemBar
                  actionIcon={
                    <IconButton
                      sx={{ color: 'white' }}
                      onClick={() => handleImageDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  position="top"
                  actionPosition="right"
                  sx={{
                    background: 'none',
                    '& .MuiImageListItemBar-actionIcon': {
                      mr: -1,
                      mt: -1
                    }
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          startIcon={<AddIcon />}
        >
          {isLoading ? '처리 중...' : '작성 완료'}
        </Button>
      </Box>
    </Box>
  );
};

export default PostForm; 