import { LogEntry, ErrorEvent, NetworkRequest, PerformanceMetric, Trace } from '../types';

export const mockObserverLogs: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '10:42:13.821',
    level: 'INFO',
    service: 'frontend-service',
    message: 'Build concluído com sucesso. 418 módulos compilados em 1m 12s.',
    traceId: 'trc-89a1b2',
    requestId: 'req-4102',
    status: 200,
  },
  {
    id: 'log-2',
    timestamp: '10:40:21.140',
    level: 'INFO',
    service: 'vercel-integration',
    message: 'Deploy iniciado para branch feat/agents-ui em us-east1.',
    traceId: 'trc-77b3c4',
    requestId: 'req-4101',
    status: 202,
  },
  {
    id: 'log-3',
    timestamp: '10:38:45.512',
    level: 'ERROR',
    service: 'ci-pipeline-runner',
    message: 'Erro no teste de integração: Type mismatch TS2322 in src/agents/dispatcher.ts(42,9).',
    traceId: 'trc-55c4d5',
    requestId: 'req-4099',
    status: 500,
  },
  {
    id: 'log-4',
    timestamp: '10:35:12.339',
    level: 'INFO',
    service: 'agent-runtime',
    message: 'Agente Code Review finalizou análise do PR #243 com 0 violações críticas.',
    traceId: 'trc-33d5e6',
    requestId: 'req-4095',
    status: 200,
  },
  {
    id: 'log-5',
    timestamp: '10:32:18.012',
    level: 'INFO',
    service: 'github-webhook-listener',
    message: 'Nova issue criada #245 (Erro no pipeline de build) por @carlasantos.',
    traceId: 'trc-22e6f7',
    requestId: 'req-4091',
    status: 200,
  },
  {
    id: 'log-6',
    timestamp: '10:28:04.912',
    level: 'WARN',
    service: 'database-pool',
    message: 'Pool de conexões PostgreSQL atingiu 82% da capacidade configurada (41/50).',
    traceId: 'trc-11f7a8',
    requestId: 'req-4085',
    status: 429,
  },
  {
    id: 'log-7',
    timestamp: '10:24:55.720',
    level: 'DEBUG',
    service: 'mcp-server-transport',
    message: 'Handshake SSE estabelecido com cliente LSP no socket #1904.',
    traceId: 'trc-00a8b9',
    requestId: 'req-4080',
    status: 101,
  },
];

export const mockErrorEvents: ErrorEvent[] = [
  {
    id: 'err-1',
    error: 'TypeError: Cannot read properties of undefined (reading "durationMs")',
    message: 'src/agents/dispatcher.ts:42',
    frequency: 148,
    service: 'ci-pipeline-runner',
    lastSeen: 'há 10 minutos',
    firstSeen: 'há 1 hora',
    stackTrace: `TypeError: Cannot read properties of undefined (reading "durationMs")
    at AgentDispatcher.computeTelemetry (/src/agents/dispatcher.ts:42:18)
    at AgentRunner.executeStage (/src/pipelines/runner.ts:114:24)
    at async WorkerPool.processTask (/src/core/worker.ts:88:12)`,
    status: 'Investigando',
    affectedUsers: 14,
  },
  {
    id: 'err-2',
    error: 'DatabaseConnectionTimeoutError: Pool exhausted after 10000ms',
    message: 'src/db/pool.ts:89',
    frequency: 64,
    service: 'database-pool',
    lastSeen: 'há 45 minutos',
    firstSeen: 'há 3 horas',
    stackTrace: `DatabaseConnectionTimeoutError: Connection acquisition timed out
    at Pool.acquire (/src/db/pool.ts:89:15)
    at QueryExecutor.run (/src/db/executor.ts:32:20)`,
    status: 'Investigando',
    affectedUsers: 89,
  },
  {
    id: 'err-3',
    error: 'GeminiApiRateLimitError: 429 Resource has been exhausted',
    message: 'src/services/ai/client.ts:58',
    frequency: 23,
    service: 'ai-orchestrator',
    lastSeen: 'há 2 horas',
    firstSeen: 'há 8 horas',
    stackTrace: `GeminiApiRateLimitError: Quota exceeded for quota metric 'GenerateContent requests'
    at AiClient.generate (/src/services/ai/client.ts:58:22)
    at DocumentationAgent.summarizePR (/src/agents/doc.ts:74:16)`,
    status: 'Resolvido',
    affectedUsers: 12,
  },
];

export const mockNetworkRequests: NetworkRequest[] = [
  { id: 'net-1', timestamp: '10:42:13', method: 'GET', endpoint: '/api/v1/metrics/observer', status: 200, latency: 120, payloadSize: '4.8 KB' },
  { id: 'net-2', timestamp: '10:41:50', method: 'POST', endpoint: '/api/v1/agents/review/dispatch', status: 200, latency: 260, payloadSize: '24.1 KB' },
  { id: 'net-3', timestamp: '10:40:22', method: 'GET', endpoint: '/api/v1/pipelines/pipe-1/logs', status: 200, latency: 95, payloadSize: '58.2 KB' },
  { id: 'net-4', timestamp: '10:38:45', method: 'POST', endpoint: '/api/v1/ci/webhook/github', status: 500, latency: 850, payloadSize: '1.2 KB' },
  { id: 'net-5', timestamp: '10:35:10', method: 'GET', endpoint: '/api/v1/health', status: 200, latency: 12, payloadSize: '0.4 KB' },
  { id: 'net-6', timestamp: '10:32:00', method: 'PUT', endpoint: '/api/v1/tasks/task-1/status', status: 200, latency: 140, payloadSize: '2.1 KB' },
];

export const mockPerformanceMetric: PerformanceMetric = {
  cpu: 42,
  memory: '1.4 GB',
  memoryPercentage: 58,
  responseTime: 120,
  throughput: 320,
  errorRate: 0.1,
  fps: 60,
};

export const mockTraces: Trace[] = [
  {
    id: 'trc-1',
    traceId: 'trc-89a1b2c3d4e5f6',
    service: 'api-gateway',
    name: 'GET /api/v1/dashboard/metrics',
    duration: 124,
    status: 'Sucesso',
    timestamp: '10:42:13',
    spans: [
      { id: 'sp-1', name: 'Gateway Authentication', service: 'auth-service', durationMs: 14, offsetMs: 0, status: 'ok' },
      { id: 'sp-2', name: 'Cache Lookup (Redis)', service: 'cache-service', durationMs: 6, offsetMs: 14, status: 'ok' },
      { id: 'sp-3', name: 'DB Aggregate Metrics', service: 'database-pool', durationMs: 88, offsetMs: 20, status: 'ok' },
      { id: 'sp-4', name: 'JSON Serialization', service: 'api-gateway', durationMs: 16, offsetMs: 108, status: 'ok' },
    ],
  },
  {
    id: 'trc-2',
    traceId: 'trc-55c4d5e6f7a8b9',
    service: 'ci-pipeline-runner',
    name: 'POST /api/v1/pipelines/pipe-1/build',
    duration: 850,
    status: 'Erro',
    timestamp: '10:38:45',
    spans: [
      { id: 'sp-5', name: 'Queue Ingestion', service: 'queue-service', durationMs: 40, offsetMs: 0, status: 'ok' },
      { id: 'sp-6', name: 'Worker Provisioning', service: 'k8s-runner', durationMs: 180, offsetMs: 40, status: 'ok' },
      { id: 'sp-7', name: 'Vite Typecheck Task', service: 'ci-runner', durationMs: 630, offsetMs: 220, status: 'error' },
    ],
  },
];
