import { SystemPersona, PromptTemplate } from '../types';

export const SYSTEM_PERSONAS: SystemPersona[] = [
  {
    id: 'default',
    name: 'Standard AI Assistant',
    description: 'Balanced, polite, and direct multi-purpose assistant.',
    instruction: 'You are Gemini AI Studio, a helpful, precise, and articulate AI assistant. Provide clear, well-formatted responses using Markdown when applicable.',
    icon: 'Sparkles',
  },
  {
    id: 'engineer',
    name: 'Senior Full-Stack Engineer',
    description: 'Optimized for writing clean, efficient TypeScript/React code.',
    instruction: 'You are an expert senior software engineer. Write clean, production-ready, performant code. Focus on best practices, clear explanations, and modern TypeScript/React patterns.',
    icon: 'Code2',
  },
  {
    id: 'writer',
    name: 'Creative Storyteller & Writer',
    description: 'Passionate tone, expressive vocabulary, structured storytelling.',
    instruction: 'You are a master creative writer and story architect. Craft vivid, engaging prose with rich descriptive language, clear pacing, and compelling narrative structure.',
    icon: 'PenTool',
  },
  {
    id: 'analyst',
    name: 'Data & Technical Analyst',
    description: 'Structured, objective analytical decomposition and summaries.',
    instruction: 'You are a rigorous data analyst. Deconstruct complex problems into logical bullet points, compare trade-offs, highlight key metrics, and provide concise summaries.',
    icon: 'BarChart3',
  },
  {
    id: 'educator',
    name: 'Patient Tech Educator',
    description: 'Explains complex topics with intuitive real-world analogies.',
    instruction: 'You are a patient computer science educator. Explain technical concepts simply using relatable everyday analogies, step-by-step guides, and practical examples.',
    icon: 'GraduationCap',
  },
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'code-refactor',
    title: 'Refactor Code for Performance',
    description: 'Review and optimize code snippets for readability & speed.',
    category: 'Coding',
    prompt: 'Please analyze the following code snippet, identify potential performance bottlenecks or bad practices, and provide an optimized, clean version with explanations:\n\n```typescript\n// Paste code here\n```',
    systemInstruction: SYSTEM_PERSONAS.find(p => p.id === 'engineer')?.instruction,
  },
  {
    id: 'summarize-article',
    title: 'Executive Summary',
    description: 'Extract core takeaways, action items, and key points.',
    category: 'Analysis',
    prompt: 'Summarize the following text into 3 executive takeaways, 5 key bullet points, and actionable next steps:\n\n',
    systemInstruction: SYSTEM_PERSONAS.find(p => p.id === 'analyst')?.instruction,
  },
  {
    id: 'tone-shift',
    title: 'Professional Email Polisher',
    description: 'Rephrase informal text into polished professional communication.',
    category: 'Creative',
    prompt: 'Rephrase the following message into a polite, professional, and clear workplace communication:\n\n"',
    systemInstruction: 'You are a professional communications coach.',
  },
  {
    id: 'brainstorm-ideas',
    title: 'Product Feature Ideation',
    description: 'Generate 10 innovative feature ideas with pros/cons.',
    category: 'General',
    prompt: 'Generate 10 creative feature ideas for an app concept. For each idea, include a 1-sentence description and primary user benefit.\n\nApp Concept: ',
    systemInstruction: SYSTEM_PERSONAS.find(p => p.id === 'default')?.instruction,
  },
];
