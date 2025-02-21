import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
  Rating
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import usePostStore from '../../store/postStore';
import useBoardStore from '../../store/boardStore';
import useCosmeticStore from '../../store/cosmeticStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

// 별점 스타일 컴포넌트
const StyledRating = styled(Rating)`
  .MuiRating-icon {
    font-size: 30px;
    color: gray;
    cursor: pointer;
    transition: color 0.2s;
    -webkit-text-stroke: 1px black;
  }

  .MuiRating-iconFilled {
    color: gold;
  }

  .MuiRating-iconHover {
    color: gold;
  }
`;

const PostFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const boardId = queryParams.get('boardId');
  const cosmeticId = queryParams.get('cosmeticId');
  const initialType = queryParams.get('type') || 'GENERAL';

  const [selectedCosmetic, setSelectedCosmetic] = useState(cosmeticId || '');
  const [postType, setPostType] = useState(initialType);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 0,
    tags: [],
    images: []
  });

  const { 
    currentBoard,
    fetchBoard,
    isLoading: boardLoading,
    error: boardError,
    clearError: clearBoardError
  } = useBoardStore();

  const {
    currentPost,
    createPost,
    updatePost,
    fetchPost,
    isLoading: postLoading,
    error: postError,
    clearError: clearPostError
  } = usePostStore();

  const {
    cosmetics,
    fetchCosmetics,
    isLoading: cosmeticsLoading,
    error: cosmeticsError,
    clearError: clearCosmeticsError
  } = useCosmeticStore();

  useEffect(() => {
    if (boardId) {
      fetchBoard(boardId);
    }
    if (postId) {
      fetchPost(postId);
    }
    fetchCosmetics();
  }, [boardId, postId, fetchBoard, fetchPost, fetchCosmetics]);

  useEffect(() => {
    if (postId && currentPost) {
      setFormData({
        title: currentPost.title,
        content: currentPost.content,
        rating: currentPost.rating || 0,
        tags: currentPost.tags || [],
        images: []
      });
      setPostType(currentPost.postType);
      setSelectedCosmetic(currentPost.cosmeticId || '');
    }
  }, [postId, currentPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      ...formData,
      boardId: boardId || null,
      cosmeticId: selectedCosmetic || null,
      postType
    };

    const success = postId
      ? await updatePost(postId, postData)
      : await createPost(postData);

    if (success) {
      if (boardId) {
        navigate(`/boards/${boardId}`);
      } else if (cosmeticId) {
        navigate(`/cosmetics/${cosmeticId}`);
      } else {
        navigate('/');
      }
    }
  };

  const handleTypeChange = (event) => {
    setPostType(event.target.value);
    if (event.target.value === 'REVIEW' && !selectedCosmetic) {
      setSelectedCosmetic('');
    }
  };

  const handleCosmeticChange = (event) => {
    setSelectedCosmetic(event.target.value);
  };

  if (boardLoading || postLoading || cosmeticsLoading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          돌아가기
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          {postId ? '게시글 수정' : '새 게시글 작성'}
        </Typography>

        {currentBoard && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            게시판: {currentBoard.name}
          </Typography>
        )}
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        {/* 게시글 타입 선택 */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>게시글 타입</InputLabel>
            <Select
              value={postType}
              onChange={handleTypeChange}
              label="게시글 타입"
            >
              <MenuItem value="GENERAL">일반 게시글</MenuItem>
              <MenuItem value="REVIEW">리뷰</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* 화장품 선택 (리뷰인 경우) */}
        {postType === 'REVIEW' && (
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>리뷰할 화장품</InputLabel>
              <Select
                value={selectedCosmetic}
                onChange={handleCosmeticChange}
                label="리뷰할 화장품"
                required
              >
                {cosmetics.map((cosmetic) => (
                  <MenuItem key={cosmetic.id} value={cosmetic.id}>
                    {cosmetic.itemName} ({cosmetic.entpName})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* 게시글 폼 */}
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Typography component="legend">제목</Typography>
            <FormControl fullWidth>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '8px'
                }}
              />
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography component="legend">내용</Typography>
            <FormControl fullWidth>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={10}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '8px',
                  resize: 'vertical'
                }}
              />
            </FormControl>
          </Box>

          {postType === 'REVIEW' && (
            <Box sx={{ mb: 3 }}>
              <Typography component="legend">별점</Typography>
              <StyledRating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
                size="large"
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              {postId ? '수정' : '작성'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <ErrorAlert
        open={!!(boardError || postError || cosmeticsError)}
        message={boardError || postError || cosmeticsError || ''}
        onClose={() => {
          clearBoardError();
          clearPostError();
          clearCosmeticsError();
        }}
      />
    </Container>
  );
};

export default PostFormPage; 