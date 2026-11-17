const apiOrigin = (
  import.meta.env.VITE_API_URL
  || (import.meta.env.DEV
    ? 'http://localhost:8081'
    : 'https://unibus-backend-55sx.onrender.com')
).replace(/\/+$/, '').replace(/\/api$/i, '');

async function request(path, { method = 'GET', body, ...options } = {}) {
  const token = localStorage.getItem('unibus-token');
  const response = await fetch(`${apiOrigin}/api${path}`, {
    method,
    ...options,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.mensagem || data?.message || `Falha na requisição (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return { data, status: response.status };
}

const api = {
  get: (path, options) => request(path, options),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export default api;
