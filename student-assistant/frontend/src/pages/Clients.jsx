'use strict';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import useAutoRefetch from '../lib/useAutoRefetch';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await apiFetch('/clients');
        if (!mounted) return;
        setClients(res.clients || res || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Failed to load clients');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // auto refetch when a client is updated
  useAutoRefetch('client:updated', '/clients', setClients);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-semibold">Clients</h2>
      <p className="text-gray-600 mt-2">List of clients. Click a client to view details.</p>

      <div className="mt-6 bg-white border rounded p-4">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <ul className="space-y-2">
            {clients.length === 0 && <li className="text-gray-500">No clients found.</li>}
            {clients.map(c => (
              <li key={c._id || c.id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <Link to={`/clients/${c._id || c.id}`} className="font-medium text-blue-600">{c.name || c.email || 'Client'}</Link>
                  <div className="text-sm text-gray-500">Risk: <strong>{c.riskScore ?? c.risk?.score ?? '—'}</strong></div>
                </div>
                <div className="text-sm text-gray-500">Updated: {new Date(c.updatedAt || c.modifiedAt || Date.now()).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
