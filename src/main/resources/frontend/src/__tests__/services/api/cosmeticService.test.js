import axios from '../../../services/api/axios';
import cosmeticService from '../../../services/api/cosmeticService';
import { formatCosmeticData } from '../../../utils/cosmeticUtils';

// axios mock 설정
jest.mock('../../../services/api/axios');

describe('cosmeticService', () => {
  // 각 테스트 전에 mock 초기화
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategories', () => {
    const mockCategories = ['선크림', '로션', '크림'];

    it('카테고리 목록을 성공적으로 조회', async () => {
      axios.get.mockResolvedValueOnce({ data: mockCategories });

      const result = await cosmeticService.getCategories();

      expect(axios.get).toHaveBeenCalledWith('/api/cosmetics/categories');
      expect(result).toEqual(mockCategories);
    });

    it('API 호출 실패 시 에러 전파', async () => {
      const error = new Error('API 호출 실패');
      axios.get.mockRejectedValueOnce(error);

      await expect(cosmeticService.getCategories()).rejects.toThrow('API 호출 실패');
      expect(axios.get).toHaveBeenCalledWith('/api/cosmetics/categories');
    });
  });

  describe('searchCosmetics', () => {
    const mockSearchParams = { item_name: '선크림' };
    const mockApiResponse = [{
      id: 1,
      cosmeticReportSeq: 123,
      itemName: '선크림 SPF50+ PA+++',
      entpName: '테스트 브랜드'
    }];

    it('검색 파라미터로 화장품 목록 조회', async () => {
      axios.get.mockResolvedValueOnce({ data: mockApiResponse });

      const result = await cosmeticService.searchCosmetics(mockSearchParams);

      expect(axios.get).toHaveBeenCalledWith('/api/cosmetics/search', {
        params: mockSearchParams
      });
      expect(result).toEqual(mockApiResponse.map(formatCosmeticData));
    });

    it('빈 검색 결과 처리', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });

      const result = await cosmeticService.searchCosmetics(mockSearchParams);

      expect(result).toEqual([]);
    });

    it('API 호출 실패 시 에러 전파', async () => {
      const error = new Error('검색 실패');
      axios.get.mockRejectedValueOnce(error);

      await expect(cosmeticService.searchCosmetics(mockSearchParams))
        .rejects.toThrow('검색 실패');
    });
  });

  describe('getCosmeticById', () => {
    const mockCosmeticId = 1;
    const mockApiResponse = {
      id: 1,
      cosmeticReportSeq: 123,
      itemName: '선크림 SPF50+ PA+++',
      entpName: '테스트 브랜드'
    };

    it('ID로 화장품 상세 정보 조회', async () => {
      axios.get.mockResolvedValueOnce({ data: mockApiResponse });

      const result = await cosmeticService.getCosmeticById(mockCosmeticId);

      expect(axios.get).toHaveBeenCalledWith(`/api/cosmetics/${mockCosmeticId}`);
      expect(result).toEqual(formatCosmeticData(mockApiResponse));
    });

    it('존재하지 않는 ID 조회 시 에러 처리', async () => {
      const error = { 
        response: { 
          status: 404,
          data: { message: '화장품을 찾을 수 없습니다.' }
        }
      };
      axios.get.mockRejectedValueOnce(error);

      await expect(cosmeticService.getCosmeticById(999))
        .rejects.toEqual(error);
    });

    it('API 호출 실패 시 에러 전파', async () => {
      const error = new Error('서버 에러');
      axios.get.mockRejectedValueOnce(error);

      await expect(cosmeticService.getCosmeticById(mockCosmeticId))
        .rejects.toThrow('서버 에러');
    });
  });
}); 