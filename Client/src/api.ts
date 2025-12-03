const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000';

async function request(path: string, init?: RequestInit) {
  const url = API_BASE.replace(/\/$/, '') + path;
  const res = await fetch(url, init);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = (data && (data.errors || data)) || { detail: res.statusText };
    throw err;
  }
  // DRF paginated responses include `results`
  if (data && Object.prototype.hasOwnProperty.call(data, 'results')) return data.results;
  return data;
}

export async function get(path: string) {
  return request(path, { method: 'GET' });
}

export default { get };
