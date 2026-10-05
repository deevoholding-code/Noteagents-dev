import React, { useState, useEffect } from 'react';
import { ErrorEvent } from '../../types';
import { observerService } from '../../services';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { CodeBlock } from '../../components/ui/CodeBlock';
import { AlertOctagon, Users, Clock, Terminal } from 'lucide-react';

export const ErrorsPage: React.FC = () => {
  const [errors, setErrors] = useState<ErrorEvent[]>([]);
  const [selectedError, setSelectedError] = useState<ErrorEvent | null>(null);

  useEffect(() => {
    observerService.getErrors().then(setErrors);
  }, []);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Observer', href: '/observer/metrics' }, { label: 'Erros' }]} />

      <PageHeader
        title="Observer — Rastreamento de Exceções"
        subtitle="Agrupamento inteligente de stack traces não tratados e taxa de usuários impactados."
      />

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs divide-y divide-slate-100 overflow-hidden">
        {errors.map((err) => (
          <div
            key={err.id}
            onClick={() => setSelectedError(err)}
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 shrink-0 mt-0.5">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 line-clamp-1">{err.error}</p>
                <p className="font-mono text-xs text-slate-500 mt-0.5">{err.message}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span className="font-semibold text-slate-700">{err.service}</span>
                  <span>•</span>
                  <span>Última vez: {err.lastSeen}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {err.affectedUsers} afetados
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="text-right">
                <span className="text-lg font-black text-rose-600 block leading-tight">
                  {err.frequency}x
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">ocorrências</span>
              </div>
              <StatusBadge status={err.status} size="sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Stack Trace Modal */}
      {selectedError && (
        <Modal
          isOpen={!!selectedError}
          onClose={() => setSelectedError(null)}
          title="Detalhes da Exceção & Stack Trace"
          maxWidth="xl"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase">Erro</h4>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedError.error}</p>
              <p className="text-xs font-mono text-slate-600 mt-0.5">{selectedError.message}</p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600 py-2 border-t border-b border-slate-100">
              <span>Serviço: <strong>{selectedError.service}</strong></span>
              <span>Frequência: <strong>{selectedError.frequency} ocorrências</strong></span>
              <span>Usuários: <strong>{selectedError.affectedUsers}</strong></span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Stack Trace</h4>
              <CodeBlock code={selectedError.stackTrace} language="plaintext" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
