import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Issue, TaskComment } from '../../types';
import { issueService } from '../../services';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../providers/ToastProvider';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge, TypeBadge } from '../../components/ui/PriorityBadge';
import { Terminal } from '../../components/ui/Terminal';
import {
  AlertCircle,
  CheckCircle2,
  GitPullRequest,
  GitBranch,
  Bot,
  Send,
  Sparkles,
  MessageSquare,
  FileText,
  Activity,
  History,
  ShieldAlert,
} from 'lucide-react';

export const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { success } = useToast();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [activeTab, setActiveTab] = useState<'geral' | 'discussao' | 'evidencias' | 'prs' | 'historico'>('geral');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (id) {
      issueService.getById(id).then(setIssue);
    }
  }, [id]);

  if (!issue) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-slate-500">Carregando detalhes da issue...</p>
      </div>
    );
  }

  const handleToggleStatus = async () => {
    const nextStatus = issue.status === 'Aberta' ? 'Fechada' : 'Aberta';
    const updated = await issueService.update(issue.id, { status: nextStatus });
    setIssue({ ...updated });
    success(
      nextStatus === 'Fechada' ? 'Issue fechada' : 'Issue reaberta',
      `Status alterado para ${nextStatus}.`
    );
  };

  const handleAssignToMe = async () => {
    const updated = await issueService.update(issue.id, {
      assignee: {
        name: user?.name || 'Lucas Almeida',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
    });
    setIssue({ ...updated });
    success('Issue atribuída', 'Você assumiu a investigação desta issue.');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comm: TaskComment = {
      id: `ic-${Date.now()}`,
      author: {
        name: user?.name || 'Lucas Almeida',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: user?.role || 'Community Developer',
      },
      content: newComment,
      createdAt: 'Agora mesmo',
    };

    setIssue((prev) => (prev ? {
      ...prev,
      comments: [...(prev.comments || []), comm],
      commentsCount: (prev.commentsCount || 0) + 1,
    } : null));

    setNewComment('');
    success('Comentário publicado', 'Sua análise foi anexada à issue.');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Issues', href: '/issues' },
          { label: `#${issue.number} ${issue.title}` },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-sm font-bold text-slate-400">
              #{issue.number}
            </span>
            <TypeBadge type={issue.type} />
            <PriorityBadge priority={issue.priority} />
            <StatusBadge status={issue.status} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {issue.title}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Aberta por <strong>{issue.author.name}</strong> • {issue.createdAt}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {!issue.assignee && (
            <button
              onClick={handleAssignToMe}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
            >
              Assumir issue
            </button>
          )}

          <button
            onClick={handleToggleStatus}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              issue.status === 'Aberta'
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {issue.status === 'Aberta' ? 'Fechar issue' : 'Reabrir issue'}
          </button>

          <Link
            to="/pull-requests"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
          >
            <GitPullRequest className="w-4 h-4 text-purple-600" />
            <span>Criar PR</span>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('geral')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'geral'
                  ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Visão geral</span>
            </button>

            <button
              onClick={() => setActiveTab('discussao')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'discussao'
                  ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discussão</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
                {issue.comments?.length || issue.commentsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('evidencias')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'evidencias'
                  ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Evidências & Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('prs')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'prs'
                  ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitPullRequest className="w-4 h-4" />
              <span>Pull Requests</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
                {issue.prs?.length || 0}
              </span>
            </button>
          </div>

          {/* AI Diagnosis Callout */}
          {issue.diagnosis && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-xs mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Diagnóstico Automatizado (IA Agent)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-mono bg-white p-3 rounded-xl border border-blue-100">
                {issue.diagnosis}
              </p>
            </div>
          )}

          {/* Tab 1: Visão Geral */}
          {activeTab === 'geral' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Descrição</h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {issue.description}
                </p>

                {issue.labels && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase block mb-2">
                      Labels
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {issue.labels.map((lbl) => (
                        <span
                          key={lbl}
                          className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold"
                        >
                          #{lbl}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              {issue.timeline && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Histórico de Atividades</h3>
                  <div className="space-y-3">
                    {issue.timeline.map((item, idx) => (
                      <div key={item.id} className="flex items-start gap-3 text-xs">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 shrink-0 font-bold text-[10px]">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{item.action}</p>
                          <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Discussão */}
          {activeTab === 'discussao' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {issue.comments && issue.comments.length > 0 ? (
                  issue.comments.map((comm) => (
                    <div key={comm.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img src={comm.author.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-xs font-bold text-slate-900">{comm.author.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{comm.createdAt}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700">{comm.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 p-4 text-center">Nenhum comentário na issue.</p>
                )}
              </div>

              <form onSubmit={handleAddComment} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreva uma resposta ou proposta de correção..."
                  className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 3: Evidências & Logs */}
          {activeTab === 'evidencias' && (
            <Terminal
              title={`Logs de Diagnóstico da Issue #${issue.number}`}
              logs={issue.logs || ['[INFO] Sem logs registrados para esta ocorrência.']}
            />
          )}

          {/* Tab 4: Pull Requests */}
          {activeTab === 'prs' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Pull Requests Vinculados</h3>
              {issue.prs && issue.prs.length > 0 ? (
                issue.prs.map((pr) => (
                  <div key={pr.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="w-4 h-4 text-purple-600" />
                      <Link to="/pull-requests" className="text-xs font-bold text-slate-900 hover:text-blue-600">
                        #{pr.number} {pr.title}
                      </Link>
                    </div>
                    <StatusBadge status={pr.status} size="sm" />
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Nenhum Pull Request aberto para esta issue ainda.</p>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar Metadata */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Detalhes da Issue
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Status</span>
              <StatusBadge status={issue.status} />
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Prioridade</span>
              <PriorityBadge priority={issue.priority} />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block mb-1">Autor</span>
              <div className="flex items-center gap-2">
                <img src={issue.author.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                <span className="font-semibold text-slate-800">{issue.author.name}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Responsável</span>
              {issue.assignee ? (
                <div className="flex items-center gap-2">
                  <img src={issue.assignee.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                  <span className="font-semibold text-slate-800">{issue.assignee.name}</span>
                </div>
              ) : (
                <span className="text-slate-400 italic">Não atribuído</span>
              )}
            </div>

            {issue.assignedAgent && (
              <div>
                <span className="text-slate-400 block mb-1">Agente de IA</span>
                <div className="flex items-center gap-1.5 font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                  <Bot className="w-3.5 h-3.5 text-purple-600" />
                  <span>{issue.assignedAgent}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
