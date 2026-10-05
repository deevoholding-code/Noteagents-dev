import React, { useState } from 'react';
import { Terminal as TerminalIcon, Copy, Check } from 'lucide-react';

export const Terminal: React.FC<{ logs: string[]; title?: string }> = ({
  logs,
  title = 'Console Output',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0B0F19] text-slate-200 overflow-hidden shadow-lg font-mono text-xs my-4">
      <div className="flex items-center justify-between px-4 py-3 bg-[#111827] border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-400">
          <TerminalIcon className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-slate-300">{title}</span>
          <span className="text-[11px] text-slate-500">({logs.length} linhas)</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar logs'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto space-y-1 select-text">
        {logs.map((log, index) => {
          let color = 'text-slate-300';
          if (log.includes('[ERROR]') || log.includes('error') || log.includes('failed') || log.includes('FATAL')) {
            color = 'text-rose-400 font-semibold';
          } else if (log.includes('[WARN]') || log.includes('warning')) {
            color = 'text-amber-400';
          } else if (log.includes('PASS') || log.includes('success') || log.includes('status 0')) {
            color = 'text-emerald-400';
          } else if (log.includes('Running:') || log.includes('Deploying')) {
            color = 'text-cyan-400 font-medium';
          }

          return (
            <div key={index} className={`leading-relaxed ${color} flex items-start gap-2`}>
              <span className="text-slate-600 select-none text-[10px] w-6 shrink-0">{index + 1}</span>
              <span className="whitespace-pre-wrap break-all">{log}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
