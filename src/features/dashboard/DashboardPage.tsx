import React from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { StatCard } from '../../components/ui/StatCard';
import { ProjectHealthCard } from './components/ProjectHealthCard';
import { ActivityChartCard } from './components/ActivityChartCard';
import { RecentDeploymentsCard } from './components/RecentDeploymentsCard';
import { FeaturedProjectsCard } from './components/FeaturedProjectsCard';
import { ActiveIncidentsCard } from './components/ActiveIncidentsCard';
import { RecentLogsCard } from './components/RecentLogsCard';
import { DashboardTabsTable } from './components/DashboardTabsTable';
import { ActiveAgentsCard } from './components/ActiveAgentsCard';
import { IssuesCategoryCard } from './components/IssuesCategoryCard';
import { RecentContributionsCard } from './components/RecentContributionsCard';
import {
  AlertCircle,
  CheckSquare,
  GitPullRequest,
  Workflow,
  Bot,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Olá, {user?.name?.split(' ')[0] || 'Lucas'}! 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Aqui está o que está acontecendo no NoteAgents. Encontre tarefas, acompanhe o projeto e contribua.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-2xs self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Segunda-feira, 15 de Janeiro de 2024</span>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          icon={<AlertCircle className="w-5 h-5 text-rose-600" />}
          iconBgColor="bg-rose-50"
          title="Issues abertas"
          value="24"
          trend={{ value: '↑ 12%', color: 'red' }}
          subtitle="8 críticas"
          subtitleColor="text-rose-600"
        />

        <StatCard
          icon={<CheckSquare className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
          title="Tarefas disponíveis"
          value="18"
          trend={{ value: '↑ 28%', color: 'green' }}
          subtitle="6 boas para iniciantes"
          subtitleColor="text-slate-500"
        />

        <StatCard
          icon={<GitPullRequest className="w-5 h-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
          title="Pull Requests"
          value="12"
          subtitle="4 em revisão"
          subtitleColor="text-blue-600"
        />

        <StatCard
          icon={<Workflow className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
          title="Builds (últimas 24h)"
          value="8"
          trend={{ value: '↑ 100%', color: 'green' }}
          subtitle="Todas bem-sucedidas"
          subtitleColor="text-slate-500"
        />

        <StatCard
          icon={<Bot className="w-5 h-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
          title="Agentes ativos"
          value="6"
          subValue="de 8"
          subtitle="2 em execução"
          subtitleColor="text-blue-600"
        />

        <StatCard
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
          title="Uptime da API"
          value="99,9%"
          badge={{ text: 'Operacional' }}
          subtitle="Operacional"
          subtitleColor="text-emerald-600"
        />
      </div>

      {/* Main Grid: Left Main Area + Right Activity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        {/* Left Column (Spans 2 on lg, 3 on xl) */}
        <div className="space-y-6 lg:col-span-2 xl:col-span-3">
          {/* Middle Row: Project Health, Activity Chart, Recent Deployments */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <ProjectHealthCard />
            <ActivityChartCard />
            <RecentDeploymentsCard />
          </div>

          {/* Lower Section: Tabs Table (Tarefas, Issues, PRs, etc.) */}
          <DashboardTabsTable />

          {/* Bottom Row: Agentes em Execução + Issues por Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActiveAgentsCard />
            <IssuesCategoryCard />
          </div>
        </div>

        {/* Right Sidebar Panel */}
        <div className="space-y-6 lg:col-span-1 xl:col-span-1">
          <FeaturedProjectsCard />
          <ActiveIncidentsCard />
          <RecentLogsCard />
          <RecentContributionsCard />
        </div>
      </div>
    </div>
  );
};
