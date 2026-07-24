import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  X,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  ExternalLink,
  BookMarked,
  Sparkles,
  Loader2,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { ChatMessage, SystemPersona } from '../types';

interface ChatStudioProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  selectedPersona: SystemPersona;
  temperature: number;
  topP: number;
  searchGrounding: boolean;
  onSavePrompt: (prompt: string) => void;
}

export const ChatStudio: React.FC<ChatStudioProps> = ({
  messages,
  setMessages,
  selectedPersona,
  temperature,
  topP,
  searchGrounding,
  onSavePrompt,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<{
    data: string;
    mimeType: string;
    previewUrl: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPEG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64Data = result.split(',')[1];
      setAttachedImage({
        data: base64Data,
        mimeType: file.type,
        previewUrl: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt.trim();
    if (!textToSend && !attachedImage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: attachedImage || undefined,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputPrompt('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          systemInstruction: selectedPersona.instruction,
          temperature,
          topP,
          searchGrounding,
          image: userMessage.image,
          history: newHistory.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate response');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.text || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingChunks: data.groundingChunks,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `Error: ${err.message || 'An unexpected error occurred while calling Gemini.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = () => {
    if (messages.length === 0) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Studio Header Banner */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between text-xs text-slate-600 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">Active Persona:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/50">
            {selectedPersona.name}
          </span>
          {searchGrounding && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/50">
              <Globe className="w-3 h-3 text-emerald-600" />
              Google Search Grounding
            </span>
          )}
        </div>

        {messages.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              disabled={isLoading}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-700 font-medium transition-colors border border-slate-200/60"
              title="Regenerate Last Response"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Retry</span>
            </button>

            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-red-50 hover:text-red-600 text-slate-600 font-medium transition-colors border border-slate-200/60"
              title="Clear Conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto my-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-400 mx-auto flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">What would you like to explore today?</h2>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                Ask questions, generate code, analyze topics, or upload an image to analyze with Gemini 3.6 Flash.
              </p>
            </div>

            {/* Quick Starter Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left">
              {[
                {
                  title: 'Write a Custom React Hook',
                  prompt: 'Write a clean TypeScript React hook `useDebounce` with full type annotations and usage example.',
                },
                {
                  title: 'Explain Complex Science Simply',
                  prompt: 'Explain quantum entanglement using an intuitive everyday analogy for high school students.',
                },
                {
                  title: 'Analyze Code Efficiency',
                  prompt: 'What are the main architectural differences between Server Components and Client Components in React?',
                },
                {
                  title: 'Creative Story Outline',
                  prompt: 'Outline a gripping sci-fi short story premise set on a deep space research habitat.',
                },
              ].map((starter, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(starter.prompt)}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-xs transition-all group text-left"
                >
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">{starter.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{starter.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-3xl mx-auto ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-slate-900'
                    : msg.isError
                    ? 'bg-red-500'
                    : 'bg-indigo-600'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`group relative max-w-[85%] rounded-2xl p-4 shadow-2xs ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : msg.isError
                    ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-none'
                    : 'bg-white border border-slate-200/80 text-slate-900 rounded-tl-none'
                }`}
              >
                {/* Image Attachment inside Message */}
                {msg.image && (
                  <div className="mb-3 overflow-hidden rounded-lg border border-white/20">
                    <img
                      src={typeof msg.image === 'string' ? msg.image : msg.image.previewUrl}
                      alt="Uploaded media"
                      className="max-h-60 w-auto object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Message Text */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Search Grounding Citations */}
                {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-emerald-600" />
                      Search Sources:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.groundingChunks.map((chunk, idx) => {
                        if (!chunk.web?.uri) return null;
                        return (
                          <a
                            key={idx}
                            href={chunk.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                          >
                            <span>{chunk.web.title || 'Source'}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Timestamp & Action Buttons */}
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyText(msg.text, msg.id)}
                      className="p-1 rounded hover:bg-black/10 transition-colors"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    {msg.role === 'user' && (
                      <button
                        onClick={() => onSavePrompt(msg.text)}
                        className="p-1 rounded hover:bg-black/10 transition-colors"
                        title="Save prompt to library"
                      >
                        <BookMarked className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none p-4 shadow-2xs flex items-center gap-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-xs font-semibold text-slate-600">Gemini 3.6 Flash is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="bg-white border-t border-slate-200 p-3 lg:p-4 shrink-0">
        <div className="max-w-3xl mx-auto space-y-2">
          {/* Preview Attached Image */}
          {attachedImage && (
            <div className="relative inline-block border border-slate-200 rounded-xl p-1 bg-slate-50">
              <img
                src={attachedImage.previewUrl}
                alt="Upload preview"
                className="h-16 w-auto object-cover rounded-lg"
              />
              <button
                onClick={() => setAttachedImage(null)}
                className="absolute -top-2 -right-2 bg-slate-900 text-white p-0.5 rounded-full hover:bg-red-600 transition-colors shadow-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 rounded-2xl p-2 transition-all">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
              title="Attach Image"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything or describe a task..."
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-slate-900 placeholder:text-slate-400 py-1.5 max-h-32 min-h-[24px]"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={(!inputPrompt.trim() && !attachedImage) || isLoading}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-xl transition-all shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 px-1">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>Gemini 3.6 Flash</span>
          </div>
        </div>
      </div>
    </div>
  );
};
