import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import usePostStore from '../../store/postStore';
import useBoardStore from '../../store/boardStore';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const PostListPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { posts, fetchPosts, isLoading: postsLoading, error: postsError, clearError: clearPostsError } = usePostStore();
  const { currentBoard, fetchBoard, isLoading: boardLoading, error: boardError, clearError: clearBoardError } = useBoardStore();

  useEffect(() => {
    fetchBoard(boardId);
    fetchPosts(boardId);
  }, [boardId, fetchBoard, fetchPosts]);

  if (postsLoading || boardLoading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {currentBoard?.name}
          </Typography>
          {isAuthenticated && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/boards/${boardId}/posts/new`)}
            >
              글쓰기
            </Button>
          )}
        </Box>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {currentBoard?.description}
        </Typography>
        <Divider />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>제목</TableCell>
              <TableCell align="center">작성자</TableCell>
              <TableCell align="center">조회수</TableCell>
              <TableCell align="center">작성일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow
                key={post.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/boards/${boardId}/posts/${post.id}`)}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{post.title}</Typography>
                    {post.commentCount > 0 && (
                      <Chip
                        size="small"
                        label={post.commentCount}
                        color="primary"
                        icon={<CommentIcon />}
                      />
                    )}
                    {post.tags.map((tag) => (
                      <Chip
                        key={tag}
                        size="small"
                        label={tag}
                        color="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/posts/tag/${tag.replace('#', '')}`);
                        }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="center">{post.userNickname}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ViewIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {post.viewCount}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {new Date(post.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ErrorAlert
        open={!!(postsError || boardError)}
        message={postsError || boardError || ''}
        onClose={() => {
          clearPostsError();
          clearBoardError();
        }}
      />
    </Container>
  );
};

export default PostListPage;