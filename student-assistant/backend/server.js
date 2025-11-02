'use strict';
//npm install dotenv
const dotenv = require('dotenv');
dotenv.config();





const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRouter = require('./routes');
const { connectToDatabase } = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
	res.json({ status: 'ok' });
});

// API routes
app.use('/api', apiRouter);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

async function start() {
	try {
		await connectToDatabase(MONGODB_URI);
		console.log('Connected to MongoDB');
		app.listen(PORT, () => {
			console.log(`Backend server listening on port ${PORT}`);
		});
	} catch (err) {
		console.error('Failed to start server:', err.message);
		process.exit(1);
	}
}

start();


