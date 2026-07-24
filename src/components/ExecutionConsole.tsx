import React from 'react';
import { Terminal, Trash2 } from 'lucide-react';

interface ExecutionConsoleProps {
  logs: string[];
  onClearLogs: () => void;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({ logs, onClearLogs }) => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 font-mono text-xs shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">Terminal Agêntico de Telemetria ao Vivo</span>
        </div>
        <button
          onClick={onClearLogs}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded"
          title="Limpar logs"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1 py-1 text-slate-300">
        {logs.length === 0 ? (
          <span className="text-slate-600">Nenhum evento registrado no terminal.</span>
        ) : (
          logs.map((log, i) => (
            <div
              key={i}
              className={
                log.includes('⚠️')
                  ? 'text-amber-400'
                  : log.includes('❌')
                  ? 'text-rose-400'
                  : log.includes('✅') || log.includes('🎉')
                  ? 'text-emerald-400'
                  : 'text-slate-300'
              }
            >
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
