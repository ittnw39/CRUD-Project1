import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import HomePage from './pages/home/HomePage';
import BoardListPage from './pages/board/BoardListPage';
import BoardDetailPage from './pages/board/BoardDetailPage';
import BoardFormPage from './pages/board/BoardFormPage';
import PostDetailPage from './pages/post/PostDetailPage';
import PostFormPage from './pages/post/PostFormPage';
import CosmeticListPage from './pages/cosmetic/CosmeticListPage';
import CosmeticDetailPage from './pages/cosmetic/CosmeticDetailPage';

const theme = createTheme({
  typography: {
    fontFamily: '"Jua", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/boards" element={<BoardListPage />} />
          <Route path="/boards/new" element={<BoardFormPage />} />
          <Route path="/boards/:boardId" element={<BoardDetailPage />} />
          <Route path="/boards/:boardId/edit" element={<BoardFormPage />} />
          <Route path="/posts/new" element={<PostFormPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/posts/:postId/edit" element={<PostFormPage />} />
          <Route path="/cosmetics" element={<CosmeticListPage />} />
          <Route path="/cosmetics/:cosmeticId" element={<CosmeticDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 