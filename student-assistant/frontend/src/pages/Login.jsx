import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const { login } = useAuth();

	async function handleSubmit() {
		try {
			setError('');
			await login(email, password);
			navigate('/dashboard');
		} catch (e) {
			setError(e.message || 'Login failed');
		}
	}

	return (
		<div className="max-w-md mx-auto p-6">
			<h2 className="text-xl font-semibold mb-4">Login</h2>
			<div className="space-y-3">
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<input className="w-full border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
				<input className="w-full border p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
				<button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>
			</div>
		</div>
	);
}


