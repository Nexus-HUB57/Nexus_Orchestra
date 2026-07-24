import React, { useState } from 'react';
import { PRESET_MISSIONS } from '../data/presetScenarios';
import { Agent, AgentRole, PresetMission, SystemAnomaly } from '../types';
import { runAgentTask } from '../services/api';
import { Send, Play, Sparkles, RefreshCw, AlertTriangle, Code2, ShieldAlert, CheckCircle2, Copy, Check } from 'lucide-react';

interface MissionControlProps {
  agents: Agent[];
  activeAgentId: string;
  onAgentStatusChange: (agentId: string, status: Agent['status']) => void;
  onAnomalyCreated: (anomaly: SystemAnomaly) => void;
  onWisdomGained: (amount: number) => void;
  onLogAdd: (log: string) => void;
  chaosModeEnabled: boolean;
}

export const MissionControl: React.FC<MissionControlProps> = ({
  agents,
  activeAgentId,
  onAgentStatusChange,
  onAnomalyCreated,
  onWisdomGained,
  onLogAdd,
  chaosModeEnabled,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [selectedAgentRole, setSelectedAgentRole] = useState<AgentRole>('architect');
  const [isRunning, setIsRunning] = useState(false);
  const [currentOutput, setCurrentOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeAgent = agents.find((a) => a.id === activeAgentId) || agents[0];

  const handleExecuteMission = async (customPrompt?: string, forceChaos?: boolean) => {
    const finalPrompt = customPrompt || promptInput;
    if (!finalPrompt.trim()) return;

    setIsRunning(true);
    setCurrentOutput(null);
    onAgentStatusChange(activeAgent.id, 'executing');
    onLogAdd(`[${new Date().toLocaleTimeString()}] Disparando missão para ${activeAgent.name}...`);

    try {
      const response = await runAgentTask({
        prompt: finalPrompt,
        agentRole: selectedAgentRole,
        injectChaos: forceChaos ?? chaosModeEnabled,
      });

      setCurrentOutput(response.output);

      if (response.anomalyDetected) {
        onAnomalyCreated(response.anomalyDetected);
        onAgentStatusChange(activeAgent.id, 'healing');
        onLogAdd(`[${new Date().toLocaleTimeString()}] ⚠️ Anomalia detectada e curada pelo Sentinel Auto-Healer.`);
      }

      if (response.telemetry?.wisdomGain) {
        onWisdomGained(response.telemetry.wisdomGain);
      }

      response.logs.forEach((log) => onLogAdd(log));
      onAgentStatusChange(activeAgent.id, 'idle');
    } catch (err: any) {
      setCurrentOutput(`❌ Erro na execução da missão: ${err.message}`);
      onAgentStatusChange(activeAgent.id, 'error');
      onLogAdd(`[${new Date().toLocaleTimeString()}] ❌ Falha na comunicação com o servidor: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyOutput = () => {
    if (!currentOutput) return;
    navigator.clipboard.writeText(currentOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Preset Scenarios Gallery */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Missões Pré-Configuradas de IA Agêntica</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">Preset Scenarios</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_MISSIONS.map((mission) => (
            <div
              key={mission.id}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {mission.category}
                  </span>
                  {mission.injectChaos && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50">
                      Chaos Test
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {mission.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {mission.description}
                </p>
              </div>

              <button
                onClick={() => {
                  setPromptInput(mission.prompt);
                  handleExecuteMission(mission.prompt, mission.injectChaos);
                }}
                disabled={isRunning}
                className="w-full py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-700 text-cyan-300 text-xs font-medium flex items-center justify-center gap-1 transition-all disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Lançar Missão</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Interactive Prompt Console */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Terminal de Comando do Agente</span>
          </h3>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Atribuir ao Agente:</span>
            <select
              value={selectedAgentRole}
              onChange={(e) => setSelectedAgentRole(e.target.value as AgentRole)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500/50"
            >
              <option value="architect">Aethel Architect</option>
              <option value="executor">Autonomous Executor</option>
              <option value="sentinel_healer">Sentinel Auto-Healer</option>
              <option value="epistemic_sage">Epistemic Sage</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <textarea
            rows={4}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Digite a diretiva técnica para os agentes autônomos (ex: Implementar um worker resiliente com reconexão automática e auto-cura)..."
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-2 font-mono">
              <span>Status: {isRunning ? 'Processando raciocínio...' : 'Pronto'}</span>
              {chaosModeEnabled && (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  [Modo Caos Ativo]
                </span>
              )}
            </div>

            <button
              onClick={() => handleExecuteMission()}
              disabled={isRunning || !promptInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Disparar Agente</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Execution Output Display */}
      {currentOutput && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Resultado da Execução Agêntica</span>
            </span>

            <button
              onClick={handleCopyOutput}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-sans text-xs text-slate-200 leading-relaxed overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap">
            {currentOutput}
          </div>
        </div>
      )}
    </div>
  );
};
