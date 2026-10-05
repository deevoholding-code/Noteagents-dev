import React, { useState, useEffect, useMemo } from 'react';
import { LogEntry, LogLevel } from '../../types';
import { observerService } from '../../services';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Search, Terminal, Filter, RefreshCw } from 'lucide-react';

export const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [levelFilter, setLevelFilter] = useState<'ALL' | LogLevel>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    observerService.getLogs().then(setLogs);
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
      const matchesSearch =
        log.message.toLowerCase().includes(search.toLowerCase()) ||
        log.service.toLowerCase().includes(search.toLowerCase()) ||
        (log.traceId && log.traceId.toLowerCase().includes(search.toLowerCase()));
      return matchesLevel && matchesSearch;
    });
  }, [logs, levelFilter, search]);

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case 'ERROR':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'WARN':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'INFO':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DEBUG':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Observer', href: '/observer/metrics' }, { label: 'Logs' }]} />

      <PageHeader
        title="Observer — Logs em Tempo Real"
        subtitle="Fluxo estruturado de eventos, stdout/stderr de containers e registros de auditoria dos serviços."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                levelFilter === lvl
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar mensagem, serviço, traceId..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase text-slate-400 font-sans">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Serviço</th>
                <th className="py-3 px-4">Mensagem</th>
                <th className="py-3 px-4">Trace ID</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                    {log.timestamp}
                  </td>

                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getLevelBadge(
                        log.level
                      )}`}
                    >
                      {log.level}
                    </span>
                  </td>

                  <td className="py-2.5 px-4 text-slate-700 font-semibold whitespace-nowrap">
                    {log.service}
                  </td>

                  <td className="py-2.5 px-4 text-slate-800 break-all max-w-md">
                    {log.message}
                  </td>

                  <td className="py-2.5 px-4 text-blue-600 hover:underline cursor-pointer whitespace-nowrap text-[11px]">
                    {log.traceId || '—'}
                  </td>

                  <td className="py-2.5 px-4 text-right whitespace-nowrap font-bold text-slate-600">
                    {log.status || 200}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
