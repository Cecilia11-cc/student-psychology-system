import axios from 'axios';
import { handleMockRequest } from './mockApi';

const IS_DEMO = (() => {
  const h = window.location.hostname;
  if (h.includes('github.io')) return true;
  if (localStorage.getItem('demo_mode') === 'true') return true;
  return false;
})();

// Show a visible indicator on the page during development
console.log(
  `%c🧠 SPS %c${IS_DEMO ? 'DEMO' : 'LIVE'} %c| ${window.location.hostname}`,
  'font-weight:bold;font-size:14px;',
  `color:${IS_DEMO ? '#faad14' : '#52c41a'};font-weight:bold;`,
  'color:#999;'
);

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

if (IS_DEMO) {
  // ===== DEMO MODE: intercept ALL requests, return mock data =====
  api.interceptors.request.use(
    async (config) => {
      // Prevent the real request from being sent
      const controller = new AbortController();
      config.signal = controller.signal;

      // Immediately abort and return mock data
      const mockData = await handleMockRequest(
        config.method?.toUpperCase() || 'GET',
        config.url || '',
        config.data
      );

      // Store mock data on the config for the response interceptor
      (config as Record<string, unknown>)._mockData = mockData;
      controller.abort();

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Catch aborted requests and return mock data
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const mockData = (error?.config as Record<string, unknown>)?._mockData;
      if (mockData && (axios.isCancel(error) || error?.code === 'ERR_CANCELED')) {
        return Promise.resolve({
          status: 200,
          statusText: 'OK',
          data: mockData,
          headers: {},
          config: error.config || {},
        });
      }
      return Promise.reject(error);
    }
  );
} else {
  // ===== LIVE MODE: auth token =====
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export default api;
