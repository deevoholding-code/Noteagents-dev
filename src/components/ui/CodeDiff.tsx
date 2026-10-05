import React from 'react';
import { PRFileDiff } from '../../types';
import { FileCode, ChevronDown } from 'lucide-react';

export const CodeDiff: React.FC<{ fileDiff: PRFileDiff }> = ({ fileDiff }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden my-4 text-xs font-mono shadow-xs">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <FileCode className="w-4 h-4 text-slate-500" />
          <span>{fileDiff.filename}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-600 font-semibold">+{fileDiff.additions}</span>
          <span className="text-rose-600 font-semibold">-{fileDiff.deletions}</span>
          <button className="text-slate-400 hover:text-slate-600" aria-label="Toggle diff">
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100/50 bg-[#F8FAFC]">
        {fileDiff.patch.map((line, idx) => {
          const isAdd = line.type === 'add';
          const isDel = line.type === 'del';

          return (
            <div
              key={idx}
              className={`flex items-start px-4 py-1 leading-5 ${
                isAdd
                  ? 'bg-emerald-50/70 text-emerald-900 border-l-2 border-emerald-500'
                  : isDel
                  ? 'bg-rose-50/70 text-rose-900 border-l-2 border-rose-500'
                  : 'text-slate-700'
              }`}
            >
              <span className="w-8 shrink-0 text-slate-400 select-none text-[11px]">{idx + 1}</span>
              <span className="w-5 shrink-0 select-none font-bold text-center">
                {isAdd ? '+' : isDel ? '-' : ' '}
              </span>
              <pre className="font-mono text-xs whitespace-pre-wrap break-all flex-1">{line.content}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
