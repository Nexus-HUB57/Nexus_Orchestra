import React, { useState, useEffect } from 'react';
import { Settings, X, ShieldCheck, ShieldAlert, Cpu, RefreshCw, KeyRound, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isApiConfigured: boolean;
  checkStatus: () => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isApiConfigured,
  checkStatus,
  onResetData,
}) => {
  const [checking, setChecking] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setChecking(true);
    await checkStatus();
    setTimeout(() => setChecking(false), 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Studio Settings & Status</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Key Connection Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              Gemini API Secret Key
            </span>
            <button
              onClick={handleRefresh}
              disabled={checking}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
              title="Re-check connection"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
              isApiConfigured
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {isApiConfigured ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <div>
              <p className="font-bold">
                {isApiConfigured ? 'API Key Active & Server-Side Bound' : 'Missing GEMINI_API_KEY'}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                {isApiConfigured
                  ? 'Your Gemini API requests are safely processed via server-side routes.'
                  : 'Configure GEMINI_API_KEY in the AI Studio Settings > Secrets panel.'}
              </p>
            </div>
          </div>
        </div>

        {/* Models Configured Summary */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-indigo-600" />
            Active SDK Models
          </p>
          <div className="space-y-1.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">gemini-3.6-flash</p>
                <p className="text-[10px] text-slate-500">Text generation & Search Grounding</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                Ready
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">gemini-3.1-flash-lite-image</p>
                <p className="text-[10px] text-slate-500">Multimodal image generation</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                Ready
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">gemini-3.1-flash-tts-preview</p>
                <p className="text-[10px] text-slate-500">Natural voice speech synthesis</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                Ready
              </span>
            </div>
          </div>
        </div>

        {/* Reset Data */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear chat messages and reset local data?')) {
                onResetData();
                onClose();
              }
            }}
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
          >
            Reset Session Data
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
