import React, { useState, useEffect } from 'react';
import { Audit } from '../../types';
import { auditService } from '../../services';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Cpu,
  Eye,
  FileCheck,
} from 'lucide-react';

export const AuditsPage: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([]);

  useEffect(() => {
    auditService.list().then(setAudits);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Auditorias do Sistema' }]} />

      <PageHeader
        title="Auditorias de Engenharia & Evidências"
        subtitle="Relatórios consolidados de segurança, arquitetura, performance, qualidade de código e acessibilidade."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {audits.map((audit) => (
          <div
            key={audit.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{audit.name}</h3>
                  <span className="text-xs text-slate-400 font-medium">
                    Responsável: {audit.responsible}
                  </span>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-xl font-black ${getScoreColor(
                    audit.score
                  )}`}
                >
                  {audit.score}
                </div>
              </div>

              {/* Status and Issues Count */}
              <div className="flex items-center justify-between py-2 border-t border-b border-slate-100 text-xs mb-4">
                <StatusBadge status={audit.status} />

                <div className="flex items-center gap-3 font-mono font-semibold">
                  <span className="text-rose-600">{audit.issuesCount.critical} críticas</span>
                  <span className="text-amber-600">{audit.issuesCount.warning} avisos</span>
                  <span className="text-blue-600">{audit.issuesCount.info} info</span>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2 mb-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Principais Recomendações
                </h4>
                <ul className="space-y-1.5">
                  {audit.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                      <span className="leading-snug">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {audit.date}
              </span>
              <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
                Ver relatório completo →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
