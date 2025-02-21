import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  Rating,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import ConfirmDialog from '../common/ConfirmDialog';

const PostDetail = ({
  post,
  isAuthor,
  onEdit,
  onDelete
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setDeleteDialogOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      {/* 게시글 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={post.userProfileImage}
            alt={post.userNickname}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">
              {post.userNickname}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          {post.postType === 'REVIEW' && (
            <Rating value={post.rating} readOnly size="large" />
          )}
        </Box>
        <Typography variant="h5" component="h1" gutterBottom>
          {post.title}
        </Typography>
        {post.postType === 'REVIEW' && post.cosmeticName && (
          <Typography variant="subtitle1" color="text.secondary">
            {post.cosmeticName}
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 게시글 내용 */}
      <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
        {post.content}
      </Typography>

      {/* 이미지 */}
      {post.imagePaths && post.imagePaths.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <ImageList cols={3} gap={8}>
            {post.imagePaths.map((image, index) => (
              <ImageListItem 
                key={index}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`게시글 이미지 ${index + 1}`}
                  loading="lazy"
                  style={{ borderRadius: 4 }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}

      {/* 태그 */}
      {post.tags && post.tags.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {post.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      )}

      {/* 작성자 전용 버튼 */}
      {isAuthor && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            onClick={onEdit}
          >
            수정
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
          >
            삭제
          </Button>
        </Box>
      )}

      {/* 이미지 확대 보기 다이얼로그 */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
            }}
            onClick={() => setSelectedImage(null)}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={selectedImage}
            alt="확대된 이미지"
            style={{ width: '100%', height: 'auto' }}
          />
        </Box>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="게시글 삭제"
        message="정말로 이 게시글을 삭제하시겠습니까?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Paper>
  );
};

export default PostDetail; 