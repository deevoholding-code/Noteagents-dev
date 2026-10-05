import React, { useState, useEffect } from 'react';
import { NetworkRequest } from '../../types';
import { observerService } from '../../services';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Network, ArrowUpDown, Clock } from 'lucide-react';

export const NetworkPage: React.FC = () => {
  const [requests, setRequests] = useState<NetworkRequest[]>([]);

  useEffect(() => {
    observerService.getNetwork().then(setRequests);
  }, []);

  const chartData = requests.map((r, i) => ({
    time: r.timestamp,
    latency: r.latency,
    endpoint: r.endpoint,
  }));

  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'GET': return 'bg-blue-50 text-blue-700';
      case 'POST': return 'bg-emerald-50 text-emerald-700';
      case 'PUT': return 'bg-amber-50 text-amber-700';
      case 'DELETE': return 'bg-rose-50 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Observer', href: '/observer/metrics' }, { label: 'Network' }]} />

      <PageHeader
        title="Observer — Tráfego de Rede & API Gateway"
        subtitle="Monitore endpoints de entrada, volume de payloads e latência média das requisições HTTP."
      />

      {/* Latency Chart */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Latência por Requisição (ms)</h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="ms" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="latency" name="Latência" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase text-slate-400 font-sans">
                <th className="py-3 px-4">Horário</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4">Endpoint</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Latência</th>
                <th className="py-3 px-4 text-right">Tamanho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4 text-slate-400 text-[11px]">{req.timestamp}</td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${getMethodBadge(req.method)}`}>
                      {req.method}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">{req.endpoint}</td>
                  <td className="py-2.5 px-4">
                    <span className={`font-bold ${req.status >= 400 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">{req.latency} ms</td>
                  <td className="py-2.5 px-4 text-right text-slate-500">{req.payloadSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
