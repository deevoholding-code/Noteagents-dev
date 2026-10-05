import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { mockContributions, generateHeatmapData } from '../../mocks/contributions';
import { currentUser } from '../../mocks/users';
import { GitCommit, GitPullRequest, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';

export const ContributionsPage: React.FC = () => {
  const heatmapWeeks = useMemo(() => generateHeatmapData(), []);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-slate-100';
      case 1: return 'bg-emerald-200';
      case 2: return 'bg-emerald-300';
      case 3: return 'bg-emerald-500';
      case 4: return 'bg-emerald-700';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Minhas Contribuições' }]} />

      <PageHeader
        title="Minhas Contribuições Open Source"
        subtitle="Acompanhe seu impacto no ecossistema NoteAgents através de commits, revisões de código e abertura de issues."
      />

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Total de contribuições</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {currentUser.stats?.contributions || 24}
          </p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            No último ano
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Pull Requests</span>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">
            {currentUser.stats?.pullRequests || 12}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">100% aprovados</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Issues resolvidas</span>
          <p className="text-3xl font-extrabold text-purple-600 mt-2">
            {currentUser.stats?.issues || 18}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Triage e mitigação</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Code Reviews</span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">
            {currentUser.stats?.reviews || 6}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Revisões minuciosas</span>
        </div>
      </div>

      {/* GitHub-style Contribution Heatmap */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Matriz de Atividade (365 dias)</span>
          </h3>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>Menos</span>
            <div className="w-2.5 h-2.5 rounded-xs bg-slate-100" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-200" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-300" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-700" />
            <span>Mais</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-[700px]">
            {heatmapWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    title={`${day.date}: ${day.count} contribuições`}
                    className={`w-3 h-3 rounded-xs ${getLevelColor(day.level)} hover:ring-2 hover:ring-slate-400 cursor-pointer transition-all`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Contributions Activity Stream */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Atividades Recentes</h3>
        <div className="divide-y divide-slate-100">
          {mockContributions.map((c) => (
            <div key={c.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img src={c.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                <div>
                  <p className="text-slate-800">
                    <strong className="text-slate-900">{c.user}</strong> {c.title}:{' '}
                    <span className="font-mono text-blue-600 font-semibold">{c.reference}</span>
                  </p>
                </div>
              </div>
              <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap">{c.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
