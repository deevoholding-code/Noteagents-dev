import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NotificationItem } from '../../types';
import { notificationService } from '../../services';
import { useToast } from '../../providers/ToastProvider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Bell,
  Check,
  CheckCheck,
  GitPullRequest,
  AlertCircle,
  Rocket,
  MessageSquare,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [category, setCategory] = useState<string>('Todas');
  const { success } = useToast();

  useEffect(() => {
    notificationService.list().then(setNotifications);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAll = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    success('Notificações atualizadas', 'Todas as notificações foram marcadas como lidas.');
  };

  const categories = [
    'Todas',
    'Menções',
    'Issues',
    'Pull Requests',
    'Deployments',
    'Sistema',
  ];

  const filtered = notifications.filter(
    (n) => category === 'Todas' || n.category === category
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Notificações' }]} />

      <PageHeader
        title="Central de Notificações"
        subtitle="Acompanhe menções, novos comentários nos seus PRs, alertas de pipelines e atribuição de issues."
        actions={
          <button
            onClick={handleMarkAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" />
            <span>Marcar todas como lidas</span>
          </button>
        }
      />

      {/* Categories */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="Nenhuma notificação"
            description="Você está em dia com todas as novidades e eventos."
          />
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !item.read ? 'bg-blue-50/40' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <Link
                    to={item.link}
                    className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors block"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  <span className="text-[11px] text-slate-400 mt-2 block font-medium">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {!item.read && (
                <button
                  onClick={() => handleMarkAsRead(item.id)}
                  title="Marcar como lida"
                  className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
