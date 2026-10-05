import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  AlertCircle,
  GitPullRequest,
  AlertTriangle,
  FolderGit2,
  Workflow,
  Rocket,
  Bot,
  ShieldCheck,
  Activity,
  FileCode,
  Network,
  Cpu,
  Layers,
  BarChart3,
  MessageSquare,
  BookOpen,
  GitCommit,
  User,
  Bell,
  Settings,
  X,
  PlusCircle,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  path: string;
  icon: React.ReactNode;
  keywords?: string[];
}

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: CommandItem[] = useMemo(
    () => [
      { id: 'dash', title: 'Dashboard', category: 'Navegação', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 text-blue-600" /> },
      { id: 'tasks', title: 'Tarefas', category: 'Navegação', path: '/tasks', icon: <CheckSquare className="w-4 h-4 text-blue-600" />, keywords: ['task', 'todo', 'trabalho'] },
      { id: 'issues', title: 'Issues', category: 'Navegação', path: '/issues', icon: <AlertCircle className="w-4 h-4 text-blue-600" />, keywords: ['bug', 'problema', 'erro'] },
      { id: 'prs', title: 'Pull Requests', category: 'Navegação', path: '/pull-requests', icon: <GitPullRequest className="w-4 h-4 text-blue-600" />, keywords: ['pr', 'review', 'code'] },
      { id: 'incidents', title: 'Incidentes', category: 'Navegação', path: '/incidents', icon: <AlertTriangle className="w-4 h-4 text-amber-600" />, keywords: ['alerta', 'outage', 'queda'] },
      { id: 'repos', title: 'Repositórios GitHub', category: 'Navegação', path: '/repositories', icon: <FolderGit2 className="w-4 h-4 text-blue-600" />, keywords: ['git', 'code', 'core'] },
      { id: 'pipelines', title: 'Pipelines CI/CD', category: 'Navegação', path: '/pipelines', icon: <Workflow className="w-4 h-4 text-blue-600" />, keywords: ['ci', 'cd', 'build', 'test'] },
      { id: 'deployments', title: 'Deployments', category: 'Navegação', path: '/deployments', icon: <Rocket className="w-4 h-4 text-blue-600" />, keywords: ['vercel', 'produção', 'preview'] },
      { id: 'agents', title: 'Agentes de IA', category: 'Navegação', path: '/agents', icon: <Bot className="w-4 h-4 text-purple-600" />, keywords: ['ai', 'code review', 'security agent'] },
      { id: 'audits', title: 'Auditorias', category: 'Navegação', path: '/audits', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, keywords: ['security', 'architecture', 'qualidade'] },
      { id: 'logs', title: 'Observer - Logs', category: 'Observabilidade', path: '/observer/logs', icon: <Activity className="w-4 h-4 text-slate-600" />, keywords: ['log', 'console', 'stderr'] },
      { id: 'errors', title: 'Observer - Erros', category: 'Observabilidade', path: '/observer/errors', icon: <FileCode className="w-4 h-4 text-rose-600" />, keywords: ['exceptions', 'stack trace'] },
      { id: 'network', title: 'Observer - Network', category: 'Observabilidade', path: '/observer/network', icon: <Network className="w-4 h-4 text-cyan-600" />, keywords: ['api', 'latência', 'http'] },
      { id: 'perf', title: 'Observer - Performance', category: 'Observabilidade', path: '/observer/performance', icon: <Cpu className="w-4 h-4 text-amber-600" />, keywords: ['cpu', 'memória', 'throughput'] },
      { id: 'traces', title: 'Observer - Traces', category: 'Observabilidade', path: '/observer/traces', icon: <Layers className="w-4 h-4 text-indigo-600" />, keywords: ['waterfall', 'spans'] },
      { id: 'metrics', title: 'Observer - Métricas', category: 'Observabilidade', path: '/observer/metrics', icon: <BarChart3 className="w-4 h-4 text-blue-600" />, keywords: ['charts', 'uptime'] },
      { id: 'disc', title: 'Discussões da Comunidade', category: 'Colaboração', path: '/discussions', icon: <MessageSquare className="w-4 h-4 text-emerald-600" />, keywords: ['forum', 'perguntas', 'mcp'] },
      { id: 'docs', title: 'Documentação Técnica', category: 'Colaboração', path: '/documentation', icon: <BookOpen className="w-4 h-4 text-blue-600" />, keywords: ['guide', 'api', 'sdk'] },
      { id: 'contrib', title: 'Minhas Contribuições', category: 'Colaboração', path: '/contributions', icon: <GitCommit className="w-4 h-4 text-emerald-600" />, keywords: ['stats', 'commits', 'heatmap'] },
      { id: 'profile', title: 'Meu Perfil', category: 'Conta', path: '/profile', icon: <User className="w-4 h-4 text-slate-600" /> },
      { id: 'notifs', title: 'Notificações', category: 'Conta', path: '/notifications', icon: <Bell className="w-4 h-4 text-slate-600" /> },
      { id: 'settings', title: 'Configurações', category: 'Conta', path: '/settings', icon: <Settings className="w-4 h-4 text-slate-600" /> },
    ],
    []
  );

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(lower) ||
        cmd.category.toLowerCase().includes(lower) ||
        cmd.keywords?.some((k) => k.toLowerCase().includes(lower))
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(); // toggle
      }
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        navigate(filteredCommands[selectedIndex].path);
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in zoom-in-95 duration-150"
        role="dialog"
      >
        <div className="flex items-center px-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar issues, tarefas, logs, PRs, agentes..."
            className="w-full px-3 py-4 text-sm text-slate-900 bg-transparent placeholder-slate-400 focus:outline-hidden"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              Nenhum resultado encontrado para &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      navigate(cmd.path);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 text-blue-900' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                        {cmd.icon}
                      </div>
                      <span className="text-sm font-medium">{cmd.title}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-normal">{cmd.category}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Navegar: <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↓</kbd></span>
            <span>Selecionar: <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↵</kbd></span>
          </div>
          <span className="font-medium text-slate-400">NoteAgents Search</span>
        </div>
      </div>
    </div>
  );
};
