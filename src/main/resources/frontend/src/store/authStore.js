import create from 'zustand';
import { authApi } from '../services/api/authApi';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      set({ 
        user: response.data,
        isAuthenticated: true,
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '로그인에 실패했습니다.',
        isLoading: false 
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authApi.logout();
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '로그아웃에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore; 