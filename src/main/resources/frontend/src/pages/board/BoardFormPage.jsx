import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import useBoardStore from '../../store/boardStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const BOARD_CATEGORIES = [
  '일반',
  '공지사항',
  '질문/답변',
  '리뷰'
];

const BoardFormPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { 
    currentBoard,
    fetchBoard,
    createBoard,
    updateBoard,
    isLoading,
    error,
    clearError
  } = useBoardStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '일반'
  });

  useEffect(() => {
    if (boardId) {
      fetchBoard(boardId);
    }
  }, [boardId, fetchBoard]);

  useEffect(() => {
    if (boardId && currentBoard) {
      setFormData({
        name: currentBoard.name,
        description: currentBoard.description,
        category: currentBoard.category
      });
    }
  }, [boardId, currentBoard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = boardId
      ? await updateBoard(boardId, formData)
      : await createBoard(formData);

    if (success) {
      navigate('/boards');
    }
  };

  if (boardId && isLoading) return <LoadingSpinner />;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/boards')}
            sx={{ mb: 2 }}
          >
            게시판 목록으로
          </Button>

          <Typography variant="h4" component="h1" gutterBottom>
            {boardId ? '게시판 수정' : '새 게시판 생성'}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="게시판 이름"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="설명"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>카테고리</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="카테고리"
              required
            >
              {BOARD_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/boards')}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
            >
              {boardId ? '수정' : '생성'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <ErrorAlert
        open={!!error}
        message={error || ''}
        onClose={clearError}
      />
    </Container>
  );
};

export default BoardFormPage; 