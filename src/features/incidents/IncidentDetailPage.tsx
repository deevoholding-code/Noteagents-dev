import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Incident, IncidentStatus } from '../../types';
import { incidentService } from '../../services';
import { useToast } from '../../providers/ToastProvider';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { Terminal } from '../../components/ui/Terminal';
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Activity,
  BarChart3,
  Server,
  ArrowRight,
} from 'lucide-react';

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { success } = useToast();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [activeTab, setActiveTab] = useState<'geral' | 'timeline' | 'logs' | 'metricas'>('geral');

  useEffect(() => {
    if (id) {
      incidentService.getById(id).then(setIncident);
    }
  }, [id]);

  if (!incident) {
    return (
      <div className="p-12 text-center text-slate-500">
        Carregando detalhes do incidente...
      </div>
    );
  }

  const handleUpdateStatus = async (newStatus: IncidentStatus) => {
    const updated = await incidentService.updateStatus(incident.id, newStatus);
    setIncident({ ...updated });
    success('Status do incidente atualizado', `Incidente transicionado para ${newStatus}.`);
  };

  const stages: IncidentStatus[] = ['Detectado', 'Investigando', 'Mitigando', 'Resolvido'];
  const currentStageIndex = stages.indexOf(incident.status);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Incidentes', href: '/incidents' },
          { label: incident.title },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <PriorityBadge priority={incident.severity} />
            <StatusBadge status={incident.status} />
            <span className="text-xs text-slate-500 font-mono">
              Detectado em: {incident.detectedAt}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {incident.title}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Responsável: <strong>{incident.responsible || 'Equipe de Resposta'}</strong>
          </p>
        </div>

        {/* Status transition actions */}
        <div className="flex items-center gap-2">
          {incident.status !== 'Resolvido' && (
            <>
              {incident.status === 'Investigando' && (
                <button
                  onClick={() => handleUpdateStatus('Mitigando')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  Avançar para Mitigando
                </button>
              )}
              <button
                onClick={() => handleUpdateStatus('Resolvido')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
              >
                Marcar como Resolvido
              </button>
            </>
          )}
        </div>
      </div>

      {/* Timeline Stepper */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
          Etapas do Ciclo de Resposta
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={stage}
                className={`flex flex-col p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/50'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-200 bg-slate-50/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Passo 0{idx + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <span className="text-sm font-extrabold text-slate-900">{stage}</span>
                <span className="text-[11px] text-slate-500 mt-1">
                  {isCurrent ? 'Em andamento' : isCompleted ? 'Concluído' : 'Pendente'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('geral')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'geral'
              ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Visão geral</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'timeline'
              ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Timeline de Ações</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'logs'
              ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Logs de Erro</span>
        </button>

        <button
          onClick={() => setActiveTab('metricas')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'metricas'
              ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Métricas de Impacto</span>
        </button>
      </div>

      {/* Tab 1: Geral */}
      {activeTab === 'geral' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-1">Impacto</h3>
                <p className="text-sm text-slate-800 leading-relaxed">{incident.impact}</p>
              </div>

              {incident.rootCause && (
                <div className="pt-3 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase text-slate-400 mb-1">Causa Raiz</h3>
                  <p className="text-sm text-slate-800 leading-relaxed font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {incident.rootCause}
                  </p>
                </div>
              )}

              {incident.actions && (
                <div className="pt-3 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">
                    Ações de Mitigação Recomendadas
                  </h3>
                  <ul className="space-y-2">
                    {incident.actions.map((act, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column Services */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Serviços Afetados
            </h3>
            <div className="space-y-2">
              {incident.affectedServices.map((srv) => (
                <div
                  key={srv}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <Server className="w-4 h-4 text-rose-500" />
                  <span>{srv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="space-y-4">
            {incident.timeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
                <span className="font-mono text-xs font-semibold text-slate-400 shrink-0 w-16">
                  {item.timestamp}
                </span>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-900 block mb-0.5">
                    [{item.stage}] {item.description}
                  </span>
                  {item.user && (
                    <span className="text-[11px] text-slate-500">Ação por: {item.user}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Logs */}
      {activeTab === 'logs' && (
        <Terminal
          title="Logs do Incidente"
          logs={incident.logs || ['[INFO] Nenhum registro adicional.']}
        />
      )}

      {/* Tab 4: Métricas */}
      {activeTab === 'metricas' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <span className="text-xs text-slate-400 font-semibold uppercase">Pico de Latência</span>
            <p className="text-2xl font-bold text-rose-600 mt-2">
              {incident.metrics?.latencyPeak || 'N/A'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <span className="text-xs text-slate-400 font-semibold uppercase">Taxa de Erro</span>
            <p className="text-2xl font-bold text-rose-600 mt-2">
              {incident.metrics?.errorRatePeak || 'N/A'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <span className="text-xs text-slate-400 font-semibold uppercase">Requisições Afetadas</span>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {incident.metrics?.affectedRequests || 0}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
