import { getCLS, getFID, getLCP } from 'web-vitals';

/**
 * 성능 측정 결과를 로깅하는 함수
 * @param {string} metricName - 측정 지표 이름
 * @param {number} value - 측정값
 * @param {string} context - 측정 컨텍스트
 */
export const logPerformanceMetric = (metricName, value, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${context ? `[${context}] ` : ''}${metricName}: ${value.toFixed(2)}ms`);
  }
  
  // TODO: 프로덕션 환경에서는 성능 모니터링 서비스로 전송
};

/**
 * 컴포넌트 렌더링 성능을 측정하는 Profiler onRender 콜백
 * @param {string} id - Profiler ID
 * @param {string} phase - 렌더링 단계
 * @param {number} actualDuration - 실제 렌더링 시간
 */
export const handleProfilerRender = (id, phase, actualDuration) => {
  logPerformanceMetric('renderDuration', actualDuration, id);
};

/**
 * API 호출 시간을 측정하는 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {number} startTime - 호출 시작 시간
 */
export const measureApiCall = (endpoint, startTime) => {
  const duration = performance.now() - startTime;
  logPerformanceMetric('apiCallDuration', duration, endpoint);
};

/**
 * 웹 바이탈 지표를 측정하는 함수
 */
export const measureWebVitals = () => {
  getCLS((metric) => logPerformanceMetric('CLS', metric.value * 1000, 'WebVitals'));
  getFID((metric) => logPerformanceMetric('FID', metric.value, 'WebVitals'));
  getLCP((metric) => logPerformanceMetric('LCP', metric.value, 'WebVitals'));
}; 