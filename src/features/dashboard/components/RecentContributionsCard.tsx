import React from 'react';
import { Link } from 'react-router-dom';
import { mockContributions } from '../../../mocks/contributions';
import { ChevronRight } from 'lucide-react';

export const RecentContributionsCard: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Contribuições Recentes</h3>
        <Link
          to="/contributions"
          className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Ver todas <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 mt-2">
        {mockContributions.map((c) => (
          <div key={c.id} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <img
                src={c.avatar}
                alt={c.user}
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-100"
              />
              <div>
                <p className="text-xs text-slate-700 leading-snug">
                  <span className="font-bold text-slate-900">{c.user}</span> {c.title}
                </p>
                <Link
                  to={c.targetUrl}
                  className="text-[11px] font-mono font-medium text-blue-600 hover:underline block truncate max-w-[160px] sm:max-w-[220px]"
                >
                  {c.reference}
                </Link>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 shrink-0 font-medium">{c.timeAgo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
