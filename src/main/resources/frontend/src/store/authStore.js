import { create } from 'zustand';
import axios from '../services/api/axios';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/auth/register', {
        email: userData.email,
        password: userData.password,
        nickname: userData.nickname
      });
      console.log('회원가입 성공:', response.data);
      return true;
    } catch (error) {
      console.error('회원가입 에러:', error);
      set({ 
        error: error.response?.data?.message || '회원가입에 실패했습니다.',
        isLoading: false 
      });
      return false;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      const { token, refreshToken, nickname } = response.data;
      
      // 토큰을 localStorage에 저장
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      // axios 기본 헤더에 토큰 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ 
        user: { email: credentials.email, nickname },
        isAuthenticated: true,
        isLoading: false 
      });
      return true;
    } catch (error) {
      console.error('로그인 에러:', error);
      set({ 
        error: error.response?.data?.message || '로그인에 실패했습니다.',
        isLoading: false 
      });
      return false;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      // localStorage에서 토큰 제거
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      // axios 헤더에서 토큰 제거
      delete axios.defaults.headers.common['Authorization'];
      
      set({ 
        user: null,
        isAuthenticated: false
      });
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await axios.post('/api/auth/refresh', null, {
        headers: {
          'Refresh-Token': refreshToken
        }
      });

      const newToken = response.data;
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return true;
    } catch (error) {
      console.error('토큰 갱신 에러:', error);
      return false;
    }
  },

  clearError: () => set({ error: null }),

  // 페이지 새로고침 시 사용자 정보 조회
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('/api/users/me');
      set({ 
        user: response.data,
        isAuthenticated: true
      });
    } catch (error) {
      console.error('인증 체크 에러:', error);
      if (error.response?.status === 401) {
        // 토큰이 만료된 경우 갱신 시도
        const refreshSuccess = await useAuthStore.getState().refreshToken();
        if (!refreshSuccess) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
    }
  }
}));

export default useAuthStore; 