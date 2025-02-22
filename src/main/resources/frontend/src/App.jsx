import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import HomePage from './pages/home/HomePage';
import BoardListPage from './pages/board/BoardListPage';
import BoardDetailPage from './pages/board/BoardDetailPage';
import PostDetailPage from './pages/post/PostDetailPage';
import PostFormPage from './pages/post/PostFormPage';
import CosmeticListPage from './pages/cosmetic/CosmeticListPage';
import CosmeticDetailPage from './pages/cosmetic/CosmeticDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import useAuthStore from './store/authStore';

const theme = createTheme({
  typography: {
    fontFamily: '"Jua", sans-serif',
  },
});

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/boards" element={<BoardListPage />} />
            <Route path="/boards/:boardId" element={<BoardDetailPage />} />
            <Route path="/cosmetics" element={<CosmeticListPage />} />
            <Route path="/cosmetics/:cosmeticId" element={<CosmeticDetailPage />} />
            
            {/* 인증이 필요한 라우트 */}
            <Route path="/posts/new" element={
              <PrivateRoute>
                <PostFormPage />
              </PrivateRoute>
            } />
            <Route path="/posts/:postId/edit" element={
              <PrivateRoute>
                <PostFormPage />
              </PrivateRoute>
            } />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 