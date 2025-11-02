import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function Dashboard() {
	const data = [
		{ name: 'Mon', tasks: 2 },
		{ name: 'Tue', tasks: 3 },
		{ name: 'Wed', tasks: 1 },
		{ name: 'Thu', tasks: 4 },
		{ name: 'Fri', tasks: 2 },
		{ name: 'Sat', tasks: 0 },
		{ name: 'Sun', tasks: 1 }
	];
	return (
		<div className="max-w-5xl mx-auto p-6">
			<h2 className="text-xl font-semibold">Dashboard</h2>
			<p className="text-gray-600 mt-2">Overview of upcoming deadlines and notes.</p>
			<div className="mt-6 h-64 bg-white border rounded p-3">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
						<CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis allowDecimals={false} />
						<Tooltip />
						<Line type="monotone" dataKey="tasks" stroke="#2563eb" strokeWidth={2} dot={false} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}


