# Nexus Orchestra — Gemini AI Studio

An interactive, full-stack multimodal AI workspace powered by **Google Gemini 3.6 Flash**, **React 19**, **Tailwind CSS v4**, and **Express.js**.

---

## 🌟 Key Features

- 💬 **Chat Studio**: Interactive conversational AI workspace with customizable system personas, message history, image attachments, and Google Search Grounding for real-time web context.
- 🧪 **Creative Playground**: Real-time prompt engineering sandbox to test system instructions, hyperparameter adjustments (Temperature, Top P), and pre-built templates with execution timing.
- 🎨 **Visual Studio**: High-quality text-to-image generator using `gemini-3.1-flash-lite-image` with configurable aspect ratios, style presets, and instant PNG downloads.
- 🎙️ **Speech Synthesis (TTS)**: Natural text-to-speech engine powered by `gemini-3.1-flash-tts-preview` with multiple distinct voice characters (Kore, Puck, Fenrir, Zephyr, Charon) and downloadable WAV output.
- 📚 **Saved Prompts Library**: Bookmark, filter, and reuse your favorite prompts across sessions with local storage persistence.
- 🔒 **Secure Server-Side Architecture**: API keys remain safely guarded behind Express `/api/gemini` backend proxy endpoints.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Motion animations.
- **Backend / API**: Express v4 server, `@google/genai` TypeScript SDK.
- **Build System**: Vite v6, `tsx` for TypeScript execution, esbuild.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- `GEMINI_API_KEY` configured in your environment variables.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nexus-HUB57/Nexus_Orchestra.git
   cd Nexus_Orchestra
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and insert your Gemini API Key:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key"
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 📄 License

Apache-2.0 License
