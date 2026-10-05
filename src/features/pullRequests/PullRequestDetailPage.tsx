import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PullRequest } from '../../types';
import { pullRequestService } from '../../services';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../providers/ToastProvider';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CodeDiff } from '../../components/ui/CodeDiff';
import {
  GitPullRequest,
  GitBranch,
  GitCommit,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  FileCode,
  ShieldCheck,
  Send,
  GitMerge,
  ThumbsUp,
  AlertTriangle,
} from 'lucide-react';

export const PullRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { success, warning } = useToast();

  const [pr, setPr] = useState<PullRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'conversa' | 'commits' | 'arquivos' | 'checks' | 'deploy'>('arquivos');
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (id) {
      pullRequestService.getById(id).then(setPr);
    }
  }, [id]);

  if (!pr) {
    return (
      <div className="p-12 text-center text-slate-500">
        Carregando detalhes do Pull Request...
      </div>
    );
  }

  const handleMerge = async () => {
    const updated = await pullRequestService.merge(pr.id);
    setPr({ ...updated });
    success('Pull Request mesclado!', `As alterações da branch ${pr.branch} foram mescladas com sucesso.`);
  };

  const handleReview = async (type: 'approved' | 'changes_requested' | 'commented') => {
    const comment = reviewComment.trim() || (type === 'approved' ? 'Aprovado sem restrições.' : 'Revisão submetida.');
    const updated = await pullRequestService.addReview(pr.id, comment, type);
    setPr({ ...updated });
    setReviewComment('');
    if (type === 'approved') {
      success('Revisão aprovada', 'Seu voto de aprovação foi registrado.');
    } else {
      warning('Alterações solicitadas', 'Comentários de revisão submetidos.');
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Pull Requests', href: '/pull-requests' },
          { label: `#${pr.number} ${pr.branch}` },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-sm font-bold text-slate-400">
              #{pr.number}
            </span>
            <StatusBadge status={pr.status} />
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
              <GitBranch className="w-3.5 h-3.5 text-blue-600" />
              {pr.branch} → {pr.baseBranch}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {pr.title}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Criado por <strong>{pr.author.name}</strong> • {pr.createdAt} •{' '}
            <span className="text-emerald-600 font-mono font-semibold">+{pr.additions}</span>{' '}
            <span className="text-rose-600 font-mono font-semibold">-{pr.deletions}</span>
          </p>
        </div>

        {/* Merge and Review Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {pr.status !== 'Merged' && (
            <>
              <button
                onClick={() => handleReview('approved')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Aprovar</span>
              </button>

              <button
                onClick={handleMerge}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
              >
                <GitMerge className="w-4 h-4" />
                <span>Merge</span>
              </button>
            </>
          )}

          {pr.deployUrl && (
            <a
              href={pr.deployUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <span>Preview</span>
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('arquivos')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'arquivos'
              ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Arquivos alterados</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-mono">
            {pr.changedFilesCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('conversa')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'conversa'
              ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Conversação</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
            {pr.reviews?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('commits')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'commits'
              ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>Commits</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
            {pr.commits?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('checks')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'checks'
              ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Checks</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold">
            {pr.checks.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {/* 1. Arquivos Alterados (Diff visual) */}
      {activeTab === 'arquivos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
            <span>Mostrando {pr.filesDiff?.length || 0} arquivos modificados com syntax highlight:</span>
            <div className="flex items-center gap-3 font-mono font-semibold">
              <span className="text-emerald-600">+{pr.additions} adições</span>
              <span className="text-rose-600">-{pr.deletions} remoções</span>
            </div>
          </div>

          {pr.filesDiff?.map((fd, i) => (
            <CodeDiff key={i} fileDiff={fd} />
          ))}
        </div>
      )}

      {/* 2. Conversação & Reviews */}
      {activeTab === 'conversa' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Descrição do PR</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {pr.description}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Revisões e Comentários
            </h3>
            {pr.reviews?.map((rev, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <img src={rev.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <span className="text-xs font-bold text-slate-900">{rev.reviewer}</span>
                      <span
                        className={`text-[10px] font-semibold ml-2 px-2 py-0.5 rounded-full ${
                          rev.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {rev.status === 'approved' ? 'Aprovou as mudanças' : 'Comentou'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>

          {/* Review input */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Deixe seu review ou comentário</h4>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Escreva sua avaliação técnica sobre o diff..."
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleReview('changes_requested')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
              >
                Solicitar alterações
              </button>
              <button
                type="button"
                onClick={() => handleReview('approved')}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
              >
                Aprovar mudanças
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Commits */}
      {activeTab === 'commits' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {pr.commits?.map((commit) => (
            <div key={commit.hash} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <GitCommit className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900">{commit.message}</p>
                  <p className="text-[11px] text-slate-500">
                    {commit.author} • {commit.time}
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
                {commit.hash}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 4. Checks */}
      {activeTab === 'checks' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {pr.checks.map((check, idx) => (
            <div key={idx} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {check.status === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : check.status === 'failed' ? (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                )}
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{check.name}</p>
                  {check.description && (
                    <p className="text-xs text-slate-500">{check.description}</p>
                  )}
                </div>
              </div>

              {check.duration && (
                <span className="text-xs font-mono text-slate-400 font-medium">
                  {check.duration}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
