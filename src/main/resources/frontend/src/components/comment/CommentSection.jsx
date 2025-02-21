import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon
} from '@mui/icons-material';
import useCommentStore from '../../store/commentStore';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const CommentSection = ({ postId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { 
    comments,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    isLoading,
    error,
    clearError
  } = useCommentStore();

  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (postId) {
      fetchComments(postId);
    }
  }, [postId, fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const success = await createComment(postId, newComment.trim());
    if (success) {
      setNewComment('');
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    const success = await updateComment(postId, editingComment.id, editContent.trim());
    if (success) {
      setEditingComment(null);
      setEditContent('');
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      await deleteComment(postId, commentId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading && comments.length === 0) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        댓글 {comments.length}개
      </Typography>

      {/* 댓글 작성 폼 */}
      {isAuthenticated && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="댓글을 작성하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              disabled={!newComment.trim()}
            >
              작성
            </Button>
          </Box>
        </Box>
      )}

      {/* 댓글 목록 */}
      <List>
        {comments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                user?.id === comment.userId && (
                  <Box>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setEditingComment(comment);
                        setEditContent(comment.content);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )
              }
            >
              <ListItemAvatar>
                <Avatar src={comment.userProfileImage} alt={comment.userNickname}>
                  {comment.userNickname[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography component="span" variant="subtitle2">
                      {comment.userNickname}
                    </Typography>
                    <Typography component="span" variant="caption" color="text.secondary">
                      {formatDate(comment.createdAt)}
                    </Typography>
                  </Box>
                }
                secondary={comment.content}
              />
            </ListItem>
            {index < comments.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>

      {/* 댓글 수정 다이얼로그 */}
      <Dialog
        open={!!editingComment}
        onClose={() => setEditingComment(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>댓글 수정</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingComment(null)}>취소</Button>
          <Button onClick={handleEdit} variant="contained" disabled={!editContent.trim()}>
            수정
          </Button>
        </DialogActions>
      </Dialog>

      <ErrorAlert
        open={!!error}
        message={error || ''}
        onClose={clearError}
      />
    </Box>
  );
};

export default CommentSection; 