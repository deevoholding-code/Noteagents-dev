import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Task, TaskComment } from '../../types';
import { taskService } from '../../services';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../providers/ToastProvider';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge, TypeBadge } from '../../components/ui/PriorityBadge';
import { Terminal } from '../../components/ui/Terminal';
import {
  User,
  Clock,
  GitBranch,
  GitPullRequest,
  Bot,
  Send,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { success, info } = useToast();

  const [task, setTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'geral' | 'discussao' | 'logs' | 'evidencias' | 'pr'>('geral');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (id) {
      taskService.getById(id).then(setTask);
    }
  }, [id]);

  if (!task) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-slate-500">Carregando detalhes da tarefa...</p>
      </div>
    );
  }

  const handleAssignToMe = async () => {
    const updated = await taskService.assignToMe(task.id);
    setTask({ ...updated });
    success('Tarefa assumida com sucesso', 'Você foi definido como o responsável desta tarefa.');
  };

  const handleCreateBranch = () => {
    const branchName = `task/${task.id}-${task.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`.slice(0, 35);
    setTask((prev) => (prev ? { ...prev, branch: branchName } : null));
    success('Branch criada', `Branch ${branchName} sincronizada com o repositório.`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj: TaskComment = {
      id: `c-${Date.now()}`,
      author: {
        name: user?.name || 'Lucas Almeida',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: user?.role || 'Community Developer',
      },
      content: newComment,
      createdAt: 'Agora mesmo',
    };

    setTask((prev) => (prev ? {
      ...prev,
      comments: [...(prev.comments || []), commentObj],
      commentsCount: (prev.commentsCount || 0) + 1,
    } : null));

    setNewComment('');
    success('Comentário enviado', 'Sua resposta foi adicionada à discussão da tarefa.');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Tarefas', href: '/tasks' },
          { label: task.title },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <TypeBadge type={task.type} />
            <PriorityBadge priority={task.priority} />
            <PriorityBadge priority={task.difficulty} />
            <StatusBadge status={task.status} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {task.title}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Criada por <strong>{task.author.name}</strong> • Atualizado {task.updatedAt}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {task.status === 'Aberta' && (
            <button
              onClick={handleAssignToMe}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
            >
              Assumir tarefa
            </button>
          )}

          {!task.branch && (
            <button
              onClick={handleCreateBranch}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
            >
              <GitBranch className="w-4 h-4 text-blue-600" />
              <span>Criar branch</span>
            </button>
          )}

          <Link
            to="/pull-requests"
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
          >
            <GitPullRequest className="w-4 h-4 text-purple-600" />
            <span>Criar PR</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Tabs and metadata sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Spans 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sub Navigation Tabs */}
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
                {task.comments?.length || task.commentsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'logs'
                  ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('evidencias')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'evidencias'
                  ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Evidências</span>
            </button>
          </div>

          {/* Tab 1: Visão Geral */}
          {activeTab === 'geral' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Descrição</h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {task.description}
                </p>

                {task.files && task.files.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">
                      Arquivos impactados
                    </h4>
                    <div className="space-y-1.5">
                      {task.files.map((file) => (
                        <div
                          key={file}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-700"
                        >
                          <FileCode className="w-4 h-4 text-blue-500" />
                          <span>{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              {task.timeline && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Linha do tempo</h3>
                  <div className="space-y-4">
                    {task.timeline.map((item, idx) => (
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
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((comm) => (
                    <div
                      key={comm.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={comm.author.avatar}
                            alt={comm.author.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900">{comm.author.name}</span>
                            <span className="text-[10px] text-slate-400 block">{comm.author.role}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">{comm.createdAt}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {comm.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 p-4 text-center">Nenhum comentário ainda.</p>
                )}
              </div>

              {/* Add comment box */}
              <form onSubmit={handleAddComment} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreva um comentário ou sugestão técnica..."
                  className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 placeholder:text-slate-400"
                />
                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar comentário</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 3: Logs */}
          {activeTab === 'logs' && (
            <Terminal
              title={`Logs de Execução da Tarefa #${task.id}`}
              logs={[
                `[10:38:45] Task ${task.id} loaded in runner context`,
                `[10:38:46] Trigger: Automated retry policy verification`,
                `[10:38:48] Analyzing AST in src/pipelines/runner.ts`,
                `[10:38:52] Detected potential unhandled rejection on line 42`,
                `[10:39:00] Telemetry metrics captured: CPU 42%, Memory 1.4 GB`,
              ]}
            />
          )}

          {/* Tab 4: Evidências */}
          {activeTab === 'evidencias' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Evidências e Diagnósticos</h3>
              {task.evidence ? (
                task.evidence.map((ev, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{ev}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Nenhuma evidência anexada.</p>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar Metadata Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Metadados
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Status</span>
              <StatusBadge status={task.status} />
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Prioridade</span>
              <PriorityBadge priority={task.priority} />
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Dificuldade</span>
              <PriorityBadge priority={task.difficulty} />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block mb-1">Autor</span>
              <div className="flex items-center gap-2">
                <img
                  src={task.author.avatar}
                  alt={task.author.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-semibold text-slate-800">{task.author.name}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Responsável</span>
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <img
                    src={task.assignee.avatar}
                    alt={task.assignee.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-semibold text-slate-800">{task.assignee.name}</span>
                </div>
              ) : (
                <span className="text-slate-400 italic">Não atribuído</span>
              )}
            </div>

            {task.assignedAgent && (
              <div>
                <span className="text-slate-400 block mb-1">Agente associado</span>
                <div className="flex items-center gap-1.5 font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                  <Bot className="w-3.5 h-3.5 text-purple-600" />
                  <span>{task.assignedAgent}</span>
                </div>
              </div>
            )}

            {task.branch && (
              <div>
                <span className="text-slate-400 block mb-1">Branch</span>
                <div className="flex items-center gap-1.5 font-mono text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 truncate">
                  <GitBranch className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{task.branch}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
