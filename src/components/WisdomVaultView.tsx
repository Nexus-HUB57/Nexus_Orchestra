import React, { useState } from 'react';
import { WisdomAxiom } from '../types';
import { distillWisdomAxiom } from '../services/api';
import { Sparkles, Brain, Award, Search, RefreshCw, Tag } from 'lucide-react';

interface WisdomVaultViewProps {
  axioms: WisdomAxiom[];
  onAddAxiom: (axiom: WisdomAxiom) => void;
}

export const WisdomVaultView: React.FC<WisdomVaultViewProps> = ({ axioms, onAddAxiom }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDistilling, setIsDistilling] = useState(false);
  const [customContext, setCustomContext] = useState('');

  const filteredAxioms = axioms.filter((ax) => {
    const matchesSearch =
      ax.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ax.statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ax.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || ax.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRunDistillation = async () => {
    setIsDistilling(true);
    try {
      const res = await distillWisdomAxiom(
        customContext || 'Metacognição avançada sobre resiliência em sistemas agênticos e prevenção de exceções assíncronas.'
      );
      if (res.axiom) {
        onAddAxiom(res.axiom);
        setCustomContext('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDistilling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Brain className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Cofre de Auto-Sabedoria (Epistemic Auto-Wisdom Vault)
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              O Algoritmo de Auto-Sabedoria realiza ciclos metacognitivos de auto-reflexão sobre as tarefas executadas e falhas superadas. Ele destila regras universais (Axiomas) que realimentam os agentes para evitar que o mesmo erro ocorra novamente.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 text-right font-mono text-xs">
            <span className="text-purple-400 block font-bold">Total de Axiomas Registrados:</span>
            <span className="text-2xl font-extrabold text-white">{axioms.length}</span>
          </div>
        </div>
      </div>

      {/* Metacognition Distillation Trigger Box */}
      <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Sessão Autônoma de Destilação de Sabedoria</span>
          </h3>
          <span className="text-xs font-mono text-purple-300">Epistemic Sage Agent</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
            placeholder="Contexto opcional para reflexão (ex: Prevenção de exceções de concorrência)..."
            className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
          />
          <button
            onClick={handleRunDistillation}
            disabled={isDistilling}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 whitespace-nowrap"
          >
            {isDistilling ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Destilando Sabedoria...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Executar Ciclo de Metacognição</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar axiomas por palavra-chave ou tag..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {['all', 'Error Prevention', 'Architectural Resilience', 'Self-Governance', 'Context Efficiency'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat === 'all' ? 'Todas Categorias' : cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Axioms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAxioms.map((ax) => (
          <div
            key={ax.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 space-y-3 transition-all hover:shadow-xl hover:shadow-purple-950/20 group"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50">
                {ax.category}
              </span>
              <div className="flex items-center space-x-1 text-xs text-emerald-400 font-mono font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>{ax.confidenceScore}% Confiança</span>
              </div>
            </div>

            <h4 className="font-bold text-sm text-slate-100 group-hover:text-purple-300 transition-colors">
              {ax.title}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/60 font-sans">
              "{ax.statement}"
            </p>

            <p className="text-[11px] text-slate-400 leading-normal">
              <strong className="text-slate-300 font-semibold">Racional:</strong> {ax.rationale}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-500">
              <span>Origem: {ax.provenance}</span>
              <div className="flex items-center space-x-1">
                <Tag className="w-3 h-3 text-purple-400" />
                <span>{ax.tags.join(', ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
