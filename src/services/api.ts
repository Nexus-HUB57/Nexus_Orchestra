import { AgentRunResponse, AgentRole, SystemAnomaly, WisdomAxiom } from '../types';

export async function runAgentTask(params: {
  prompt: string;
  agentRole?: AgentRole;
  injectChaos?: boolean;
  chaosType?: SystemAnomaly['type'];
}): Promise<AgentRunResponse> {
  const response = await fetch('/api/agent/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro na requisição HTTP (${response.status})`);
  }

  return response.json();
}

export async function healCodeSnippet(params: {
  codeSnippet: string;
  errorDescription: string;
  targetTier?: number;
}): Promise<{ success: boolean; healedCode: string; tierApplied: number; entropyReducedPercent: number }> {
  const response = await fetch('/api/agent/heal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro ao chamar motor de auto-cura (${response.status})`);
  }

  return response.json();
}

export async function distillWisdomAxiom(executionContext: string): Promise<{ success: boolean; axiom: WisdomAxiom }> {
  const response = await fetch('/api/agent/wisdom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ executionContext }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro ao destilar sabedoria (${response.status})`);
  }

  return response.json();
}

export async function checkServerHealth(): Promise<{
  status: string;
  geminiConfigured: boolean;
  engine: string;
  nineRouterBridge?: any;
  nvidiaTokenApi?: any;
}> {
  const response = await fetch('/api/health');
  return response.json();
}

export async function dispatch9RouterBridge(params: {
  prompt: string;
  agentRole?: string;
  preferredModel?: string;
  systemInstruction?: string;
}) {
  const response = await fetch('/api/bridge/9router/dispatch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro no 9Router Bridge (${response.status})`);
  }

  return response.json();
}

export async function completionNvidiaTokenApi(params: {
  prompt: string;
  systemPrompt?: string;
  model?: string;
}) {
  const response = await fetch('/api/bridge/nvidia/completion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro na Nvidia Token API (${response.status})`);
  }

  return response.json();
}

export async function scanSecrets() {
  const response = await fetch('/api/secrets/scan');
  if (!response.ok) {
    throw new Error('Falha ao realizar varredura de secrets.');
  }
  return response.json();
}

export async function syncObsidianVault(payload: { axioms?: any[]; anomalies?: any[]; agentTraces?: any[] }) {
  const response = await fetch('/api/bridge/obsidian/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro na sincronização Obsidian (${response.status})`);
  }

  return response.json();
}

export async function executeE2ESync(payload?: { axioms?: any[]; anomalies?: any[] }) {
  const response = await fetch('/api/sync/e2e', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro na sincronização End-to-End (${response.status})`);
  }

  return response.json();
}

export async function runStressTestStep(iteration: number) {
  const response = await fetch('/api/stress-test/step', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ iteration }),
  });

  if (!response.ok) {
    throw new Error(`Erro na execução da iteração de estresse ${iteration}`);
  }

  return response.json();
}

export async function runStressTestSuite(iterations = 100) {
  const response = await fetch('/api/stress-test/suite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ iterations }),
  });

  if (!response.ok) {
    throw new Error('Erro ao executar o teste de estresse 100/100');
  }

  return response.json();
}

export async function fetchSystemSkills() {
  const response = await fetch('/api/skills');
  if (!response.ok) {
    throw new Error('Erro ao carregar lista de skills do sistema');
  }
  return response.json();
}

export async function executeSkillsFusion() {
  const response = await fetch('/api/skills/fuse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Erro ao executar a fusão cirúrgica de skills');
  }

  return response.json();
}


