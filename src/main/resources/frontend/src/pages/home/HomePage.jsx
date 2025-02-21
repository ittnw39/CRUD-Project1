import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  styled,
  Grid
} from '@mui/material';

// 글로우 갤러리 로고 스타일
const LogoText = styled(Typography)`
  font-family: "Bagel Fat One", system-ui;
  font-size: 80px;
  color: aliceblue;
  -webkit-text-stroke: 1px lightskyblue;
  margin-top: 70px;
  cursor: pointer;

  & span {
    display: inline-block;
  }

  & span.wave-animation {
    animation: wave 0.6s ease-in-out infinite;
  }

  @keyframes wave {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const StyledContainer = styled(Container)`
  margin-top: 2rem !important;
  border: 10px solid #a5dafb80;
  border-radius: 50% 50% 20px 20px;
  padding: 2rem;
`;

const SubTitle = styled(Typography)`
  color: #71aadd;
  font-size: 20px;
  text-align: center;
  font-family: "Jua", sans-serif;
`;

const StyledButton = styled(Button)`
  background-color: #2a8cc7;
  border-radius: 30px 30px 5px;
  margin: 10px;
  font-family: "Jua", sans-serif;
  &:hover {
    background-color: #1f7ab3;
  }
`;

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 웨이브 애니메이션 효과
    const textElement = document.getElementById('waveText');
    if (textElement) {
      const text = textElement.innerText;
      const letters = text.split('').map((char, i) => 
        `<span key={${i}}>${char}</span>`
      ).join('');
      textElement.innerHTML = letters;

      const spanLetters = textElement.querySelectorAll('span');
      let isAnimating = false;
      let timeouts = [];

      textElement.addEventListener('mouseover', () => {
        if (!isAnimating) {
          isAnimating = true;
          spanLetters.forEach((span, index) => {
            const timeout = setTimeout(() => {
              span.classList.add('wave-animation');
            }, index * 150);
            timeouts.push(timeout);
          });
        }
      });

      textElement.addEventListener('mouseout', () => {
        timeouts.forEach(clearTimeout);
        timeouts = [];
        spanLetters.forEach(span => {
          span.classList.remove('wave-animation');
          isAnimating = false;
        });
      });
    }
  }, []);

  return (
    <StyledContainer maxWidth="lg">
      <Box className="header mb-5">
        <LogoText 
          variant="h1" 
          component="h1" 
          align="center"
          id="waveText"
        >
          Glow Gallery
        </LogoText>
        <SubTitle variant="h4">
          스킨케어 정보공유 게시판
        </SubTitle>
      </Box>
      
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item>
          <StyledButton
            variant="contained"
            onClick={() => navigate('/boards')}
          >
            게시판 목록
          </StyledButton>
        </Grid>
        <Grid item>
          <StyledButton
            variant="contained"
            onClick={() => navigate('/cosmetics')}
          >
            화장품 목록
          </StyledButton>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default HomePage; 