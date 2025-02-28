/**
 * 화장품 이름에서 SPF 값을 추출하는 함수
 * @param {string} itemName - 화장품 이름
 * @returns {string|null} - 추출된 SPF 값 또는 null
 */
export const extractSpf = (itemName) => {
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

/**
 * 화장품 이름에서 PA 값을 추출하는 함수
 * @param {string} itemName - 화장품 이름
 * @returns {string|null} - 추출된 PA 값 또는 null
 */
export const extractPa = (itemName) => {
  const patterns = ['피에이', 'pa', 'PA'];
  const loweredItemName = itemName.toLowerCase();
  
  for (const pattern of patterns) {
    const index = loweredItemName.indexOf(pattern);
    if (index !== -1) {
      let plusCount = 0;
      let foundInvalidChar = false;
      
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
        } else if (!/\s/.test(c)) {
          // 공백이 아닌 다른 문자가 나오면 잘못된 형식
          foundInvalidChar = true;
          break;
        }
      }
      
      if (plusCount > 0 && !foundInvalidChar) {
        return '+'.repeat(plusCount);
      }
    }
  }
  return null;
};

/**
 * API 응답 데이터를 프론트엔드 모델로 변환하는 함수
 * @param {Object} item - API 응답 데이터
 * @returns {Object} - 변환된 화장품 데이터
 */
export const formatCosmeticData = (item) => {
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
}; 