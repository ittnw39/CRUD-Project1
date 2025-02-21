import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Divider,
  Tabs,
  Tab,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Sort as SortIcon,
  Visibility as VisibilityIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import useBoardStore from '../../store/boardStore';
import usePostStore from '../../store/postStore';
import useAuthStore from '../../store/authStore';
import PostList from '../../components/post/PostList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const ROWS_PER_PAGE_OPTIONS = [12, 24, 36];
const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: '최신순' },
  { value: 'createdAt,asc', label: '오래된순' },
  { value: 'viewCount,desc', label: '조회수순' },
  { value: 'commentCount,desc', label: '댓글많은순' }
];

const BoardDetailPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  
  // 필터 및 정렬 상태
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0].value);
  
  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [totalPages, setTotalPages] = useState(0);

  const { 
    currentBoard, 
    fetchBoard, 
    isLoading: boardLoading, 
    error: boardError,
    clearError: clearBoardError 
  } = useBoardStore();

  const {
    posts,
    totalElements,
    fetchPosts,
    isLoading: postsLoading,
    error: postsError,
    clearError: clearPostsError
  } = usePostStore();

  const fetchPostsWithParams = useCallback(async () => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page')) || 1;
    const size = parseInt(params.get('size')) || 10;
    await fetchPosts(boardId, { page, size });
    setTotalPages(Math.ceil(totalElements / rowsPerPage));
  }, [location.search, boardId, fetchPosts, totalElements, rowsPerPage]);

  useEffect(() => {
    if (boardId) {
      fetchBoard(boardId);
      fetchPostsWithParams();
    }
  }, [boardId, fetchBoard, fetchPostsWithParams]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    await fetchPostsWithParams();
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  if (boardLoading || postsLoading) return <LoadingSpinner />;
  if (!currentBoard) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* 게시판 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/boards')}
          sx={{ mb: 2 }}
        >
          게시판 목록으로
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          {currentBoard.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {currentBoard.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            label={currentBoard.category}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<VisibilityIcon />}
            label={`조회수 ${currentBoard.totalViews || 0}`}
            variant="outlined"
          />
          <Chip
            icon={<CommentIcon />}
            label={`댓글수 ${currentBoard.totalComments || 0}`}
            variant="outlined"
          />
          <Chip
            label={`게시글 ${currentBoard.postCount || 0}개`}
            variant="outlined"
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* 필터 및 검색 */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2
        }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="전체" value="all" />
            <Tab label="일반" value="GENERAL" />
            <Tab label="리뷰" value="REVIEW" />
          </Tabs>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {isAuthenticated && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/posts/new?boardId=${boardId}`)}
              >
                글쓰기
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Box component="form" onSubmit={handleSearch} sx={{ flex: 1 }}>
            <TextField
              fullWidth
              placeholder="게시글 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              displayEmpty
              size="small"
              startAdornment={<SortIcon sx={{ mr: 1 }} />}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 80 }}>
            <Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              size="small"
            >
              {ROWS_PER_PAGE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}개씩
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* 게시글 목록 */}
      <PostList
        posts={posts}
        emptyMessage="아직 게시글이 없습니다."
        gridProps={{ xs: 12, sm: 6, md: 4 }}
      />

      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Stack>
      )}

      <ErrorAlert
        open={!!(boardError || postsError)}
        message={boardError || postsError || ''}
        onClose={() => {
          clearBoardError();
          clearPostsError();
        }}
      />
    </Container>
  );
};

export default BoardDetailPage; 