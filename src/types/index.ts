export type ActiveTab = 'chat' | 'playground' | 'visual' | 'speech' | 'saved';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  image?: {
    data: string;
    mimeType: string;
    previewUrl: string;
  };
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
  isError?: boolean;
}

export interface SystemPersona {
  id: string;
  name: string;
  description: string;
  instruction: string;
  icon: string;
}

export interface SavedPrompt {
  id: string;
  title: string;
  prompt: string;
  category: 'General' | 'Coding' | 'Creative' | 'Analysis' | 'Image';
  createdAt: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  systemInstruction?: string;
}

export interface GeneratedImageItem {
  id: string;
  prompt: string;
  aspectRatio: string;
  imageUrl: string;
  createdAt: string;
  caption?: string;
}

export interface SpeechItem {
  id: string;
  text: string;
  voiceName: string;
  audioUrl: string;
  createdAt: string;
}
