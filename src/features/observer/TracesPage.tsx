import React, { useState, useEffect } from 'react';
import { Trace } from '../../types';
import { observerService } from '../../services';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Layers, Clock } from 'lucide-react';

export const TracesPage: React.FC = () => {
  const [traces, setTraces] = useState<Trace[]>([]);

  useEffect(() => {
    observerService.getTraces().then(setTraces);
  }, []);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Observer', href: '/observer/metrics' }, { label: 'Traces' }]} />

      <PageHeader
        title="Observer — Distributed Tracing"
        subtitle="Visualização tipo waterfall da execução de requisições através dos múltiplos microserviços e agentes."
      />

      <div className="space-y-6">
        {traces.map((trc) => (
          <div key={trc.id} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-blue-600 font-bold">{trc.traceId}</span>
                  <StatusBadge status={trc.status} size="sm" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{trc.name}</h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                <span>Duração total: <strong>{trc.duration} ms</strong></span>
                <span>{trc.timestamp}</span>
              </div>
            </div>

            {/* Waterfall spans */}
            <div className="space-y-2.5">
              {trc.spans.map((span) => {
                const totalDur = trc.duration;
                const offsetPercent = (span.offsetMs / totalDur) * 100;
                const widthPercent = Math.max((span.durationMs / totalDur) * 100, 4);

                return (
                  <div key={span.id} className="flex items-center gap-4 text-xs">
                    <div className="w-40 sm:w-56 shrink-0 truncate">
                      <span className="font-semibold text-slate-800">{span.name}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {span.service}
                      </span>
                    </div>

                    {/* Bar visualization */}
                    <div className="flex-1 bg-slate-100 h-6 rounded-lg relative overflow-hidden">
                      <div
                        className={`absolute top-0 bottom-0 rounded-lg flex items-center px-2 text-[10px] font-mono font-bold text-white transition-all ${
                          span.status === 'error' ? 'bg-rose-500' : 'bg-blue-600'
                        }`}
                        style={{
                          left: `${offsetPercent}%`,
                          width: `${widthPercent}%`,
                        }}
                      >
                        <span className="truncate">{span.durationMs}ms</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
