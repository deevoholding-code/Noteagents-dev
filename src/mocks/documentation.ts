import { DocCategory } from '../types';

export const mockDocumentationCategories: DocCategory[] = [
  {
    id: 'intro',
    title: 'Visão Geral do NoteAgents',
    sections: [
      {
        id: 'sec-overview',
        title: 'Introdução e Filosofia',
        slug: 'introducao',
        content: `NoteAgents é a plataforma definitiva de engenharia de software assistida por agentes inteligentes. Unificamos o ciclo de vida completo do software — da concepção e revisão de código à observabilidade em tempo real e orquestração de deploys — com foco absoluto em colaboração e produtividade open source.`,
        codeSnippet: {
          language: 'bash',
          code: `# Clone o repositório principal e inicie o ambiente
git clone https://github.com/noteagents/core.git
cd core
pnpm install
pnpm dev`,
        },
      },
      {
        id: 'sec-architecture',
        title: 'Arquitetura do Sistema',
        slug: 'arquitetura',
        content: `O sistema opera sob o modelo de Despacho de Agentes Orientado a Eventos. O runtime isola cada agente em workers concorrentes que se comunicam através de protocolos padronizados (JSON-RPC e SSE).`,
      },
    ],
  },
  {
    id: 'agents',
    title: 'Agentes Autônomos',
    sections: [
      {
        id: 'sec-agent-lifecycle',
        title: 'Ciclo de Vida dos Agentes',
        slug: 'ciclo-de-vida',
        content: `Os agentes do NoteAgents passam pelos seguintes estados operacionais:
1. Ocioso: pronto para receber tarefas;
2. Executando: processando ASTs de código ou pipelines;
3. Processando: gerando saídas estruturadas com IA;
4. Finalizando: submetendo commits ou relatórios de auditoria.`,
        codeSnippet: {
          language: 'typescript',
          code: `import { defineAgent } from '@noteagents/agents';

export const customLinterAgent = defineAgent({
  name: 'SecurityLinter',
  version: '1.0.0',
  async onExecute(context) {
    const diff = await context.getPullRequestDiff();
    return context.auditAST(diff);
  }
});`,
        },
      },
      {
        id: 'sec-mcp',
        title: 'Protocolo MCP (Model Context Protocol)',
        slug: 'mcp-integration',
        content: `O NoteAgents implementa conectores nativos de cliente e servidor MCP para fornecer contexto rico de repositórios, métricas e logs às LLMs.`,
      },
    ],
  },
  {
    id: 'observer',
    title: 'Observabilidade & CI/CD',
    sections: [
      {
        id: 'sec-pipelines',
        title: 'Configuração de Pipelines',
        slug: 'pipelines-config',
        content: `Os pipelines do NoteAgents suportam etapas de compilação paralela, testes de regressão automatizados e checagem contínua de tipos TypeScript.`,
        codeSnippet: {
          language: 'yaml',
          code: `name: noteagents-ci
stages:
  - install: pnpm install --frozen-lockfile
  - build: vite build
  - test: vitest run
  - audit: pnpm audit`,
        },
      },
    ],
  },
];
