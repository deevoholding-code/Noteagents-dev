import React from 'react';
import { Link } from 'react-router-dom';
import { mockIncidents } from '../../../mocks/incidents';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ChevronRight, AlertTriangle, AlertCircle } from 'lucide-react';

export const ActiveIncidentsCard: React.FC = () => {
  const activeIncidents = mockIncidents.filter((i) => i.status !== 'Resolvido');

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Incidentes Ativos</h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-[11px] font-bold text-rose-700">
            {activeIncidents.length}
          </span>
        </div>
        <Link
          to="/incidents"
          className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Ver todos <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 mt-2">
        {activeIncidents.map((inc) => (
          <div key={inc.id} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <Link
                  to={`/incidents/${inc.id}`}
                  className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors block"
                >
                  {inc.title}
                </Link>
                <span className="text-[11px] text-slate-500">{inc.detectedAt}</span>
              </div>
            </div>

            <StatusBadge status={inc.status} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
};
