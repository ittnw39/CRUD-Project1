import { renderHook, act } from '@testing-library/react';
import usePerformanceMonitor from '../../hooks/usePerformanceMonitor';

describe('usePerformanceMonitor', () => {
  let mockConsoleLog;
  let currentTime = 0;

  beforeEach(() => {
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(performance, 'now').mockImplementation(() => currentTime);
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('컴포넌트 마운트 시간을 측정', () => {
    currentTime = 0;
    const { unmount } = renderHook(() => usePerformanceMonitor('TestComponent'));
    currentTime = 50; // 마운트 시간을 50ms로 설정
    unmount();

    expect(mockConsoleLog).toHaveBeenCalledWith(
      '[Performance] [TestComponent] mountDuration: 50.00ms'
    );
  });

  it('동기 작업 성능을 측정', () => {
    currentTime = 0;
    const { result } = renderHook(() => usePerformanceMonitor('TestComponent'));

    currentTime = 100; // 마운트 시간 시뮬레이션
    
    currentTime = 150; // 동기 작업 시작 시간
    const operationResult = result.current.measureOperation('testOperation', () => {
      currentTime = 200; // 동기 작업 종료 시간
      return 'test result';
    });

    expect(operationResult).toBe('test result');
    expect(mockConsoleLog).toHaveBeenCalledWith(
      '[Performance] [TestComponent] testOperation: 50.00ms'
    );
  });

  it('비동기 작업 성능을 측정', async () => {
    currentTime = 0;
    const { result } = renderHook(() => usePerformanceMonitor('TestComponent'));

    currentTime = 100; // 비동기 작업 시작
    const operationPromise = result.current.measureAsyncOperation(
      'asyncOperation',
      async () => {
        currentTime = 150; // 비동기 작업 중
        return 'async result';
      }
    );
    
    currentTime = 200; // 비동기 작업 완료
    const operationResult = await operationPromise;

    expect(operationResult).toBe('async result');
    expect(mockConsoleLog).toHaveBeenCalledWith(
      '[Performance] [TestComponent] asyncOperation: 100.00ms'
    );
  });

  it('비동기 작업 실패 시 에러를 전파하고 시간을 측정', async () => {
    currentTime = 0;
    const { result } = renderHook(() => usePerformanceMonitor('TestComponent'));

    currentTime = 100; // 비동기 작업 시작
    const failingOperation = result.current.measureAsyncOperation(
      'failingOperation',
      async () => {
        currentTime = 150; // 에러 발생 전
        throw new Error('Test Error');
      }
    );

    await expect(failingOperation).rejects.toThrow('Test Error');

    expect(mockConsoleLog).toHaveBeenCalledWith(
      '[Performance] [TestComponent] failingOperation error: 50.00ms'
    );
  });
}); 