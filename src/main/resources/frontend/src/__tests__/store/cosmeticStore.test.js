import { act } from 'react';
import useCosmeticStore from '../../store/cosmeticStore';
import cosmeticService from '../../services/api/cosmeticService';

// cosmeticService mock 설정
jest.mock('../../services/api/cosmeticService');

describe('cosmeticStore', () => {
  let store;

  beforeEach(() => {
    // 각 테스트 전에 스토어 초기화
    useCosmeticStore.setState({
      cosmetics: [],
      currentCosmetic: null,
      selectedCosmetic: null,
      categories: [],
      isLoading: false,
      error: null
    });
    store = useCosmeticStore.getState();
    jest.clearAllMocks();
  });

  describe('기본 상태 관리', () => {
    it('초기 상태 확인', () => {
      const state = useCosmeticStore.getState();
      expect(state.cosmetics).toEqual([]);
      expect(state.currentCosmetic).toBeNull();
      expect(state.selectedCosmetic).toBeNull();
      expect(state.categories).toEqual([]);
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
    });

    it('선택된 화장품 설정 및 초기화', () => {
      const mockCosmetic = {
        id: 1,
        itemName: '테스트 선크림'
      };

      act(() => {
        store.setSelectedCosmetic(mockCosmetic);
      });
      
      const stateAfterSet = useCosmeticStore.getState();
      expect(stateAfterSet.selectedCosmetic).toEqual(mockCosmetic);

      act(() => {
        store.clearSelectedCosmetic();
      });
      
      const stateAfterClear = useCosmeticStore.getState();
      expect(stateAfterClear.selectedCosmetic).toBeNull();
    });

    it('에러 상태 초기화', () => {
      act(() => {
        useCosmeticStore.setState({ error: '테스트 에러' });
      });
      
      const stateWithError = useCosmeticStore.getState();
      expect(stateWithError.error).toBe('테스트 에러');

      act(() => {
        store.clearError();
      });
      
      const stateAfterClear = useCosmeticStore.getState();
      expect(stateAfterClear.error).toBeNull();
    });
  });

  describe('API 액션', () => {
    describe('fetchCategories', () => {
      const mockCategories = ['선크림', '로션', '크림'];

      it('카테고리 목록 조회 성공', async () => {
        cosmeticService.getCategories.mockResolvedValueOnce(mockCategories);

        await act(async () => {
          await store.fetchCategories();
        });

        const state = useCosmeticStore.getState();
        expect(state.categories).toEqual(mockCategories);
        expect(state.isLoading).toBeFalsy();
        expect(state.error).toBeNull();
      });

      it('카테고리 목록 조회 실패', async () => {
        const error = new Error('API 호출 실패');
        cosmeticService.getCategories.mockRejectedValueOnce(error);

        await act(async () => {
          await store.fetchCategories();
        });

        const state = useCosmeticStore.getState();
        expect(state.categories).toEqual([]);
        expect(state.isLoading).toBeFalsy();
        expect(state.error).toBe('카테고리 목록을 불러오는데 실패했습니다.');
      });
    });

    describe('fetchCosmetics', () => {
      const mockCosmetics = [{
        id: 1,
        itemName: '테스트 선크림',
        entpName: '테스트 브랜드'
      }];

      it('화장품 목록 조회 성공', async () => {
        cosmeticService.searchCosmetics.mockResolvedValueOnce(mockCosmetics);

        await act(async () => {
          await store.fetchCosmetics({ category: '선크림' });
        });

        const state = useCosmeticStore.getState();
        expect(state.cosmetics).toEqual(mockCosmetics);
        expect(state.isLoading).toBeFalsy();
        expect(state.error).toBeNull();
      });

      it('화장품 목록 조회 실패', async () => {
        const error = new Error('API 호출 실패');
        cosmeticService.searchCosmetics.mockRejectedValueOnce(error);

        await act(async () => {
          await store.fetchCosmetics({ category: '선크림' });
        });

        const state = useCosmeticStore.getState();
        expect(state.cosmetics).toEqual([]);
        expect(state.isLoading).toBeFalsy();
        expect(state.error).toBe('화장품 목록을 불러오는데 실패했습니다.');
      });
    });

    describe('fetchCosmetic', () => {
      const mockCosmetic = {
        id: 1,
        itemName: '테스트 선크림',
        entpName: '테스트 브랜드'
      };

      it('화장품 상세 정보 조회 성공', async () => {
        cosmeticService.getCosmeticById.mockResolvedValueOnce(mockCosmetic);

        await act(async () => {
          await store.fetchCosmetic(1);
        });

        const state = useCosmeticStore.getState();
        expect(state.currentCosmetic).toEqual(mockCosmetic);
        expect(state.isLoading).toBeFalsy();
        expect(state.error).toBeNull();
      });

      it('화장품 상세 정보 조회 실패', async () => {
        const error = new Error('API 호출 실패');
        cosmeticService.getCosmeticById.mockRejectedValueOnce(error);

        await act(async () => {
          await store.fetchCosmetic(1);
        });

        const state = useCosmeticStore.getState();
        expect(state.currentCosmetic).toBeNull();
        expect(state.isLoading).toBeFalsy();
        expect(state.error).toBe('화장품 정보를 불러오는데 실패했습니다.');
      });
    });
  });

  describe('선택자', () => {
    const mockCosmetics = [
      { id: 1, itemName: '선크림 A', entpName: '브랜드 A' },
      { id: 2, itemName: '선크림 B', entpName: '브랜드 B' }
    ];

    beforeEach(() => {
      useCosmeticStore.setState({ cosmetics: mockCosmetics });
      store = useCosmeticStore.getState();
    });

    it('ID로 화장품 조회', () => {
      const result = store.getCosmeticById(1);
      expect(result).toEqual(mockCosmetics[0]);
    });

    it('검색어로 화장품 필터링', () => {
      const results = store.getFilteredCosmetics('브랜드 A');
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(mockCosmetics[0]);
    });

    it('빈 검색어로 전체 화장품 반환', () => {
      const results = store.getFilteredCosmetics('');
      expect(results).toEqual(mockCosmetics);
    });
  });
}); 