import {
  User,
  Task,
  Issue,
  PullRequest,
  Incident,
  Repository,
  Pipeline,
  Deployment,
  Agent,
  Audit,
  LogEntry,
  ErrorEvent,
  NetworkRequest,
  PerformanceMetric,
  Trace,
  Discussion,
  DocCategory,
  Contribution,
  NotificationItem,
} from '../types';
import { currentUser } from '../mocks/users';
import { mockTasks } from '../mocks/tasks';
import { mockIssues } from '../mocks/issues';
import { mockPullRequests } from '../mocks/pullRequests';
import { mockIncidents } from '../mocks/incidents';
import { mockRepositories } from '../mocks/repositories';
import { mockPipelines } from '../mocks/pipelines';
import { mockDeployments } from '../mocks/deployments';
import { mockAgents } from '../mocks/agents';
import { mockAudits } from '../mocks/audits';
import {
  mockObserverLogs,
  mockErrorEvents,
  mockNetworkRequests,
  mockPerformanceMetric,
  mockTraces,
} from '../mocks/observer';
import { mockDiscussions } from '../mocks/discussions';
import { mockDocumentationCategories } from '../mocks/documentation';
import { mockContributions } from '../mocks/contributions';
import { mockNotifications } from '../mocks/notifications';

// -------------------------------------------------------------
// AUTH SERVICE
// -------------------------------------------------------------
export interface LoginInput {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterInput {
  fullName: string;
  username: string;
  email: string;
  password?: string;
}

export interface AuthService {
  getCurrentUser(): Promise<User | null>;
  login(input: LoginInput): Promise<{ user: User; token: string }>;
  register(input: RegisterInput): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  requestPasswordReset(email: string): Promise<boolean>;
}

class MockAuthServiceImpl implements AuthService {
  private user: User | null = null;
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('noteagents_session_user');
      const token = localStorage.getItem('noteagents_auth_token');
      if (stored && token) {
        try {
          this.user = JSON.parse(stored);
          this.token = token;
        } catch {
          this.user = null;
          this.token = null;
        }
      }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return this.user;
  }

  async login(input: LoginInput): Promise<{ user: User; token: string }> {
    // Simulate slight network delay
    await new Promise((res) => setTimeout(res, 350));
    const user: User = {
      ...currentUser,
      email: input.email || currentUser.email,
    };
    const token = 'mock_jwt_token_' + Date.now();
    this.user = user;
    this.token = token;

    if (typeof window !== 'undefined') {
      localStorage.setItem('noteagents_session_user', JSON.stringify(user));
      localStorage.setItem('noteagents_auth_token', token);
    }
    return { user, token };
  }

  async register(input: RegisterInput): Promise<{ user: User; token: string }> {
    await new Promise((res) => setTimeout(res, 400));
    const user: User = {
      ...currentUser,
      name: input.fullName,
      username: input.username,
      email: input.email,
    };
    const token = 'mock_jwt_token_' + Date.now();
    this.user = user;
    this.token = token;

    if (typeof window !== 'undefined') {
      localStorage.setItem('noteagents_session_user', JSON.stringify(user));
      localStorage.setItem('noteagents_auth_token', token);
    }
    return { user, token };
  }

  async logout(): Promise<void> {
    this.user = null;
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('noteagents_session_user');
      localStorage.removeItem('noteagents_auth_token');
    }
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    return true;
  }
}

export const authService: AuthService = new MockAuthServiceImpl();

// -------------------------------------------------------------
// TASK SERVICE
// -------------------------------------------------------------
export interface TaskService {
  list(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  create(input: Partial<Task>): Promise<Task>;
  update(id: string, input: Partial<Task>): Promise<Task>;
  assignToMe(id: string): Promise<Task>;
}

class MockTaskServiceImpl implements TaskService {
  private tasks: Task[] = [...mockTasks];

  async list(): Promise<Task[]> {
    return [...this.tasks];
  }

  async getById(id: string): Promise<Task | null> {
    return this.tasks.find((t) => t.id === id) || null;
  }

  async create(input: Partial<Task>): Promise<Task> {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: input.title || 'Nova Tarefa',
      description: input.description || '',
      type: input.type || 'Feature',
      priority: input.priority || 'Média',
      difficulty: input.difficulty || 'Média',
      status: 'Aberta',
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.role,
      },
      updatedAt: 'Agora mesmo',
      createdAt: new Date().toISOString(),
      commentsCount: 0,
      timeline: [
        {
          id: `tm-${Date.now()}`,
          action: `Tarefa criada por ${currentUser.name}`,
          author: currentUser.name,
          timestamp: 'Agora mesmo',
          type: 'status',
        },
      ],
      ...input,
    };
    this.tasks.unshift(newTask);
    return newTask;
  }

  async update(id: string, input: Partial<Task>): Promise<Task> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Task not found');
    this.tasks[index] = { ...this.tasks[index], ...input, updatedAt: 'Agora mesmo' };
    return this.tasks[index];
  }

  async assignToMe(id: string): Promise<Task> {
    return this.update(id, {
      status: 'Em andamento',
      assignee: {
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
    });
  }
}

export const taskService: TaskService = new MockTaskServiceImpl();

// -------------------------------------------------------------
// ISSUE SERVICE
// -------------------------------------------------------------
export interface IssueService {
  list(): Promise<Issue[]>;
  getById(id: string): Promise<Issue | null>;
  create(input: Partial<Issue>): Promise<Issue>;
  update(id: string, input: Partial<Issue>): Promise<Issue>;
}

class MockIssueServiceImpl implements IssueService {
  private issues: Issue[] = [...mockIssues];

  async list(): Promise<Issue[]> {
    return [...this.issues];
  }

  async getById(id: string): Promise<Issue | null> {
    return this.issues.find((i) => i.id === id || i.number.toString() === id) || null;
  }

  async create(input: Partial<Issue>): Promise<Issue> {
    const newIssue: Issue = {
      id: `issue-${Date.now()}`,
      number: 247 + this.issues.length,
      title: input.title || 'Nova Issue',
      description: input.description || '',
      status: 'Aberta',
      priority: input.priority || 'Média',
      type: input.type || 'Bug',
      labels: input.labels || ['triage'],
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      createdAt: 'Agora mesmo',
      updatedAt: 'Agora mesmo',
      commentsCount: 0,
      ...input,
    };
    this.issues.unshift(newIssue);
    return newIssue;
  }

  async update(id: string, input: Partial<Issue>): Promise<Issue> {
    const index = this.issues.findIndex((i) => i.id === id || i.number.toString() === id);
    if (index === -1) throw new Error('Issue not found');
    this.issues[index] = { ...this.issues[index], ...input, updatedAt: 'Agora mesmo' };
    return this.issues[index];
  }
}

export const issueService: IssueService = new MockIssueServiceImpl();

// -------------------------------------------------------------
// PULL REQUEST SERVICE
// -------------------------------------------------------------
export interface PullRequestService {
  list(): Promise<PullRequest[]>;
  getById(id: string): Promise<PullRequest | null>;
  merge(id: string): Promise<PullRequest>;
  addReview(id: string, comment: string, status: 'approved' | 'changes_requested' | 'commented'): Promise<PullRequest>;
}

class MockPullRequestServiceImpl implements PullRequestService {
  private prs: PullRequest[] = [...mockPullRequests];

  async list(): Promise<PullRequest[]> {
    return [...this.prs];
  }

  async getById(id: string): Promise<PullRequest | null> {
    return this.prs.find((p) => p.id === id || p.number.toString() === id) || null;
  }

  async merge(id: string): Promise<PullRequest> {
    const index = this.prs.findIndex((p) => p.id === id || p.number.toString() === id);
    if (index === -1) throw new Error('PR not found');
    this.prs[index] = { ...this.prs[index], status: 'Merged', updatedAt: 'Agora mesmo' };
    return this.prs[index];
  }

  async addReview(id: string, comment: string, status: 'approved' | 'changes_requested' | 'commented'): Promise<PullRequest> {
    const index = this.prs.findIndex((p) => p.id === id || p.number.toString() === id);
    if (index === -1) throw new Error('PR not found');
    const reviews = this.prs[index].reviews || [];
    reviews.push({
      reviewer: currentUser.name,
      avatar: currentUser.avatar,
      status,
      comment,
    });
    this.prs[index] = {
      ...this.prs[index],
      reviews,
      status: status === 'approved' ? 'Aprovada' : this.prs[index].status,
      updatedAt: 'Agora mesmo',
    };
    return this.prs[index];
  }
}

export const pullRequestService: PullRequestService = new MockPullRequestServiceImpl();

// -------------------------------------------------------------
// INCIDENT SERVICE
// -------------------------------------------------------------
export interface IncidentService {
  list(): Promise<Incident[]>;
  getById(id: string): Promise<Incident | null>;
  updateStatus(id: string, status: Incident['status']): Promise<Incident>;
}

class MockIncidentServiceImpl implements IncidentService {
  private incidents: Incident[] = [...mockIncidents];

  async list(): Promise<Incident[]> {
    return [...this.incidents];
  }

  async getById(id: string): Promise<Incident | null> {
    return this.incidents.find((inc) => inc.id === id) || null;
  }

  async updateStatus(id: string, status: Incident['status']): Promise<Incident> {
    const index = this.incidents.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Incident not found');
    this.incidents[index] = {
      ...this.incidents[index],
      status,
    };
    this.incidents[index].timeline.push({
      stage: status,
      timestamp: 'Agora mesmo',
      description: `Status alterado para ${status} por ${currentUser.name}`,
      user: currentUser.name,
    });
    return this.incidents[index];
  }
}

export const incidentService: IncidentService = new MockIncidentServiceImpl();

// -------------------------------------------------------------
// REPOSITORY SERVICE
// -------------------------------------------------------------
export interface RepositoryService {
  list(): Promise<Repository[]>;
  sync(id: string): Promise<Repository>;
}

class MockRepositoryServiceImpl implements RepositoryService {
  private repos: Repository[] = [...mockRepositories];

  async list(): Promise<Repository[]> {
    return [...this.repos];
  }

  async sync(id: string): Promise<Repository> {
    const repo = this.repos.find((r) => r.id === id);
    if (!repo) throw new Error('Repo not found');
    repo.lastCommit.time = 'Agora mesmo';
    return { ...repo };
  }
}

export const repositoryService: RepositoryService = new MockRepositoryServiceImpl();

// -------------------------------------------------------------
// PIPELINE SERVICE
// -------------------------------------------------------------
export interface PipelineService {
  list(): Promise<Pipeline[]>;
  getById(id: string): Promise<Pipeline | null>;
  reRun(id: string): Promise<Pipeline>;
}

class MockPipelineServiceImpl implements PipelineService {
  private pipelines: Pipeline[] = [...mockPipelines];

  async list(): Promise<Pipeline[]> {
    return [...this.pipelines];
  }

  async getById(id: string): Promise<Pipeline | null> {
    return this.pipelines.find((p) => p.id === id) || null;
  }

  async reRun(id: string): Promise<Pipeline> {
    const index = this.pipelines.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Pipeline not found');
    this.pipelines[index] = {
      ...this.pipelines[index],
      status: 'Em execução',
      startedAt: 'Agora mesmo',
    };
    return this.pipelines[index];
  }
}

export const pipelineService: PipelineService = new MockPipelineServiceImpl();

// -------------------------------------------------------------
// DEPLOYMENT SERVICE
// -------------------------------------------------------------
export interface DeploymentService {
  list(): Promise<Deployment[]>;
  triggerDeploy(branch: string, environment: 'Produção' | 'Preview'): Promise<Deployment>;
}

class MockDeploymentServiceImpl implements DeploymentService {
  private deployments: Deployment[] = [...mockDeployments];

  async list(): Promise<Deployment[]> {
    return [...this.deployments];
  }

  async triggerDeploy(branch: string, environment: 'Produção' | 'Preview'): Promise<Deployment> {
    const newDep: Deployment = {
      id: `dep-${Date.now()}`,
      environment,
      branch,
      commit: 'a1b2c3d',
      commitMessage: 'Manual deploy triggered from console',
      status: 'Building',
      url: `https://${branch.replace('/', '-')}.noteagents.dev`,
      triggeredAt: 'Agora mesmo',
      duration: '0s',
      author: currentUser.name,
    };
    this.deployments.unshift(newDep);
    return newDep;
  }
}

export const deploymentService: DeploymentService = new MockDeploymentServiceImpl();

// -------------------------------------------------------------
// AGENT SERVICE
// -------------------------------------------------------------
export interface AgentService {
  list(): Promise<Agent[]>;
  runTask(agentId: string, taskTitle: string): Promise<Agent>;
}

class MockAgentServiceImpl implements AgentService {
  private agents: Agent[] = [...mockAgents];

  async list(): Promise<Agent[]> {
    return [...this.agents];
  }

  async runTask(agentId: string, taskTitle: string): Promise<Agent> {
    const index = this.agents.findIndex((a) => a.id === agentId);
    if (index === -1) throw new Error('Agent not found');
    this.agents[index] = {
      ...this.agents[index],
      status: 'Executando',
      currentTask: taskTitle,
      progress: 10,
      lastActive: 'Agora mesmo',
    };
    return this.agents[index];
  }
}

export const agentService: AgentService = new MockAgentServiceImpl();

// -------------------------------------------------------------
// AUDIT SERVICE
// -------------------------------------------------------------
export interface AuditService {
  list(): Promise<Audit[]>;
}

class MockAuditServiceImpl implements AuditService {
  async list(): Promise<Audit[]> {
    return [...mockAudits];
  }
}

export const auditService: AuditService = new MockAuditServiceImpl();

// -------------------------------------------------------------
// OBSERVER SERVICE
// -------------------------------------------------------------
export interface ObserverService {
  getLogs(): Promise<LogEntry[]>;
  getErrors(): Promise<ErrorEvent[]>;
  getNetwork(): Promise<NetworkRequest[]>;
  getPerformance(): Promise<PerformanceMetric>;
  getTraces(): Promise<Trace[]>;
}

class MockObserverServiceImpl implements ObserverService {
  async getLogs(): Promise<LogEntry[]> {
    return [...mockObserverLogs];
  }
  async getErrors(): Promise<ErrorEvent[]> {
    return [...mockErrorEvents];
  }
  async getNetwork(): Promise<NetworkRequest[]> {
    return [...mockNetworkRequests];
  }
  async getPerformance(): Promise<PerformanceMetric> {
    return { ...mockPerformanceMetric };
  }
  async getTraces(): Promise<Trace[]> {
    return [...mockTraces];
  }
}

export const observerService: ObserverService = new MockObserverServiceImpl();

// -------------------------------------------------------------
// DISCUSSION SERVICE
// -------------------------------------------------------------
export interface DiscussionService {
  list(): Promise<Discussion[]>;
  create(input: Partial<Discussion>): Promise<Discussion>;
  like(id: string): Promise<Discussion>;
}

class MockDiscussionServiceImpl implements DiscussionService {
  private discussions: Discussion[] = [...mockDiscussions];

  async list(): Promise<Discussion[]> {
    return [...this.discussions];
  }

  async create(input: Partial<Discussion>): Promise<Discussion> {
    const newDisc: Discussion = {
      id: `disc-${Date.now()}`,
      title: input.title || 'Nova Discussão',
      content: input.content || '',
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      category: input.category || 'Arquitetura',
      repliesCount: 0,
      likesCount: 1,
      lastActivity: 'Agora mesmo',
      isSolved: false,
      tags: input.tags || ['comunidade'],
    };
    this.discussions.unshift(newDisc);
    return newDisc;
  }

  async like(id: string): Promise<Discussion> {
    const disc = this.discussions.find((d) => d.id === id);
    if (!disc) throw new Error('Discussion not found');
    disc.likesCount += 1;
    return { ...disc };
  }
}

export const discussionService: DiscussionService = new MockDiscussionServiceImpl();

// -------------------------------------------------------------
// DOCUMENTATION SERVICE
// -------------------------------------------------------------
export interface DocumentationService {
  getCategories(): Promise<DocCategory[]>;
}

class MockDocumentationServiceImpl implements DocumentationService {
  async getCategories(): Promise<DocCategory[]> {
    return [...mockDocumentationCategories];
  }
}

export const docService: DocumentationService = new MockDocumentationServiceImpl();

// -------------------------------------------------------------
// CONTRIBUTION SERVICE
// -------------------------------------------------------------
export interface ContributionService {
  list(): Promise<Contribution[]>;
}

class MockContributionServiceImpl implements ContributionService {
  async list(): Promise<Contribution[]> {
    return [...mockContributions];
  }
}

export const contributionService: ContributionService = new MockContributionServiceImpl();

// -------------------------------------------------------------
// NOTIFICATION SERVICE
// -------------------------------------------------------------
export interface NotificationService {
  list(): Promise<NotificationItem[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
}

class MockNotificationServiceImpl implements NotificationService {
  private notifs: NotificationItem[] = [...mockNotifications];

  async list(): Promise<NotificationItem[]> {
    return [...this.notifs];
  }

  async markAsRead(id: string): Promise<void> {
    const item = this.notifs.find((n) => n.id === id);
    if (item) item.read = true;
  }

  async markAllAsRead(): Promise<void> {
    this.notifs.forEach((n) => (n.read = true));
  }
}

export const notificationService: NotificationService = new MockNotificationServiceImpl();

// -------------------------------------------------------------
// PROFILE SERVICE
// -------------------------------------------------------------
export interface ProfileService {
  getProfile(): Promise<User>;
  updateProfile(input: Partial<User>): Promise<User>;
}

class MockProfileServiceImpl implements ProfileService {
  private profile: User = { ...currentUser };

  async getProfile(): Promise<User> {
    return { ...this.profile };
  }

  async updateProfile(input: Partial<User>): Promise<User> {
    this.profile = { ...this.profile, ...input };
    if (typeof window !== 'undefined') {
      localStorage.setItem('noteagents_session_user', JSON.stringify(this.profile));
    }
    return { ...this.profile };
  }
}

export const profileService: ProfileService = new MockProfileServiceImpl();
