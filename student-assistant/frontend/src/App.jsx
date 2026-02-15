import React from 'react';
import '../src/lib/toast';
import { Link, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ClientDetail from './pages/ClientDetail';
import Clients from './pages/Clients';
import Notes from './pages/Notes';
import Reminders from './pages/Reminders';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import SseConnector from './components/SseConnector';

function Home() {
	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold">Smart Student Assistant</h1>
			<p className="text-gray-600 mt-2">Welcome! Use the nav to explore.</p>
		</div>
	);
}

function App() {
	return (
		<div className="min-h-screen bg-gray-50">
			<SseConnector />
			{/* lightweight toast system initialized from src/lib/toast */}
			<nav className="bg-white border-b">
				<div className="max-w-6xl mx-auto px-4 py-3 flex gap-4">
					<Link to="/" className="font-semibold">Home</Link>
					<Link to="/notes">Notes</Link>
					<Link to="/clients">Clients</Link>
					<Link to="/reminders">Reminders</Link>
					<Link to="/chat">AI Assistant</Link>
					<Link to="/login" className="ml-auto">Login</Link>
					<Link to="/register">Register</Link>
				</div>
			</nav>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
				<Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
				<Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
				<Route path="/clients/:id" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />
				<Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
				<Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</div>
	);
}

export default App;


