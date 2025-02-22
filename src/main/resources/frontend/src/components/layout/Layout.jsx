import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, styled } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const LayoutRoot = styled(Box)({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  width: '100%'
});

const LayoutContent = styled(Box)({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: 64 // Header height
});

const MainContent = styled(Box)(({ theme }) => ({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default
}));

const Layout = () => {
  return (
    <LayoutRoot>
      <Header />
      <LayoutContent>
        <Sidebar />
        <MainContent>
          <Outlet />
        </MainContent>
      </LayoutContent>
    </LayoutRoot>
  );
};

export default Layout; 