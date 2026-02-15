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

    // automatically refetch when reminders change elsewhere
    useAutoRefetch(['reminder:created','reminder:updated','reminder:deleted'], '/reminders', (res) => {
        setReminders(res?.reminders || []);
    }, { autoFetchOnMount: true });

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
        const res = await apiFetch(`/reminders/${id}`, { method: 'PUT', token, body: { completed: !completed } });
        setReminders((cur) => cur.map(r => r._id === id ? res.reminder : r));
    }

    async function removeReminder(id) {
        await apiFetch(`/reminders/${id}`, { method: 'DELETE', token });
        setReminders((cur) => cur.filter(r => r._id !== id));
    }

    return (
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-xl font-semibold">Reminders</h2>
            <div className="mt-4 grid grid-cols-3 gap-2">
                <input className="border p-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <input className="border p-2" type="datetime-local" value={dueAt} onChange={e => setDueAt(e.target.value)} />
                <button onClick={addReminder} className="bg-blue-600 text-white px-3 py-2 rounded">Add</button>
            </div>
			<ul className="mt-4 space-y-2">
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
		</div>
	);
}


