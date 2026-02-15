import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import useAutoRefetch from '../lib/useAutoRefetch';

function computeWeekData(reminders) {
	const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	const counts = { Sun:0, Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0 };
	for (const r of reminders || []) {
		const d = new Date(r.dueAt);
		if (isNaN(d)) continue;
		const name = days[d.getDay()];
		counts[name] = (counts[name] || 0) + 1;
	}
	return [
		{ name: 'Mon', tasks: counts.Mon || 0 },
		{ name: 'Tue', tasks: counts.Tue || 0 },
		{ name: 'Wed', tasks: counts.Wed || 0 },
		{ name: 'Thu', tasks: counts.Thu || 0 },
		{ name: 'Fri', tasks: counts.Fri || 0 },
		{ name: 'Sat', tasks: counts.Sat || 0 },
		{ name: 'Sun', tasks: counts.Sun || 0 }
	];
}

export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const [reminders, setReminders] = useState([]);
	const [data, setData] = useState([]);

	useAutoRefetch(['reminder:created','reminder:updated','reminder:deleted'], '/reminders', (res) => {
		const list = res?.reminders || [];
		setReminders(list);
		setData(computeWeekData(list));
		setLoading(false);
	}, { autoFetchOnMount: true });

	useEffect(() => {
		// derive chart data whenever reminders change
		setData(computeWeekData(reminders));
		if (loading && reminders.length) setLoading(false);
	}, [reminders]);

	return (
		<div className="max-w-5xl mx-auto p-6">
			<h2 className="text-xl font-semibold">Dashboard</h2>
			<p className="text-gray-600 mt-2">Overview of upcoming deadlines and notes.</p>
			<div className="mt-6 h-64 bg-white border rounded p-3">
				{loading ? (
					<div className="animate-pulse h-full flex flex-col gap-4 p-2">
						<div className="h-6 bg-gray-200 rounded w-1/3" />
						<div className="flex-1 bg-gray-100 rounded" />
					</div>
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
							<CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis allowDecimals={false} />
							<Tooltip />
							<Line type="monotone" dataKey="tasks" stroke="#2563eb" strokeWidth={2} dot={false} />
						</LineChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
}


