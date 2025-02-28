import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import cosmeticService from '../services/api/cosmeticService';
import { extractSpf, extractPa } from '../utils/cosmeticUtils';
import { createError } from '../utils/errorUtils';

/**
 * 화장품 상태 관리 스토어
 */
const useCosmeticStore = create(
  devtools(
    (set, get) => ({
      // 상태
      cosmetics: [],
      currentCosmetic: null,
      selectedCosmetic: null,
      categories: [],
      isLoading: false,
      error: null,

      // 액션
      setSelectedCosmetic: (cosmetic) => {
        set({ selectedCosmetic: cosmetic });
      },

      clearSelectedCosmetic: () => set({ selectedCosmetic: null }),

      clearError: () => set({ error: null }),

      // API 액션
      fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
          const categories = await cosmeticService.getCategories();
          set({ categories, isLoading: false });
        } catch (error) {
          const formattedError = createError(error, 'fetchCategories');
          set({ 
            error: formattedError,
            isLoading: false 
          });
        }
      },

      fetchCosmetics: async (searchParams) => {
        set({ isLoading: true, error: null });
        try {
          const cosmetics = await cosmeticService.searchCosmetics(searchParams);
          set({ cosmetics, isLoading: false });
        } catch (error) {
          const formattedError = createError(error, 'fetchCosmetics');
          set({ 
            error: formattedError,
            isLoading: false 
          });
        }
      },

      fetchCosmetic: async (cosmeticId) => {
        set({ isLoading: true, error: null });
        try {
          const currentCosmetic = await cosmeticService.getCosmeticById(cosmeticId);
          set({ currentCosmetic, isLoading: false });
        } catch (error) {
          const formattedError = createError(error, 'fetchCosmetic');
          set({ 
            error: formattedError,
            currentCosmetic: null,
            isLoading: false 
          });
        }
      },

      // 선택자
      getSelectedCosmetic: () => get().selectedCosmetic,
      
      getIsLoading: () => get().isLoading,
      
      getError: () => get().error,
      
      getCosmeticById: (cosmeticId) => 
        get().cosmetics.find(cosmetic => cosmetic.id === cosmeticId),
      
      getFilteredCosmetics: (searchTerm) => {
        const { cosmetics } = get();
        if (!searchTerm) return cosmetics;
        
        const term = searchTerm.toLowerCase();
        return cosmetics.filter(cosmetic => 
          cosmetic.itemName.toLowerCase().includes(term) ||
          cosmetic.entpName.toLowerCase().includes(term)
        );
      }
    }),
    {
      name: 'CosmeticStore',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

export default useCosmeticStore; 