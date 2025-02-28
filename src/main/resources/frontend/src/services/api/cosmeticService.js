import axios from './axios';
import { formatCosmeticData } from '../../utils/cosmeticUtils';

/**
 * 화장품 API 서비스
 */
class CosmeticService {
  /**
   * 카테고리 목록을 조회합니다.
   * @returns {Promise<Array>} 카테고리 목록
   */
  async getCategories() {
    const response = await axios.get('/api/cosmetics/categories');
    return response.data;
  }

  /**
   * 화장품 목록을 검색합니다.
   * @param {Object} searchParams - 검색 파라미터
   * @returns {Promise<Array>} 검색된 화장품 목록
   */
  async searchCosmetics(searchParams) {
    const response = await axios.get('/api/cosmetics/search', { params: searchParams });
    return response.data.map(formatCosmeticData);
  }

  /**
   * 특정 화장품의 상세 정보를 조회합니다.
   * @param {number} cosmeticId - 화장품 ID
   * @returns {Promise<Object>} 화장품 상세 정보
   */
  async getCosmeticById(cosmeticId) {
    const response = await axios.get(`/api/cosmetics/${cosmeticId}`);
    return formatCosmeticData(response.data);
  }
}

export default new CosmeticService(); 