import { useEffect, useRef } from 'react';
import { logPerformanceMetric } from '../utils/performanceUtils';

/**
 * 컴포넌트 성능을 모니터링하는 커스텀 훅
 * @param {string} componentName - 컴포넌트 이름
 * @returns {Object} 성능 측정 관련 유틸리티 함수
 */
const usePerformanceMonitor = (componentName) => {
  const mountTime = useRef(performance.now());
  const renderCount = useRef(0);

  useEffect(() => {
    // 컴포넌트 마운트 시간 측정
    const mountDuration = performance.now() - mountTime.current;
    logPerformanceMetric('mountDuration', mountDuration, componentName);

    return () => {
      // 컴포넌트 언마운트 시 총 렌더링 횟수 기록
      logPerformanceMetric('totalRenders', renderCount.current, componentName);
    };
  }, [componentName]);

  // 렌더링 횟수 추적
  renderCount.current++;

  return {
    // 사용자 정의 성능 측정
    measureOperation: (operationName, operation) => {
      const startTime = performance.now();
      const result = operation();
      const duration = performance.now() - startTime;
      logPerformanceMetric(operationName, duration, componentName);
      return result;
    },

    // 비동기 작업 성능 측정
    measureAsyncOperation: async (operationName, operation) => {
      const startTime = performance.now();
      try {
        const result = await operation();
        const duration = performance.now() - startTime;
        logPerformanceMetric(operationName, duration, componentName);
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        logPerformanceMetric(`${operationName}Error`, duration, componentName);
        throw error;
      }
    }
  };
};

export default usePerformanceMonitor; 