import React from 'react';
import { Sparkles, Settings, Activity, ShieldCheck, ShieldAlert, BookMarked } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isApiConfigured: boolean;
  onOpenSettings: () => void;
  savedPromptsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isApiConfigured,
  onOpenSettings,
  savedPromptsCount,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-md flex items-center justify-center text-white">
          <div className="w-full h-full bg-slate-900/10 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Gemini AI Studio</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              3.6 Flash
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">Multimodal AI Workspace & Creative Engine</p>
        </div>
      </div>

      {/* Center Tabs for Quick Navigation (Desktop) */}
      <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
            activeTab === 'chat'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Chat Studio
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
            activeTab === 'video'
              ? 'bg-white text-purple-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Video Chat (60s)
        </button>
        <button
          onClick={() => setActiveTab('playground')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
            activeTab === 'playground'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Playground
        </button>
        <button
          onClick={() => setActiveTab('visual')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
            activeTab === 'visual'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Image Generator
        </button>
        <button
          onClick={() => setActiveTab('speech')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
            activeTab === 'speech'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Speech TTS
        </button>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setActiveTab('saved')}
          className={`relative p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
            activeTab === 'saved'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
          title="Saved Prompts Library"
        >
          <BookMarked className="w-4 h-4 text-indigo-600" />
          <span className="hidden sm:inline">Saved Prompts</span>
          {savedPromptsCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 bg-indigo-600 text-white text-[10px] font-bold rounded-full">
              {savedPromptsCount}
            </span>
          )}
        </button>

        {/* Status Indicator */}
        <div
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border ${
            isApiConfigured
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
          title={isApiConfigured ? 'API Connected' : 'Check Gemini API Key in Settings'}
        >
          {isApiConfigured ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Ready</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Check Key</span>
            </>
          )}
        </div>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
          title="Settings & Key Status"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
