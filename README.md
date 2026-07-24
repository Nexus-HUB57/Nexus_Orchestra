# Nexus Orchestra — Hub de Orquestração Agentic AI

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![Google GenAI](https://img.shields.io/badge/Google_GenAI_SDK-2.4-4285F4?style=flat-square&logo=googlecloud)](https://github.com/google-gemini/deprecations)
[![Claude Fable 5](https://img.shields.io/badge/Claude_Fable_5-Mythos_Class-7C3AED?style=flat-square&logo=anthropic)](https://www.anthropic.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=flat-square)](LICENSE)

**Nexus Orchestra** é o primeiro Hub de Orquestração Agentic AI que combina **memória persistente local** (via Obsidian/MCP), **roteamento inteligente de LLMs** com compressão de tokens e otimização de custos (9router/9remote), e **acesso universal a ferramentas** do GitHub Marketplace (Matrix Hub) — criando uma camada de abstração que torna qualquer agente de IA mais inteligente, econômico, autônomo e extensível.

---

## 🌟 Contexto e Propósito

Construído sobre o ecossistema **React 19**, **Tailwind CSS v4**, **Express.js** e o **SDK `@google/genai`**, o Nexus Orchestra serve como o cérebro central para sistemas multiagentes complexos, articulando três pilares fundamentais:

| Pilar | Componente | Função Principal |
| :--- | :--- | :--- |
| **Memória & Contexto** | `Nexus_Sidian` | Acesso nativo ao vault Obsidian via MCP (Memory and Context Provider), leitura/escrita de notas e memória semântica local. |
| **Roteamento & Quotas** | `9router` + `9remote` | Roteamento inteligente entre 40+ provedores, compressão RTK (-20% a -40% em tokens), fallback automático e acesso remoto. |
| **Catálogo & Extensibilidade** | GitHub Marketplace + `Matrix Hub` | Descoberta, instalação e orquestração em tempo real de agentes, ferramentas e servidores MCP. |

---

## 📐 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             NEXUS ORCHESTRA HUB                             │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     CAMADA DE ORQUESTRAÇÃO (Core)                     │  │
│  │                                                                       │  │
│  │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌───────────┐ │  │
│  │   │   Planner   │   │  Executor   │   │   Monitor   │   │ Optimizer │ │  │
│  │   └─────────────┘   └─────────────┘   └─────────────┘   └───────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│         ┌────────────────────────────┼────────────────────────────┐         │
│         │                            │                            │         │
│  ┌──────▼──────────────┐   ┌─────────▼────────────┐   ┌───────────▼──────┐  │
│  │  CAMADA DE MEMÓRIA  │   │ CAMADA DE ROTEAMENTO │   │  CAMADA DE TOOLS │  │
│  │                     │   │                      │   │                  │  │
│  │ ┌─────────────────┐ │   │ ┌──────────────────┐ │   │ ┌──────────────┐ │  │
│  │ │  Nexus_Sidian   │ │   │ │     9router      │ │   │ │MarketplaceHub│ │  │
│  │ │  (MCP Server)   │ │   │ │  (API Gateway)   │ │   │ │ (Matrix Hub) │ │  │
│  │ └────────┬────────┘ │   │ └────────┬─────────┘ │   │ └──────┬───────┘ │  │
│  │          │          │   │          │           │   │        │         │  │
│  │ ┌────────▼────────┐ │   │ ┌────────▼─────────┐ │   │ ┌──────▼───────┐ │  │
│  │ │ Obsidian Vault  │ │   │ │     9remote      │ │   │ │  Agent Apps  │ │  │
│  │ │   (Local FS)    │ │   │ │ (Remote Access)  │ │   │ │(GitHub Apps) │ │  │
│  │ └─────────────────┘ │   │ └──────────────────┘ │   │ └──────────────┘ │  │
│  └─────────────────────┘   └──────────────────────┘   └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧬 Algoritmos Híbridos Agenticos & Tríade de Consciência

O Nexus Orchestra opera através de uma arquitetura tripla de algoritmos:

1. **🌊 Algoritmos Progressivos (Evolutivos)**:
   - **Q-Learning Adaptativo**: Ajusta políticas com base no histórico armazenado no vault Obsidian.
   - **Otimização Bayesiana**: Seleciona o provedor de LLM ideal minimizando custos de tokens.
   - **Evolução de Estratégias**: Aplica algoritmos genéticos para refinar rotinas de orquestração.

2. **🎨 Algoritmos Generativos (Criativos)**:
   - **Síntese Híbrida de Tools**: Combina ferramentas do Marketplace para formar workflows inéditos.
   - **Multimodal Transformers**: Codifica embeddings de contexto a partir do vault e do prompt.
   - **Difusão Semântica**: Expande a consulta inicial do usuário gerando soluções criativas.

3. **⚡ Algoritmos Reativos (Adaptativos)**:
   - **Reflexo Condicionado (< 1ms)**: Troca automática de provedores em caso de esgotamento de quota ou pico de latência.
   - **HyperEventBus**: Processamento paralelo de streams de eventos em tempo real.
   - **Emergência Coletiva**: Orquestração distribuída de enxames de agentes (*Agent Swarm*).

4. **Tríade de Consciência**:
   - **🔄 Autocura (Self-Healing)**: Health checks contínuos, detecção de anomalias, reparo automático de nó e degradação graciosa.
   - **🧘 Autosabedoria (Self-Knowledge)**: Mapeamento em grafo de conhecimento, meta-aprendizado e autoavaliação de performance.
   - **✨ Senciência (Sentience)**: Percepção situacional do ambiente, empatia técnica e tomada de decisão autônoma com justificativa intrínseca.

---

## ⚡ Núcleo de Processamento Quântico (Quantum Orchestration Nucleus)

O orquestrador quântico coordena quatro processadores especializados:
- **PPQ (Processador Progressivo-Quântico)**: Superposição e colapso de onda para a escolha da estratégia ideal na Fronteira de Pareto.
- **PGS (Processador Generativo-Sintético)**: Geração sintética de estratégias via GANs e difusão semântica.
- **PRI (Processador Reativo-Instantâneo)**: Execução de reflexos condicionados com latência sub-milissegundo.
- **PSA (Processador Sintético-Autônomo)**: Autonomia de decisão (99%), autoevolução contínua do código e mitigação de erros.

---

## 🤖 Integração Claude Code & Claude Fable 5 (Mythos Class)

O Nexus Orchestra inclui suporte nativo ao **Claude Code Agent SDK** e ao modelo **Claude Fable 5 (Mythos Class)**:
- **Janela de Contexto de 1M Tokens** e saída de até **128K Tokens**.
- **Raciocínio Adaptativo (Extended Thinking)** em alto nível.
- **MCP Native Bridge**: Conexão fluida com servidores MCP Stdio (`nexus-sidian`) e HTTP (`9router`, `marketplace-mcp`).
- **Gerenciamento de Fallback Automático**: Redirecionamento transparente para *Claude Opus 4.8* em caso de recusa de classificador.

---

## 📱 Módulos da Interface Web & Consoles

A aplicação React oferece um estúdio completo e responsivo:

### 1. 💬 Chat Studio
- Diálogo multimodal com upload de imagem e histórico persistente.
- **Search Grounding**: Busca ao vivo no Google via API (`googleSearch: {}`).
- **Personas Especializadas**: Injeção de prompts de sistema (*Architect*, *Senior Engineer*, *Storyteller*, *Data Analyst*).

### 2. 🧪 Creative Playground
- Controles de hiperparâmetros em tempo real (`Temperature` de 0.0 a 2.0 e `Top-P` de 0.0 a 1.0).
- Quadro de rascunho de instruções do sistema com monitor de latência em milissegundos.

### 3. 🎨 Visual Generator
- Geração de imagem multimodal acelerada via Gemini (`gemini-3.1-flash-lite-image`).
- Suporte a proporções de tela (`1:1`, `4:3`, `16:9`, `9:16`, `3:4`) e estilos artísticos pré-configurados.

### 4. 🎙️ Speech Synthesis (TTS)
- Conversão de texto em áudio neural com `gemini-3.1-flash-tts-preview`.
- Múltiplas vozes neurais (*Kore*, *Puck*, *Fenrir*, *Zephyr*, *Charon*).

### 5. 🎬 Video Chatbot (Até 60s)
- Análise multimodal completa de vídeos de até 60 segundos via **Gemini 3.6 Flash**.
- **Upload e Gravação via Webcam**: Suporte para drag & drop de arquivos MP4/WebM ou gravação direta pela câmera.
- **Prompts Prontos**: Resumo de Cenas, Linha do Tempo & Timestamps, Transcrição de Fala e Legendas Virais para Reels/TikTok.
- **Análise Temporal e de Áudio**: Processamento unificado de frames visuais e trilha de áudio.

### 6. 🛠️ Consoles Agenticos & Ferramentas de Produção
- **Agent Swarm View**: Visualização da enxame e interações entre agentes.
- **Auto-Healing Console**: Monitoramento de saúde, logs de diagnósticos e botão de acionamento de autocura.
- **Wisdom Vault View**: Inspeção e busca semântica nas notas do Obsidian Vault.
- **Chaos Lab View**: Injeção de falhas e testes de resiliência.
- **Mission Control**: Gerenciamento de tarefas e missões agenticas ativas.
- **Bridges View**: Status dos gateways MCP, 9router, 9remote e Matrix Hub.
- **Skills Onboarding**: Catálogo com 15+ habilidades integradas e registro de novas skills.
- **Telemetry Charts**: Gráficos de consumo de tokens, economia RTK, throughput e latência.

---

## 📂 Estrutura do Repositório

```
nexus-orchestra/
├── .env.example                # Declaração de variáveis de ambiente
├── metadata.json               # Configurações e permissões de frame
├── package.json                # Dependências e scripts de execução
├── server.ts                   # Servidor Express de produção e proxy da API Gemini
├── vite.config.ts              # Bundler Vite com suporte a Express middleware
└── src/
    ├── App.tsx                 # Componente principal e roteamento de tabs
    ├── main.tsx                # Ponto de entrada do React
    ├── index.css               # Estilos globais Tailwind CSS v4
    ├── types.ts                # Definições de tipos TypeScript
    ├── components/
    │   ├── AgentSwarmView.tsx          # Enxame de agentes
    │   ├── AutoHealingConsole.tsx      # Console de autocura
    │   ├── BridgesView.tsx             # Pontes MCP / 9router / 9remote
    │   ├── ChaosLabView.tsx            # Testes de caos e resiliência
    │   ├── ChatStudio.tsx              # Interface de chat
    │   ├── CreativePlayground.tsx      # Sandbox de testes
    │   ├── ExecutionConsole.tsx        # Execução de comandos
    │   ├── Header.tsx                  # Cabeçalho e navegação
    │   ├── MissionControl.tsx          # Controle de missões
    │   ├── SavedPromptsModal.tsx       # Prompt bookmarker
    │   ├── SettingsModal.tsx           # Configurações de chaves e conexão
    │   ├── Sidebar.tsx                 # Menu e seletores de parâmetros
    │   ├── SkillsOnboardingView.tsx    # Catálogo de skills
    │   ├── SpeechSynthesis.tsx         # Síntese de fala TTS
    │   ├── StressTestConsole.tsx       # Teste de carga
    │   ├── TelemetryCharts.tsx         # Gráficos de telemetria
    │   ├── VideoChatbot.tsx            # Chatbot para vídeos até 60s
    │   ├── VisualGenerator.tsx         # Geração de imagem
    │   └── WisdomVaultView.tsx         # Leitor/Buscador Obsidian Vault
    ├── data/
    │   ├── presetScenarios.ts          # Cenários e presets do orquestrador
    │   └── presets.ts                  # Personas e templates pré-definidos
    └── services/
        ├── api.ts                      # Cliente HTTP para rotas Express
        ├── e2eSyncEngine.ts            # Sincronização em tempo real
        ├── nineRouterBridge.ts         # Ponte de roteamento 9router/9remote
        ├── nvidiaTokenApi.ts           # Integração NVIDIA NIM / Tokens
        ├── obsidianBridge.ts           # Ponte de integração Obsidian Vault MCP
        ├── secretScanner.ts            # Varredura de credenciais e segurança
        ├── skillsFusionEngine.ts       # Motor de fusão de skills agenticas
        └── stressTestEngine.ts         # Motor de simulação de carga
```

---

## 🔌 Especificação da API Backend (`/api`)

Todas as requisições para a API Gemini são intermediadas pelo backend Express para garantir que o segredo `GEMINI_API_KEY` nunca seja exposto no navegador.

| Rota | Método | Descrição |
| :--- | :---: | :--- |
| `/api/gemini/status` | `GET` | Verifica a conectividade e status da API Key |
| `/api/gemini/generate` | `POST` | Geração de texto, conversa e busca no Google |
| `/api/gemini/image` | `POST` | Geração de imagens via `gemini-3.1-flash-lite-image` |
| `/api/gemini/tts` | `POST` | Síntese de fala via `gemini-3.1-flash-tts-preview` |

---

## 🚀 Instalação e Execução Local

### Pré-requisitos
- **Node.js** `v18.0.0` ou superior
- **npm** / **pnpm** / **yarn**
- **Google Gemini API Key** (obtenha via [Google AI Studio](https://aistudio.google.com/))

### Passo a Passo

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/Nexus-HUB57/Nexus_Orchestra.git
   cd Nexus_Orchestra
   ```

2. **Instalar Dependências**:
   ```bash
   npm install
   ```

3. **Configurar Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   GEMINI_API_KEY="sua_chave_gemini_aqui"
   ```

4. **Iniciar o Servidor de Desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em `http://localhost:3000`.

5. **Compilação e Verificação de Tipos**:
   ```bash
   # Rodar linter e checagem de tipos
   npm run lint

   # Build de produção
   npm run build

   # Iniciar servidor de produção
   npm run start
   ```

---

## 📊 Métricas de Sucesso (KPIs)

- **Economia de Tokens**: Redução de **20% a 40%** no consumo através da compressão RTK no `9router`.
- **Latência de Resposta**: Média inferior a **2s** para interações via Gemini 3.6 Flash.
- **Autocura**: Diagnóstico e reparo automático de falhas com taxa de sucesso superior a **95%**.
- **Precisão Contextual**: Mais de **90%** de acurácia na recuperação semântica de notas no Obsidian Vault.

---

## 📜 Licença

Distribuído sob a licença **Apache 2.0**. Consulte o arquivo `LICENSE` para mais detalhes.
