import React from 'react';
import { Link } from 'react-router-dom';
import { mockRepositories } from '../../../mocks/repositories';
import { ChevronRight, Star, GitFork, FolderGit2 } from 'lucide-react';

export const FeaturedProjectsCard: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Projetos em destaque</h3>
        <Link
          to="/repositories"
          className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Ver todos <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 mt-2">
        {mockRepositories.map((repo) => (
          <div key={repo.id} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0 shadow-2xs">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <div>
                <Link
                  to="/repositories"
                  className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  {repo.fullName}
                </Link>
                <p className="text-[11px] text-slate-500 truncate max-w-[140px] sm:max-w-[200px]">
                  {repo.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}
                </span>
                <span className="flex items-center gap-0.5">
                  <GitFork className="w-3 h-3 text-slate-400" />
                  {repo.forks}
                </span>
              </div>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                  repo.status === 'Principal'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {repo.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
