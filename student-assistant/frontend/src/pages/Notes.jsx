import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

export default function Notes() {
    const { token } = useAuth();
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');

    async function load() {
        const res = await apiFetch('/notes', { token });
        setNotes(res.notes);
    }

    useEffect(() => { if (token) { load(); } }, [token]);

    async function addNote() {
        if (!title.trim()) return;
        const res = await apiFetch('/notes', { method: 'POST', token, body: { title } });
        setNotes([res.note, ...notes]);
        setTitle('');
    }

    async function removeNote(id) {
        await apiFetch(`/notes/${id}`, { method: 'DELETE', token });
        setNotes(notes.filter(n => n._id !== id));
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


