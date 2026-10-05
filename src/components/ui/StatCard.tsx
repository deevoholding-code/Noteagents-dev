import React from 'react';

export interface StatCardProps {
  icon: React.ReactNode;
  iconBgColor?: string;
  title: string;
  value: string | number;
  subValue?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    color?: 'green' | 'red' | 'blue' | 'amber';
  };
  badge?: {
    text: string;
    type?: 'success' | 'info' | 'warning' | 'error';
  };
  subtitle: string;
  subtitleColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconBgColor = 'bg-blue-50 text-blue-600',
  title,
  value,
  subValue,
  trend,
  badge,
  subtitle,
  subtitleColor = 'text-slate-500',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md ${
        onClick ? 'cursor-pointer hover:border-blue-300' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBgColor}`}>
            {icon}
          </div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {subValue && <span className="text-sm font-medium text-slate-500">{subValue}</span>}

        {trend && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
              trend.color === 'red'
                ? 'bg-rose-50 text-rose-600'
                : trend.color === 'green'
                ? 'bg-emerald-50 text-emerald-600'
                : trend.color === 'blue'
                ? 'bg-blue-50 text-blue-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            {trend.value}
          </span>
        )}

        {badge && (
          <span className="ml-auto inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            {badge.text}
          </span>
        )}
      </div>

      <p className={`mt-2 text-xs font-medium ${subtitleColor}`}>{subtitle}</p>
    </div>
  );
};
