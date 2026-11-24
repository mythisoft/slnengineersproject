const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('sln_admin_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // If body is FormData, let browser set Content-Type with boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
    cache: options.cache || 'no-store',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};
