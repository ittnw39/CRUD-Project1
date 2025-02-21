import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Rating,
  LinearProgress,
  Divider,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  RateReview as RateReviewIcon
} from '@mui/icons-material';
import useCosmeticStore from '../../store/cosmeticStore';
import PostList from '../../components/post/PostList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const CosmeticDetailPage = () => {
  const { cosmeticId } = useParams();
  const navigate = useNavigate();
  const { 
    currentCosmetic,
    fetchCosmetic,
    isLoading,
    error,
    clearError
  } = useCosmeticStore();

  useEffect(() => {
    if (cosmeticId) {
      fetchCosmetic(cosmeticId);
    }
  }, [cosmeticId, fetchCosmetic]);

  if (isLoading) return <LoadingSpinner />;
  if (!currentCosmetic) return null;

  const renderRatingBar = (rating, count, total) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ mr: 1, minWidth: 60 }}>
          {rating}점
        </Typography>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
        />
        <Typography variant="body2" sx={{ ml: 1, minWidth: 40 }}>
          {count}
        </Typography>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/cosmetics')}
        sx={{ mb: 2 }}
      >
        화장품 목록으로
      </Button>

      <Grid container spacing={4}>
        {/* 화장품 정보 */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
              {currentCosmetic.imageUrl && (
                <Box
                  component="img"
                  src={currentCosmetic.imageUrl}
                  alt={currentCosmetic.itemName}
                  sx={{
                    width: 200,
                    height: 200,
                    objectFit: 'contain',
                    mr: 4
                  }}
                />
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {currentCosmetic.entpName}
                </Typography>
                <Typography variant="h4" component="h1" gutterBottom>
                  {currentCosmetic.itemName}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {currentCosmetic.categories?.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Button
                  variant="contained"
                  startIcon={<RateReviewIcon />}
                  onClick={() => navigate(`/posts/new?type=REVIEW&cosmeticId=${cosmeticId}`)}
                  sx={{ mt: 2 }}
                >
                  리뷰 작성
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              제품 설명
            </Typography>
            <Typography variant="body1" paragraph>
              {currentCosmetic.description || '제품 설명이 없습니다.'}
            </Typography>
          </Paper>
        </Grid>

        {/* 리뷰 통계 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                리뷰 통계
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ textAlign: 'center', mr: 3 }}>
                  <Typography variant="h3" component="div">
                    {currentCosmetic.averageRating?.toFixed(1) || '0.0'}
                  </Typography>
                  <Rating
                    value={currentCosmetic.averageRating || 0}
                    readOnly
                    precision={0.5}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {currentCosmetic.reviewCount || 0}개의 리뷰
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    renderRatingBar(
                      rating,
                      currentCosmetic.ratingCounts?.[rating] || 0,
                      currentCosmetic.reviewCount || 0
                    )
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 리뷰 목록 */}
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" gutterBottom>
            리뷰 목록
          </Typography>
          <PostList
            posts={currentCosmetic.reviews || []}
            variant="compact"
            emptyMessage="아직 작성된 리뷰가 없습니다."
          />
        </Grid>
      </Grid>

      <ErrorAlert
        open={!!error}
        message={error || ''}
        onClose={clearError}
      />
    </Container>
  );
};

export default CosmeticDetailPage; 