import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
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
  FileCheck2,
  Activity,
  Terminal,
  AlertOctagon,
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
  ChevronDown,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Logo } from './Logo';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const [observerOpen, setObserverOpen] = useState(
    location.pathname.startsWith('/observer')
  );

  const isObserverActive = location.pathname.startsWith('/observer');

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
      isActive
        ? 'bg-blue-50 text-[#0B5FFF] font-semibold shadow-2xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`;

  const renderBadge = (count: string | number, color: 'blue' | 'red' | 'amber' = 'blue') => {
    if (collapsed) return null;
    const colors = {
      blue: 'bg-slate-100 text-slate-600 group-hover:bg-slate-200',
      red: 'bg-rose-100 text-rose-700',
      amber: 'bg-amber-100 text-amber-700',
    };
    return (
      <span className={`ml-auto px-2 py-0.5 text-[11px] font-bold rounded-full transition-colors ${colors[color]}`}>
        {count}
      </span>
    );
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-200 ease-in-out lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand & Top Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
            <Logo size="sm" showText={!collapsed} />
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Back to Community */}
        {!collapsed && (
          <div className="px-4 pt-3 pb-1 shrink-0">
            <Link
              to="/discussions"
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-50"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Voltar para a Comunidade</span>
            </Link>
          </div>
        )}

        {/* Navigation items scroll area */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* DESENVOLVIMENTO */}
          <div>
            {!collapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Desenvolvimento
              </p>
            )}

            <nav className="space-y-0.5">
              <NavLink to="/dashboard" onClick={onClose} className={navLinkClass} title="Dashboard">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Dashboard</span>}
              </NavLink>

              <NavLink to="/tasks" onClick={onClose} className={navLinkClass} title="Tarefas">
                <CheckSquare className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Tarefas</span>}
                {renderBadge(12, 'blue')}
              </NavLink>

              <NavLink to="/issues" onClick={onClose} className={navLinkClass} title="Issues">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Issues</span>}
                {renderBadge(8, 'blue')}
              </NavLink>

              <NavLink to="/pull-requests" onClick={onClose} className={navLinkClass} title="Pull Requests">
                <GitPullRequest className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Pull Requests</span>}
                {renderBadge(5, 'blue')}
              </NavLink>

              <NavLink to="/incidents" onClick={onClose} className={navLinkClass} title="Incidentes">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                {!collapsed && <span>Incidentes</span>}
                {renderBadge(2, 'red')}
              </NavLink>

              <NavLink to="/repositories" onClick={onClose} className={navLinkClass} title="Repositórios">
                <FolderGit2 className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Repositórios</span>}
              </NavLink>

              <NavLink to="/pipelines" onClick={onClose} className={navLinkClass} title="Pipelines">
                <Workflow className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Pipelines</span>}
              </NavLink>

              <NavLink to="/deployments" onClick={onClose} className={navLinkClass} title="Deployments">
                <Rocket className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Deployments</span>}
              </NavLink>

              <NavLink to="/agents" onClick={onClose} className={navLinkClass} title="Agentes">
                <Bot className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Agentes</span>}
              </NavLink>

              <NavLink to="/audits" onClick={onClose} className={navLinkClass} title="Auditorias">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Auditorias</span>}
              </NavLink>

              <NavLink to="/audits" onClick={onClose} className={navLinkClass} title="Evidências">
                <FileCheck2 className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Evidências</span>}
              </NavLink>

              {/* Observer Accordion */}
              <div>
                <button
                  onClick={() => setObserverOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isObserverActive
                      ? 'text-[#0B5FFF] font-semibold bg-blue-50/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                  title="Observer"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>Observer</span>}
                  </div>
                  {!collapsed && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                        observerOpen ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {observerOpen && !collapsed && (
                  <div className="ml-5 pl-2 mt-1 space-y-0.5 border-l border-slate-200">
                    <NavLink
                      to="/observer/logs"
                      onClick={onClose}
                      className={navLinkClass}
                    >
                      <Terminal className="w-3.5 h-3.5 shrink-0" />
                      <span>Logs</span>
                    </NavLink>
                    <NavLink
                      to="/observer/errors"
                      onClick={onClose}
                      className={navLinkClass}
                    >
                      <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                      <span>Erros</span>
                    </NavLink>
                    <NavLink
                      to="/observer/network"
                      onClick={onClose}
                      className={navLinkClass}
                    >
                      <Network className="w-3.5 h-3.5 shrink-0 text-cyan-600" />
                      <span>Network</span>
                    </NavLink>
                    <NavLink
                      to="/observer/performance"
                      onClick={onClose}
                      className={navLinkClass}
                    >
                      <Cpu className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                      <span>Performance</span>
                    </NavLink>
                    <NavLink
                      to="/observer/traces"
                      onClick={onClose}
                      className={navLinkClass}
                    >
                      <Layers className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                      <span>Traces</span>
                    </NavLink>
                    <NavLink
                      to="/observer/metrics"
                      onClick={onClose}
                      className={navLinkClass}
                    >
                      <BarChart3 className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                      <span>Métricas</span>
                    </NavLink>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* COLABORAÇÃO */}
          <div>
            {!collapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Colaboração
              </p>
            )}

            <nav className="space-y-0.5">
              <NavLink to="/discussions" onClick={onClose} className={navLinkClass} title="Discussões">
                <MessageSquare className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Discussões</span>}
              </NavLink>

              <NavLink to="/documentation" onClick={onClose} className={navLinkClass} title="Documentação">
                <BookOpen className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Documentação</span>}
              </NavLink>

              <NavLink to="/contributions" onClick={onClose} className={navLinkClass} title="Contribuições">
                <GitCommit className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Contribuições</span>}
              </NavLink>
            </nav>
          </div>

          {/* CONTA */}
          <div>
            {!collapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Conta
              </p>
            )}

            <nav className="space-y-0.5">
              <NavLink to="/profile" onClick={onClose} className={navLinkClass} title="Perfil">
                <User className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Perfil</span>}
              </NavLink>

              <NavLink to="/notifications" onClick={onClose} className={navLinkClass} title="Notificações">
                <Bell className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Notificações</span>}
                {renderBadge(3, 'red')}
              </NavLink>

              <NavLink to="/settings" onClick={onClose} className={navLinkClass} title="Configurações">
                <Settings className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Configurações</span>}
              </NavLink>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};
