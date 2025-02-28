/**
 * 에러 타입 상수
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  API: 'API_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * 에러 메시지 상수
 */
export const ErrorMessages = {
  [ErrorTypes.NETWORK]: '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.',
  [ErrorTypes.API]: '서버 요청 중 오류가 발생했습니다.',
  [ErrorTypes.VALIDATION]: '입력값이 올바르지 않습니다.',
  [ErrorTypes.NOT_FOUND]: '요청하신 정보를 찾을 수 없습니다.',
  [ErrorTypes.UNKNOWN]: '알 수 없는 오류가 발생했습니다.'
};

/**
 * API 에러 응답을 분석하여 에러 타입을 반환
 * @param {Error} error - API 에러 객체
 * @returns {string} 에러 타입
 */
export const getErrorType = (error) => {
  if (!error) return ErrorTypes.UNKNOWN;
  
  if (!error.response) {
    return ErrorTypes.NETWORK;
  }

  const { status } = error.response;
  
  switch (status) {
    case 400:
      return ErrorTypes.VALIDATION;
    case 404:
      return ErrorTypes.NOT_FOUND;
    case 500:
      return ErrorTypes.API;
    default:
      return ErrorTypes.UNKNOWN;
  }
};

/**
 * 에러 객체를 생성하고 로깅
 * @param {Error} error - 원본 에러 객체
 * @param {string} context - 에러 발생 컨텍스트
 * @returns {Object} 포맷된 에러 객체
 */
export const createError = (error, context) => {
  const errorType = getErrorType(error);
  const errorMessage = error.response?.data?.message || ErrorMessages[errorType];
  
  // 개발 환경에서만 콘솔에 에러 로깅
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}] ${errorType}:`, {
      message: errorMessage,
      originalError: error
    });
  }

  return {
    type: errorType,
    message: errorMessage,
    timestamp: new Date().toISOString(),
    context
  };
}; 