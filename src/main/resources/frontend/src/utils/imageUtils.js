// 이미지 URL을 처리하는 유틸리티 함수
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * 이미지 URL을 절대 경로로 변환합니다.
 * @param {string} imageUrl - 상대 경로 이미지 URL
 * @returns {string} 절대 경로 이미지 URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE_URL}${imageUrl}`;
};

/**
 * 이미지 URL 배열을 절대 경로로 변환합니다.
 * @param {string[]} imageUrls - 상대 경로 이미지 URL 배열
 * @returns {string[]} 절대 경로 이미지 URL 배열
 */
export const getImageUrls = (imageUrls) => {
  if (!imageUrls) return [];
  return imageUrls.map(getImageUrl);
}; 