import create from 'zustand';
import axios from '../services/api/axios';

const useCosmeticStore = create((set) => ({
  cosmetics: [],
  currentCosmetic: null,
  isLoading: false,
  error: null,

  fetchCosmetics: async (searchParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/cosmetics', { params: searchParams });
      set({ cosmetics: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '화장품 목록을 불러오는데 실패했습니다.',
        isLoading: false 
      });
    }
  },

  fetchCosmetic: async (cosmeticId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/api/cosmetics/${cosmeticId}`);
      set({ currentCosmetic: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '화장품 정보를 불러오는데 실패했습니다.',
        isLoading: false 
      });
    }
  },

  searchCosmetics: async (keyword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/api/cosmetics/search?keyword=${encodeURIComponent(keyword)}`);
      set({ cosmetics: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '화장품 검색에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null })
}));

export default useCosmeticStore; 