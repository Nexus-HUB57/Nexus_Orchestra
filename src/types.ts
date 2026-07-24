export type AgentRole = 'architect' | 'executor' | 'sentinel_healer' | 'epistemic_sage' | 'skill_fuser';

export type ActiveTab = 'chat' | 'playground' | 'visual' | 'speech' | 'saved' | 'video' | 'overview' | 'skills-onboarding' | 'auto-healing' | 'wisdom-vault' | 'chaos-lab' | 'missions' | 'bridges';

export interface VideoMetadata {
  fileName: string;
  durationSeconds: number;
  fileSizeMb: number;
  mimeType: string;
  previewUrl: string;
  base64Data?: string;
  recordedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender?: 'user' | 'assistant' | 'system';
  role?: 'user' | 'assistant' | 'system';
  content?: string;
  text?: string;
  timestamp: string;
  image?: string | { data: string; mimeType: string; previewUrl: string };
  videoUrl?: string;
  videoMetadata?: VideoMetadata;
  personaId?: string;
  groundingChunks?: any[];
  isError?: boolean;
  metadata?: Record<string, any>;
}

export interface SavedPrompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
  createdAt: string;
  tags?: string[];
}

export interface SystemPersona {
  id: string;
  name: string;
  title?: string;
  avatar?: string;
  icon?: string;
  description: string;
  systemPrompt?: string;
  instruction?: string;
  category?: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  systemInstruction?: string;
  category: string;
}

export interface SpeechItem {
  id: string;
  text: string;
  voice?: string;
  voiceName?: string;
  timestamp?: string;
  createdAt?: string;
  audioUrl?: string;
}

export interface GeneratedImageItem {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp?: string;
  createdAt?: string;
  caption?: string;
  aspectRatio: string;
}

export interface AgentSkill {
  id: string;
  name: string;
  category: 'AI & Cognition' | 'Database & Storage' | 'Identity & Auth' | 'Location & Maps' | 'Integrations & Workspace' | 'Realtime & UI' | 'Migration & Codebase';
  description: string;
  toolsProvided: string[];
  algorithmsProvided: string[];
  path: string;
  isFused: boolean;
  assignedAgentRoles: AgentRole[];
  synergyScore: number; // 0 - 100
}

export interface SkillFusionResult {
  timestamp: string;
  totalSkillsScanned: number;
  fusedSkillsCount: number;
  synergyLevel: number;
  fusedAgentsCount: number;
  newAxiomsGenerated: number;
  logs: string[];
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  title: string;
  avatar: string;
  status: 'idle' | 'analyzing' | 'executing' | 'healing' | 'distilling' | 'fusing' | 'error';
  currentTask?: string;
  efficiency: number; // 0-100
  wisdomLevel: number; // 0-100
  color: string;
  skills: string[];
  tools: string[];
  algorithms: string[];
  onboardingStatus: 'fused' | 'syncing' | 'pending';
  specialties: string[];
}

export type HealingTier = 1 | 2 | 3 | 4;

export interface AutoHealingStep {
  tier: HealingTier;
  timestamp: string;
  action: string;
  strategy: string;
  formula: string; // e.g. "H(t) = H_0 * e^(1.42t)"
  entropyReduction: number; // e.g. -45%
  status: 'applied' | 'evaluating' | 'success' | 'failed';
  patchCode?: string;
}

export interface SystemAnomaly {
  id: string;
  timestamp: string;
  type: 'SyntaxError' | 'LogicInversion' | 'ContextOverflow' | 'SchemaMismatch' | 'MemoryCorruption' | 'RateLimitExceeded';
  severity: 'low' | 'medium' | 'critical' | 'existential';
  description: string;
  affectedComponent: string;
  originalCodeSnippet?: string;
  entropyImpact: number; // 0 - 100
  status: 'detected' | 'diagnosing' | 'healing_tier_1' | 'healing_tier_2' | 'healing_tier_3' | 'healing_tier_4' | 'healed' | 'unresolved';
  healingSteps: AutoHealingStep[];
  healedCodeSnippet?: string;
  resolutionTimeMs?: number;
}

export interface WisdomAxiom {
  id: string;
  createdAt: string;
  category: 'Error Prevention' | 'Logic Optimization' | 'Self-Governance' | 'Architectural Resilience' | 'Context Efficiency';
  title: string;
  statement: string;
  rationale: string;
  provenance: string; // Task or anomaly that generated this wisdom
  confidenceScore: number; // 0 - 100
  timesApplied: number;
  weight: number; // Exponential weight based on success history
  tags: string[];
}

export interface TaskNode {
  id: string;
  label: string;
  assignedAgentRole: AgentRole;
  status: 'pending' | 'running' | 'glitched' | 'healing' | 'completed' | 'failed';
  prompt: string;
  output?: string;
  error?: string;
  healingAttempts?: number;
  healingLogs?: string[];
}

export interface TelemetryPoint {
  timestamp: string;
  entropy: number;       // System entropy 0 - 100
  healingPower: number;  // Exponential power curve
  wisdomIndex: number;   // Cumulative wisdom
  activeAgents: number;
  healedFaultsCount: number;
}

export interface AgentRunResponse {
  success: boolean;
  taskId: string;
  agentRole: AgentRole;
  output: string;
  thinkingProcess?: string;
  anomalyDetected?: SystemAnomaly;
  healedOutput?: string;
  newAxiom?: WisdomAxiom;
  telemetry: {
    initialEntropy: number;
    finalEntropy: number;
    healingTierUsed?: HealingTier;
    wisdomGain: number;
  };
  logs: string[];
}

export interface PresetMission {
  id: string;
  title: string;
  description: string;
  category: 'Software Architecture' | 'Chaos Repair' | 'Exponential Wisdom' | 'Autonomous Refactoring';
  prompt: string;
  injectChaos: boolean;
  chaosType?: SystemAnomaly['type'];
  expectedHealingTier?: HealingTier;
}
