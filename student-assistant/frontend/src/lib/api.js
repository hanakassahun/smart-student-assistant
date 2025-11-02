const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

async function apiFetch(path, { method = 'GET', body, token } = {}) {
	const headers = { 'Content-Type': 'application/json' };
	if (token) headers['Authorization'] = `Bearer ${token}`;
	const res = await fetch(`${API_BASE}${path}`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		const message = data?.error || res.statusText || 'Request failed';
		throw new Error(message);
	}
	return data;
}

export { API_BASE, apiFetch };


