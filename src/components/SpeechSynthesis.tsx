import React, { useState } from 'react';
import { Mic, Volume2, Play, Pause, Download, Loader2, Sparkles, User, AudioWaveform } from 'lucide-react';
import { SpeechItem } from '../types';

export const SpeechSynthesis: React.FC = () => {
  const [text, setText] = useState('Welcome to Gemini AI Studio! Convert any text into realistic human speech.');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [history, setHistory] = useState<SpeechItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const voiceOptions = [
    { name: 'Kore', description: 'Warm, balanced female voice' },
    { name: 'Puck', description: 'Energetic, expressive voice' },
    { name: 'Fenrir', description: 'Deep, resonant male voice' },
    { name: 'Zephyr', description: 'Smooth, calm conversational voice' },
    { name: 'Charon', description: 'Authoritative, clear broadcast voice' },
  ];

  const handleGenerateSpeech = async () => {
    if (!text.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voiceName: selectedVoice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to synthesize speech');
      }

      const newItem: SpeechItem = {
        id: Date.now().toString(),
        text: text.trim(),
        voiceName: selectedVoice,
        audioUrl: data.audioUrl,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setHistory((prev) => [newItem, ...prev]);
    } catch (err: any) {
      alert(`TTS Error: ${err.message || 'Speech generation failed'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto p-4 lg:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Gemini Text-to-Speech</h2>
            <p className="text-xs text-slate-500">
              Synthesize natural human audio using Gemini's TTS model (`gemini-3.1-flash-tts-preview`).
            </p>
          </div>
        </div>

        {/* Text Input Canvas */}
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type text to speak..."
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none resize-none"
          />

          {/* Voice Selector Grid */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              Select Voice Character:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {voiceOptions.map((voice) => (
                <button
                  key={voice.name}
                  onClick={() => setSelectedVoice(voice.name)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedVoice === voice.name
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold">{voice.name}</p>
                  <p className={`text-[10px] line-clamp-1 ${selectedVoice === voice.name ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {voice.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={handleGenerateSpeech}
              disabled={isLoading || !text.trim()}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Synthesizing Speech...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Audio
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Audio History */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span>Generated Audio Tracks</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-mono">
            {history.length}
          </span>
        </h3>

        {history.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-400 space-y-2">
            <Volume2 className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No audio generated yet.</p>
            <p className="text-[11px] text-slate-400">Enter text above and click "Generate Audio" to hear synthesized speech.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      Voice: {item.voiceName}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium line-clamp-2">"{item.text}"</p>
                </div>

                <div className="flex items-center gap-3">
                  <audio
                    src={item.audioUrl}
                    controls
                    className="h-10 w-full max-w-xs rounded-xl border border-slate-200"
                  />
                  <a
                    href={item.audioUrl}
                    download={`gemini-speech-${item.voiceName}-${Date.now()}.wav`}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shrink-0"
                    title="Download Audio WAV"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
