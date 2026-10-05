import { Incident } from '../types';

export const mockIncidents: Incident[] = [
  {
    id: 'inc-1',
    title: 'Erro no pipeline de build',
    severity: 'Crítica',
    status: 'Investigando',
    detectedAt: 'há 1 hora (09:42 UTC)',
    impact: 'Bloqueio de deploys em produção e cancelamento de previews automáticos na branch principal.',
    affectedServices: ['CI/CD Runner', 'Vercel Deployment', 'GitHub Actions Dispatcher'],
    rootCause: 'Conflito de tipos em módulo recém-introduzido de agentes interrompeu a compilação do Vite.',
    responsible: 'Rafael Mendes',
    timeline: [
      {
        stage: 'Detectado',
        timestamp: '10:38:45',
        description: 'Alerta disparado pelo monitor de saúde do CI após 3 falhas consecutivas de compilação.',
        user: 'Sistema de Observabilidade',
      },
      {
        stage: 'Investigando',
        timestamp: '10:45:10',
        description: 'Engenharia de DevOps isolou o problema na biblioteca de tipos do TypeScript.',
        user: 'Rafael Mendes',
      },
    ],
    logs: [
      '10:38:45 [ERROR] CI Runner #148 exited with code 1: TS2322 in src/agents/dispatcher.ts',
      '10:40:02 [WARN] 4 PR preview jobs queued waiting for runner release',
      '10:45:12 [INFO] Investigador Rafael Mendes designado para mitigação',
    ],
    metrics: {
      latencyPeak: '3.4s',
      errorRatePeak: '100% dos builds',
      affectedRequests: 14,
    },
    actions: [
      'Reverter commit problemático ou aprovar PR #246 de hotfix',
      'Ativar modo de bypass temporário para deploys emergenciais',
      'Aumentar verbosidade dos logs de tipagem no CI',
    ],
  },
  {
    id: 'inc-2',
    title: 'Latência elevada na API de métricas',
    severity: 'Alta',
    status: 'Mitigando',
    detectedAt: 'há 3 horas (07:30 UTC)',
    impact: 'Tempo de resposta de consultas no dashboard subiu de 120ms para 850ms em horários de pico.',
    affectedServices: ['API Gateway', 'Banco de Dados', 'Observer Service'],
    rootCause: 'Lock de tabela transitório durante agregação periódica de logs em background.',
    responsible: 'João Pereira',
    timeline: [
      {
        stage: 'Detectado',
        timestamp: '07:30:00',
        description: 'Alerta P99 de latência acima do limiar de 500ms.',
      },
      {
        stage: 'Investigando',
        timestamp: '07:42:00',
        description: 'Identificado bloqueio na fila de agregação do PostgreSQL.',
        user: 'João Pereira',
      },
      {
        stage: 'Mitigando',
        timestamp: '08:15:00',
        description: 'Aplicado kill em transações presas e particionamento de índices ativado.',
        user: 'João Pereira',
      },
    ],
    logs: [
      '07:30:12 [WARN] P99 response time exceeded 850ms on /api/metrics/observer',
      '08:15:24 [INFO] Kill connection ID 8491 (idle in transaction)',
      '08:20:00 [INFO] P99 dropped to 210ms and recovering',
    ],
    metrics: {
      latencyPeak: '850ms',
      errorRatePeak: '2.4%',
      affectedRequests: 4200,
    },
    actions: [
      'Adicionar timeout rígido de 5s para consultas analíticas',
      'Sincronizar réplica de leitura para desonerar a base primária',
    ],
  },
  {
    id: 'inc-3',
    title: 'Falha intermitente no provedor de IA (Gemini API 503)',
    severity: 'Média',
    status: 'Resolvido',
    detectedAt: 'ontem às 18:20',
    impact: 'Atraso de 40s na geração automática de sumários de PR.',
    affectedServices: ['Serviços de IA', 'Documentation Agent'],
    rootCause: 'Indisponibilidade regional temporária do provedor em us-central1.',
    responsible: 'Carla Santos',
    timeline: [
      { stage: 'Detectado', timestamp: '18:20', description: 'Taxa de erro 503 atingiu 18%' },
      { stage: 'Mitigando', timestamp: '18:25', description: 'Fallback automático ativado para região secundária' },
      { stage: 'Resolvido', timestamp: '18:50', description: 'Tráfego restabelecido e operando normalmente' },
    ],
  },
];
