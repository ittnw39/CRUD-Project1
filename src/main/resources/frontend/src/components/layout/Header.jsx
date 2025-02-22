import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  styled
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import useAuthStore from '../../store/authStore';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoText = styled(Typography)`
  font-family: "Bagel Fat One", system-ui;
  font-size: 24px;
  color: aliceblue;
  -webkit-text-stroke: 1px lightskyblue;
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
      transform: translateY(-5px);
    }
  }
`;

const SubtitleText = styled(Typography)`
  font-family: "Jua", sans-serif;
  color: #666;
  font-size: 14px;
  margin-left: 8px;
  padding-left: 8px;
  border-left: 2px solid #eee;
  letter-spacing: -0.5px;
`;

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <StyledAppBar position="fixed">
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <LogoContainer
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <LogoText variant="h6" id="waveText">
              GlowGallery
            </LogoText>
            <SubtitleText variant="subtitle2">
              스킨케어 정보공유 게시판
            </SubtitleText>
          </LogoContainer>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated ? (
              <>
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user?.nickname?.[0] || <AccountCircleIcon />}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  onClick={handleClose}
                >
                  <MenuItem component={RouterLink} to="/profile">
                    <AccountCircleIcon sx={{ mr: 1 }} />
                    프로필
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/settings">
                    <SettingsIcon sx={{ mr: 1 }} />
                    설정
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ExitToAppIcon sx={{ mr: 1 }} />
                    로그아웃
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                >
                  로그인
                </Button>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/register"
                >
                  회원가입
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header; 