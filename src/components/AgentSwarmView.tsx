import React from 'react';
import { Agent } from '../types';
import { ShieldAlert, Zap, Brain, Compass, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

interface AgentSwarmViewProps {
  agents: Agent[];
  activeAgentId: string;
  onSelectAgent: (id: string) => void;
  onRunAgent: (agent: Agent) => void;
}

export const AgentSwarmView: React.FC<AgentSwarmViewProps> = ({
  agents,
  activeAgentId,
  onSelectAgent,
  onRunAgent,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Enxame Agêntico Multimodular (Swarm DAG)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Agentes especializados interconectados com capacidade de auto-correção e feedback contínuo.
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
          4 Agentes Ativos
        </span>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {agents.map((agent) => {
          const isSelected = agent.id === activeAgentId;
          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-800/80 border-cyan-500/60 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Status Indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{agent.avatar}</span>
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      agent.status === 'executing'
                        ? 'bg-emerald-400 animate-ping'
                        : agent.status === 'healing'
                        ? 'bg-amber-400 animate-ping'
                        : agent.status === 'distilling'
                        ? 'bg-purple-400 animate-pulse'
                        : 'bg-slate-500'
                    }`}
                  />
                  <span className="text-[11px] font-mono capitalize text-slate-300">
                    {agent.status}
                  </span>
                </div>
              </div>

              {/* Agent Title & Name */}
              <h3 className="font-semibold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                {agent.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1 mb-3">{agent.title}</p>

              {/* Agent Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 mb-3">
                <div>
                  <span className="text-slate-500 block">Eficiência</span>
                  <span className="text-emerald-400 font-bold">{agent.efficiency}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Sabedoria</span>
                  <span className="text-purple-400 font-bold">{agent.wisdomLevel} pts</span>
                </div>
              </div>

              {/* Quick Trigger Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRunAgent(agent);
                }}
                className="w-full py-1.5 px-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/50 text-cyan-300 text-xs font-medium flex items-center justify-center gap-1 transition-all group-hover:shadow-md"
              >
                <span>Acionar Agente</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {/* DAG Workflow Link Visualization */}
      <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 overflow-x-auto">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 font-medium">Fluxo DAG:</span>
          <span>Aethel Architect</span>
          <span className="text-slate-600">→</span>
          <span>Autonomous Executor</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-600">⇄</span>
          <span className="text-amber-400 font-medium">Sentinel Auto-Healer</span>
          <span className="text-slate-600">→</span>
          <span className="text-purple-400 font-medium">Epistemic Sage</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />
        </div>
      </div>
    </div>
  );
};
