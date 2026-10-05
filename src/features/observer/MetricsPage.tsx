import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Cpu, HardDrive, Zap, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

export const MetricsPage: React.FC = () => {
  const [range, setRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h');

  const metricHistory = [
    { time: '04:00', reqs: 180, latency: 110, cpu: 28 },
    { time: '08:00', reqs: 340, latency: 145, cpu: 48 },
    { time: '12:00', reqs: 410, latency: 160, cpu: 54 },
    { time: '16:00', reqs: 380, latency: 135, cpu: 46 },
    { time: '20:00', reqs: 260, latency: 115, cpu: 34 },
    { time: '24:00', reqs: 320, latency: 120, cpu: 42 },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Observer' }, { label: 'Métricas' }]} />

      <PageHeader
        title="Observer — Métricas do Cluster"
        subtitle="Métricas vitais de infraestrutura, throughput em tempo real e tempo de resposta da API."
        actions={
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['1h', '6h', '24h', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  range === r
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      {/* 4 Large Highlight Cards matching Screen 20 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            CPU
          </span>
          <p className="text-3xl font-black text-slate-900 mt-2">42%</p>
          <span className="text-xs text-slate-500 mt-1 block">Média de 8 vCPUs</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Memória
          </span>
          <p className="text-3xl font-black text-slate-900 mt-2">1.4 GB</p>
          <span className="text-xs text-slate-500 mt-1 block">58% utilizado</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Requests/min
          </span>
          <p className="text-3xl font-black text-slate-900 mt-2">320</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            ↑ 14% vs ontem
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Latência média
          </span>
          <p className="text-3xl font-black text-slate-900 mt-2">120 ms</p>
          <span className="text-xs text-blue-600 font-semibold mt-1 block">P95: 180 ms</span>
        </div>
      </div>

      {/* Primary Chart */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Throughput de Requisições vs Latência</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metricHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="reqs" name="Requisições/min" stroke="#2563EB" fill="#2563EB" fillOpacity={0.1} strokeWidth={2.5} />
              <Area type="monotone" dataKey="latency" name="Latência (ms)" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
