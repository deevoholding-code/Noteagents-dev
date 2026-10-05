import React from 'react';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', dot = true }) => {
  const getStyle = (s: string) => {
    const normalized = s.toLowerCase().trim();

    if (['online', 'operacional', 'conectado', 'sincronizado', 'sucesso', 'concluída', 'concluído', 'aprovada', 'aprovado', 'merged'].includes(normalized)) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    }

    if (['executando', 'processando', 'em andamento', 'building', 'em execução'].includes(normalized)) {
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500 animate-pulse',
      };
    }

    if (['aberta', 'aberto', 'investigando', 'identificado', 'em revisão', 'finalizando', 'alerta', 'mitigando'].includes(normalized)) {
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      };
    }

    if (['falhou', 'falha', 'erro', 'crítica', 'crítico', 'cancelado'].includes(normalized)) {
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
      };
    }

    if (['ocioso', 'fechada', 'fechado', 'arquivado'].includes(normalized)) {
      return {
        bg: 'bg-slate-100 text-slate-600 border-slate-200',
        dot: 'bg-slate-400',
      };
    }

    // Default neutral
    return {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-500',
    };
  };

  const style = getStyle(status);
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style.bg} ${sizeClass} transition-colors`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
      <span>{status}</span>
    </span>
  );
};
