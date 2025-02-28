import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import cosmeticService from '../services/api/cosmeticService';

// SPF 추출 함수
const extractSpf = (itemName) => {
  const patterns = ['에스피에프', 'spf', 'SPF'];
  const loweredItemName = itemName.toLowerCase();
  
  for (const pattern of patterns) {
    const index = loweredItemName.indexOf(pattern);
    if (index !== -1) {
      let result = '';
      let foundNumber = false;
      
      // 숫자와 + 또는 "플러스" 찾기
      for (let i = index + pattern.length; i < itemName.length; i++) {
        const c = itemName[i];
        
        // 괄호나 '/' 만나면 중단
        if (c === ')' || c === '/') break;
        
        if (/\d/.test(c)) {
          foundNumber = true;
          result += c;
        } else if (foundNumber && (c === '+' || itemName.substring(i).startsWith('플러스'))) {
          result += '+';
          if (itemName[i] === '플') i += 2; // "플러스" 건너뛰기
        } else if (foundNumber && !/\s/.test(c)) {
          break;
        }
      }
      
      if (foundNumber) {
        return result;
      }
    }
  }
  return null;
};

// PA 추출 함수
const extractPa = (itemName) => {
  const patterns = ['피에이', 'pa', 'PA'];
  const loweredItemName = itemName.toLowerCase();
  
  for (const pattern of patterns) {
    const index = loweredItemName.indexOf(pattern);
    if (index !== -1) {
      let plusCount = 0;
      
      // + 또는 "플러스" 개수 세기
      for (let i = index + pattern.length; i < itemName.length; i++) {
        const c = itemName[i];
        
        // 괄호나 '/' 만나면 중단
        if (c === ')' || c === '/') break;
        
        if (c === '+') {
          plusCount++;
        } else if (itemName.substring(i).startsWith('플러스')) {
          plusCount++;
          i += 2; // "플러스" 건너뛰기
        } else if (plusCount > 0 && !/\s/.test(c)) {
          break;
        }
      }
      
      if (plusCount > 0) {
        return '+'.repeat(plusCount);
      }
    }
  }
  return null;
};

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
          set({ 
            error: error.response?.data?.message || '카테고리 목록을 불러오는데 실패했습니다.',
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
          set({ 
            error: error.response?.data?.message || '화장품 목록을 불러오는데 실패했습니다.',
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
          set({ 
            error: error.response?.data?.message || '화장품 정보를 불러오는데 실패했습니다.',
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