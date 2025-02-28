import React, { useState } from 'react';
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
  ImageListItemBar,
  FormControl,
  Select,
  MenuItem,
  InputLabel
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
    images: [],
    cosmeticType: ''
  },
  postType,
  selectedCosmetic,
  cosmetics = [],
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState(initialData);
  const [tagInput, setTagInput] = useState('');
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (_, value) => {
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
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    // 파일 유효성 검사
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`지원하지 않는 파일 형식입니다: ${file.type}\n지원되는 형식: jpg, png, gif`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`파일 크기가 너무 큽니다: ${(file.size / 1024 / 1024).toFixed(2)}MB\n최대 크기: 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newPreviewImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviewImages(prev => [...prev, ...newPreviewImages]);
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...validFiles]
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
        <>
          <Box sx={{ mb: 3 }}>
            <Typography component="legend">별점</Typography>
            <Rating
              name="rating"
              value={formData.rating}
              onChange={handleRatingChange}
              size="large"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>화장품 카테고리</InputLabel>
              <Select
                name="cosmeticType"
                value={formData.cosmeticType}
                onChange={handleChange}
                label="화장품 카테고리"
                required
              >
                <MenuItem value="SKINCARE">스킨케어</MenuItem>
                <MenuItem value="BODYCARE">바디케어</MenuItem>
                <MenuItem value="SUNCARE">선케어</MenuItem>
                <MenuItem value="MAKEUP">메이크업</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {cosmetics.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>리뷰할 화장품</InputLabel>
                <Select
                  name="selectedCosmetic"
                  value={selectedCosmetic}
                  onChange={handleChange}
                  label="리뷰할 화장품"
                  required
                >
                  {cosmetics.map((cosmetic) => (
                    <MenuItem key={cosmetic.cosmeticReportSeq} value={cosmetic.cosmeticReportSeq}>
                      {cosmetic.itemName} ({cosmetic.entpName})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </>
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