import { getCLS, getFID, getLCP } from 'web-vitals';

/**
 * 성능 측정 결과를 로깅하는 함수
 * @param {string} componentName - 컴포넌트 이름 또는 컨텍스트
 * @param {string} metric - 측정 지표 이름
 * @param {number} value - 측정값
 */
export const logPerformanceMetric = (componentName, metric, value) => {
  if (process.env.NODE_ENV === 'development') {
    const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
    console.log(`[Performance] [${componentName}] ${metric}: ${formattedValue}ms`);
  }
};

/**
 * 컴포넌트 렌더링 성능을 측정하는 Profiler onRender 콜백
 * @param {string} id - Profiler ID
 * @param {string} phase - 렌더링 단계
 * @param {number} actualDuration - 실제 렌더링 시간
 */
export const handleProfilerRender = (id, phase, actualDuration) => {
  logPerformanceMetric(id, 'renderDuration', actualDuration);
};

/**
 * API 호출 시간을 측정하는 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {function} apiCall - API 호출 함수
 */
export const measureApiCall = async (endpoint, apiCall) => {
  if (typeof apiCall !== 'function') {
    throw new Error('apiCall must be a function');
  }

  const startTime = performance.now();
  try {
    const result = await apiCall();
    const duration = Math.max(0, performance.now() - startTime);
    logPerformanceMetric('API', endpoint, duration);
    return result;
  } catch (error) {
    const duration = Math.max(0, performance.now() - startTime);
    logPerformanceMetric('API', `${endpoint} error`, duration);
    throw error;
  }
};

/**
 * 웹 바이탈 지표를 측정하는 함수
 */
export const measureWebVitals = () => {
  getCLS((metric) => {
    logPerformanceMetric('WebVitals', 'CLS', metric.value);
  });
  getFID((metric) => {
    logPerformanceMetric('WebVitals', 'FID', metric.value);
  });
  getLCP((metric) => {
    logPerformanceMetric('WebVitals', 'LCP', metric.value);
  });
}; 