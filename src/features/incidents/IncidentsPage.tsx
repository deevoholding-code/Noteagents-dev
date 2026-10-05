import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Incident, IncidentSeverity } from '../../types';
import { incidentService } from '../../services';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { AlertTriangle, ShieldAlert, CheckCircle2, Clock, Search } from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    incidentService.list().then(setIncidents);
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter;
      const matchesSearch =
        inc.title.toLowerCase().includes(search.toLowerCase()) ||
        inc.impact.toLowerCase().includes(search.toLowerCase());
      return matchesSeverity && matchesSearch;
    });
  }, [incidents, severityFilter, search]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Incidentes' }]} />

      <PageHeader
        title="Gerenciamento de Incidentes"
        subtitle="Monitore interrupções de serviço, degradação de performance e etapas de mitigação em andamento."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'Crítica', 'Alta', 'Média', 'Baixa'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                severityFilter === sev
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {sev === 'all' ? 'Todas as severidades' : sev}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar incidentes..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
          />
        </div>
      </div>

      {/* Incidents Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {filteredIncidents.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="Nenhum incidente ativo no momento"
            description="Todos os serviços estão operando dentro dos parâmetros de confiabilidade."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Incidente</th>
                  <th className="py-3 px-4">Severidade</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Detectado</th>
                  <th className="py-3 px-4">Responsável</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <Link
                        to={`/incidents/${inc.id}`}
                        className="font-bold text-slate-900 hover:text-rose-600 transition-colors text-sm line-clamp-1 block"
                      >
                        {inc.title}
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{inc.impact}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={inc.severity} />
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={inc.status} />
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {inc.detectedAt}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      {inc.responsible || 'Sistema'}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/incidents/${inc.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors inline-block"
                      >
                        Investigar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
