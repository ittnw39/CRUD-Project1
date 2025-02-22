import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Link
} from '@mui/material';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700
            }}
          >
            화장품 리뷰
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              component={RouterLink}
              to="/cosmetics"
              color="inherit"
              sx={{ textDecoration: 'none' }}
            >
              화장품
            </Link>
            <Link
              component={RouterLink}
              to="/boards"
              color="inherit"
              sx={{ textDecoration: 'none' }}
            >
              게시판
            </Link>
            
            {isAuthenticated ? (
              <Button
                color="inherit"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            ) : (
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
              >
                로그인
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 