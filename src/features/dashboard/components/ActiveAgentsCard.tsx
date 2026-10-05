import React from 'react';
import { Link } from 'react-router-dom';
import { mockAgents } from '../../../mocks/agents';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ChevronRight, Code2, ShieldAlert, LayoutGrid, FileText } from 'lucide-react';

export const ActiveAgentsCard: React.FC = () => {
  const getIcon = (name: string) => {
    if (name.includes('Code Review')) return <Code2 className="w-4 h-4 text-blue-600" />;
    if (name.includes('Security')) return <ShieldAlert className="w-4 h-4 text-rose-600" />;
    if (name.includes('Frontend')) return <LayoutGrid className="w-4 h-4 text-purple-600" />;
    return <FileText className="w-4 h-4 text-cyan-600" />;
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Agentes em Execução</h3>
        <Link
          to="/agents"
          className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Ver todos <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 mt-2">
        {mockAgents.slice(0, 4).map((agent) => (
          <div key={agent.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                {getIcon(agent.name)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{agent.name}</p>
                <p className="text-[11px] text-slate-500 line-clamp-1">{agent.currentTask}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Progress bar */}
              <div className="flex items-center gap-2 w-32">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 w-8 text-right">
                  {agent.progress}%
                </span>
              </div>

              <StatusBadge status={agent.status} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
