import { useEffect, useRef } from 'react';
import { logPerformanceMetric } from '../utils/performanceUtils';

const usePerformanceMonitor = (componentName) => {
  const mountTime = useRef(performance.now());
  const renderCount = useRef(0);

  useEffect(() => {
    const startTime = performance.now();
    renderCount.current += 1;

    return () => {
      const duration = performance.now() - startTime;
      logPerformanceMetric(componentName, 'mountDuration', duration);
      logPerformanceMetric(componentName, 'totalRenders', renderCount.current);
    };
  }, [componentName]);

  const measureOperation = (operationName, operation) => {
    const startTime = performance.now();
    const result = operation();
    const duration = performance.now() - startTime;
    logPerformanceMetric(componentName, operationName, duration);
    return result;
  };

  const measureAsyncOperation = async (operationName, operation) => {
    const startTime = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      logPerformanceMetric(componentName, operationName, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      logPerformanceMetric(componentName, `${operationName} error`, duration);
      throw error;
    }
  };

  return {
    measureOperation,
    measureAsyncOperation
  };
};

export default usePerformanceMonitor;