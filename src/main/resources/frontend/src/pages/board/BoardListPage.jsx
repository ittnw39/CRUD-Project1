import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import useBoardStore from '../../store/boardStore';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const BoardListPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    boards, 
    fetchBoards, 
    deleteBoard,
    isLoading, 
    error, 
    clearError 
  } = useBoardStore();

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleDelete = async (boardId) => {
    if (window.confirm('정말로 이 게시판을 삭제하시겠습니까?')) {
      const success = await deleteBoard(boardId);
      if (success) {
        // 삭제 후 목록 새로고침
        fetchBoards();
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          게시판 목록
        </Typography>
        {isAuthenticated && user?.role === 'ADMIN' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/boards/new')}
          >
            게시판 생성
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {boards.map((board) => (
          <Grid item xs={12} sm={6} md={4} key={board.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {board.name}
                  </Typography>
                  {isAuthenticated && user?.role === 'ADMIN' && (
                    <Box>
                      <Tooltip title="수정">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/boards/${board.id}/edit`);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton 
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(board.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                <Typography 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {board.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={board.category}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    icon={<DescriptionIcon />}
                    label={`게시글 ${board.postCount}개`}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/boards/${board.id}`)}
                >
                  게시판 보기
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ErrorAlert
        open={!!error}
        message={error || ''}
        onClose={clearError}
      />
    </Container>
  );
};

export default BoardListPage; 