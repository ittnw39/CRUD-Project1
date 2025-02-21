import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Rating,
  Chip,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  RateReview as RateReviewIcon
} from '@mui/icons-material';
import useCosmeticStore from '../../store/cosmeticStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const CosmeticListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    cosmetics, 
    fetchCosmetics, 
    searchCosmetics,
    isLoading, 
    error, 
    clearError 
  } = useCosmeticStore();

  useEffect(() => {
    fetchCosmetics();
  }, [fetchCosmetics]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchCosmetics(searchQuery);
    } else {
      fetchCosmetics();
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          화장품 목록
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="화장품 검색..."
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
      </Box>

      <Grid container spacing={3}>
        {cosmetics.map((cosmetic) => (
          <Grid item xs={12} sm={6} md={4} key={cosmetic.id}>
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
              onClick={() => navigate(`/cosmetics/${cosmetic.id}`)}
            >
              {cosmetic.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={cosmetic.imageUrl}
                  alt={cosmetic.itemName}
                  sx={{ objectFit: 'contain', p: 2 }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {cosmetic.entpName}
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  {cosmetic.itemName}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating 
                    value={cosmetic.averageRating || 0} 
                    readOnly 
                    precision={0.5}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({cosmetic.reviewCount || 0}개의 리뷰)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {cosmetic.categories?.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<RateReviewIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/posts/new?type=REVIEW&cosmeticId=${cosmetic.id}`);
                  }}
                >
                  리뷰 작성
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

export default CosmeticListPage;
