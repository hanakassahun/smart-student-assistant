import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { toast } from '../lib/toast';
import useAutoRefetch from '../lib/useAutoRefetch';

export default function Reminders() {
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [dueAt, setDueAt] = useState('');
    const [formError, setFormError] = useState('');
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function loadReminders() {
        setLoading(true);
        setError('');
        try {
            const res = await apiFetch('/reminders', { token });
            setReminders(res.reminders || []);
        } catch (e) {
            setError(e.message || 'Failed to load reminders');
        } finally {
            setLoading(false);
        }
    }

    // automatically refetch when reminders change elsewhere
    useAutoRefetch(['reminder:created','reminder:updated','reminder:deleted'], '/reminders', (res) => {
        setReminders(res?.reminders || []);
        setLoading(false);
    }, { autoFetchOnMount: false, setError });

    useEffect(() => {
        if (token) loadReminders();
    }, [token]);

    async function addReminder() {
        setFormError('');
        if (!title.trim()) {
            setFormError('Title is required');
            toast.error('Title is required');
            return;
        }
        if (!dueAt || Number.isNaN(Date.parse(dueAt))) {
            setFormError('Valid due date/time is required');
            toast.error('Valid due date/time is required');
            return;
        }
        try {
            const res = await apiFetch('/reminders', { method: 'POST', token, body: { title, dueAt } });
            // optimistic UI: prepend the returned reminder; auto-refetch will reconcile
            setReminders((cur) => [res.reminder, ...cur]);
            setTitle('');
            setDueAt('');
            toast.success('Reminder saved');
        } catch (e) {
            const msg = e.message || 'Failed to save reminder';
            setFormError(msg);
            toast.error(msg);
        }
    }

    async function toggleComplete(id, completed) {
        try {
            const res = await apiFetch(`/reminders/${id}`, { method: 'PUT', token, body: { completed: !completed } });
            setReminders((cur) => cur.map(r => r._id === id ? res.reminder : r));
        } catch (e) {
            toast.error(e.message || 'Failed to update reminder');
        }
    }

    async function removeReminder(id) {
        try {
            await apiFetch(`/reminders/${id}`, { method: 'DELETE', token });
            setReminders((cur) => cur.filter(r => r._id !== id));
        } catch (e) {
            toast.error(e.message || 'Failed to delete reminder');
        }
    }

    return (
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-xl font-semibold">Reminders</h2>
            <div className="mt-4 grid grid-cols-3 gap-2">
                <input className="border p-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <input className="border p-2" type="datetime-local" value={dueAt} onChange={e => setDueAt(e.target.value)} />
                <button onClick={addReminder} className="bg-blue-600 text-white px-3 py-2 rounded">Add</button>
            </div>
            {formError && <p className="text-red-600 text-sm mt-1">{formError}</p>}
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
                        <button onClick={loadReminders} className="bg-blue-600 text-white px-4 py-2 rounded">Try Again</button>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {reminders.length === 0 && <li className="text-gray-500">No reminders found.</li>}
                        {reminders.map(r => (
                            <li key={r._id} className="border p-3 rounded flex items-center justify-between">
                                <div>
                                    <p className={r.completed ? 'line-through' : ''}>{r.title}</p>
                                    <p className="text-xs text-gray-500">Due: {new Date(r.dueAt).toLocaleString()}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => toggleComplete(r._id, r.completed)} className="text-green-700">
                                        {r.completed ? 'Mark Incomplete' : 'Mark Done'}
                                    </button>
                                    <button onClick={() => removeReminder(r._id)} className="text-red-600">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
		</div>
	);
}


