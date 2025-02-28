import { logPerformanceMetric, handleProfilerRender, measureApiCall } from '../../utils/performanceUtils';

describe('performanceUtils', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  const mockPerformanceNow = jest.spyOn(performance, 'now');

  beforeEach(() => {
    mockConsoleLog.mockClear();
    mockPerformanceNow.mockClear();
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
    mockConsoleLog.mockRestore();
    mockPerformanceNow.mockRestore();
  });

  describe('logPerformanceMetric', () => {
    it('개발 환경에서 성능 메트릭을 로깅', () => {
      process.env.NODE_ENV = 'development';
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
      process.env.NODE_ENV = 'development';
      handleProfilerRender('TestComponent', 'mount', 50);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Performance] [TestComponent] renderDuration: 50.00ms'
      );
    });
  });

  describe('measureApiCall', () => {
    it('API 호출 시간을 측정하고 로깅', () => {
      process.env.NODE_ENV = 'development';
      mockPerformanceNow.mockReturnValueOnce(150);
      
      measureApiCall('/test-endpoint', 100);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Performance] [/test-endpoint] apiCallDuration: 50.00ms'
      );
    });
  });
}); 