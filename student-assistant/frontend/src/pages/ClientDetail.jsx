'use strict';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import useAutoRefetch from '../lib/useAutoRefetch';

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load(){
      try{
        const res = await apiFetch(`/clients/${id}`);
        if(!mounted) return;
        setClient(res.client || res);
      }catch(e){
        // ignore; component can show fallback
      }
    }
    load();
    return ()=>{ mounted=false; };
  }, [id]);

  // will auto-refetch when `client:updated` or generic entity update events are emitted
  useAutoRefetch('client:updated', `/clients/${id}`, setClient, { autoFetchOnMount: false });

  if (!client) return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-semibold">Client</h2>
      <div className="mt-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-3" />
        <div className="h-10 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  );

  const score = client.riskScore ?? client.risk?.score ?? client.score;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-semibold">{client.name || 'Client'}</h2>
      <p className="text-gray-600 mt-2">Overview and risk information.</p>
      <div className="mt-6 bg-white border rounded p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Risk score</div>
            <div className="text-2xl font-bold">{score ?? '—'}</div>
          </div>
          <div className="text-sm text-gray-600">Updated: {new Date(client.updatedAt || client.modifiedAt || Date.now()).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
