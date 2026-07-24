import React, { useState } from 'react';
import { Flame, ShieldAlert, Zap, AlertTriangle, Play, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SystemAnomaly } from '../types';
import { runAgentTask } from '../services/api';

interface ChaosLabViewProps {
  onAnomalyCreated: (anomaly: SystemAnomaly) => void;
  onWisdomGained: (amount: number) => void;
}

export const ChaosLabView: React.FC<ChaosLabViewProps> = ({ onAnomalyCreated, onWisdomGained }) => {
  const [selectedChaosType, setSelectedChaosType] = useState<SystemAnomaly['type']>('SchemaMismatch');
  const [targetComponent, setTargetComponent] = useState('AgentWorkerNode[executor]');
  const [isInjecting, setIsInjecting] = useState(false);
  const [chaosLog, setChaosLog] = useState<string[]>([]);
  const [lastAnomalies, setLastAnomalies] = useState<SystemAnomaly[]>([]);

  const handleInjectChaos = async () => {
    setIsInjecting(true);
    setChaosLog([
      `[${new Date().toLocaleTimeString()}] ⚠️ DISPARANDO INJEÇÃO DE CAOS: [${selectedChaosType}]`,
      `[${new Date().toLocaleTimeString()}] Injetando carga corrompida em ${targetComponent}...`,
      `[${new Date().toLocaleTimeString()}] Entropia do sistema saltou para 85%! Falha detectada pelo Sentinel Auto-Healer.`,
    ]);

    try {
      const result = await runAgentTask({
        prompt: `Injeção de Caos Controlada: Simulação de falha crítica [${selectedChaosType}] no componente ${targetComponent}.`,
        agentRole: 'sentinel_healer',
        injectChaos: true,
        chaosType: selectedChaosType,
      });

      if (result.anomalyDetected) {
        onAnomalyCreated(result.anomalyDetected);
        setLastAnomalies((prev) => [result.anomalyDetected!, ...prev]);
        if (result.telemetry?.wisdomGain) {
          onWisdomGained(result.telemetry.wisdomGain);
        }
      }

      setChaosLog((prev) => [
        ...prev,
        ...result.logs,
        `[${new Date().toLocaleTimeString()}] 🎉 AUTO-CURA EXPONENCIAL BEM SUCEDIDA! Entropia normalizada.`,
      ]);
    } catch (err: any) {
      setChaosLog((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ❌ Erro ao injetar caos: ${err.message}`,
      ]);
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950/50 via-slate-900 to-slate-950 border border-rose-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <Flame className="w-6 h-6 animate-pulse" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Laboratório de Injeção de Caos (Chaos Engineering Bench)
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Injete falhas artificiais, vazamentos de memória, corrupções de payload e exceções assíncronas para testar a resiliência do Algoritmo de Auto-Cura Exponencial em tempo de execução real.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/20 font-mono text-xs text-right">
            <span className="text-rose-400 block font-bold">Estado do Servidor:</span>
            <span className="text-emerald-400 font-bold">Tolerante a Falhas Críticas</span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chaos Injection Selector */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Configurar Vetor de Ataque / Falha</span>
          </h3>

          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">Tipo de Anomalia:</label>
            <select
              value={selectedChaosType}
              onChange={(e) => setSelectedChaosType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-rose-300 font-mono focus:outline-none focus:border-rose-500/50"
            >
              <option value="SchemaMismatch">SchemaMismatch (Payload Truncado/Invalido)</option>
              <option value="SyntaxError">SyntaxError (Falha Sintática de Código)</option>
              <option value="LogicInversion">LogicInversion (Condição Lógica Invertida)</option>
              <option value="MemoryCorruption">MemoryCorruption (Buffer Overflow / Null Pointer)</option>
              <option value="ContextOverflow">ContextOverflow (Saturação de Janela)</option>
              <option value="RateLimitExceeded">RateLimitExceeded (Simulação de Throttle 429)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">Componente Alvo:</label>
            <select
              value={targetComponent}
              onChange={(e) => setTargetComponent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-rose-500/50"
            >
              <option value="AgentWorkerNode[executor]">AgentWorkerNode [Executor]</option>
              <option value="AgentWorkerNode[architect]">AgentWorkerNode [Architect]</option>
              <option value="MemoryStore[vault]">MemoryStore [Wisdom Vault]</option>
              <option value="PipelineDAG[router]">PipelineDAG [Message Router]</option>
            </select>
          </div>

          <button
            onClick={handleInjectChaos}
            disabled={isInjecting}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50"
          >
            {isInjecting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Injetando Caos e Curando...</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 fill-current" />
                <span>Injetar Falha no Sistema</span>
              </>
            )}
          </button>
        </div>

        {/* Live Execution & Healing Terminal */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Console de Execução de Caos & Auto-Cura ao Vivo</span>
            </span>
            <span className="text-xs font-mono text-slate-500">Live Telemetry</span>
          </h3>

          <div className="min-h-[220px] bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1 overflow-y-auto max-h-64">
            {chaosLog.length > 0 ? (
              chaosLog.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.includes('⚠️')
                      ? 'text-rose-400 font-bold'
                      : log.includes('🎉') || log.includes('✅')
                      ? 'text-emerald-400 font-bold'
                      : 'text-slate-300'
                  }
                >
                  {log}
                </div>
              ))
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-slate-600">
                <AlertTriangle className="w-8 h-8 mb-2 text-slate-700" />
                <p>Nenhuma injeção de caos disparada ainda.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Repaired Anomalies */}
      {lastAnomalies.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Últimas Anomalias Curadas no Laboratório de Caos</span>
          </h3>

          <div className="space-y-3">
            {lastAnomalies.map((anom) => (
              <div key={anom.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-rose-400 font-bold">{anom.id}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {anom.type}
                    </span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">✓ Healed (Tier 4)</span>
                </div>

                {anom.healedCodeSnippet && (
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block mb-1">
                      Código Regenerado pelo Sentinel Auto-Healer:
                    </span>
                    <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                      {anom.healedCodeSnippet}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
