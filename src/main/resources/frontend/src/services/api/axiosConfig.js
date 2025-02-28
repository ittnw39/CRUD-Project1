import axios from 'axios';
import { measureApiCall } from '../../utils/performanceUtils';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  timeout: 10000
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 성능 측정을 위한 시작 시간 기록
    config.metadata = { startTime: performance.now() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    const { config } = response;
    if (config.metadata) {
      // API 호출 시간 측정
      measureApiCall(config.url, config.metadata.startTime);
    }
    return response;
  },
  (error) => {
    const { config } = error;
    if (config && config.metadata) {
      // 에러가 발생한 경우에도 API 호출 시간 측정
      measureApiCall(config.url, config.metadata.startTime);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 