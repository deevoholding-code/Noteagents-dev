export interface ProjectHealthItem {
  id: string;
  name: string;
  category: 'service' | 'api' | 'github' | 'database' | 'ai' | 'pipeline';
  status: 'Online' | 'Conectado' | 'Operacional';
  metric: string;
}

export const mockProjectHealth: ProjectHealthItem[] = [
  { id: '1', name: 'Frontend (Vercel)', category: 'service', status: 'Online', metric: '99,9%' },
  { id: '2', name: 'API', category: 'api', status: 'Online', metric: '99,9%' },
  { id: '3', name: 'GitHub', category: 'github', status: 'Conectado', metric: 'Sincronizado' },
  { id: '4', name: 'Banco de dados', category: 'database', status: 'Online', metric: '12 ms' },
  { id: '5', name: 'Serviços de IA', category: 'ai', status: 'Online', metric: '260 ms' },
  { id: '6', name: 'Pipelines', category: 'pipeline', status: 'Operacional', metric: '100%' },
];

export interface ActivityPoint {
  date: string;
  commits: number;
  pullRequests: number;
  issues: number;
  deployments: number;
}

export const mockActivityData: ActivityPoint[] = [
  { date: '9 Jan', commits: 42, pullRequests: 21, issues: 12, deployments: 4 },
  { date: '10 Jan', commits: 38, pullRequests: 22, issues: 19, deployments: 6 },
  { date: '11 Jan', commits: 65, pullRequests: 34, issues: 14, deployments: 9 },
  { date: '12 Jan', commits: 48, pullRequests: 29, issues: 24, deployments: 5 },
  { date: '13 Jan', commits: 70, pullRequests: 41, issues: 18, deployments: 8 },
  { date: '14 Jan', commits: 55, pullRequests: 32, issues: 29, deployments: 12 },
  { date: '15 Jan', commits: 60, pullRequests: 38, issues: 24, deployments: 7 },
];

export interface DashboardDeployment {
  id: string;
  environment: 'Produção' | 'Preview';
  versionOrBranch: string;
  timeAgo: string;
  status: 'Sucesso' | 'Falhou';
}

export const mockDashboardDeployments: DashboardDeployment[] = [
  { id: 'dep-1', environment: 'Produção', versionOrBranch: 'v0.3.0', timeAgo: 'há 2 horas', status: 'Sucesso' },
  { id: 'dep-2', environment: 'Preview', versionOrBranch: 'feat/agents-ui', timeAgo: 'há 4 horas', status: 'Sucesso' },
  { id: 'dep-3', environment: 'Preview', versionOrBranch: 'fix/pipeline-logs', timeAgo: 'há 6 horas', status: 'Sucesso' },
  { id: 'dep-4', environment: 'Preview', versionOrBranch: 'feat/community', timeAgo: 'há 10 horas', status: 'Falhou' },
  { id: 'dep-5', environment: 'Produção', versionOrBranch: 'v0.2.9', timeAgo: 'há 1 dia', status: 'Sucesso' },
];

export interface DashboardLog {
  id: string;
  time: string;
  message: string;
  tag: string;
  type: 'success' | 'info' | 'error';
}

export const mockDashboardLogs: DashboardLog[] = [
  { id: 'l1', time: '10:42:13', message: 'Build concluído com sucesso', tag: 'frontend', type: 'success' },
  { id: 'l2', time: '10:40:21', message: 'Deploy iniciado (feat/agents-ui)', tag: 'vercel', type: 'info' },
  { id: 'l3', time: '10:38:45', message: 'Erro no teste de integração', tag: 'pipeline', type: 'error' },
  { id: 'l4', time: '10:35:12', message: 'Agente Code Review finalizado', tag: 'agents', type: 'success' },
  { id: 'l5', time: '10:32:18', message: 'Nova issue criada #245', tag: 'github', type: 'info' },
];

export interface IssueCategoryStat {
  name: string;
  value: number;
  percentage: string;
  color: string;
}

export const mockIssuesByCategory: IssueCategoryStat[] = [
  { name: 'Bug', value: 8, percentage: '33%', color: '#EF4444' },
  { name: 'Feature', value: 6, percentage: '25%', color: '#3B82F6' },
  { name: 'Docs', value: 4, percentage: '17%', color: '#06B6D4' },
  { name: 'Improvement', value: 3, percentage: '13%', color: '#F59E0B' },
  { name: 'Security', value: 2, percentage: '8%', color: '#8B5CF6' },
  { name: 'Outros', value: 1, percentage: '4%', color: '#94A3B8' },
];
