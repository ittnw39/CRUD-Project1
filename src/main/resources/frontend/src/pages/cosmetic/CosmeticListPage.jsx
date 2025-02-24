import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Collapse,
  Rating,
  CircularProgress,
  InputAdornment,
  Chip,
  styled
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import RateReviewIcon from '@mui/icons-material/RateReview';
import useStore from '../../store/cosmeticStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

// 별점 스타일 컴포넌트
const StyledRating = styled(Rating)({
  '.MuiRating-icon': {
    fontSize: '20px',
    marginRight: '-3px',
    color: 'transparent',
    cursor: 'default',
  },
  '.MuiRating-iconEmpty': {
    '&::before': {
      content: '"★"',
      display: 'block',
      background: 'white',
      WebkitBackgroundClip: 'text',
      WebkitTextStroke: '1px #ffd700',
    }
  },
  '.MuiRating-iconFilled': {
    '&::before': {
      content: '"★"',
      display: 'block',
      color: '#ffd700',
    }
  }
});

const CosmeticListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const { cosmetics, searchCosmetics, isLoading, error, clearError } = useStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    await searchCosmetics(searchQuery.trim());
    setIsSearching(false);
    setExpandedId(null);
  };

  const handleCardClick = (cosmetic) => {
    if (cosmetic.reviewCount > 0) {
      navigate(`/cosmetics/${cosmetic.id}`);
    }
  };

  const handleExpandClick = (e, cosmeticId) => {
    e.stopPropagation();
    setExpandedId(expandedId === cosmeticId ? null : cosmeticId);
  };

  if (isLoading && !isSearching) return <LoadingSpinner />;

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
                  <IconButton type="submit" disabled={isSearching}>
                    {isSearching ? <CircularProgress size={24} /> : <SearchIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Box>

      {isSearching ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {Array.isArray(cosmetics) && cosmetics.length > 0 ? (
            cosmetics.map((cosmetic) => (
              <Grid item xs={12} sm={6} md={4} key={cosmetic.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: cosmetic.reviewCount > 0 ? 'pointer' : 'default',
                    '&:hover': {
                      boxShadow: cosmetic.reviewCount > 0 ? 6 : 1
                    }
                  }}
                  onClick={() => handleCardClick(cosmetic)}
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
                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        {cosmetic.reviewCount > 0 && (
                          <>
                            <StyledRating 
                              value={cosmetic.averageRating || 0} 
                              readOnly 
                              precision={0.5}
                              size="small"
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              ({cosmetic.reviewCount}개의 리뷰)
                            </Typography>
                          </>
                        )}
                      </Box>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => handleExpandClick(e, cosmetic.id)}
                      >
                        <Typography variant="body2" color="text.secondary">
                          상세 정보
                        </Typography>
                        {expandedId === cosmetic.id ? (
                          <ExpandLessIcon sx={{ ml: 1 }} />
                        ) : (
                          <ExpandMoreIcon sx={{ ml: 1 }} />
                        )}
                      </Box>
                    </Box>

                    <Collapse in={expandedId === cosmetic.id} timeout="auto">
                      <Box sx={{ mt: 2 }}>
                        {cosmetic.itemPh && (
                          <Typography variant="body2" gutterBottom>
                            pH: {cosmetic.itemPh}
                          </Typography>
                        )}
                        {cosmetic.cosmeticStdName && (
                          <Typography variant="body2" gutterBottom>
                            기준규격: {cosmetic.cosmeticStdName}
                          </Typography>
                        )}
                        {cosmetic.spf && (
                          <Typography variant="body2" gutterBottom>
                            SPF: {cosmetic.spf}
                          </Typography>
                        )}
                        {cosmetic.pa && (
                          <Typography variant="body2" gutterBottom>
                            PA: {cosmetic.pa}
                          </Typography>
                        )}
                        {cosmetic.usageDosage && (
                          <Typography variant="body2" gutterBottom>
                            용법용량: {cosmetic.usageDosage}
                          </Typography>
                        )}
                        {cosmetic.effectYn1 === 'Y' && (
                          <Typography variant="body2" gutterBottom>
                            미백 기능
                          </Typography>
                        )}
                        {cosmetic.effectYn2 === 'Y' && (
                          <Typography variant="body2" gutterBottom>
                            주름개선 기능
                          </Typography>
                        )}
                        {cosmetic.effectYn3 === 'Y' && (
                          <Typography variant="body2" gutterBottom>
                            자외선차단 기능
                          </Typography>
                        )}
                        {cosmetic.waterProofingName && (
                          <Typography variant="body2" gutterBottom>
                            내수성: {cosmetic.waterProofingName}
                          </Typography>
                        )}
                      </Box>
                    </Collapse>

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
                        navigate(`/posts/new?type=REVIEW&cosmeticId=${cosmetic.id}&boardId=2`);
                      }}
                    >
                      리뷰 작성
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                {searchQuery.trim() ? '검색 결과가 없습니다.' : '등록된 화장품이 없습니다.'}
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      <ErrorAlert
        open={!!error}
        message={error || ''}
        onClose={clearError}
      />
    </Container>
  );
};

export default CosmeticListPage;
