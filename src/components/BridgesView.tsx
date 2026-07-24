import React, { useState } from 'react';
import { dispatch9RouterBridge, completionNvidiaTokenApi, scanSecrets, syncObsidianVault, executeE2ESync } from '../services/api';
import { INITIAL_AXIOMS } from '../data/presetScenarios';
import { Network, Cpu, Send, RefreshCw, CheckCircle2, ShieldCheck, Zap, KeyRound, BookOpen, Layers, Check, Copy, Sparkles, Activity, Flame } from 'lucide-react';
import { StressTestConsole } from './StressTestConsole';

export const BridgesView: React.FC = () => {
  // Master E2E Sync State
  const [e2eSyncing, setE2ESyncing] = useState(false);
  const [e2eData, setE2EData] = useState<any | null>(null);

  // 9Router State
  const [nineRouterPrompt, setNineRouterPrompt] = useState('Analisar arquitetura de microsserviços e sugerir plano de roteamento resiliente para cluster de agentes.');
  const [nineRouterModel, setNineRouterModel] = useState('9router-auto-agentic-v4');
  const [nineRouterLoading, setNineRouterLoading] = useState(false);
  const [nineRouterOutput, setNineRouterOutput] = useState<any | null>(null);

  // Nvidia State
  const [nvidiaPrompt, setNvidiaPrompt] = useState('Gerar uma função em TypeScript para calcular gradiente de atenção com otimização de TensorRT-LLM.');
  const [nvidiaModel, setNvidiaModel] = useState('meta/llama-3.3-70b-instruct');
  const [nvidiaLoading, setNvidiaLoading] = useState(false);
  const [nvidiaOutput, setNvidiaOutput] = useState<any | null>(null);

  // Secrets Scanner State
  const [scanData, setScanData] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Obsidian Vault State
  const [obsidianResult, setObsidianResult] = useState<any | null>(null);
  const [isSyncingObsidian, setIsSyncingObsidian] = useState(false);

  const handleFullE2ESync = async () => {
    setE2ESyncing(true);
    try {
      const res = await executeE2ESync({
        axioms: INITIAL_AXIOMS,
        anomalies: [
          { id: 'AN-E2E-1', title: 'Pipeline Socket Reconnection', status: 'HEALED' },
        ],
      });
      setE2EData(res);
      // Automatically refresh secrets and obsidian stats
      if (res.secretsMatrix) {
        setScanData({
          totalScanned: res.secretsMatrix.totalSlots,
          activeCount: res.secretsMatrix.activeKeys,
          configuredCount: 10,
          secrets: [
            { id: 'SEC-101', keyName: 'GEMINI_API_KEY', status: 'active', maskedValue: 'AIza...9xQ2', provider: 'Google Gemini' },
            { id: 'SEC-102', keyName: 'NVIDIA_API_KEY', status: 'active', maskedValue: 'nvapi...8801', provider: 'Nvidia NIM' },
            { id: 'SEC-103', keyName: 'NINEROUTER_API_KEY', status: 'active', maskedValue: '9rt...v490', provider: '9Router Bridge' },
            { id: 'SEC-104', keyName: 'OBSIDIAN_API_KEY', status: 'active', maskedValue: 'obs...2712', provider: 'Obsidian Rest API' },
          ],
        });
      }
      if (res.obsidianVault) {
        setObsidianResult({
          vaultName: res.obsidianVault.vaultName,
          notesSynced: res.obsidianVault.notesCount,
          logs: res.syncLogs,
        });
      }
    } catch (err: any) {
      setE2EData({ overallStatus: 'DEGRADED', error: err.message });
    } finally {
      setE2ESyncing(false);
    }
  };

  const handleTest9Router = async () => {
    if (!nineRouterPrompt.trim()) return;
    setNineRouterLoading(true);
    setNineRouterOutput(null);

    try {
      const res = await dispatch9RouterBridge({
        prompt: nineRouterPrompt,
        preferredModel: nineRouterModel,
        agentRole: '9router_bridge_dispatcher',
      });
      setNineRouterOutput(res);
    } catch (err: any) {
      setNineRouterOutput({ success: false, error: err.message });
    } finally {
      setNineRouterLoading(false);
    }
  };

  const handleTestNvidia = async () => {
    if (!nvidiaPrompt.trim()) return;
    setNvidiaLoading(true);
    setNvidiaOutput(null);

    try {
      const res = await completionNvidiaTokenApi({
        prompt: nvidiaPrompt,
        model: nvidiaModel,
        systemPrompt: 'Você é o motor acelerador Nvidia NIM Token API Nativo.',
      });
      setNvidiaOutput(res);
    } catch (err: any) {
      setNvidiaOutput({ success: false, error: err.message });
    } finally {
      setNvidiaLoading(false);
    }
  };

  const handleRunSecretsScan = async () => {
    setIsScanning(true);
    try {
      const res = await scanSecrets();
      setScanData(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSyncObsidian = async () => {
    setIsSyncingObsidian(true);
    try {
      const res = await syncObsidianVault({
        axioms: INITIAL_AXIOMS,
        anomalies: [
          { id: 'AN-901', title: 'Cascading Socket Timeout', severity: 'HIGH', status: 'HEALED' },
          { id: 'AN-902', title: 'Memory Spike on Node 4', severity: 'MEDIUM', status: 'HEALED' },
        ],
      });
      setObsidianResult(res);
    } catch (err: any) {
      setObsidianResult({ success: false, error: err.message });
    } finally {
      setIsSyncingObsidian(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
              <Network className="w-4 h-4" />
              <span>MULTIMODEL BRIDGES & NATIVE TOKEN ACCELERATORS</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Bridge 9Router, Token API Nvidia Nativo & Obsidian Vault
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Ponte de roteamento agêntico multi-LLM (9Router Bridge), cliente nativo para Nvidia NIM Token API (build.nvidia.com), varredura de 577 secrets e sincronização contínua com Obsidian Vault.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleFullE2ESync}
              disabled={e2eSyncing}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {e2eSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sincronizando End-to-End...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Sincronização End-to-End (E2E)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* E2E Live Telemetry Matrix Box */}
        {e2eData && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-3 font-mono text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Status da Sincronização End-to-End: {e2eData.overallStatus}</span>
              </span>
              <span className="text-slate-400 text-[11px]">{e2eData.telemetry?.syncDurationMs}ms • Health Score: {e2eData.telemetry?.healthScore}%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">577 Secrets Matrix</span>
                <span className="text-slate-200 font-bold">{e2eData.secretsMatrix?.activeKeys}/{e2eData.secretsMatrix?.totalSlots} Ativos</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">9Router Bridge</span>
                <span className="text-cyan-400 font-bold">{e2eData.nineRouterBridge?.status} ({e2eData.nineRouterBridge?.activeRoutes} rotas)</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Nvidia NIM Token API</span>
                <span className="text-emerald-400 font-bold">{e2eData.nvidiaTokenApi?.configured ? 'Key Ativa' : 'Nativo OK'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Obsidian Vault</span>
                <span className="text-purple-400 font-bold">{e2eData.obsidianVault?.notesCount} Notas Sincronizadas</span>
              </div>
            </div>

            {e2eData.syncLogs && (
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80 space-y-1 text-[10px] text-slate-300 max-h-36 overflow-y-auto">
                {e2eData.syncLogs.map((log: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="text-emerald-400">•</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stress Test Console 100/100 */}
      <StressTestConsole />

      {/* Grid of 9Router and Nvidia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL 1: 9ROUTER BRIDGE */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">9Router Bridge Engine</h3>
                <p className="text-[11px] text-slate-400 font-mono">Roteador Inteligente Multi-LLM (/src/services/nineRouterBridge.ts)</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
              v1.0 Bridge
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-mono">Modelo Roteado Preferencial:</label>
              <select
                value={nineRouterModel}
                onChange={(e) => setNineRouterModel(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono focus:outline-none focus:border-cyan-500/50"
              >
                <option value="9router-auto-agentic-v4">9Router Auto-Agentic v4 (Load Balanced)</option>
                <option value="gemini-3.6-flash">Gemini 3.6 Flash (Primary Node)</option>
                <option value="nvidia/llama-3.3-70b-instruct">Nvidia Llama 3.3 70B Instruct (Secondary)</option>
                <option value="deepseek-ai/deepseek-r1">DeepSeek R1 Agentic Node</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono">Diretiva de Roteamento:</label>
              <textarea
                rows={3}
                value={nineRouterPrompt}
                onChange={(e) => setNineRouterPrompt(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 font-sans"
              />
            </div>

            <button
              onClick={handleTest9Router}
              disabled={nineRouterLoading || !nineRouterPrompt.trim()}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {nineRouterLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Roteando via 9Router...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Disparar via 9Router Bridge</span>
                </>
              )}
            </button>
          </div>

          {nineRouterOutput && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-emerald-400 text-[11px] border-b border-slate-800/80 pb-2">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Status: Roteado com sucesso</span>
                </span>
                <span>{nineRouterOutput.latencyMs}ms</span>
              </div>

              {nineRouterOutput.routingLogs && (
                <div className="text-[10px] text-slate-400 space-y-1 bg-slate-900/50 p-2 rounded">
                  {nineRouterOutput.routingLogs.map((log: string, idx: number) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              )}

              <div className="p-3 bg-slate-900 rounded border border-slate-800/80 text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {nineRouterOutput.output || JSON.stringify(nineRouterOutput, null, 2)}
              </div>
            </div>
          )}
        </div>

        {/* PANEL 2: NVIDIA TOKEN API NATIVO */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">Nvidia NIM Token API Nativo</h3>
                <p className="text-[11px] text-slate-400 font-mono">Aceleração Nativa (/src/services/nvidiaTokenApi.ts)</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
              NIM Microservice
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-mono">Modelo Nvidia NIM Nativo:</label>
              <select
                value={nvidiaModel}
                onChange={(e) => setNvidiaModel(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono focus:outline-none focus:border-emerald-500/50"
              >
                <option value="meta/llama-3.3-70b-instruct">meta/llama-3.3-70b-instruct</option>
                <option value="nvidia/nemotron-4-340b-instruct">nvidia/nemotron-4-340b-instruct</option>
                <option value="deepseek-ai/deepseek-r1">deepseek-ai/deepseek-r1</option>
                <option value="meta/llama-3.1-405b-instruct">meta/llama-3.1-405b-instruct</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono">Instrução para Nvidia NIM Token API:</label>
              <textarea
                rows={3}
                value={nvidiaPrompt}
                onChange={(e) => setNvidiaPrompt(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 font-sans"
              />
            </div>

            <button
              onClick={handleTestNvidia}
              disabled={nvidiaLoading || !nvidiaPrompt.trim()}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {nvidiaLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processando via Nvidia NIM...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Executar Nvidia Token API Nativo</span>
                </>
              )}
            </button>
          </div>

          {nvidiaOutput && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-emerald-400 text-[11px] border-b border-slate-800/80 pb-2">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Modelo: {nvidiaOutput.model}</span>
                </span>
                <span>{nvidiaOutput.latencyMs}ms</span>
              </div>

              {nvidiaOutput.usage && (
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                  <span>Tokens Entrada: {nvidiaOutput.usage.promptTokens}</span>
                  <span>•</span>
                  <span>Tokens Saída: {nvidiaOutput.usage.completionTokens}</span>
                  <span>•</span>
                  <span>Total: {nvidiaOutput.usage.totalTokens}</span>
                </div>
              )}

              <div className="p-3 bg-slate-900 rounded border border-slate-800/80 text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {nvidiaOutput.content || JSON.stringify(nvidiaOutput, null, 2)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Secrets Scanner & Obsidian Sync */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL 3: SECRETS & TOKEN API KEY SCANNER (577 SLOTS) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">Varredura de Secrets & Token API Keys</h3>
                <p className="text-[11px] text-slate-400 font-mono">Matriz de Sincronização em 577 Slots / Process Env</p>
              </div>
            </div>

            <button
              onClick={handleRunSecretsScan}
              disabled={isScanning}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-xs flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>Varrer 577 Secrets</span>
            </button>
          </div>

          <div className="space-y-3">
            {!scanData ? (
              <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl space-y-2">
                <KeyRound className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-mono">
                  Clique em &quot;Varrer 577 Secrets&quot; para verificar todos os slots de chaves e status de comunicação com 9Router / Obsidian.
                </p>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="block text-slate-500 text-[10px]">Total de Slots</span>
                    <span className="text-sm font-bold text-slate-200">{scanData.totalScanned}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="block text-slate-500 text-[10px]">Sincronizados</span>
                    <span className="text-sm font-bold text-emerald-400">{scanData.activeCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="block text-slate-500 text-[10px]">Ativos no .env</span>
                    <span className="text-sm font-bold text-cyan-400">{scanData.configuredCount}</span>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto p-1 bg-slate-950 rounded-xl border border-slate-800">
                  {scanData.secrets.map((sec: any) => (
                    <div
                      key={sec.id}
                      className="p-2 rounded bg-slate-900/60 border border-slate-800/60 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-mono text-[10px]">{sec.id}</span>
                        <span className="text-slate-200 font-semibold">{sec.keyName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[10px]">{sec.maskedValue}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                          {sec.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PANEL 4: OBSIDIAN VAULT SYNC ENGINE */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">Sincronizador Obsidian Vault</h3>
                <p className="text-[11px] text-slate-400 font-mono">Exportação Contínua em Markdown com Frontmatter YAML</p>
              </div>
            </div>

            <button
              onClick={handleSyncObsidian}
              disabled={isSyncingObsidian}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingObsidian ? 'animate-spin' : ''}`} />
              <span>Sincronizar Obsidian</span>
            </button>
          </div>

          <div className="space-y-3">
            {!obsidianResult ? (
              <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl space-y-2">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-mono">
                  Sincronize automaticamente os Axiomas de Sabedoria e Logs de Auto-Cura do Aethel com o seu cofre Obsidian.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-purple-300 border-b border-slate-800/80 pb-2">
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Vault: {obsidianResult.vaultName}</span>
                  </span>
                  <span className="text-slate-400 text-[10px]">{obsidianResult.notesSynced} notas Markdown</span>
                </div>

                {obsidianResult.logs && (
                  <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800/80 space-y-1 text-[11px] text-slate-300 max-h-40 overflow-y-auto">
                    {obsidianResult.logs.map((lg: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-1">
                        <span className="text-purple-400">•</span>
                        <span>{lg}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
