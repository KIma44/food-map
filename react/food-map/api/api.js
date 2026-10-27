import axios from 'axios';

// 1. Axios 기본 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 서버 주소
  // Content-Type은 기본적으로 axios가 json/form-data에 맞춰 자동 설정하도록 비워둡니다.
});

// 2. Request Interceptor: 모든 요청 헤더에 Access Token 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    
    // accessToken이 존재하고 문자열 'null'이나 'undefined'가 아닌 경우에만 Header에 추가
    if (accessToken && accessToken !== 'null' && accessToken !== 'undefined') {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: 401(토큰 만료) 발생 시 Refresh Token으로 재발급 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // originalRequest가 존재하지 않는 경우 처리
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // 401 Unauthorized 에러이며, 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken || refreshToken === 'null' || refreshToken === 'undefined') {
          throw new Error('Refresh Token이 없습니다.');
        }

        // 토큰 재발급 API 호출 (api 인스턴스가 아닌 순수 axios 사용하여 무한 루프 방지)
        const response = await axios.post('http://localhost:8080/api/auth/refresh', {
          refreshToken: refreshToken,
        });

        // 백엔드 응답 형태에 맞춰 토큰 추출 (accessToken 또는 token 등)
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (!accessToken) {
          throw new Error('새로운 Access Token을 받아오지 못했습니다.');
        }

        // 새 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // 실패했던 기존 요청의 헤더를 새 토큰으로 교체 후 재요청
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 토큰 재발급 실패 시 (리프레시 토큰도 만료되었거나 없을 때) -> 스토리지 비우고 로그인 이동
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userProfile');

        // 현재 이미 로그인 페이지에 있는 경우가 아니라면 이동
        if (window.location.pathname !== '/login') {
          alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;