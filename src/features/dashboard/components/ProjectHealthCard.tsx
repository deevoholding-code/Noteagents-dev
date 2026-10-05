import React from 'react';
import { Link } from 'react-router-dom';
import { mockProjectHealth } from '../../../mocks/dashboard';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { CheckCircle2, ChevronRight, Globe, Server, Database, Bot, Workflow, GitBranch } from 'lucide-react';

export const ProjectHealthCard: React.FC = () => {
  const getIcon = (cat: string) => {
    switch (cat) {
      case 'service': return <Globe className="w-4 h-4 text-blue-500" />;
      case 'api': return <Server className="w-4 h-4 text-blue-500" />;
      case 'github': return <GitBranch className="w-4 h-4 text-slate-800" />;
      case 'database': return <Database className="w-4 h-4 text-emerald-500" />;
      case 'ai': return <Bot className="w-4 h-4 text-purple-500" />;
      case 'pipeline': return <Workflow className="w-4 h-4 text-indigo-500" />;
      default: return <Server className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Saúde do Projeto</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Operacional
          </span>
        </div>
        <Link
          to="/observer/metrics"
          className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Ver detalhes <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 mt-2">
        {mockProjectHealth.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                {getIcon(item.category)}
              </div>
              <span className="text-xs font-semibold text-slate-800">{item.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={item.status} size="sm" />
              <span className="text-xs font-mono text-slate-500 min-w-14 text-right">
                {item.metric}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
