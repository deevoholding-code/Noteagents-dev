import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../providers/ToastProvider';
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  User as UserIcon,
  GitPullRequest,
  CheckSquare,
  AlertCircle,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  Check,
} from 'lucide-react';
import { mockNotifications } from '../../mocks/notifications';

export const Topbar: React.FC<{
  onOpenCommandPalette: () => void;
  onToggleSidebar: () => void;
}> = ({ onOpenCommandPalette, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [contributionMenuOpen, setContributionMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const contribMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotifMenuOpen(false);
      }
      if (contribMenuRef.current && !contribMenuRef.current.contains(e.target as Node)) {
        setContributionMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    await logout();
    success('Sessão encerrada com sucesso', 'Você foi desconectado do NoteAgents.');
    navigate('/login');
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    success('Notificações atualizadas', 'Todas as notificações foram marcadas como lidas.');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6 lg:px-8">
      {/* Left: Mobile hamburger & Global Search input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors lg:hidden"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar triggering Command Palette */}
        <div
          onClick={onOpenCommandPalette}
          className="flex items-center w-full max-w-md gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 text-slate-400 hover:text-slate-600 transition-all cursor-pointer shadow-2xs group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          <span className="text-xs sm:text-sm text-slate-500 font-normal truncate flex-1 select-none">
            Buscar issues, tarefas, logs, PRs, agentes...
          </span>
          <div className="hidden sm:flex items-center gap-1 select-none">
            <kbd className="px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 bg-white rounded border border-slate-200 shadow-2xs">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions, Notifications & User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* + Nova Contribuição Button with dropdown */}
        <div className="relative" ref={contribMenuRef}>
          <button
            onClick={() => setContributionMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-xl bg-[#0B5FFF] hover:bg-[#094ecc] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova contribuição</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${contributionMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {contributionMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 z-50">
              <Link
                to="/tasks"
                onClick={() => setContributionMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>Nova Tarefa</span>
              </Link>
              <Link
                to="/issues"
                onClick={() => setContributionMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Nova Issue</span>
              </Link>
              <Link
                to="/pull-requests"
                onClick={() => setContributionMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <GitPullRequest className="w-4 h-4 text-purple-600" />
                <span>Novo Pull Request</span>
              </Link>
              <Link
                to="/discussions"
                onClick={() => setContributionMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Nova Discussão</span>
              </Link>
            </div>
          )}
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setNotifMenuOpen((prev) => !prev)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
            )}
          </button>

          {notifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-100 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Notificações</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-700">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Marcar lidas
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.slice(0, 4).map((notif) => (
                  <Link
                    key={notif.id}
                    to={notif.link}
                    onClick={() => setNotifMenuOpen(false)}
                    className={`block p-3.5 hover:bg-slate-50 transition-colors ${
                      !notif.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {notif.avatar ? (
                        <img
                          src={notif.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Bell className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 leading-snug">{notif.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{notif.description}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setNotifMenuOpen(false)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 block py-1"
                >
                  Ver todas as notificações →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors group"
            aria-label="Menu do usuário"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'Lucas Almeida'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                {user?.name || 'Lucas Almeida'}
              </span>
              <span className="text-[10px] font-medium text-slate-500 leading-tight">
                {user?.role || 'Community Developer'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'Lucas Almeida'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || 'lucas.almeida@noteagents.dev'}</p>
              </div>

              <Link
                to="/profile"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <UserIcon className="w-4 h-4 text-slate-500" />
                <span>Meu perfil</span>
              </Link>

              <Link
                to="/contributions"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <GitPullRequest className="w-4 h-4 text-slate-500" />
                <span>Contribuições</span>
              </Link>

              <Link
                to="/notifications"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Bell className="w-4 h-4 text-slate-500" />
                <span>Notificações</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Configurações</span>
              </Link>

              <Link
                to="/documentation"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Ajuda & Docs</span>
              </Link>

              <div className="border-t border-slate-100 my-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
