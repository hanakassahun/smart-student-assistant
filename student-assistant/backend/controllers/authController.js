'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

function signToken(userId) {
	return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function register(req, res) {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
		const exists = await User.findOne({ email });
		if (exists) return res.status(409).json({ error: 'Email already in use' });
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, passwordHash });
		const token = signToken(user._id.toString());
		res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
	} catch (err) {
		res.status(500).json({ error: 'Registration failed' });
	}
}

async function login(req, res) {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ error: 'Invalid credentials' });
		const ok = await user.comparePassword(password);
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
		const token = signToken(user._id.toString());
		res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
	} catch (err) {
		res.status(500).json({ error: 'Login failed' });
	}
}

module.exports = { register, login };


