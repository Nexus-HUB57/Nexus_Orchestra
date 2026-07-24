import React from 'react';
import {
  MessageSquare,
  FlaskConical,
  Image as ImageIcon,
  Mic,
  Video,
  BookMarked,
  Sliders,
  Globe,
  Sparkles,
  Code2,
  PenTool,
  BarChart3,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import { ActiveTab, SystemPersona } from '../types';
import { SYSTEM_PERSONAS } from '../data/presets';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedPersona: SystemPersona;
  setSelectedPersona: (persona: SystemPersona) => void;
  temperature: number;
  setTemperature: (val: number) => void;
  topP: number;
  setTopP: (val: number) => void;
  searchGrounding: boolean;
  setSearchGrounding: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedPersona,
  setSelectedPersona,
  temperature,
  setTemperature,
  topP,
  setTopP,
  searchGrounding,
  setSearchGrounding,
}) => {
  const personaIcons: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles className="w-4 h-4 text-indigo-500" />,
    Code2: <Code2 className="w-4 h-4 text-blue-500" />,
    PenTool: <PenTool className="w-4 h-4 text-purple-500" />,
    BarChart3: <BarChart3 className="w-4 h-4 text-emerald-500" />,
    GraduationCap: <GraduationCap className="w-4 h-4 text-amber-500" />,
  };

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-slate-200/80 flex flex-col shrink-0">
      {/* Mobile Tab Strip */}
      <div className="flex md:hidden border-b border-slate-200 overflow-x-auto p-2 gap-1 bg-slate-50">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === 'video' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          Vídeo
        </button>
        <button
          onClick={() => setActiveTab('playground')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === 'playground' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Playground
        </button>
        <button
          onClick={() => setActiveTab('visual')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === 'visual' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Images
        </button>
        <button
          onClick={() => setActiveTab('speech')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === 'speech' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          TTS
        </button>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        {/* Primary Studio Navigation (Desktop) */}
        <div className="hidden md:block space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Studio Modules</p>
          
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className={`w-4 h-4 ${activeTab === 'chat' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Chat Studio</span>
            </div>
            {activeTab === 'chat' && <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />}
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'video'
                ? 'bg-purple-50 text-purple-700 border border-purple-200/60 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Video className={`w-4 h-4 ${activeTab === 'video' ? 'text-purple-600' : 'text-slate-400'}`} />
              <span>Video Chatbot (60s)</span>
            </div>
            {activeTab === 'video' && <ChevronRight className="w-3.5 h-3.5 text-purple-500" />}
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'playground'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FlaskConical className={`w-4 h-4 ${activeTab === 'playground' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Creative Playground</span>
            </div>
            {activeTab === 'playground' && <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />}
          </button>

          <button
            onClick={() => setActiveTab('visual')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'visual'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className={`w-4 h-4 ${activeTab === 'visual' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Image Generator</span>
            </div>
            {activeTab === 'visual' && <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />}
          </button>

          <button
            onClick={() => setActiveTab('speech')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'speech'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mic className={`w-4 h-4 ${activeTab === 'speech' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Speech TTS</span>
            </div>
            {activeTab === 'speech' && <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />}
          </button>
        </div>

        {/* Persona Selector */}
        <div className="space-y-2">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">System Persona</p>
          <div className="space-y-1.5">
            {SYSTEM_PERSONAS.map((persona) => {
              const isSelected = selectedPersona.id === persona.id;
              return (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-800 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200/60 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {personaIcons[persona.icon] || <Sparkles className="w-4 h-4" />}
                    <span className={isSelected ? 'text-white' : 'text-slate-900'}>{persona.name}</span>
                  </div>
                  <p className={`mt-1 text-[11px] line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {persona.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Model Hyperparameters Controls */}
        <div className="space-y-3 pt-3 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              Parameters
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
              3.6 Flash
            </span>
          </div>

          {/* Temperature */}
          <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Temperature</span>
              <span className="font-mono text-slate-900 font-bold">{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Precise (0.0)</span>
              <span>Creative (2.0)</span>
            </div>
          </div>

          {/* Top P */}
          <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Top P</span>
              <span className="font-mono text-slate-900 font-bold">{topP}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Search Grounding Toggle */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Search Grounding</p>
                <p className="text-[10px] text-slate-500">Live web information</p>
              </div>
            </div>
            <button
              onClick={() => setSearchGrounding(!searchGrounding)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                searchGrounding ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  searchGrounding ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
