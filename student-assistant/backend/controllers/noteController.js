'use strict';

const Note = require('../models/Note');

async function listNotes(req, res) {
	const notes = await Note.find({ userId: req.userId }).sort({ updatedAt: -1 });
	res.json({ notes });
}

async function createNote(req, res) {
	const { title, content = '', tags = [] } = req.body;
	if (!title) return res.status(400).json({ error: 'Title is required' });
	const note = await Note.create({ userId: req.userId, title, content, tags });
	res.status(201).json({ note });
}

async function updateNote(req, res) {
	const { id } = req.params;
	const { title, content, tags } = req.body;
	const note = await Note.findOneAndUpdate(
		{ _id: id, userId: req.userId },
		{ $set: { title, content, tags } },
		{ new: true }
	);
	if (!note) return res.status(404).json({ error: 'Not found' });
	res.json({ note });
}

async function deleteNote(req, res) {
	const { id } = req.params;
	const deleted = await Note.findOneAndDelete({ _id: id, userId: req.userId });
	if (!deleted) return res.status(404).json({ error: 'Not found' });
	res.json({ success: true });
}

module.exports = { listNotes, createNote, updateNote, deleteNote };


