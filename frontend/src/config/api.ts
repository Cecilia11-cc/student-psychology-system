import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { handleMockRequest } from './mockApi';

// ============================================================
// Detect static deployment → use mock data instead of real API
// ============================================================
function isStaticDeploy(): boolean {
  const host = window.location.hostname;
  if (host.includes('github.io')) return true;
  if (host.includes('pages.dev')) return true;
  if (localStorage.getItem('demo_mode') === 'true') return true;
  if (window.location.search.includes('demo=true')) return true;
  return false;
}

const USE_MOCK = isStaticDeploy();

console.log(
  `%c[SPS] %c${USE_MOCK ? '🎭 DEMO MODE (no backend)' : '🔌 LIVE API'}`,
  'font-weight:bold;', 'color:' + (USE_MOCK ? '#faad14' : '#52c41a')
);

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ---- AUTH TOKEN ----
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- MOCK MODE: replace HTTP methods directly ----
if (USE_MOCK) {
  type AxiosResponse<T = unknown> = { status: number; data: T; headers: Record<string, string>; config: Record<string, unknown> };

  async function mockCall(method: string, url: string, data?: unknown): Promise<AxiosResponse> {
    const result = await handleMockRequest(method, url, data);
    return { status: 200, data: result, headers: {}, config: {} };
  }

  // Replace HTTP methods on the axios instance
  (api as unknown as Record<string, unknown>).get = (url: string, config?: unknown) =>
    mockCall('GET', url);
  (api as unknown as Record<string, unknown>).post = (url: string, data?: unknown, config?: unknown) =>
    mockCall('POST', url, data);
  (api as unknown as Record<string, unknown>).put = (url: string, data?: unknown, config?: unknown) =>
    mockCall('PUT', url, data);
  (api as unknown as Record<string, unknown>).delete = (url: string, config?: unknown) =>
    mockCall('DELETE', url);
  (api as unknown as Record<string, unknown>).patch = (url: string, data?: unknown, config?: unknown) =>
    mockCall('PATCH', url, data);
}

// ---- TOKEN REFRESH (real API only) ----
if (!USE_MOCK) {
  let isRefreshing = false;
  let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = [];

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          });
        }
        originalRequest._retry = true;
        isRefreshing = true;
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        try {
          const resp = await axios.post('/api/v1/auth/refresh', { refresh_token: refreshToken });
          const { access_token, refresh_token } = resp.data.data;
          useAuthStore.getState().setTokens(access_token, refresh_token);
          failedQueue.forEach(({ resolve }) => resolve(access_token));
          failedQueue = [];
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          failedQueue.forEach(({ reject }) => reject(refreshError));
          failedQueue = [];
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );
}

export default api;
export { USE_MOCK };
