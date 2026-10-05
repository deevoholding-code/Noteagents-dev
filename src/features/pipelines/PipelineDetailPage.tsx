import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pipeline, PipelineStage } from '../../types';
import { pipelineService } from '../../services';
import { useToast } from '../../providers/ToastProvider';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Terminal } from '../../components/ui/Terminal';
import {
  Workflow,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RotateCw,
  GitBranch,
  GitCommit,
  FolderGit2,
} from 'lucide-react';

export const PipelineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { success } = useToast();

  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [selectedStage, setSelectedStage] = useState<string>('stg-2'); // default to Build

  useEffect(() => {
    if (id) {
      pipelineService.getById(id).then((p) => {
        setPipeline(p);
        if (p?.stages && p.stages.length > 0) {
          setSelectedStage(p.stages[0].id);
        }
      });
    }
  }, [id]);

  if (!pipeline) {
    return (
      <div className="p-12 text-center text-slate-500">
        Carregando detalhes do pipeline...
      </div>
    );
  }

  const handleReRun = async () => {
    const updated = await pipelineService.reRun(pipeline.id);
    setPipeline({ ...updated });
    success('Execução iniciada', `O pipeline #${pipeline.id} foi reenfileirado.`);
  };

  const activeStageObj = pipeline.stages.find((s) => s.id === selectedStage) || pipeline.stages[0];

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Pipelines', href: '/pipelines' },
          { label: pipeline.title },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge status={pipeline.status} />
            <span className="font-mono text-xs text-slate-500 flex items-center gap-1">
              <FolderGit2 className="w-3.5 h-3.5 text-blue-500" />
              {pipeline.repository}
            </span>
            <span className="font-mono text-xs text-slate-500 flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5 text-slate-400" />
              {pipeline.branch}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {pipeline.title}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Commit <strong>{pipeline.commit}</strong>: &quot;{pipeline.commitMessage}&quot; • Duração total: {pipeline.duration}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReRun}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            <span>Reexecutar pipeline</span>
          </button>
        </div>
      </div>

      {/* Stages Stepper */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Etapas do Pipeline (Selecione para ver logs)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {pipeline.stages.map((stage) => {
            const isSelected = stage.id === activeStageObj?.id;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`flex flex-col p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">{stage.name}</span>
                  {stage.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : stage.status === 'failed' ? (
                    <XCircle className="w-4 h-4 text-rose-500" />
                  ) : stage.status === 'running' ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-300" />
                  )}
                </div>

                <span className="text-xs font-mono text-slate-500 font-semibold">
                  {stage.duration}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 capitalize font-medium">
                  {stage.status === 'success' ? 'Sucesso' : stage.status === 'failed' ? 'Falhou' : 'Pendente'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Terminal View for the selected stage */}
      {activeStageObj && (
        <Terminal
          title={`Logs da Etapa: ${activeStageObj.name} (${activeStageObj.duration})`}
          logs={activeStageObj.logs}
        />
      )}
    </div>
  );
};
