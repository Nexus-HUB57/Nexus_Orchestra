import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  Upload,
  Camera,
  Play,
  Square,
  Sparkles,
  Send,
  Trash2,
  Clock,
  FileVideo,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Zap,
  MessageSquare,
  Film,
  ListOrdered,
  Mic,
  Tag,
  Info
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage, VideoMetadata } from '../types';

interface VideoChatbotProps {
  temperature?: number;
  topP?: number;
}

const PRESET_PROMPTS = [
  {
    id: 'summary',
    label: '🔍 Resumo de Cenas',
    icon: Film,
    prompt: 'Faça um resumo analítico detalhado do vídeo. Destaque o cenário, os sujeitos principais e o enredo geral.',
  },
  {
    id: 'timestamps',
    label: '⏱️ Linha do Tempo & Timestamps',
    icon: ListOrdered,
    prompt: 'Crie uma linha do tempo minuciosa em formato de tabela com timestamps (ex: 00:05, 00:15) descrevendo as ações ocorridas a cada trecho.',
  },
  {
    id: 'audio_transcript',
    label: '🗣️ Transcrição & Tom',
    icon: Mic,
    prompt: 'Transcreva os áudios e diálogos presentes no vídeo e identifique o tom emocional e ritmo da comunicação.',
  },
  {
    id: 'social_media',
    label: '📱 Legenda para TikTok/Reels',
    icon: Tag,
    prompt: 'Crie uma legenda viral para redes sociais (TikTok/Reels/Shorts) baseada neste vídeo, com hook magnético, 5 hashtags e call-to-action.',
  },
];

// Sample lightweight canvas synthetic video generator for immediate testing
function createSampleVideoBlob(): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    const stream = canvas.captureStream(30);

    // Audio synth tone
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const dst = audioCtx.createMediaStreamDestination();
    osc.connect(dst);
    osc.frequency.value = 440;
    osc.start();

    const combinedStream = new MediaStream([
      ...stream.getVideoTracks(),
      ...dst.stream.getAudioTracks(),
    ]);

    const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      osc.stop();
      audioCtx.close();
      resolve(new Blob(chunks, { type: 'video/webm' }));
    };

    recorder.start();

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      if (!ctx) return;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 640, 360);

      // Draw dynamic animations
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.arc(320 + Math.sin(frame / 10) * 100, 180, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('Nexus Orchestra - Video Sample Test', 120, 60);
      ctx.font = '18px monospace';
      ctx.fillText(`Frame: ${frame} | Time: ${(frame / 30).toFixed(1)}s`, 220, 260);

      if (frame >= 90) { // 3 seconds video
        clearInterval(interval);
        recorder.stop();
      }
    }, 1000 / 30);
  });
}

export const VideoChatbot: React.FC<VideoChatbotProps> = ({
  temperature = 0.7,
  topP = 0.95,
}) => {
  // Video state
  const [videoMeta, setVideoMeta] = useState<VideoMetadata | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [durationError, setDurationError] = useState<string | null>(null);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const liveVideoPreviewRef = useRef<HTMLVideoElement | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Video File Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processVideoFile(file);
  };

  const processVideoFile = async (file: File | Blob, customName?: string) => {
    setDurationError(null);
    setIsUploading(true);

    const fileName = customName || (file as File).name || 'video_input.webm';
    const fileSizeMb = Number(((file.size || 0) / (1024 * 1024)).toFixed(2));
    const objectUrl = URL.createObjectURL(file);

    // Calculate video duration
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = objectUrl;

    tempVideo.onloadedmetadata = async () => {
      const duration = Math.round(tempVideo.duration || 0);

      if (duration > 65) {
        setDurationError(
          `O vídeo selecionado possui ${duration} segundos. O limite ideal para este Chatbot de Vídeos é de 60 segundos.`
        );
      }

      // Read file to base64
      const reader = new FileReader();
      reader.onload = () => {
        const resultStr = reader.result as string;
        const base64Data = resultStr.split(',')[1];
        const mimeType = file.type || 'video/mp4';

        setVideoMeta({
          fileName,
          durationSeconds: duration,
          fileSizeMb,
          mimeType,
          previewUrl: objectUrl,
          base64Data,
          recordedAt: new Date().toLocaleTimeString(),
        });
        setIsUploading(false);
      };
      reader.onerror = () => {
        setDurationError('Erro ao ler o arquivo de vídeo.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    };

    tempVideo.onerror = () => {
      setDurationError('Não foi possível processar este formato de vídeo.');
      setIsUploading(false);
    };
  };

  // Webcam Recording Controls
  const startRecording = async () => {
    setDurationError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      webcamStreamRef.current = stream;

      if (liveVideoPreviewRef.current) {
        liveVideoPreviewRef.current.srcObject = stream;
        liveVideoPreviewRef.current.play();
      }

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        // Stop webcam tracks
        stream.getTracks().forEach((track) => track.stop());
        if (liveVideoPreviewRef.current) {
          liveVideoPreviewRef.current.srcObject = null;
        }
        await processVideoFile(blob, `gravação_webcam_${Date.now()}.webm`);
      };

      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((prev) => {
          if (prev >= 59) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Webcam access error:', err);
      setDurationError('Não foi possível acessar a câmera/microfone. Verifique as permissões.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
  };

  // Generate Sample Video
  const handleLoadSampleVideo = async () => {
    setIsUploading(true);
    try {
      const sampleBlob = await createSampleVideoBlob();
      await processVideoFile(sampleBlob, 'amostra_teste_nexus.webm');
    } catch (e) {
      console.error(e);
      setIsUploading(false);
    }
  };

  // Send Prompt to Gemini Video Chat Endpoint
  const handleSendMessage = async (promptOverride?: string) => {
    const textToSend = promptOverride || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    if (!videoMeta) {
      setDurationError('Por favor, envie um vídeo de até 60s antes de iniciar a análise.');
      return;
    }

    const userMessageId = Date.now().toString();
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      videoUrl: videoMeta.previewUrl,
      videoMetadata: videoMeta,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    if (!promptOverride) setInputPrompt('');
    setIsLoading(true);

    try {
      // Build request body for /api/gemini/generate with video payload
      const payload: any = {
        prompt: textToSend,
        temperature,
        topP,
        systemInstruction: `Você é o Chatbot de Análise de Vídeo do Nexus Orchestra, um especialista em inteligência artificial multimodal. Analise o vídeo enviado (até 60s) com alta precisão técnica em relação às cenas, movimentos, fala, áudio, objetos e timestamps. Seja direto, claro e estruturado.`,
        video: {
          mimeType: videoMeta.mimeType,
          data: videoMeta.base64Data,
        },
        history: messages.map((m) => ({
          role: m.role,
          text: m.text || m.content || '',
        })),
      };

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Erro HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.text || 'Não foi possível gerar resposta para o vídeo.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingChunks: data.groundingChunks,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Video Chatbot error:', err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `⚠️ **Erro na análise do vídeo**: ${err.message || 'Ocorreu uma falha ao enviar os frames do vídeo para a API Gemini.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Chatbot para Vídeos (Até 60s)</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                Gemini 3.6 Multimodal
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Upload ou gravação de vídeo até 60 segundos com análise de cenas, áudio e timestamps.
            </p>
          </div>
        </div>

        {videoMeta && (
          <button
            onClick={() => {
              setVideoMeta(null);
              setMessages([]);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Limpar Vídeo
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        {/* Left Column: Video Selector / Recording / Controls */}
        <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0 overflow-y-auto">
          {/* Duration Error / Alert */}
          {durationError && (
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Atenção ao Vídeo</p>
                <p className="mt-0.5 text-[11px] text-amber-700 leading-relaxed">{durationError}</p>
              </div>
            </div>
          )}

          {/* Active Video Display OR Upload Box */}
          {videoMeta ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Vídeo Ativo Pronto
                </span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-mono font-bold">
                  {videoMeta.durationSeconds}s / 60s
                </span>
              </div>

              {/* HTML5 Video Player */}
              <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden group shadow-inner">
                <video
                  src={videoMeta.previewUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Metadata Details */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">NOME</span>
                  <p className="font-semibold text-slate-800 truncate">{videoMeta.fileName}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TAMANHO</span>
                  <p className="font-semibold text-slate-800">{videoMeta.fileSizeMb} MB</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">DURAÇÃO</span>
                  <p className="font-semibold text-slate-800">{videoMeta.durationSeconds}s</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">FORMATO</span>
                  <p className="font-semibold text-slate-800 uppercase">{videoMeta.mimeType.split('/')[1]}</p>
                </div>
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Substituir
                </button>
                <button
                  onClick={() => setVideoMeta(null)}
                  className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all"
                  title="Remover Vídeo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-slate-800">Carregar Vídeo (Máx. 60s)</h3>
                <p className="text-xs text-slate-500">Envie um arquivo MP4/WebM ou grave diretamente da câmera</p>
              </div>

              {/* Webcam Live Preview if recording */}
              {isRecording ? (
                <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border-2 border-rose-500 shadow-md">
                  <video
                    ref={liveVideoPreviewRef}
                    muted
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute top-3 left-3 bg-rose-600 text-white px-2.5 py-1 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    REC 00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds} / 00:60
                  </div>
                  <button
                    onClick={stopRecording}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    Parar Gravação
                  </button>
                </div>
              ) : (
                /* Drag Drop Upload Box */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/30 rounded-xl p-6 text-center cursor-pointer transition-all space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    {isUploading ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <FileVideo className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Clique para selecionar um vídeo</p>
                    <p className="text-[11px] text-slate-400 mt-1">MP4, WebM, MOV ou AVI (Até 60s)</p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/avi"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Action Buttons: Webcam & Sample */}
              {!isRecording && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={startRecording}
                    disabled={isUploading}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <Camera className="w-4 h-4 text-rose-400" />
                    Gravar Webcam
                  </button>
                  <button
                    onClick={handleLoadSampleVideo}
                    disabled={isUploading}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Usar Amostra
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Preset Prompts Chips */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              Prompts Prontos para Vídeo
            </h4>
            <div className="space-y-1.5">
              {PRESET_PROMPTS.map((preset) => {
                const IconComp = preset.icon;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setInputPrompt(preset.prompt);
                      if (videoMeta) handleSendMessage(preset.prompt);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200/70 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/50 text-slate-700 text-xs font-medium transition-all flex items-center gap-2 group"
                  >
                    <IconComp className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="truncate">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat Messages Area */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Diálogo Multimodal do Vídeo</span>
              {messages.length > 0 && (
                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                  {messages.length} msg
                </span>
              )}
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Limpar Histórico
              </button>
            )}
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Film className="w-7 h-7" />
                </div>
                <div className="max-w-md">
                  <h4 className="text-sm font-bold text-slate-700">Ainda não há conversas neste vídeo</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Carregue um vídeo de até 60s no painel ao lado e faça perguntas sobre cenas, diálogos, movimentos ou peça timestamps e legendas.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} text-xs`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 space-y-2 shadow-2xs ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : msg.isError
                          ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-none'
                          : 'bg-slate-100 text-slate-800 border border-slate-200/60 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-70 border-b border-white/10 pb-1">
                        <span className="font-bold uppercase tracking-wider">
                          {isUser ? 'Você' : 'Nexus Video AI'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Attached Video Badge if User */}
                      {isUser && msg.videoMetadata && (
                        <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg text-[11px] font-mono">
                          <FileVideo className="w-3.5 h-3.5 text-purple-300" />
                          <span className="truncate">{msg.videoMetadata.fileName}</span>
                          <span className="ml-auto font-bold">{msg.videoMetadata.durationSeconds}s</span>
                        </div>
                      )}

                      <div className="prose prose-xs max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100">
                        <Markdown>{msg.text || msg.content}</Markdown>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-purple-50 border border-purple-200 text-purple-900 rounded-2xl rounded-tl-none p-4 max-w-[80%] flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-600 shrink-0" />
                  <span className="text-xs font-semibold">
                    Analisando os frames visuais e trilha de áudio do vídeo via Gemini 3.6...
                  </span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/80">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  videoMeta
                    ? 'Digite sua pergunta sobre o vídeo (ex: Descreva a ação aos 0:10)...'
                    : 'Carregue um vídeo primeiro...'
                }
                disabled={!videoMeta || isLoading}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition-all disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!videoMeta || !inputPrompt.trim() || isLoading}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
              >
                <span>Enviar</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
