'use strict';

const { Router } = require('express');
const authRoutes = require('./auth');
const notesRoutes = require('./notes');
const remindersRoutes = require('./reminders');
const chatRoutes = require('./chat');
const clientsRoutes = require('./clients');
const streamRoutes = require('./stream');

const router = Router();

router.get('/', (_req, res) => {
	res.json({ message: 'API root' });
});

router.use('/auth', authRoutes);
router.use('/notes', notesRoutes);
router.use('/reminders', remindersRoutes);
router.use('/chat', chatRoutes);
router.use('/clients', clientsRoutes);
router.use('/stream', streamRoutes);

module.exports = router;


