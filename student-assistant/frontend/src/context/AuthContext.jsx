import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem('token') || '');
	const [user, setUser] = useState(() => {
		const raw = localStorage.getItem('user');
		try { return raw ? JSON.parse(raw) : null; } catch { return null; }
	});

	useEffect(() => {
		if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
		if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
	}, [token, user]);

	async function login(email, password) {
		const res = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
		setToken(res.token);
		setUser(res.user);
	}

	async function register(name, email, password) {
		const res = await apiFetch('/auth/register', { method: 'POST', body: { name, email, password } });
		setToken(res.token);
		setUser(res.user);
	}

	function logout() {
		setToken('');
		setUser(null);
	}

	const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	return useContext(AuthContext);
}


