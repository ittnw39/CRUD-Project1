import { ErrorTypes, ErrorMessages, getErrorType, createError } from '../../utils/errorUtils';

describe('errorUtils', () => {
  describe('getErrorType', () => {
    it('네트워크 에러 타입 반환', () => {
      const error = new Error('Network Error');
      expect(getErrorType(error)).toBe(ErrorTypes.NETWORK);
    });

    it('유효성 검사 에러 타입 반환', () => {
      const error = { response: { status: 400 } };
      expect(getErrorType(error)).toBe(ErrorTypes.VALIDATION);
    });

    it('Not Found 에러 타입 반환', () => {
      const error = { response: { status: 404 } };
      expect(getErrorType(error)).toBe(ErrorTypes.NOT_FOUND);
    });

    it('API 에러 타입 반환', () => {
      const error = { response: { status: 500 } };
      expect(getErrorType(error)).toBe(ErrorTypes.API);
    });

    it('알 수 없는 에러 타입 반환', () => {
      const error = { response: { status: 418 } }; // I'm a teapot
      expect(getErrorType(error)).toBe(ErrorTypes.UNKNOWN);
    });

    it('에러가 없을 경우 UNKNOWN 반환', () => {
      expect(getErrorType(null)).toBe(ErrorTypes.UNKNOWN);
    });
  });

  describe('createError', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    beforeEach(() => {
      mockConsoleError.mockClear();
    });

    afterAll(() => {
      process.env.NODE_ENV = originalNodeEnv;
      mockConsoleError.mockRestore();
    });

    it('API 에러 객체 생성', () => {
      const error = {
        response: {
          status: 500,
          data: { message: '서버 내부 오류' }
        }
      };
      
      const result = createError(error, 'testContext');
      
      expect(result).toEqual({
        type: ErrorTypes.API,
        message: '서버 내부 오류',
        context: 'testContext',
        timestamp: expect.any(String)
      });
    });

    it('커스텀 메시지가 없을 경우 기본 메시지 사용', () => {
      const error = {
        response: { status: 500 }
      };
      
      const result = createError(error, 'testContext');
      
      expect(result.message).toBe(ErrorMessages[ErrorTypes.API]);
    });

    it('개발 환경에서 콘솔 에러 로깅', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('테스트 에러');
      
      createError(error, 'testContext');
      
      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('프로덕션 환경에서 콘솔 에러 로깅하지 않음', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('테스트 에러');
      
      createError(error, 'testContext');
      
      expect(mockConsoleError).not.toHaveBeenCalled();
    });
  });
}); 