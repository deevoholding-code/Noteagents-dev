import React from 'react';
import { Link } from 'react-router-dom';
import { mockDashboardLogs } from '../../../mocks/dashboard';
import { ChevronRight } from 'lucide-react';

export const RecentLogsCard: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Logs recentes</h3>
        <Link
          to="/observer/logs"
          className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Ver todos <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 font-mono text-xs mt-2">
        {mockDashboardLogs.map((log) => {
          let dotColor = 'bg-emerald-500';
          if (log.type === 'error') dotColor = 'bg-rose-500';
          if (log.type === 'info') dotColor = 'bg-blue-500';

          return (
            <div key={log.id} className="flex items-center justify-between py-2 text-slate-600">
              <div className="flex items-center gap-2.5 truncate pr-2">
                <span className="text-[11px] text-slate-400 select-none shrink-0">{log.time}</span>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                <span className="truncate text-slate-800 font-sans text-xs">{log.message}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0 font-mono">
                {log.tag}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
