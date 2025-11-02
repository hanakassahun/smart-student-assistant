'use strict';

const Reminder = require('../models/Reminder');

async function listReminders(req, res) {
	const reminders = await Reminder.find({ userId: req.userId }).sort({ dueAt: 1 });
	res.json({ reminders });
}

async function createReminder(req, res) {
	const { title, dueAt, type = 'other', notes = '' } = req.body;
	if (!title || !dueAt) return res.status(400).json({ error: 'Missing fields' });
	const reminder = await Reminder.create({ userId: req.userId, title, dueAt, type, notes });
	res.status(201).json({ reminder });
}

async function updateReminder(req, res) {
	const { id } = req.params;
	const { title, dueAt, type, notes, completed } = req.body;
	const reminder = await Reminder.findOneAndUpdate(
		{ _id: id, userId: req.userId },
		{ $set: { title, dueAt, type, notes, completed } },
		{ new: true }
	);
	if (!reminder) return res.status(404).json({ error: 'Not found' });
	res.json({ reminder });
}

async function deleteReminder(req, res) {
	const { id } = req.params;
	const deleted = await Reminder.findOneAndDelete({ _id: id, userId: req.userId });
	if (!deleted) return res.status(404).json({ error: 'Not found' });
	res.json({ success: true });
}

module.exports = { listReminders, createReminder, updateReminder, deleteReminder };


