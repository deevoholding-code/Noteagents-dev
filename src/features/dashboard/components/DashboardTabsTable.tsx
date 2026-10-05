import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Task } from '../../../types';
import { taskService } from '../../../services';
import { useToast } from '../../../providers/ToastProvider';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { PriorityBadge, TypeBadge } from '../../../components/ui/PriorityBadge';
import { ChevronRight, MoreHorizontal, CheckSquare, AlertCircle, GitPullRequest, MessageSquare, AlertTriangle } from 'lucide-react';

export const DashboardTabsTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tarefas' | 'issues' | 'prs' | 'discussoes' | 'incidentes'>('tarefas');
  const [tasks, setTasks] = useState<Task[]>([]);
  const { success } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    taskService.list().then(setTasks);
  }, []);

  const handleAssignTask = async (taskId: string) => {
    const updated = await taskService.assignToMe(taskId);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    success('Tarefa assumida', 'Você agora é o responsável pela tarefa.');
  };

  const getTargetUrl = () => {
    switch (activeTab) {
      case 'tarefas': return '/tasks';
      case 'issues': return '/issues';
      case 'prs': return '/pull-requests';
      case 'discussoes': return '/discussions';
      case 'incidentes': return '/incidents';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('tarefas')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'tarefas'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Tarefas</span>
          </button>

          <button
            onClick={() => setActiveTab('issues')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'issues'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Issues</span>
          </button>

          <button
            onClick={() => setActiveTab('prs')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'prs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GitPullRequest className="w-4 h-4" />
            <span>Pull Requests</span>
          </button>

          <button
            onClick={() => setActiveTab('discussoes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'discussoes'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discussões</span>
          </button>

          <button
            onClick={() => setActiveTab('incidentes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'incidentes'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Incidentes</span>
          </button>
        </div>

        <Link
          to={getTargetUrl()}
          className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
        >
          Ver todas <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400">
              <th className="py-3 px-3">Título</th>
              <th className="py-3 px-3">Tipo</th>
              <th className="py-3 px-3">Prioridade</th>
              <th className="py-3 px-3">Dificuldade</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Autor</th>
              <th className="py-3 px-3">Atualizado</th>
              <th className="py-3 px-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.slice(0, 5).map((task) => (
              <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 max-w-xs sm:max-w-sm">
                  <Link
                    to={`/tasks/${task.id}`}
                    className="font-bold text-slate-900 hover:text-blue-600 transition-colors block line-clamp-1"
                  >
                    {task.title}
                  </Link>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {task.description}
                  </p>
                </td>

                <td className="py-3 px-3">
                  <TypeBadge type={task.type} />
                </td>

                <td className="py-3 px-3">
                  <PriorityBadge priority={task.priority} />
                </td>

                <td className="py-3 px-3">
                  <PriorityBadge priority={task.difficulty} />
                </td>

                <td className="py-3 px-3">
                  <StatusBadge status={task.status} />
                </td>

                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={task.author.avatar}
                      alt={task.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-medium text-slate-700 whitespace-nowrap">
                      {task.author.name}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-3 whitespace-nowrap text-slate-500 font-medium">
                  {task.updatedAt}
                </td>

                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {task.status === 'Aberta' ? (
                      <button
                        onClick={() => handleAssignTask(task.id)}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs transition-all active:scale-95"
                      >
                        Assumir
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                      >
                        Ver
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/tasks/${task.id}`)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      aria-label="Mais opções"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
