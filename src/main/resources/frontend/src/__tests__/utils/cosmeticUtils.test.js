import { extractSpf, extractPa, formatCosmeticData } from '../../utils/cosmeticUtils';

describe('cosmeticUtils', () => {
  describe('extractSpf', () => {
    it('숫자와 + 기호로 된 SPF 값을 추출', () => {
      expect(extractSpf('선크림 SPF50+')).toBe('50+');
      expect(extractSpf('자외선차단제 SPF30')).toBe('30');
    });

    it('한글로 된 "에스피에프" 표기에서 SPF 값을 추출', () => {
      expect(extractSpf('선크림 에스피에프50플러스')).toBe('50+');
      expect(extractSpf('자외선차단제 에스피에프30')).toBe('30');
    });

    it('소문자 spf 표기에서 SPF 값을 추출', () => {
      expect(extractSpf('선크림 spf50+')).toBe('50+');
      expect(extractSpf('자외선차단제 spf30')).toBe('30');
    });

    it('괄호 안의 SPF 값을 추출', () => {
      expect(extractSpf('선크림 (SPF50+)')).toBe('50+');
      expect(extractSpf('자외선차단제 (spf30)')).toBe('30');
    });

    it('SPF 값이 없는 경우 null 반환', () => {
      expect(extractSpf('일반 크림')).toBeNull();
      expect(extractSpf('')).toBeNull();
    });

    it('잘못된 형식의 SPF 표기는 null 반환', () => {
      expect(extractSpf('선크림 SPF')).toBeNull();
      expect(extractSpf('선크림 SPF+')).toBeNull();
    });
  });

  describe('extractPa', () => {
    it('+ 기호로 된 PA 값을 추출', () => {
      expect(extractPa('선크림 PA+++')).toBe('+++');
      expect(extractPa('자외선차단제 PA++')).toBe('++');
    });

    it('한글로 된 "피에이" 표기에서 PA 값을 추출', () => {
      expect(extractPa('선크림 피에이+++')).toBe('+++');
      expect(extractPa('자외선차단제 피에이++')).toBe('++');
    });

    it('소문자 pa 표기에서 PA 값을 추출', () => {
      expect(extractPa('선크림 pa+++')).toBe('+++');
      expect(extractPa('자외선차단제 pa++')).toBe('++');
    });

    it('괄호 안의 PA 값을 추출', () => {
      expect(extractPa('선크림 (PA+++)')).toBe('+++');
      expect(extractPa('자외선차단제 (pa++)')).toBe('++');
    });

    it('한글 "플러스"로 표기된 PA 값을 추출', () => {
      expect(extractPa('선크림 PA플러스플러스플러스')).toBe('+++');
      expect(extractPa('자외선차단제 피에이플러스플러스')).toBe('++');
    });

    it('PA 값이 없는 경우 null 반환', () => {
      expect(extractPa('일반 크림')).toBeNull();
      expect(extractPa('')).toBeNull();
    });

    it('잘못된 형식의 PA 표기는 null 반환', () => {
      expect(extractPa('선크림 PA')).toBeNull();
      expect(extractPa('선크림 PA플러스크림')).toBeNull();
    });
  });

  describe('formatCosmeticData', () => {
    const mockApiResponse = {
      id: 1,
      cosmeticReportSeq: 123,
      itemName: '선크림 SPF50+ PA+++',
      entpName: '테스트 브랜드',
      reportFlagName: '보고완료',
      itemPh: '7.0',
      cosmeticStdName: '선크림',
      usageDosage: '적당량',
      effectYn1: 'Y',
      effectYn2: 'N',
      effectYn3: 'Y',
      waterProofingName: '워터프루프',
      reviewCount: 10,
      averageRating: 4.5
    };

    it('API 응답을 올바른 형식으로 변환', () => {
      const formatted = formatCosmeticData(mockApiResponse);
      
      expect(formatted).toEqual({
        ...mockApiResponse,
        spf: '50+',
        pa: '+++'
      });
    });

    it('SPF와 PA 값이 이미 있는 경우 기존 값을 유지', () => {
      const responseWithValues = {
        ...mockApiResponse,
        spf: '30+',
        pa: '++'
      };
      
      const formatted = formatCosmeticData(responseWithValues);
      
      expect(formatted.spf).toBe('30+');
      expect(formatted.pa).toBe('++');
    });

    it('reviewCount와 averageRating이 없는 경우 기본값 사용', () => {
      const responseWithoutReviews = {
        ...mockApiResponse,
        reviewCount: undefined,
        averageRating: undefined
      };
      
      const formatted = formatCosmeticData(responseWithoutReviews);
      
      expect(formatted.reviewCount).toBe(0);
      expect(formatted.averageRating).toBe(0);
    });
  });
}); 