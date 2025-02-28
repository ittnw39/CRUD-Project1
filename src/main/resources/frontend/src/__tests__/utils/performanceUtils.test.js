import { logPerformanceMetric, handleProfilerRender, measureApiCall, measureWebVitals } from '../../utils/performanceUtils';
import { getCLS, getFID, getLCP } from 'web-vitals';

jest.mock('web-vitals', () => ({
  getCLS: jest.fn(cb => cb({ value: 0.1 })),
  getFID: jest.fn(cb => cb({ value: 100 })),
  getLCP: jest.fn(cb => cb({ value: 2500 }))
}));

describe('performanceUtils', () => {
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const mockPerformanceNow = jest.spyOn(performance, 'now')
    .mockReturnValue(50);

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development';
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockPerformanceNow.mockRestore();
  });

  describe('logPerformanceMetric', () => {
    it('개발 환경에서 성능 메트릭을 로깅', () => {
      logPerformanceMetric('testMetric', 100, 'testContext');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Performance] [testContext] testMetric: 100.00ms'
      );
    });

    it('프로덕션 환경에서 로깅하지 않음', () => {
      process.env.NODE_ENV = 'production';
      logPerformanceMetric('testMetric', 100, 'testContext');
      
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });
  });

  describe('handleProfilerRender', () => {
    it('컴포넌트 렌더링 시간을 로깅', () => {
      handleProfilerRender('TestComponent', 'mount', 50);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Performance] [TestComponent] renderDuration: 50.00ms'
      );
    });
  });

  describe('measureApiCall', () => {
    it('API 호출 시간을 측정', async () => {
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(50);

      const mockApiCall = jest.fn().mockResolvedValue('test result');
      const result = await measureApiCall('testApi', mockApiCall);
      
      expect(result).toBe('test result');
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Performance] [API] testApi: 50.00ms'
      );
    });

    it('API 호출 실패 시 에러를 전파하고 시간을 측정', async () => {
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(50);

      const mockError = new Error('Test Error');
      const mockApiCall = jest.fn().mockRejectedValue(mockError);
      
      await expect(measureApiCall('failingApi', mockApiCall)).rejects.toThrow('Test Error');
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Performance] [API] failingApi error: 50.00ms'
      );
    });
  });

  describe('measureWebVitals', () => {
    it('웹 바이탈 지표를 측정하고 로깅', () => {
      measureWebVitals();
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Performance] [WebVitals] CLS: 0.10ms'
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Performance] [WebVitals] FID: 100.00ms'
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Performance] [WebVitals] LCP: 2500.00ms'
      );
    });
  });
}); 