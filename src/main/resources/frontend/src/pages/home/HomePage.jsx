import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Rating } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { styled } from '@mui/system';
import useCosmeticStore from '../../store/cosmeticStore';

const CosmeticCard = styled(Card)`
  margin: 10px;
  max-width: 280px;
  transition: transform 0.3s ease;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const CardImageContainer = styled(Box)`
  position: relative;
  height: 120px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const StyledRating = styled(Rating)`
  .MuiRating-icon {
    color: #ff69b4;
  }
`;

const HomePage = () => {
  const { cosmetics, isLoading } = useCosmeticStore();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          인기 화장품
        </Typography>
        {cosmetics && cosmetics.length > 0 ? (
          <Slider {...sliderSettings}>
            {cosmetics.map((cosmetic) => (
              <CosmeticCard key={cosmetic.id}>
                <CardImageContainer>
                  {cosmetic.firstReviewImage ? (
                    <CardMedia
                      component="img"
                      height="120"
                      image={cosmetic.firstReviewImage}
                      alt={cosmetic.itemName}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      리뷰 이미지 없음
                    </Typography>
                  )}
                </CardImageContainer>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom noWrap>
                    {cosmetic.entpName}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }} noWrap>
                    {cosmetic.itemName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <StyledRating
                      value={cosmetic.averageRating || 0}
                      precision={0.5}
                      size="small"
                      readOnly
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({cosmetic.reviewCount})
                    </Typography>
                  </Box>
                </CardContent>
              </CosmeticCard>
            ))}
          </Slider>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            화장품을 검색해보세요.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default HomePage; 