import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import PostForm from '../../components/post/PostForm';
import usePostStore from '../../store/postStore';
import useBoardStore from '../../store/boardStore';
import useCosmeticStore from '../../store/cosmeticStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const PostFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const boardId = queryParams.get('boardId');
  const cosmeticId = queryParams.get('cosmeticId');
  const initialType = queryParams.get('type') || 'GENERAL';

  const [error, setError] = useState('');
  const [postType, setPostType] = useState(initialType);
  const [isSaving, setIsSaving] = useState(false);

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
    selectedCosmetic,
    getSelectedCosmetic,
    fetchCosmetics,
    isLoading: cosmeticsLoading,
    error: cosmeticsError,
    clearError: clearCosmeticsError
  } = useCosmeticStore();

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (boardId) {
          await fetchBoard(boardId);
        }
        if (postId) {
          await fetchPost(postId);
        }
      } catch (error) {
        console.error('데이터 초기화 중 오류 발생:', error);
        setError(error.message);
      }
    };

    initializeData();
  }, [boardId, postId, fetchBoard, fetchPost]);

  useEffect(() => {
    if (currentBoard) {
      setPostType(currentBoard.category === 'REVIEW' ? 'REVIEW' : 'GENERAL');
    }
  }, [currentBoard]);

  // 화장품 데이터 로드
  useEffect(() => {
    if (postType === 'REVIEW' && !selectedCosmetic) {
      console.log('선택된 화장품이 없어 화장품 목록을 불러옵니다.');
      fetchCosmetics();
    }
  }, [postType, selectedCosmetic, fetchCosmetics]);

  const handleSubmit = async (formData) => {
    try {
      setIsSaving(true);
      const postFormData = new FormData();
      
      const requestData = {
        boardId: parseInt(boardId),
        title: formData.title,
        content: formData.content,
        postType: postType,
        tags: formData.tags || []
      };

      if (postType === 'REVIEW') {
        console.log('화장품 ID:', cosmeticId);
        const cosmeticData = selectedCosmetic;
        console.log('선택된 화장품 정보:', cosmeticData);

        if (!cosmeticData) {
          throw new Error('선택된 화장품 정보를 찾을 수 없습니다. 화장품을 다시 선택해주세요.');
        }

        requestData.rating = formData.rating || 0;
        requestData.cosmeticInfo = {
          cosmeticReportSeq: parseInt(cosmeticId),
          cosmeticType: formData.cosmeticType,
          itemName: cosmeticData.itemName || '',
          entpName: cosmeticData.entpName || '',
          reportFlagName: cosmeticData.reportFlagName || '',
          itemPh: cosmeticData.itemPh || '',
          cosmeticStdName: cosmeticData.cosmeticStdName || '',
          spf: cosmeticData.spf || null,
          pa: cosmeticData.pa || null,
          usageDosage: cosmeticData.usageDosage || '',
          effectYn1: cosmeticData.effectYn1 || 'N',
          effectYn2: cosmeticData.effectYn2 || 'N',
          effectYn3: cosmeticData.effectYn3 || 'N',
          waterProofingName: cosmeticData.waterProofingName || ''
        };
      }

      // request 파트 추가
      postFormData.append('request', new Blob([JSON.stringify(requestData)], {
        type: 'application/json'
      }));

      // 이미지 추가
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          postFormData.append('images', image);
        });
      }

      console.log('요청 데이터:', {
        ...requestData,
        imageCount: formData.images?.length || 0
      });

      let response;
      try {
        if (postId) {
          response = await updatePost(postId, postFormData);
        } else {
          response = await createPost(postFormData);
        }
        
        console.log('응답 데이터:', response);
        
        // 게시글 상세 페이지로 이동하기 전에 잠시 대기 (이미지 처리 시간 고려)
        if (response?.id) {
          setTimeout(() => {
            setIsSaving(false);
            navigate(`/posts/${response.id}`);
          }, 1000);
        } else {
          setIsSaving(false);
          navigate(`/boards/${boardId}`);
        }
      } catch (error) {
        setIsSaving(false);
        console.error('게시글 저장 중 오류 발생:', error);
        setError(error.response?.data?.message || error.message || '게시글 저장에 실패했습니다.');
      }
    } catch (error) {
      setIsSaving(false);
      console.error('게시글 저장 중 오류 발생:', error);
      setError(error.message || '게시글 저장에 실패했습니다.');
    }
  };

  if (boardLoading || postLoading || cosmeticsLoading) return <LoadingSpinner />;

  const initialFormData = postId && currentPost ? {
    title: currentPost.title,
    content: currentPost.content,
    rating: currentPost.rating || 0,
    tags: currentPost.tags || [],
    images: [],
    cosmeticType: currentPost.cosmeticType || ''
  } : undefined;

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
        <PostForm
          initialData={initialFormData}
          postType={postType}
          selectedCosmetic={cosmeticId}
          cosmetics={cosmetics}
          onSubmit={handleSubmit}
          isLoading={postLoading}
        />
      </Paper>

      <ErrorAlert
        open={!!(boardError || postError || cosmeticsError || error)}
        message={boardError || postError || cosmeticsError || error}
        onClose={() => {
          clearBoardError();
          clearPostError();
          clearCosmeticsError();
          setError('');
        }}
      />

      {/* 저장 중 로딩 다이얼로그 */}
      <Dialog
        open={isSaving}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white'
            }}
          >
            <CircularProgress size={60} thickness={4} sx={{ color: 'white', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              게시글을 저장하고 있습니다...
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              잠시만 기다려주세요.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PostFormPage; 