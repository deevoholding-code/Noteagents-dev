import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pipeline, PipelineStatus } from '../../types';
import { pipelineService } from '../../services';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Workflow, GitBranch, GitCommit, Clock, Search } from 'lucide-react';

export const PipelinesPage: React.FC = () => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    pipelineService.list().then(setPipelines);
  }, []);

  const filteredPipelines = pipelines.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.branch.toLowerCase().includes(search.toLowerCase()) ||
      p.commitMessage.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Pipelines CI/CD' }]} />

      <PageHeader
        title="Pipelines de Integração e Entrega Contínua"
        subtitle="Monitore as etapas de build, testes automatizados, checagem de tipos e deploy contínuo em cada commit."
      />

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'Sucesso', 'Falhou', 'Em execução'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'all' ? 'Todos os pipelines' : st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por branch, commit..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Pipelines Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {filteredPipelines.length === 0 ? (
          <EmptyState
            icon={Workflow}
            title="Nenhum pipeline encontrado"
            description="Tente ajustar os filtros de busca ou aguarde novas execuções de CI."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Pipeline</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Commit</th>
                  <th className="py-3 px-4">Duração</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPipelines.map((pipe) => (
                  <tr key={pipe.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <Link
                        to={`/pipelines/${pipe.id}`}
                        className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-sm line-clamp-1 block"
                      >
                        {pipe.title}
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {pipe.commitMessage}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                        <GitBranch className="w-3 h-3 text-slate-500" />
                        {pipe.branch}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <GitCommit className="w-3.5 h-3.5 text-slate-400" />
                        {pipe.commit}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {pipe.duration}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={pipe.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/pipelines/${pipe.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors inline-block"
                      >
                        Ver detalhes
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
