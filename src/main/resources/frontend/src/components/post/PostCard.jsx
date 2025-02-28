import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Chip,
  Button,
  Avatar
} from '@mui/material';
import { AccessTime as AccessTimeIcon } from '@mui/icons-material';
import { getImageUrl } from '../../utils/imageUtils';

const PostCard = ({ post, variant = 'standard' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
      onClick={handleClick}
    >
      {post.imagePaths && post.imagePaths[0] && (
        <CardMedia
          component="img"
          height={variant === 'compact' ? 140 : 200}
          image={getImageUrl(post.imagePaths[0])}
          alt={post.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            src={post.userProfileImage}
            alt={post.userNickname}
            sx={{ width: 24, height: 24, mr: 1 }}
          />
          <Typography variant="subtitle2" color="text.secondary">
            {post.userNickname}
          </Typography>
        </Box>

        <Typography variant="h6" component="div" gutterBottom noWrap>
          {post.title}
        </Typography>

        {post.postType === 'REVIEW' && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={post.rating} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({post.rating})
            </Typography>
          </Box>
        )}

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: variant === 'compact' ? 2 : 3,
            WebkitBoxOrient: 'vertical',
            mb: 1
          }}
        >
          {post.content}
        </Typography>

        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {post.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/posts/tag/${tag.replace('#', '')}`);
                }}
              />
            ))}
          </Box>
        )}

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 'auto'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/posts/${post.id}`);
            }}
          >
            자세히 보기
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard; 