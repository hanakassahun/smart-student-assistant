import React, { useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
    const { token } = useAuth();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    async function send() {
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input };
        setMessages([...messages, userMsg]);
        setInput('');
        try {
            const res = await apiFetch('/chat', { method: 'POST', token, body: { prompt: userMsg.content } });
            setMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }]);
        }
    }

    return (
		<div className="max-w-3xl mx-auto p-6">
			<h2 className="text-xl font-semibold">AI Assistant</h2>
            <div className="mt-4 border rounded p-3 min-h-[240px] bg-white space-y-2">
                {messages.length === 0 && <p className="text-gray-500">Ask a study question...</p>}
                {messages.map((m, idx) => (
                    <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                        <span className={m.role === 'user' ? 'inline-block bg-blue-600 text-white px-3 py-2 rounded' : 'inline-block bg-gray-100 px-3 py-2 rounded'}>
                            {m.content}
                        </span>
                    </div>
                ))}
            </div>
			<div className="mt-3 flex gap-2">
                <input className="border p-2 flex-1" placeholder="Type your question" value={input} onChange={e => setInput(e.target.value)} />
                <button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
			</div>
		</div>
	);
}


