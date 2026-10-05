import React, { useState, useEffect } from 'react';
import { PerformanceMetric } from '../../types';
import { observerService } from '../../services';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Cpu, HardDrive, Zap, Activity, AlertTriangle } from 'lucide-react';

export const PerformancePage: React.FC = () => {
  const [metric, setMetric] = useState<PerformanceMetric | null>(null);

  useEffect(() => {
    observerService.getPerformance().then(setMetric);
  }, []);

  const timeSeries = [
    { time: '10:00', cpu: 32, memory: 52, reqs: 280 },
    { time: '10:10', cpu: 38, memory: 54, reqs: 310 },
    { time: '10:20', cpu: 45, memory: 56, reqs: 340 },
    { time: '10:30', cpu: 58, memory: 62, reqs: 410 },
    { time: '10:40', cpu: 42, memory: 58, reqs: 320 },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Observer', href: '/observer/metrics' }, { label: 'Performance' }]} />

      <PageHeader
        title="Observer — Performance do Runtime"
        subtitle="Uso de recursos de CPU, perfil de consumo de memória, taxa de throughput e FPS do cliente."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Uso de CPU</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{metric?.cpu || 42}%</span>
          <span className="text-xs text-slate-400 block mt-1">4 núcleos ativos</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Consumo de Memória</span>
            <HardDrive className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{metric?.memory || '1.4 GB'}</span>
          <span className="text-xs text-slate-400 block mt-1">58% do limite de heap</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Throughput</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900">{metric?.throughput || 320}</span>
          <span className="text-xs text-slate-400 block mt-1">req/min</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Taxa de Erro</span>
            <AlertTriangle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-600">{metric?.errorRate || 0.1}%</span>
          <span className="text-xs text-slate-400 block mt-1">Padrão SLA atendido</span>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Consumo de CPU vs Memória (%)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="cpu" name="CPU (%)" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="memory" name="Memória (%)" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
