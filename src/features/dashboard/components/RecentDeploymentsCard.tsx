import React from 'react';
import { Link } from 'react-router-dom';
import { mockDashboardDeployments } from '../../../mocks/dashboard';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ChevronRight, Triangle } from 'lucide-react';

export const RecentDeploymentsCard: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Deployments Recentes</h3>
        <Link
          to="/deployments"
          className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Ver todos <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 mt-2">
        {mockDashboardDeployments.map((dep) => (
          <div key={dep.id} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shrink-0">
                <Triangle className="w-3.5 h-3.5 fill-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{dep.environment}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {dep.versionOrBranch} • {dep.timeAgo}
                </p>
              </div>
            </div>

            <StatusBadge status={dep.status} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
};
