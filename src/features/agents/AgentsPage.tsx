import React, { useState, useEffect } from 'react';
import { Agent } from '../../types';
import { agentService } from '../../services';
import { useToast } from '../../providers/ToastProvider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Bot,
  Play,
  CheckCircle2,
  Cpu,
  Zap,
  Code2,
  ShieldAlert,
  LayoutGrid,
  FileText,
  Server,
} from 'lucide-react';

export const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const { success } = useToast();

  useEffect(() => {
    agentService.list().then(setAgents);
  }, []);

  const handleRunAgent = async (agentId: string, name: string) => {
    const updated = await agentService.runTask(agentId, 'Auditoria sob demanda iniciada');
    setAgents((prev) => prev.map((a) => (a.id === agentId ? updated : a)));
    success(`Agente ativado`, `${name} iniciou uma nova rotina de análise.`);
  };

  const getAgentIcon = (name: string) => {
    if (name.includes('Code Review')) return <Code2 className="w-5 h-5 text-blue-600" />;
    if (name.includes('Security')) return <ShieldAlert className="w-5 h-5 text-rose-600" />;
    if (name.includes('Frontend')) return <LayoutGrid className="w-5 h-5 text-purple-600" />;
    if (name.includes('Documentation')) return <FileText className="w-5 h-5 text-cyan-600" />;
    if (name.includes('Backend')) return <Server className="w-5 h-5 text-amber-600" />;
    return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Agentes de IA' }]} />

      <PageHeader
        title="Agentes Autônomos de IA"
        subtitle="Orquestre agentes especializados em revisão de código, varredura de vulnerabilidades, geração de testes e documentação contínua."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-2xs">
                    {getAgentIcon(agent.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{agent.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">{agent.role}</p>
                  </div>
                </div>

                <StatusBadge status={agent.status} size="sm" />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {agent.description}
              </p>

              {/* Progress and Current Task */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                    {agent.currentTask}
                  </span>
                  <span className="font-mono font-bold text-blue-600">{agent.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 text-center mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Tarefas</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {agent.totalTasksCompleted}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Sucesso</span>
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">{agent.successRate}%</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Acurácia</span>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">{agent.accuracy}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRunAgent(agent.id, agent.name)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
            >
              <Zap className="w-3.5 h-3.5 fill-blue-700" />
              <span>Executar Tarefa Sob Demanda</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
