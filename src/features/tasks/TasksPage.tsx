import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Task, TaskStatus, TaskPriority, TaskType } from '../../types';
import { taskService } from '../../services';
import { useToast } from '../../providers/ToastProvider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge, TypeBadge } from '../../components/ui/PriorityBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  Search,
  Plus,
  Filter,
  CheckSquare,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Todas' | TaskStatus>('Todas');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskType, setNewTaskType] = useState<TaskType>('Feature');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Média');

  const { success } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    taskService.list().then((data) => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesTab = activeTab === 'Todas' || task.status === activeTab;
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesType = typeFilter === 'all' || task.type === typeFilter;
      return matchesTab && matchesSearch && matchesPriority && matchesType;
    });
  }, [tasks, activeTab, search, priorityFilter, typeFilter]);

  const handleAssign = async (taskId: string) => {
    const updated = await taskService.assignToMe(taskId);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    success('Tarefa assumida com sucesso', 'Você agora é o responsável por esta tarefa.');
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const created = await taskService.create({
      title: newTaskTitle,
      description: newTaskDesc,
      type: newTaskType,
      priority: newTaskPriority,
    });

    setTasks((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    success('Tarefa criada com sucesso', 'A nova tarefa já está visível para a comunidade.');
  };

  const tabs: Array<'Todas' | TaskStatus> = [
    'Todas',
    'Aberta',
    'Em andamento',
    'Em revisão',
    'Concluída',
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Tarefas da Comunidade' }]} />

      <PageHeader
        title="Tarefas da Comunidade"
        subtitle="Encontre tarefas abertas, assuma itens de backlog ou contribua com correções de código."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#0B5FFF] hover:bg-[#094ecc] px-4 py-2 text-sm font-semibold text-white shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </button>
        }
      />

      {/* Tabs & Search Filter Bar */}
      <div className="space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {tabs.map((tab) => {
            const count =
              tab === 'Todas'
                ? tasks.length
                : tasks.filter((t) => t.status === tab).length;

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
                <span>{tab === 'Todas' ? 'Todas as tarefas' : tab}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                    activeTab === tab
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar tarefas por título ou descrição..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Prioridade:</span>
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
            >
              <option value="all">Todas</option>
              <option value="Crítica">Crítica</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
              <span>Tipo:</span>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
            >
              <option value="all">Todos</option>
              <option value="Bug">Bug</option>
              <option value="Feature">Feature</option>
              <option value="Docs">Docs</option>
              <option value="Testes">Testes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="Nenhuma tarefa encontrada"
            description="Não encontramos tarefas para os filtros selecionados. Tente limpar os critérios de busca."
            actionLabel="Limpar filtros"
            onAction={() => {
              setActiveTab('Todas');
              setSearch('');
              setPriorityFilter('all');
              setTypeFilter('all');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Título</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Prioridade</th>
                  <th className="py-3 px-4">Dificuldade</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Autor</th>
                  <th className="py-3 px-4">Atualizado</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="font-bold text-slate-900 hover:text-blue-600 transition-colors block text-sm leading-snug line-clamp-1"
                      >
                        {task.title}
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <TypeBadge type={task.type} />
                    </td>

                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={task.priority} />
                    </td>

                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={task.difficulty} />
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={task.status} />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={task.author.avatar}
                          alt={task.author.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                        <span className="font-semibold text-slate-700 whitespace-nowrap">
                          {task.author.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                      {task.updatedAt}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {task.status === 'Aberta' ? (
                          <button
                            onClick={() => handleAssign(task.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs transition-all active:scale-95"
                          >
                            Assumir
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate(`/tasks/${task.id}`)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
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
        )}
      </div>

      {/* Modal Nova Tarefa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Criar Nova Tarefa"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título da tarefa
            </label>
            <input
              type="text"
              required
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Ex: Otimizar tempo de build do frontend"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição detalhada
            </label>
            <textarea
              rows={4}
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Descreva o contexto, critérios de aceitação e passos para reprodução..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipo
              </label>
              <select
                value={newTaskType}
                onChange={(e) => setNewTaskType(e.target.value as TaskType)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option value="Feature">Feature</option>
                <option value="Bug">Bug</option>
                <option value="Docs">Docs</option>
                <option value="Testes">Testes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prioridade
              </label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
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
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              Criar Tarefa
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
