export type UserRole = 'Community Developer' | 'Core Maintainer' | 'DevOps Lead' | 'AI Engineer' | 'Security Analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  github?: string;
  location?: string;
  company?: string;
  joinedDate: string;
  stats?: {
    contributions: number;
    pullRequests: number;
    issues: number;
    reviews: number;
  };
}

export type TaskType = 'Bug' | 'Feature' | 'Docs' | 'Testes' | 'Melhoria' | 'Refactor';
export type TaskPriority = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type TaskDifficulty = 'Fácil' | 'Média' | 'Difícil';
export type TaskStatus = 'Aberta' | 'Em andamento' | 'Em revisão' | 'Concluída';

export interface TaskComment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  createdAt: string;
}

export interface TaskTimelineItem {
  id: string;
  action: string;
  author: string;
  timestamp: string;
  type: 'status' | 'comment' | 'assignment' | 'branch' | 'agent';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  status: TaskStatus;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  assignee?: {
    name: string;
    avatar: string;
  };
  assignedAgent?: string;
  updatedAt: string;
  createdAt: string;
  branch?: string;
  prId?: string;
  commentsCount: number;
  timeline?: TaskTimelineItem[];
  comments?: TaskComment[];
  files?: string[];
  evidence?: string[];
}

export type IssueStatus = 'Aberta' | 'Em andamento' | 'Fechada';
export type IssuePriority = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type IssueType = 'Bug' | 'Feature' | 'Docs' | 'Improvement' | 'Security' | 'Outros';

export interface Issue {
  id: string;
  number: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  labels: string[];
  author: {
    name: string;
    avatar: string;
  };
  assignee?: {
    name: string;
    avatar: string;
  };
  assignedAgent?: string;
  createdAt: string;
  updatedAt: string;
  diagnosis?: string;
  commentsCount: number;
  timeline?: TaskTimelineItem[];
  comments?: TaskComment[];
  logs?: string[];
  prs?: { id: string; number: number; title: string; status: string }[];
}

export type PRStatus = 'Aberta' | 'Em revisão' | 'Aprovada' | 'Merged' | 'Fechada';
export type PRCheckStatus = 'success' | 'running' | 'failed' | 'pending';

export interface PRCheck {
  name: string;
  status: PRCheckStatus;
  duration?: string;
  description?: string;
}

export interface PRFileDiff {
  filename: string;
  additions: number;
  deletions: number;
  patch: Array<{
    type: 'add' | 'del' | 'normal';
    lineNumber?: number;
    content: string;
  }>;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  description: string;
  branch: string;
  baseBranch: string;
  author: {
    name: string;
    avatar: string;
  };
  status: PRStatus;
  checks: PRCheck[];
  additions: number;
  deletions: number;
  changedFilesCount: number;
  createdAt: string;
  updatedAt: string;
  deployUrl?: string;
  reviews?: Array<{
    reviewer: string;
    avatar: string;
    status: 'approved' | 'changes_requested' | 'commented';
    comment?: string;
  }>;
  commits?: Array<{
    hash: string;
    message: string;
    author: string;
    time: string;
  }>;
  filesDiff?: PRFileDiff[];
}

export type IncidentSeverity = 'Crítica' | 'Alta' | 'Média' | 'Baixa';
export type IncidentStatus = 'Detectado' | 'Investigando' | 'Mitigando' | 'Resolvido';

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  detectedAt: string;
  impact: string;
  affectedServices: string[];
  rootCause?: string;
  responsible?: string;
  timeline: Array<{
    stage: IncidentStatus;
    timestamp: string;
    description: string;
    user?: string;
  }>;
  logs?: string[];
  metrics?: {
    latencyPeak?: string;
    errorRatePeak?: string;
    affectedRequests?: number;
  };
  actions?: string[];
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  lastCommit: {
    hash: string;
    message: string;
    time: string;
  };
  status: 'Principal' | 'Ativo' | 'Arquivado';
  language: string;
  isPrimary?: boolean;
  tags?: string[];
}

export type PipelineStatus = 'Sucesso' | 'Falhou' | 'Em execução' | 'Cancelado';

export interface PipelineStage {
  id: string;
  name: string;
  status: 'success' | 'running' | 'failed' | 'pending';
  duration: string;
  logs: string[];
}

export interface Pipeline {
  id: string;
  title: string;
  repository: string;
  branch: string;
  commit: string;
  commitMessage: string;
  duration: string;
  status: PipelineStatus;
  startedAt: string;
  author: string;
  stages: PipelineStage[];
}

export type DeploymentEnv = 'Produção' | 'Preview';
export type DeploymentStatus = 'Sucesso' | 'Falhou' | 'Building';

export interface Deployment {
  id: string;
  environment: DeploymentEnv;
  version?: string;
  branch: string;
  commit: string;
  commitMessage?: string;
  status: DeploymentStatus;
  url: string;
  triggeredAt: string;
  duration: string;
  author?: string;
}

export type AgentStatus = 'Executando' | 'Processando' | 'Finalizando' | 'Ocioso' | 'Erro';

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: AgentStatus;
  currentTask: string;
  progress: number;
  lastActive: string;
  avatarIcon: string;
  totalTasksCompleted: number;
  successRate: number;
  accuracy: string;
}

export interface Audit {
  id: string;
  name: string;
  category: 'Security' | 'Architecture' | 'Performance' | 'Quality' | 'Accessibility';
  score: number;
  status: 'Concluída' | 'Em andamento' | 'Alerta';
  issuesCount: {
    critical: number;
    warning: number;
    info: number;
  };
  date: string;
  responsible: string;
  recommendations: string[];
}

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  traceId?: string;
  requestId?: string;
  status?: number;
  details?: Record<string, unknown>;
}

export interface ErrorEvent {
  id: string;
  error: string;
  message: string;
  frequency: number;
  service: string;
  lastSeen: string;
  firstSeen: string;
  stackTrace: string;
  status: 'Não resolvido' | 'Investigando' | 'Resolvido';
  affectedUsers: number;
}

export interface NetworkRequest {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  status: number;
  latency: number;
  payloadSize: string;
  clientIp?: string;
}

export interface PerformanceMetric {
  cpu: number;
  memory: string;
  memoryPercentage: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  fps?: number;
}

export interface TraceSpan {
  id: string;
  name: string;
  service: string;
  durationMs: number;
  offsetMs: number;
  status: 'ok' | 'error';
}

export interface Trace {
  id: string;
  traceId: string;
  service: string;
  name: string;
  duration: number;
  status: 'Sucesso' | 'Erro';
  timestamp: string;
  spans: TraceSpan[];
}

export interface DiscussionReply {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isSolution?: boolean;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  category: 'Arquitetura' | 'Frontend' | 'Backend' | 'IA' | 'MCP' | 'DevOps' | 'Segurança' | 'Documentação';
  repliesCount: number;
  likesCount: number;
  lastActivity: string;
  isSolved: boolean;
  tags: string[];
  replies?: DiscussionReply[];
}

export interface DocSection {
  id: string;
  title: string;
  slug: string;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface DocCategory {
  id: string;
  title: string;
  sections: DocSection[];
}

export interface Contribution {
  id: string;
  user: string;
  type: 'pr' | 'comment' | 'commit' | 'issue' | 'mention' | 'review';
  title: string;
  reference: string;
  targetUrl: string;
  timeAgo: string;
  avatar: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: 'Todas' | 'Menções' | 'Issues' | 'Pull Requests' | 'Deployments' | 'Sistema';
  timestamp: string;
  read: boolean;
  link: string;
  avatar?: string;
}
