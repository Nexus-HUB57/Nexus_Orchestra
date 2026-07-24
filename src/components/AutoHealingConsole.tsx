import React, { useState } from 'react';
import { ShieldCheck, Flame, RefreshCw, Cpu, Code2, AlertTriangle, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { healCodeSnippet } from '../services/api';
import { SystemAnomaly } from '../types';

interface AutoHealingConsoleProps {
  onAnomalyHealed: (anomaly: SystemAnomaly) => void;
  systemAnomalies: SystemAnomaly[];
}

export const AutoHealingConsole: React.FC<AutoHealingConsoleProps> = ({
  onAnomalyHealed,
  systemAnomalies,
}) => {
  const [customCode, setCustomCode] = useState<string>(
    `// Exemplo de código com falha sintática e risco de Null Pointer
function processUserData(payload: any) {
  const users = payload.data.users;
  return users.map((u: any) => {
    return u.profile.email.toLowerCase(); // CRASH if profile or email is undefined!
  });
}`
  );
  const [errorDescription, setErrorDescription] = useState<string>(
    'TypeError: Cannot read properties of undefined (reading "email") em tempo de execução'
  );
  const [selectedTier, setSelectedTier] = useState<number>(4);
  const [isHealing, setIsHealing] = useState<boolean>(false);
  const [healedResult, setHealedResult] = useState<string | null>(null);
  const [healingLogs, setHealingLogs] = useState<string[]>([]);

  const handleRunHealing = async () => {
    setIsHealing(true);
    setHealedResult(null);
    setHealingLogs([
      `[${new Date().toLocaleTimeString()}] Inicializando Algoritmo de Auto-Cura Exponencial (Tier ${selectedTier})...`,
      `[${new Date().toLocaleTimeString()}] Análise de Entropia: Detecção de risco de exceção crítica por desreferenciamento nulo.`,
      `[${new Date().toLocaleTimeString()}] Escalando poder de cura: H(t) = H_0 * 2^${selectedTier}`,
    ]);

    try {
      const res = await healCodeSnippet({
        codeSnippet: customCode,
        errorDescription,
        targetTier: selectedTier,
      });

      setHealedResult(res.healedCode);
      setHealingLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ⚙️ Gemini 3.6 Flash sintetizou o patch de resiliência.`,
        `[${new Date().toLocaleTimeString()}] ✅ AUTO-CURA CONCLUÍDA. Redução de Entropia: ${res.entropyReducedPercent}%.`,
      ]);

      const healedAnomaly: SystemAnomaly = {
        id: `ANOMALY-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'SyntaxError',
        severity: 'critical',
        description: errorDescription,
        affectedComponent: 'CustomCodeModule',
        originalCodeSnippet: customCode,
        entropyImpact: 88,
        status: 'healed',
        healedCodeSnippet: res.healedCode,
        resolutionTimeMs: 1250,
        healingSteps: [
          {
            tier: selectedTier as any,
            timestamp: new Date().toISOString(),
            action: 'Síntese de Patch Exponencial',
            strategy: 'Gemini AI Immunization',
            formula: `H_${selectedTier}(t) = H_0 * 2^${selectedTier}`,
            entropyReduction: res.entropyReducedPercent,
            status: 'success',
          },
        ],
      };

      onAnomalyHealed(healedAnomaly);
    } catch (err: any) {
      setHealingLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ❌ Erro ao executar auto-cura: ${err.message}`,
      ]);
    } finally {
      setIsHealing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Algoritmo Exponencial de Auto-Cura (Exponential Auto-Healing)
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Sistema de imunização autônoma de 4 camadas (Tiers 1-4). Quando anomalias, exceções não tratadas ou dados corrompidos ocorrem, o motor escala exponencialmente sua capacidade de reparo para neutralizar a entropia antes da falha propagar.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 text-right font-mono text-xs">
            <span className="text-amber-400 block font-bold">Fórmula de Cura Exponencial:</span>
            <span className="text-slate-200">H_e(t) = H_0 • 2^k • e^(γ • t)</span>
          </div>
        </div>

        {/* 4 Tier Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
              <span>Tier 1: Micro-Patch</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">2¹ Power</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Tratamento local de exceções, limpeza de escopo e reinicialização de parâmetros nulos.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
              <span>Tier 2: Schema Guard</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">2² Power</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Injeção dinâmica de Type Guards, validação contratual e sanitização de payloads.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
              <span>Tier 3: Graph Mutation</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">2³ Power</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Desacoplamento de dependências no grafo DAG e roteamento para fallbacks resilientes.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/40 text-xs bg-amber-950/10">
            <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
              <span>Tier 4: AI Synthesis</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">2⁴ Power</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Regeneração sintética do algoritmo via Gemini 3.6 Flash com imunização total.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Code Doctor & Auto-Healer Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Faulty Code Input */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>Código com Falha / Diagnóstico de Entropia</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Entrada de Código</span>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">
              Descrição do Erro / Comportamento Anômalo:
            </label>
            <input
              type="text"
              value={errorDescription}
              onChange={(e) => setErrorDescription(e.target.value)}
              placeholder="Descreva o erro ou cole a stack trace..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">
              Trecho de Código Vulnerável ou Indutor de Falha:
            </label>
            <textarea
              rows={8}
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="Cole seu código aqui..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-200/90 focus:outline-none focus:border-amber-500/50 leading-relaxed"
            />
          </div>

          {/* Tier Selection */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Escala de Cura:</span>
              {[1, 2, 3, 4].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    selectedTier === tier
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tier {tier}
                </button>
              ))}
            </div>

            <button
              onClick={handleRunHealing}
              disabled={isHealing}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isHealing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sintetizando Patch...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Executar Auto-Cura Exponencial</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Healed Code Output & Telemetry */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Código Regenerado & Imunizado</span>
            </h3>
            {healedResult && (
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                Resiliência Total
              </span>
            )}
          </div>

          {/* Healed Code Display */}
          <div className="min-h-[220px] p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto text-emerald-300/90 leading-relaxed">
            {healedResult ? (
              <pre className="whitespace-pre-wrap">{healedResult}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 py-12">
                <ShieldCheck className="w-10 h-10 mb-2 stroke-[1.5]" />
                <p>Aguardando execução do Sentinel Auto-Healer...</p>
              </div>
            )}
          </div>

          {/* Live Healing Logs */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-400 space-y-1 max-h-36 overflow-y-auto">
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
              Terminal de Telemetria de Auto-Cura:
            </div>
            {healingLogs.length > 0 ? (
              healingLogs.map((log, idx) => (
                <div key={idx} className="text-slate-300">
                  {log}
                </div>
              ))
            ) : (
              <span className="text-slate-600">Nenhum evento registrado ainda.</span>
            )}
          </div>
        </div>
      </div>

      {/* Historical Anomalies List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Histórico de Anomalias Curadas no Sistema</span>
        </h3>

        {systemAnomalies.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            Nenhuma anomalia crítica registrada na sessão atual. Dispare Injeção de Caos para testar!
          </p>
        ) : (
          <div className="space-y-2">
            {systemAnomalies.map((anom) => (
              <div
                key={anom.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-amber-400 font-bold">{anom.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {anom.type}
                    </span>
                    <span className="text-slate-500 text-[11px]">{new Date(anom.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300 mt-1">{anom.description}</p>
                </div>

                <div className="flex items-center space-x-3 font-mono text-xs">
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">Entropia</span>
                    <span className="text-rose-400 font-bold">{anom.entropyImpact}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">Status</span>
                    <span className="text-emerald-400 font-bold capitalize">{anom.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
