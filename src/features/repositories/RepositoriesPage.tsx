import React, { useState, useEffect } from 'react';
import { Repository } from '../../types';
import { repositoryService } from '../../services';
import { useToast } from '../../providers/ToastProvider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import {
  FolderGit2,
  Star,
  GitFork,
  AlertCircle,
  GitBranch,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Search,
} from 'lucide-react';

export const RepositoriesPage: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [search, setSearch] = useState('');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const { success } = useToast();

  useEffect(() => {
    repositoryService.list().then(setRepos);
  }, []);

  const handleSync = async (id: string) => {
    setSyncingId(id);
    const updated = await repositoryService.sync(id);
    setRepos((prev) => prev.map((r) => (r.id === id ? updated : r)));
    setSyncingId(null);
    success('Repositório sincronizado', `${updated.fullName} está com os últimos commits locais.`);
  };

  const filteredRepos = repos.filter(
    (r) =>
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Repositórios GitHub' }]} />

      <PageHeader
        title="Repositórios GitHub"
        subtitle="Repositórios centrais da organização NoteAgents com sincronização automática e análise contínua de código."
        actions={
          <a
            href="https://github.com/noteagents"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ver no GitHub</span>
          </a>
        }
      />

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar repositórios..."
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Repos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0 shadow-2xs">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      {repo.fullName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
                        <GitBranch className="w-3 h-3 text-slate-400" />
                        {repo.defaultBranch}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          repo.status === 'Principal'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {repo.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {repo.description}
              </p>

              {/* Tags */}
              {repo.tags && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {repo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <GitFork className="w-3.5 h-3.5 text-slate-400" />
                    {repo.forks}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                    {repo.openIssues} issues
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">{repo.lastCommit.time}</span>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSync(repo.id)}
                  disabled={syncingId === repo.id}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingId === repo.id ? 'animate-spin' : ''}`} />
                  <span>Sincronizar</span>
                </button>

                <a
                  href={`https://github.com/${repo.fullName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
