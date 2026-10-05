import React from 'react';
import { ArrowUp, ArrowDown, AlertOctagon, Minus } from 'lucide-react';
import { TaskPriority, IssuePriority } from '../../types';

export interface PriorityBadgeProps {
  priority: TaskPriority | IssuePriority | string;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const normalized = priority.toLowerCase();

  let color = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = Minus;

  if (normalized === 'crítica') {
    color = 'bg-rose-50 text-rose-700 border-rose-200';
    Icon = AlertOctagon;
  } else if (normalized === 'alta') {
    color = 'bg-rose-50 text-rose-600 border-rose-200';
    Icon = ArrowUp;
  } else if (normalized === 'média') {
    color = 'bg-amber-50 text-amber-700 border-amber-200';
    Icon = Minus;
  } else if (normalized === 'fácil' || normalized === 'baixa') {
    color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    Icon = ArrowDown;
  } else if (normalized === 'difícil') {
    color = 'bg-rose-50 text-rose-700 border-rose-200';
    Icon = AlertOctagon;
  }

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full border ${color} ${sizeClass}`}>
      <Icon className="w-3 h-3 shrink-0" />
      <span>{priority}</span>
    </span>
  );
};

export const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const norm = type.toLowerCase();
  let color = 'bg-blue-50 text-blue-700 border-blue-200';

  if (norm === 'bug') {
    color = 'bg-purple-50 text-purple-700 border-purple-200';
  } else if (norm === 'feature') {
    color = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (norm === 'docs') {
    color = 'bg-sky-50 text-sky-700 border-sky-200';
  } else if (norm === 'testes') {
    color = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      • {type}
    </span>
  );
};
