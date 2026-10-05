import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PullRequest, PRStatus } from '../../types';
import { pullRequestService } from '../../services';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Search,
  GitBranch,
} from 'lucide-react';

export const PullRequestsPage: React.FC = () => {
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'Todas' | PRStatus>('Todas');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    pullRequestService.list().then(setPrs);
  }, []);

  const filteredPrs = useMemo(() => {
    return prs.filter((pr) => {
      const matchesTab = activeTab === 'Todas' || pr.status === activeTab;
      const matchesSearch =
        pr.title.toLowerCase().includes(search.toLowerCase()) ||
        pr.branch.toLowerCase().includes(search.toLowerCase()) ||
        pr.number.toString().includes(search);
      return matchesTab && matchesSearch;
    });
  }, [prs, activeTab, search]);

  const tabs: Array<'Todas' | PRStatus> = [
    'Todas',
    'Aberta',
    'Em revisão',
    'Aprovada',
    'Merged',
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Pull Requests' }]} />

      <PageHeader
        title="Pull Requests"
        subtitle="Revise contribuições de código, aprove mudanças e acompanhe checks de integração contínua."
      />

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {tabs.map((tab) => {
            const count =
              tab === 'Todas'
                ? prs.length
                : prs.filter((p) => p.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab === 'Todas' ? 'Todos os PRs' : tab}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                    activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por #, branch..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* PRs Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {filteredPrs.length === 0 ? (
          <EmptyState
            icon={GitPullRequest}
            title="Nenhum Pull Request encontrado"
            description="Tente alternar as abas de status ou redefinir a busca."
            actionLabel="Ver todos"
            onAction={() => {
              setActiveTab('Todas');
              setSearch('');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Pull Request</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Autor</th>
                  <th className="py-3 px-4">Checks</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Alterações</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrs.map((pr) => {
                  const failedChecks = pr.checks.filter((c) => c.status === 'failed').length;
                  const passingChecks = pr.checks.filter((c) => c.status === 'success').length;

                  return (
                    <tr key={pr.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-xs font-bold text-slate-400">
                            #{pr.number}
                          </span>
                          <Link
                            to={`/pull-requests/${pr.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-sm line-clamp-1"
                          >
                            {pr.title}
                          </Link>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{pr.description}</p>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                          <GitBranch className="w-3 h-3 text-slate-500" />
                          {pr.branch}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={pr.author.avatar}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover shrink-0"
                          />
                          <span className="font-semibold text-slate-700 whitespace-nowrap">
                            {pr.author.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {failedChecks > 0 ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-rose-600 text-xs">
                            <XCircle className="w-4 h-4" />
                            {failedChecks} com falha
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            {passingChecks}/{pr.checks.length} OK
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={pr.status} />
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-xs whitespace-nowrap">
                        <span className="text-emerald-600">+{pr.additions}</span>{' '}
                        <span className="text-rose-600">-{pr.deletions}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/pull-requests/${pr.id}`}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors inline-block"
                        >
                          Ver detalhes
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
