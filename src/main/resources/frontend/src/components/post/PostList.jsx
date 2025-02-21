import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import PostCard from './PostCard';

const PostList = ({ 
  posts, 
  variant = 'standard',
  emptyMessage = '게시글이 없습니다.',
  gridProps = { xs: 12, sm: 6, md: 4 }
}) => {
  if (!posts || posts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid item key={post.id} {...gridProps}>
          <PostCard post={post} variant={variant} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList; 