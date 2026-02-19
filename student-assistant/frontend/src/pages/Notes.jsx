import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { toast } from '../lib/toast';

export default function Notes() {
    const { token } = useAuth();
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function load() {
        setLoading(true);
        setError('');
        try {
            const res = await apiFetch('/notes', { token });
            setNotes(res.notes);
        } catch (e) {
            setError(e.message || 'Failed to load notes');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { if (token) { load(); } }, [token]);

    async function addNote() {
        setFormError('');
        if (!title.trim()) {
            setFormError('Title is required');
            return;
        }
        try {
            const res = await apiFetch('/notes', { method: 'POST', token, body: { title } });
            setNotes([res.note, ...notes]);
            setTitle('');
            toast.success('Note saved successfully');
        } catch (e) {
            const msg = e.message || 'Failed to save note';
            toast.error(msg);
            setFormError(msg);
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
                <div className="flex-1">
                    <input className="border p-2 w-full" placeholder="New note title" value={title} onChange={e => setTitle(e.target.value)} />
                    {formError && <p className="text-red-600 text-sm mt-1">{formError}</p>}
                </div>
                <button onClick={addNote} className="bg-blue-600 text-white px-3 py-2 rounded">Add</button>
            </div>
            <div className="mt-6 bg-white border rounded p-4">
                {loading ? (
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                        <div className="h-8 bg-gray-100 rounded animate-pulse" />
                        <div className="h-8 bg-gray-100 rounded animate-pulse" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded">Try Again</button>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {notes.length === 0 && <li className="text-gray-500">No notes found.</li>}
                        {notes.map(n => (
                            <li key={n._id} className="border p-3 rounded flex justify-between items-center">
                                <span>{n.title}</span>
                                <button onClick={() => removeNote(n._id)} className="text-red-600">Delete</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
		</div>
	);
}


