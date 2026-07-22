import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Sparkles,
  BookMarked,
  Sliders,
  Layers,
  FileText,
} from 'lucide-react';
import { PROMPT_TEMPLATES } from '../data/presets';
import { PromptTemplate } from '../types';

interface CreativePlaygroundProps {
  temperature: number;
  topP: number;
  searchGrounding: boolean;
  onSavePrompt: (prompt: string) => void;
}

export const CreativePlayground: React.FC<CreativePlaygroundProps> = ({
  temperature,
  topP,
  searchGrounding,
  onSavePrompt,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(PROMPT_TEMPLATES[0]);
  const [promptText, setPromptText] = useState(PROMPT_TEMPLATES[0].prompt);
  const [systemInstructionText, setSystemInstructionText] = useState(PROMPT_TEMPLATES[0].systemInstruction || '');
  const [outputResult, setOutputResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [execTime, setExecTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setPromptText(template.prompt);
    setSystemInstructionText(template.systemInstruction || '');
  };

  const handleRunPlayground = async () => {
    if (!promptText.trim()) return;

    setIsLoading(true);
    setOutputResult('');
    setExecTime(null);
    const startTime = performance.now();

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          systemInstruction: systemInstructionText,
          temperature,
          topP,
          searchGrounding,
        }),
      });

      const data = await res.json();
      const duration = Math.round(performance.now() - startTime);
      setExecTime(duration);

      if (!res.ok) {
        throw new Error(data.error || 'Playground execution failed');
      }

      setOutputResult(data.text || '');
    } catch (err: any) {
      setOutputResult(`Error: ${err.message || 'Execution failed.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto p-4 lg:p-6 space-y-6">
      {/* Title Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Creative Playground</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Experiment with system instructions, template prompts, and parameter combinations in real-time.
          </p>
        </div>

        {/* Template Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {PROMPT_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedTemplate?.id === tmpl.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tmpl.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Left Column: Input Controls */}
        <div className="space-y-4 flex flex-col">
          {/* System Instruction Panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>System Instruction / Persona Directive</span>
              <span className="text-[10px] text-slate-400 font-normal">Controls tone & output format</span>
            </label>
            <textarea
              value={systemInstructionText}
              onChange={(e) => setSystemInstructionText(e.target.value)}
              placeholder="e.g. You are a senior software architect..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none resize-none font-sans"
            />
          </div>

          {/* Prompt Input Canvas */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex-1 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                Prompt Construction Canvas
              </label>
              <button
                onClick={() => onSavePrompt(promptText)}
                disabled={!promptText.trim()}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-40 flex items-center gap-1"
              >
                <BookMarked className="w-3.5 h-3.5" />
                Save Prompt
              </button>
            </div>

            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Enter your prompt or select a template above..."
              rows={8}
              className="w-full flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none resize-none font-mono"
            />

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span>Temp: <strong className="text-slate-800">{temperature}</strong></span>
                <span>TopP: <strong className="text-slate-800">{topP}</strong></span>
              </div>

              <button
                onClick={handleRunPlayground}
                disabled={isLoading || !promptText.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-xs"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Run Prompt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Output */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col h-full min-h-[400px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Generated Output</span>
              {execTime !== null && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {execTime} ms
                </span>
              )}
            </div>

            {outputResult && (
              <button
                onClick={handleCopyResult}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          <div className="flex-1 mt-3 bg-slate-50 rounded-xl p-4 border border-slate-200/60 overflow-y-auto font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3 text-slate-400">
                <Sparkles className="w-8 h-8 text-indigo-500 animate-bounce" />
                <p className="text-xs font-sans font-semibold">Gemini is processing your playground prompt...</p>
              </div>
            ) : outputResult ? (
              outputResult
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-sans text-xs">
                Click "Run Prompt" to view output here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
