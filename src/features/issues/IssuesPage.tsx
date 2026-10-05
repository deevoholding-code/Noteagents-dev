import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Issue, IssuePriority, IssueType } from '../../types';
import { issueService } from '../../services';
import { useToast } from '../../providers/ToastProvider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge, TypeBadge } from '../../components/ui/PriorityBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  AlertCircle,
  Plus,
  Search,
  MessageSquare,
  ShieldAlert,
  Flame,
  Bug,
  Sparkles,
} from 'lucide-react';

export const IssuesPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Todas' | 'Aberta' | 'Fechada'>('Todas');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<IssueType>('Bug');
  const [newPriority, setNewPriority] = useState<IssuePriority>('Alta');

  const { success } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    issueService.list().then((data) => {
      setIssues(data);
      setLoading(false);
    });
  }, []);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesTab = activeTab === 'Todas' || issue.status === activeTab;
      const matchesSearch =
        issue.title.toLowerCase().includes(search.toLowerCase()) ||
        issue.description.toLowerCase().includes(search.toLowerCase()) ||
        issue.number.toString().includes(search);
      const matchesType = typeFilter === 'all' || issue.type === typeFilter;
      return matchesTab && matchesSearch && matchesType;
    });
  }, [issues, activeTab, search, typeFilter]);

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = await issueService.create({
      title: newTitle,
      description: newDesc,
      type: newType,
      priority: newPriority,
    });

    setIssues((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    success('Issue aberta com sucesso', `Issue #${created.number} criada.`);
  };

  const countOpen = issues.filter((i) => i.status === 'Aberta').length;
  const countCritical = issues.filter((i) => i.priority === 'Crítica').length;
  const countBugs = issues.filter((i) => i.type === 'Bug').length;
  const countFeatures = issues.filter((i) => i.type === 'Feature').length;
  const countSecurity = issues.filter((i) => i.type === 'Security').length;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Issues' }]} />

      <PageHeader
        title="Issues do Repositório"
        subtitle="Rastreie bugs, melhorias arquiteturais, diagnósticos de CI e solicitações da comunidade."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Issue</span>
          </button>
        }
      />

      {/* Summary Stat Mini-Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Abertas</span>
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-xl font-bold text-slate-900">{countOpen}</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-rose-600 mb-1">
            <span>Críticas</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-xl font-bold text-rose-600">{countCritical}</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-purple-600 mb-1">
            <span>Bugs</span>
            <Bug className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-xl font-bold text-slate-900">{countBugs}</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-blue-600 mb-1">
            <span>Features</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-xl font-bold text-slate-900">{countFeatures}</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span>Segurança</span>
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-xl font-bold text-slate-900">{countSecurity}</span>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 border-b sm:border-b-0 border-slate-200 pb-2 sm:pb-0">
          {(['Todas', 'Aberta', 'Fechada'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'Todas' ? 'Todas as issues' : tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por #, título..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
          >
            <option value="all">Todos os tipos</option>
            <option value="Bug">Bug</option>
            <option value="Feature">Feature</option>
            <option value="Docs">Docs</option>
            <option value="Security">Security</option>
          </select>
        </div>
      </div>

      {/* Issues Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {filteredIssues.length === 0 ? (
          <EmptyState
            icon={AlertCircle}
            title="Nenhuma issue encontrada"
            description="Tente ajustar os filtros ou termos de pesquisa."
            actionLabel="Limpar filtros"
            onAction={() => {
              setActiveTab('Todas');
              setSearch('');
              setTypeFilter('all');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Issue</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Prioridade</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Autor</th>
                  <th className="py-3 px-4">Comentários</th>
                  <th className="py-3 px-4 text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          #{issue.number}
                        </span>
                        <Link
                          to={`/issues/${issue.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-sm line-clamp-1"
                        >
                          {issue.title}
                        </Link>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {issue.description}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <TypeBadge type={issue.type} />
                    </td>

                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={issue.priority} />
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={issue.status} />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={issue.author.avatar}
                          alt={issue.author.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                        <span className="font-medium text-slate-700 whitespace-nowrap">
                          {issue.author.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 font-semibold text-slate-500">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {issue.commentsCount}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-400 whitespace-nowrap">
                      {issue.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nova Issue */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Abrir Nova Issue"
      >
        <form onSubmit={handleCreateIssue} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título da issue
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Erro no pipeline de build do runner"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição do problema
            </label>
            <textarea
              rows={4}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Explique o comportamento esperado vs comportamento atual..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipo
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as IssueType)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option value="Bug">Bug</option>
                <option value="Feature">Feature</option>
                <option value="Security">Security</option>
                <option value="Docs">Docs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prioridade
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as IssuePriority)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs"
            >
              Criar Issue
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
