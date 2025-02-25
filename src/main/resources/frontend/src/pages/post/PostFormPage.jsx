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
  Rating,
  IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, PhotoCamera as PhotoCameraIcon, Close as CloseIcon } from '@mui/icons-material';
import usePostStore from '../../store/postStore';
import useBoardStore from '../../store/boardStore';
import useCosmeticStore from '../../store/cosmeticStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { CosmeticType } from '../../constants/enums';

// 별점 스타일 컴포넌트
const StyledRating = styled(Rating)({
  '& .MuiRating-icon': {
    marginRight: '-3px'  // 별들 사이의 간격을 줄임
  }
});

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
  const [formValues, setFormValues] = useState({
    title: '',
    content: '',
    rating: 0,
    tags: [],
    images: [],
    cosmeticType: ''
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(boardId || '');
  const [error, setError] = useState('');

  const { 
    currentBoard,
    fetchBoard,
    isLoading: boardLoading,
    error: boardError,
    clearError: clearBoardError,
    boards,
    fetchBoards
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
    isLoading: cosmeticsLoading,
    error: cosmeticsError,
    clearError: clearCosmeticsError
  } = useCosmeticStore();

  useEffect(() => {
    fetchBoards();
    if (boardId) {
      fetchBoard(boardId);
    }
    if (postId) {
      fetchPost(postId);
    }
    if (cosmeticId && cosmeticId !== 'null') {
      console.log('화장품 ID 설정:', cosmeticId);
      setSelectedCosmetic(cosmeticId);
      
      // localStorage에서 화장품 정보 가져오기
      const savedCosmeticData = localStorage.getItem('selectedCosmetic');
      if (savedCosmeticData) {
        try {
          const parsedData = JSON.parse(savedCosmeticData);
          if (parsedData.cosmeticReportSeq === cosmeticId) {
            console.log('저장된 화장품 정보:', parsedData);
          }
        } catch (error) {
          console.error('화장품 정보 파싱 중 오류:', error);
        }
      }
    }
  }, [boardId, postId, cosmeticId, fetchBoard, fetchPost, fetchBoards]);

  useEffect(() => {
    if (postId && currentPost) {
      setFormValues({
        title: currentPost.title,
        content: currentPost.content,
        rating: currentPost.rating || 0,
        tags: currentPost.tags || [],
        images: [],
        cosmeticType: currentPost.cosmeticType || ''
      });
      setPostType(currentPost.postType);
      setSelectedCosmetic(currentPost.cosmeticId || '');
    }
  }, [postId, currentPost]);

  // 컴포넌트가 언마운트될 때 localStorage 정리
  useEffect(() => {
    return () => {
      localStorage.removeItem('selectedCosmetic');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setFormValues(prev => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (postType === 'REVIEW') {
      if (!selectedCosmetic) {
        setError('화장품을 선택해주세요.');
        return;
      }
    }

    const formData = new FormData();
    formData.append('title', formValues.title);
    formData.append('content', formValues.content);
    formData.append('boardId', selectedBoard);
    formData.append('postType', postType);
    
    if (postType === 'REVIEW') {
      if (formValues.rating === 0) {
        setError('별점을 선택해주세요.');
        return;
      }
      formData.append('rating', formValues.rating);
      
      const selectedCosmeticData = cosmetics.find(c => c.cosmeticReportSeq === selectedCosmetic);
      const cosmeticInfo = {
        cosmeticReportSeq: selectedCosmetic,
        itemName: selectedCosmeticData?.itemName || '',
        entpName: selectedCosmeticData?.entpName || '',
        reportFlagName: selectedCosmeticData?.reportFlagName || '',
        itemPh: selectedCosmeticData?.itemPh || '',
        cosmeticStdName: selectedCosmeticData?.cosmeticStdName || '',
        spf: selectedCosmeticData?.spf || '',
        pa: selectedCosmeticData?.pa || '',
        usageDosage: selectedCosmeticData?.usageDosage || '',
        effectYn1: selectedCosmeticData?.effectYn1 || '',
        effectYn2: selectedCosmeticData?.effectYn2 || '',
        effectYn3: selectedCosmeticData?.effectYn3 || '',
        waterProofingName: selectedCosmeticData?.waterProofingName || '',
        cosmeticType: formValues.cosmeticType
      };
      
      console.log('전송할 화장품 정보:', cosmeticInfo);
      formData.append('cosmeticInfo', JSON.stringify(cosmeticInfo));
    }

    formData.append('tags', JSON.stringify(formValues.tags));

    if (selectedImages.length > 0) {
      for (let i = 0; i < selectedImages.length; i++) {
        formData.append('images', selectedImages[i]);
      }
    }

    try {
      if (postId) {
        await updatePost(postId, formData, selectedImages);
      } else {
        await createPost(formData, selectedImages);
      }
      
      navigate(`/boards/${selectedBoard}`);
    } catch (error) {
      console.error('게시글 저장 중 오류 발생:', error);
      setError(error.message);
    }
  };

  const handleTypeChange = (event) => {
    setPostType(event.target.value);
    // REVIEW 타입이 아닐 경우 화장품 선택 초기화
    if (event.target.value !== 'REVIEW') {
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
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>게시판 선택</InputLabel>
            <Select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              label="게시판 선택"
              required
            >
              {boards.map((board) => (
                <MenuItem key={board.id} value={board.id}>
                  {board.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

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
          <>
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>리뷰할 화장품</InputLabel>
                <Select
                  value={selectedCosmetic}
                  onChange={handleCosmeticChange}
                  label="리뷰할 화장품"
                  required
                >
                  {Array.isArray(cosmetics) && cosmetics.map((cosmetic) => (
                    <MenuItem key={cosmetic.cosmeticReportSeq} value={cosmetic.cosmeticReportSeq}>
                      {cosmetic.itemName} ({cosmetic.entpName})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>화장품 카테고리</InputLabel>
                <Select
                  value={formValues.cosmeticType}
                  onChange={(e) => setFormValues(prev => ({ ...prev, cosmeticType: e.target.value }))}
                  label="화장품 카테고리"
                  required
                >
                  <MenuItem value={CosmeticType.SKINCARE}>스킨케어</MenuItem>
                  <MenuItem value={CosmeticType.BODYCARE}>바디케어</MenuItem>
                  <MenuItem value={CosmeticType.SUNCARE}>선케어</MenuItem>
                  <MenuItem value={CosmeticType.MAKEUP}>메이크업</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </>
        )}

        {/* 이미지 업로드 섹션 */}
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

          {/* 이미지 미리보기 */}
          {imagePreviewUrls.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {imagePreviewUrls.map((url, index) => (
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

        {/* 게시글 폼 */}
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Typography component="legend">제목</Typography>
            <FormControl fullWidth>
              <input
                type="text"
                name="title"
                value={formValues.title}
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
                value={formValues.content}
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
            <>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">별점</Typography>
                <StyledRating
                  name="rating"
                  value={formValues.rating}
                  onChange={handleRatingChange}
                  size="large"
                />
              </Box>
            </>
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
        message={boardError || postError || cosmeticsError || error}
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