import { create } from 'zustand';
import axios from '../services/api/axios';

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

const useCosmeticStore = create((set) => ({
  cosmetics: [],
  currentCosmetic: null,
  selectedCosmetic: null,  // 선택된 화장품 정보
  categories: [],
  isLoading: false,
  error: null,

  setSelectedCosmetic: (cosmetic) => {
    console.log('선택된 화장품 저장:', cosmetic);
    set({ selectedCosmetic: cosmetic });
  },

  getSelectedCosmetic: () => {
    const state = useCosmeticStore.getState();
    return state.selectedCosmetic;
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/cosmetics/categories');
      set({ categories: response.data, isLoading: false });
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
      const response = await axios.get('/api/cosmetics/search', { params: searchParams });
      
      console.log('화장품 목록 응답:', response.data);
      
      // DB에서 가져온 화장품 데이터 처리
      const formattedCosmetics = response.data.map((item) => {
        const extractedSpf = item.spf || extractSpf(item.itemName);
        const extractedPa = item.pa || extractPa(item.itemName);
        
        return {
          id: item.id,
          cosmeticReportSeq: item.cosmeticReportSeq,
          itemName: item.itemName,
          entpName: item.entpName,
          reportFlagName: item.reportFlagName,
          itemPh: item.itemPh,
          cosmeticStdName: item.cosmeticStdName,
          spf: extractedSpf,
          pa: extractedPa,
          usageDosage: item.usageDosage,
          effectYn1: item.effectYn1,
          effectYn2: item.effectYn2,
          effectYn3: item.effectYn3,
          waterProofingName: item.waterProofingName,
          reviewCount: item.reviewCount || 0,
          averageRating: item.averageRating || 0
        };
      });

      console.log('변환된 화장품 데이터:', formattedCosmetics);
      set({ cosmetics: formattedCosmetics, isLoading: false });
    } catch (error) {
      console.error('목록 조회 에러:', error);
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

  searchCosmetics: async (searchQuery) => {
    set({ isLoading: true, error: null });
    try {
      console.log('검색어:', searchQuery);
      const response = await axios.get('/api/cosmetics/search', {
        params: {
          item_name: searchQuery
        }
      });
      
      console.log('검색 응답:', response.data);
      
      // DB에서 가져온 화장품 데이터 처리
      const formattedCosmetics = response.data.map((item) => {
        const extractedSpf = item.spf || extractSpf(item.itemName);
        const extractedPa = item.pa || extractPa(item.itemName);
        
        return {
          id: item.id,
          cosmeticReportSeq: item.cosmeticReportSeq,
          itemName: item.itemName,
          entpName: item.entpName,
          reportFlagName: item.reportFlagName,
          itemPh: item.itemPh,
          cosmeticStdName: item.cosmeticStdName,
          spf: extractedSpf,
          pa: extractedPa,
          usageDosage: item.usageDosage,
          effectYn1: item.effectYn1,
          effectYn2: item.effectYn2,
          effectYn3: item.effectYn3,
          waterProofingName: item.waterProofingName,
          reviewCount: item.reviewCount || 0,
          averageRating: item.averageRating || 0
        };
      });

      console.log('변환된 검색 결과:', formattedCosmetics);
      set({ cosmetics: formattedCosmetics, isLoading: false });
    } catch (error) {
      console.error('검색 에러:', error);
      set({ 
        error: error.response?.data?.message || '화장품 검색에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  clearSelectedCosmetic: () => set({ selectedCosmetic: null }),
  clearError: () => set({ error: null })
}));

export default useCosmeticStore; 