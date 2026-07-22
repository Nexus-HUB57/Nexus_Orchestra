# Nexus Orchestra — Gemini AI Studio Workspace

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![Google GenAI](https://img.shields.io/badge/Google_GenAI_SDK-2.4-4285F4?style=flat-square&logo=googlecloud)](https://github.com/google-gemini/deprecations)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=flat-square)](LICENSE)

**Nexus Orchestra** is an enterprise-grade, full-stack multimodal AI workspace built with **React 19**, **Tailwind CSS v4**, **Express.js**, and the **Google `@google/genai` TypeScript SDK**. It provides a unified studio interface for conversational intelligence, prompt engineering, multimodal image creation, and text-to-speech audio synthesis powered by Google's latest Gemini models.

---

## 📐 System Architecture Overview

```
                        ┌──────────────────────────────────────────────┐
                        │              Client Browser (SPA)            │
                        │   React 19 + Tailwind v4 + Lucide Icons      │
                        └──────────────────────┬───────────────────────┘
                                               │
                                  HTTP REST / JSON Payload
                                               │
                        ┌──────────────────────▼───────────────────────┐
                        │           Express.js Backend Proxy           │
                        │    (Keeps GEMINI_API_KEY server-side)       │
                        └──────────────────────┬───────────────────────┘
                                               │
                                Google `@google/genai` SDK
                                               │
       ┌───────────────────────────────┼───────────────────────────────┐
       │                               │                               │
┌──────▼──────┐                 ┌──────▼──────┐                 ┌──────▼──────┐
│ Gemini 3.6  │                 │ Gemini 3.1  │                 │ Gemini 3.1  │
│ Flash       │                 │ Flash Lite  │                 │ Flash TTS   │
│ (Text/Chat) │                 │ Image       │                 │ Preview     │
└─────────────┘                 └─────────────┘                 └─────────────┘
```

---

## 🌟 Core Modules & Functionality

### 1. 💬 Chat Studio (`/src/components/ChatStudio.tsx`)
- **Multimodal Messaging**: Supports raw text, inline base64 image inspection, and contextual multi-turn conversation history.
- **Search Grounding**: Live web information retrieval integrated via Google Search grounding capabilities (`googleSearch: {}`).
- **System Persona Injection**: Switch dynamically between specialized roles (*Senior Engineer*, *Storyteller*, *Data Analyst*, *Patient Educator*).
- **Inline Operations**: One-click prompt bookmarking, response copying, and stream regeneration.

### 2. 🧪 Creative Playground (`/src/components/CreativePlayground.tsx`)
- **Hyperparameter Tuning**: Real-time control over `Temperature` (0.0 to 2.0) and `Top-P` (0.0 to 1.0) sampling.
- **System Instruction Canvas**: Override and test model directives independently from user prompts.
- **Performance Profiling**: Embedded execution timer tracking API latency in milliseconds (`ms`).

### 3. 🎨 Visual Studio (`/src/components/VisualGenerator.tsx`)
- **Multimodal Generation**: Driven by `gemini-3.1-flash-lite-image`.
- **Aspect Ratio Control**: Support for `1:1`, `4:3`, `16:9`, `9:16`, and `3:4` canvas framing.
- **Artistic Style Modifiers**: Photorealistic, Anime/Manga, Minimalist 3D, Cyberpunk Neon, and Impasto Oil Painting presets.
- **Full Resolution Exports**: High-definition image modal lightbox with instant local PNG downloads.

### 4. 🎙️ Speech Synthesis Studio (`/src/components/SpeechSynthesis.tsx`)
- **Neural Speech Synthesis**: Utilizes `gemini-3.1-flash-tts-preview` with native `Modality.AUDIO` response output.
- **Voice Characters**: Integrated voice signatures including *Kore* (Warm), *Puck* (Expressive), *Fenrir* (Deep), *Zephyr* (Calm), and *Charon* (Authoritative).
- **Audio Output**: Embedded HTML5 audio player and `.wav` format file downloads.

### 5. 📚 Saved Prompts Library (`/src/components/SavedPromptsModal.tsx`)
- **Prompt Manager**: Client-side storage (`localStorage`) for categorizing, filtering, searching, and managing prompt engineering bookmarks.

---

## 🔌 API Endpoint Specifications

All Gemini API calls are securely proxied through Express routes to ensure secret credentials never leak to the client browser.

| Endpoint | Method | Description | Request Body Payload |
| :--- | :---: | :--- | :--- |
| `/api/gemini/status` | `GET` | Health check & API key configuration state | *None* |
| `/api/gemini/generate` | `POST` | Text generation, chat, & search grounding | `{ prompt, systemInstruction, temperature, topP, searchGrounding, history, image }` |
| `/api/gemini/image` | `POST` | Multimodal text-to-image synthesis | `{ prompt, aspectRatio }` |
| `/api/gemini/tts` | `POST` | Text-to-speech audio synthesis | `{ text, voiceName }` |

---

## 📂 Project Directory Structure

```
├── .env.example               # Environment variable declaration blueprint
├── index.html                 # Main SPA entry point & font preloads
├── metadata.json              # Platform applet configuration & frame permissions
├── package.json               # Manifest dependencies & run scripts
├── server.ts                  # Production Express.js server & static file host
├── tsconfig.json              # TypeScript compiler options
├── vite.config.ts             # Vite bundler config with custom Express middleware
└── src/
    ├── App.tsx                # Main application component & layout state
    ├── index.css              # Global CSS & Tailwind CSS v4 setup
    ├── main.tsx               # DOM mounting entry point
    ├── components/
    │   ├── ChatStudio.tsx            # Conversational interface
    │   ├── CreativePlayground.tsx    # Parameter sandbox
    │   ├── Header.tsx                # Top navigation & status bar
    │   ├── SavedPromptsModal.tsx     # Library modal
    │   ├── SettingsModal.tsx         # Connection & key inspector
    │   ├── Sidebar.tsx               # Navigation & parameter panel
    │   ├── SpeechSynthesis.tsx       # TTS studio
    │   └── VisualGenerator.tsx       # Image studio
    ├── data/
    │   └── presets.ts         # Persona definitions & prompt templates
    ├── server/
    │   └── geminiApi.ts       # Express router & @google/genai SDK handler
    └── types/
        └── index.ts           # Core TypeScript interfaces & enums
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **bun** / **pnpm**
- **Google Gemini API Key**: Obtainable via [Google AI Studio](https://aistudio.google.com/)

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nexus-HUB57/Nexus_Orchestra.git
   cd Nexus_Orchestra
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Access the application interface at `http://localhost:3000`.

---

## ⚡ Build & Deployment Scripts

```bash
# Start development server on port 3000
npm run dev

# Run TypeScript compiler checks
npm run lint

# Compile frontend build artifacts
npm run build

# Start production server
npm run start
```

---

## 🛡️ Security & Best Practices

- **Zero Client Key Exposure**: `GEMINI_API_KEY` is loaded strictly on the Node.js / Express backend layer using `process.env.GEMINI_API_KEY`.
- **Input Sanitization**: Request bodies are parsed with explicit size limits (`10mb`) to handle base64 image data safely.
- **Fail-Safe Fallbacks**: Informative error responses are returned when API quotas or invalid parameters are provided.

---

## 📜 License

Distributed under the **Apache-2.0 License**. See `LICENSE` for more information.
