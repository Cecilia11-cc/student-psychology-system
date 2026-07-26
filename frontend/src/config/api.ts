import { handleMockRequest } from './mockApi';

const host = window.location.hostname;
const DEMO = host.includes('github.io') || host.includes('pages.dev')
  || localStorage.getItem('demo_mode') === 'true';

console.log(
  `%c[SPS] %c${DEMO ? '🎭 DEMO' : '🔌 LIVE'} %c${host}`,
  'font-weight:bold;font-size:14px',
  `color:${DEMO ? '#faad14' : '#52c41a'};font-weight:bold`,
  'color:#999'
);

// Simple mock API — returns fake HTTP responses
async function call(method: string, url: string, data?: unknown) {
  const result = await handleMockRequest(method, url, data);
  return { status: 200, data: result, headers: {}, config: {} };
}

const mockApi = {
  get: (url: string) => call('GET', url),
  post: (url: string, data?: unknown) => call('POST', url, data),
  put: (url: string, data?: unknown) => call('PUT', url, data),
  delete: (url: string) => call('DELETE', url),
  patch: (url: string, data?: unknown) => call('PATCH', url, data),
  interceptors: {
    request: { use: () => 0, eject: () => {} },
    response: { use: () => 0, eject: () => {} },
  },
};

type ApiType = typeof mockApi;

let liveApi: ApiType | null = null;

function getLiveApi(): ApiType {
  if (liveApi) return liveApi;
  const axios = (window as unknown as Record<string, unknown>).axios as Record<string, unknown>;
  if (!axios || typeof axios.create !== 'function') {
    console.warn('[SPS] axios not found, using mock');
    return mockApi;
  }
  const inst = (axios.create as (opts: Record<string, unknown>) => Record<string, unknown>)({
    baseURL: '/api/v1',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });
  if (typeof inst.interceptors === 'object' && inst.interceptors) {
    const req = (inst.interceptors as Record<string, unknown>).request as Record<string, unknown>;
    if (typeof req?.use === 'function') {
      (req.use as (fn: (cfg: Record<string, unknown>) => Record<string, unknown>) => void)((cfg: Record<string, unknown>) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          (cfg as Record<string, unknown>).headers = {
            ...((cfg as Record<string, unknown>).headers as Record<string, unknown> || {}),
            Authorization: `Bearer ${token}`,
          };
        }
        return cfg;
      });
    }
  }
  liveApi = inst as unknown as ApiType;
  return liveApi;
}

// Export: demo = mock, dev = live axios
const api: ApiType = DEMO ? mockApi : getLiveApi();

export default api;
