import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ActiveTab, ChatMessage, SavedPrompt, SystemPersona } from './types';
import { SYSTEM_PERSONAS } from './data/presets';
import { Loader2 } from 'lucide-react';

// Lazy-loaded Studio View Components for optimal code splitting & initial load bundle reduction
const ChatStudio = lazy(() => import('./components/ChatStudio').then((m) => ({ default: m.ChatStudio })));
const VideoChatbot = lazy(() => import('./components/VideoChatbot').then((m) => ({ default: m.VideoChatbot })));
const CreativePlayground = lazy(() => import('./components/CreativePlayground').then((m) => ({ default: m.CreativePlayground })));
const VisualGenerator = lazy(() => import('./components/VisualGenerator').then((m) => ({ default: m.VisualGenerator })));
const SpeechSynthesis = lazy(() => import('./components/SpeechSynthesis').then((m) => ({ default: m.SpeechSynthesis })));
const SavedPromptsModal = lazy(() => import('./components/SavedPromptsModal').then((m) => ({ default: m.SavedPromptsModal })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then((m) => ({ default: m.SettingsModal })));

const STORAGE_KEYS = {
  CHAT_MESSAGES: 'gemini_studio_chat_messages',
  SAVED_PROMPTS: 'gemini_studio_saved_prompts',
};

const DEFAULT_SAVED_PROMPTS: SavedPrompt[] = [
  {
    id: '1',
    title: 'React Code Reviewer',
    prompt: 'Review the following React component for performance, accessibility, and type safety issues:',
    category: 'Coding',
    createdAt: new Date().toLocaleDateString(),
  },
  {
    id: '2',
    title: 'Executive Speech Summarizer',
    prompt: 'Synthesize the main arguments and actionable recommendations from this transcript:',
    category: 'Analysis',
    createdAt: new Date().toLocaleDateString(),
  },
  {
    id: '3',
    title: 'Sci-Fi Worldbuilding Prompt',
    prompt: 'Describe a futuristic cybernetic metropolis powered by geothermal artificial suns.',
    category: 'Creative',
    createdAt: new Date().toLocaleDateString(),
  },
];

const ComponentFallback = () => (
  <div className="flex-1 flex flex-col items-center justify-center h-full bg-slate-50 text-slate-500 gap-3">
    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    <span className="text-xs font-semibold tracking-wide text-slate-600">Carregando Módulo Nexus Studio...</span>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [selectedPersona, setSelectedPersona] = useState<SystemPersona>(SYSTEM_PERSONAS[0]);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.95);
  const [searchGrounding, setSearchGrounding] = useState<boolean>(false);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavedPromptsOpen, setIsSavedPromptsOpen] = useState(false);

  // API Status state
  const [isApiConfigured, setIsApiConfigured] = useState<boolean>(true);

  // Persistence state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_PROMPTS);
      return saved ? JSON.parse(saved) : DEFAULT_SAVED_PROMPTS;
    } catch {
      return DEFAULT_SAVED_PROMPTS;
    }
  });

  // Save state on updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not save chat history to localStorage', e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_PROMPTS, JSON.stringify(savedPrompts));
    } catch (e) {
      console.warn('Could not save prompts to localStorage', e);
    }
  }, [savedPrompts]);

  // Check API Status on mount
  const checkApiStatus = async () => {
    try {
      const res = await fetch('/api/gemini/status');
      if (res.ok) {
        const data = await res.json();
        setIsApiConfigured(Boolean(data.configured));
      }
    } catch (e) {
      console.warn('API status check error', e);
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  const handleSavePromptToLibrary = (promptText: string) => {
    if (!promptText.trim()) return;
    const newSaved: SavedPrompt = {
      id: Date.now().toString(),
      title: promptText.trim().slice(0, 30) + '...',
      prompt: promptText.trim(),
      category: 'General',
      createdAt: new Date().toLocaleDateString(),
    };
    setSavedPrompts((prev) => [newSaved, ...prev]);
    setIsSavedPromptsOpen(true);
  };

  const handleUsePromptFromLibrary = (_promptText: string) => {
    setActiveTab('chat');
  };

  const handleResetSessionData = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'saved') {
            setIsSavedPromptsOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        isApiConfigured={isApiConfigured}
        onOpenSettings={() => setIsSettingsOpen(true)}
        savedPromptsCount={savedPrompts.length}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'saved') {
              setIsSavedPromptsOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          selectedPersona={selectedPersona}
          setSelectedPersona={setSelectedPersona}
          temperature={temperature}
          setTemperature={setTemperature}
          topP={topP}
          setTopP={setTopP}
          searchGrounding={searchGrounding}
          setSearchGrounding={setSearchGrounding}
        />

        {/* Dynamic Studio Tab Content with Suspense */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <Suspense fallback={<ComponentFallback />}>
            {activeTab === 'chat' && (
              <ChatStudio
                messages={messages}
                setMessages={setMessages}
                selectedPersona={selectedPersona}
                temperature={temperature}
                topP={topP}
                searchGrounding={searchGrounding}
                onSavePrompt={handleSavePromptToLibrary}
              />
            )}

            {activeTab === 'video' && (
              <VideoChatbot temperature={temperature} topP={topP} />
            )}

            {activeTab === 'playground' && (
              <CreativePlayground
                temperature={temperature}
                topP={topP}
                searchGrounding={searchGrounding}
                onSavePrompt={handleSavePromptToLibrary}
              />
            )}

            {activeTab === 'visual' && <VisualGenerator />}

            {activeTab === 'speech' && <SpeechSynthesis />}
          </Suspense>
        </main>
      </div>

      {/* Modals with Suspense */}
      <Suspense fallback={null}>
        {isSavedPromptsOpen && (
          <SavedPromptsModal
            isOpen={isSavedPromptsOpen}
            onClose={() => setIsSavedPromptsOpen(false)}
            savedPrompts={savedPrompts}
            setSavedPrompts={setSavedPrompts}
            onUsePrompt={handleUsePromptFromLibrary}
          />
        )}

        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            isApiConfigured={isApiConfigured}
            checkStatus={checkApiStatus}
            onResetData={handleResetSessionData}
          />
        )}
      </Suspense>
    </div>
  );
}

