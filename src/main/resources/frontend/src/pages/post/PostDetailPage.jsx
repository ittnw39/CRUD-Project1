import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  styled,
  Rating,
  ImageList,
  ImageListItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import usePostStore from '../../store/postStore';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CommentSection from '../../components/comment/CommentSection';

// 별점 스타일 컴포넌트
const StyledRating = styled(Rating)`
  .MuiRating-icon {
    font-size: 30px;
    color: gray;
    -webkit-text-stroke: 1px black;
  }

  .MuiRating-iconFilled {
    color: gold;
  }
`;

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentPost, fetchPost, deletePost, isLoading, error, clearError } = usePostStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
  }, [postId, fetchPost]);

  const handleEdit = () => {
    navigate(`/posts/${postId}/edit`);
  };

  const handleDelete = async () => {
    const success = await deletePost(postId);
    if (success) {
      navigate(currentPost.boardId ? `/boards/${currentPost.boardId}` : '/');
    }
    setDeleteDialogOpen(false);
  };

  if (isLoading) return <LoadingSpinner />;
  if (!currentPost) return null;

  const isAuthor = user?.id === currentPost.userId;

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(currentPost.boardId ? `/boards/${currentPost.boardId}` : '/')}
            sx={{ mb: 2 }}
          >
            {currentPost.boardId ? '게시판으로 돌아가기' : '홈으로 돌아가기'}
          </Button>

          {/* 게시글 헤더 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={currentPost.userProfileImage}
              alt={currentPost.userNickname}
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">
                {currentPost.userNickname}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">
                  {new Date(currentPost.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            {isAuthor && (
              <Box>
                <IconButton onClick={handleEdit} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => setDeleteDialogOpen(true)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          <Typography variant="h4" component="h1" gutterBottom>
            {currentPost.title}
          </Typography>

          {currentPost.postType === 'REVIEW' && (
            <>
              {currentPost.cosmeticName && (
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {currentPost.cosmeticName}
                </Typography>
              )}
              <Box sx={{ mb: 3 }}>
                <StyledRating
                  value={currentPost.rating || 0}
                  readOnly
                  size="large"
                />
              </Box>
            </>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 게시글 내용 */}
        <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
          {currentPost.content}
        </Typography>

        {/* 이미지 갤러리 */}
        {currentPost.imagePaths && currentPost.imagePaths.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <ImageList cols={3} gap={8}>
              {currentPost.imagePaths.map((image, index) => (
                <ImageListItem
                  key={index}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`이미지 ${index + 1}`}
                    loading="lazy"
                    style={{ borderRadius: 4 }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}

        {/* 태그 */}
        {currentPost.tags && currentPost.tags.length > 0 && (
          <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {currentPost.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => navigate(`/posts/tag/${tag.replace('#', '')}`)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        )}

        {/* 댓글 섹션 */}
        <Divider sx={{ my: 3 }} />
        <CommentSection postId={postId} />
      </Paper>

      {/* 이미지 미리보기 다이얼로그 */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <img
            src={selectedImage}
            alt="이미지 미리보기"
            style={{ width: '100%', height: 'auto' }}
          />
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="게시글 삭제"
        content="정말로 이 게시글을 삭제하시겠습니까?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      <ErrorAlert
        open={!!error}
        message={error || ''}
        onClose={clearError}
      />
    </Container>
  );
};

export default PostDetailPage; 