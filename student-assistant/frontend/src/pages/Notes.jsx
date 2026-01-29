import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { toast } from '../lib/toast';

export default function Notes() {
    const { token } = useAuth();
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');

    async function load() {
        try {
            const res = await apiFetch('/notes', { token });
            setNotes(res.notes);
        } catch (e) {
            toast.error(e.message || 'Failed to load notes');
        }
    }

    useEffect(() => { if (token) { load(); } }, [token]);

    async function addNote() {
        if (!title.trim()) return;
        try {
            const res = await apiFetch('/notes', { method: 'POST', token, body: { title } });
            setNotes([res.note, ...notes]);
            setTitle('');
            toast.success('Note saved successfully');
        } catch (e) {
            toast.error(e.message || 'Failed to save note');
        }
    }

    async function removeNote(id) {
        try {
            await apiFetch(`/notes/${id}`, { method: 'DELETE', token });
            setNotes(notes.filter(n => n._id !== id));
            toast.success('Note removed');
        } catch (e) {
            toast.error(e.message || 'Failed to delete note');
        }
    }

    return (
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-xl font-semibold">Notes</h2>
            <div className="mt-4 flex gap-2">
                <input className="border p-2 flex-1" placeholder="New note title" value={title} onChange={e => setTitle(e.target.value)} />
                <button onClick={addNote} className="bg-blue-600 text-white px-3 py-2 rounded">Add</button>
            </div>
			<ul className="mt-4 space-y-2">
                {notes.map(n => (
                    <li key={n._id} className="border p-3 rounded flex justify-between items-center">
                        <span>{n.title}</span>
                        <button onClick={() => removeNote(n._id)} className="text-red-600">Delete</button>
                    </li>
                ))}
			</ul>
		</div>
	);
}


