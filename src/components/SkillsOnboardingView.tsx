import React, { useState } from 'react';
import { Agent, AgentSkill, WisdomAxiom } from '../types';
import { executeSkillsFusion } from '../services/api';
import { Sparkles, Cpu, Layers, ShieldCheck, Zap, RefreshCw, CheckCircle2, FileCode, Wrench, Binary, Share2, Compass, ArrowUpRight, Search, Check } from 'lucide-react';

interface Props {
  agents: Agent[];
  skills: AgentSkill[];
  onAddAxiom?: (axiom: WisdomAxiom) => void;
  onLogAdd?: (log: string) => void;
}

export const SkillsOnboardingView: React.FC<Props> = ({ agents, skills, onAddAxiom, onLogAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFusing, setIsFusing] = useState<boolean>(false);
  const [fusionLogs, setFusionLogs] = useState<string[]>([]);
  const [fusionSummary, setFusionSummary] = useState<any | null>(null);

  const categories = ['ALL', 'AI & Cognition', 'Database & Storage', 'Identity & Auth', 'Location & Maps', 'Integrations & Workspace', 'Realtime & UI', 'Migration & Codebase'];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = selectedCategory === 'ALL' || skill.category === selectedCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.toolsProvided.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleRunFusion = async () => {
    setIsFusing(true);
    try {
      const res = await executeSkillsFusion();
      setFusionSummary(res.fusionResult);
      if (res.fusionResult?.logs) {
        setFusionLogs(res.fusionResult.logs);
      }

      if (res.newAxioms && Array.isArray(res.newAxioms) && onAddAxiom) {
        res.newAxioms.forEach((ax: WisdomAxiom) => onAddAxiom(ax));
      }

      if (onLogAdd) {
        onLogAdd(`[${new Date().toLocaleTimeString()}] 🧬 Varredura cirúrgica e fusão de 15 skills sincronizadas com os Agentes Fidedignos.`);
      }
    } catch (err: any) {
      setFusionLogs((prev) => [`[Erro de Fusão] ${err.message}`, ...prev]);
    } finally {
      setIsFusing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Center */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-teal-400 font-mono text-xs mb-1">
              <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
              <span>SKILLS ORGANISM & ONBOARDING MATRIX</span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Varredura Cirúrgica & Fusão de Skills de Última Onda</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800/80">
                15/15 System Skills Active
              </span>
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl mt-1 leading-relaxed">
              Povoamento autônomo do ecossistema integrando competências de Inteligência GenAI, SQL Relacional, Firestore NoSQL,
              Google Maps, OAuth2, Workspace, WebSockets e Reescrita de Código no DNA dos Agentes Aethel.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRunFusion}
              disabled={isFusing}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2.5 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50"
            >
              {isFusing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sincronizando & Fundindo Skills...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Executar Fusão Cirúrgica de Skills</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 text-[10px] block mb-1">Skills Mapeadas</span>
            <span className="text-base font-bold text-teal-400">{skills.length} / 15 Skills</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 text-[10px] block mb-1">Agentes Equipados</span>
            <span className="text-base font-bold text-emerald-400">{agents.length} Agentes</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 text-[10px] block mb-1">Ferramentas de Sistema</span>
            <span className="text-base font-bold text-cyan-400">38 Tools Prontas</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 text-[10px] block mb-1">Algoritmos Integrados</span>
            <span className="text-base font-bold text-purple-400">28 Algoritmos</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 text-[10px] block mb-1">Sinergia do Organismo</span>
            <span className="text-base font-bold text-amber-400">100% Assertividade</span>
          </div>
        </div>

        {/* Live Fusion Telemetry Output */}
        {fusionLogs.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/30 space-y-2 font-mono text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-teal-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Telemetria do Processo de Fusão Cirúrgica</span>
              </span>
              <span className="text-slate-400 text-[11px]">{fusionLogs.length} eventos registrados</span>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1 text-[11px] text-slate-300">
              {fusionLogs.map((log, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-teal-500">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: AGENT ORGANISM & FUSED CAPABILITIES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>ORGANISMO DOS AGENTES FIDEDIGNOS & ATRIBUIÇÕES FUNDIDAS</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">5 Agentes Onboarded</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`p-5 rounded-2xl bg-slate-900/90 border ${agent.color} space-y-4 hover:border-teal-500/50 transition-all`}
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">{agent.avatar}</div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{agent.name}</h4>
                    <span className="text-[11px] text-slate-400 block font-mono">{agent.title}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  FUSED
                </span>
              </div>

              {/* Specialties */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Especialidades do Agente:</span>
                <div className="flex flex-wrap gap-1">
                  {agent.specialties?.map((spec, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills count & preview */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1 border-t border-slate-800/60">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[9px] block">Skills</span>
                  <span className="text-teal-400 font-bold">{agent.skills?.length || 0}</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[9px] block">Tools</span>
                  <span className="text-cyan-400 font-bold">{agent.tools?.length || 0}</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[9px] block">Algoritmos</span>
                  <span className="text-purple-400 font-bold">{agent.algorithms?.length || 0}</span>
                </div>
              </div>

              {/* Tools list */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-cyan-400" />
                  <span>Ferramentas de Execução:</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {agent.tools?.slice(0, 4).map((tool, i) => (
                    <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                      {tool}
                    </span>
                  ))}
                  {agent.tools && agent.tools.length > 4 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      +{agent.tools.length - 4} mais
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: SYSTEM SKILLS CATALOG (15 SYSTEM SKILLS) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>MATRIZ DE 15 SKILLS DO ECOSSISTEMA (/skills/system_skills)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Habilidades mapeadas diretamente do repositório com suporte a injeção cirúrgica de algoritmos e ferramentas.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar skill ou ferramenta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 w-48 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-950 text-teal-300 border-teal-500/80 font-bold shadow-sm shadow-teal-500/20'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 space-y-3 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-teal-400 border border-slate-800">
                      {skill.category}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{skill.name}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>100%</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{skill.description}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                {/* Tools Provided */}
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block mb-1">Tools Fornecidas:</span>
                  <div className="flex flex-wrap gap-1">
                    {skill.toolsProvided.map((tool, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Algorithms Provided */}
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block mb-1">Algoritmos Integrados:</span>
                  <div className="flex flex-wrap gap-1">
                    {skill.algorithmsProvided.map((algo, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
                        {algo}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Path */}
                <div className="text-[10px] font-mono text-slate-500 pt-1 flex items-center justify-between">
                  <span className="truncate max-w-[200px]">{skill.path}</span>
                  <span className="text-teal-400">Fused</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
