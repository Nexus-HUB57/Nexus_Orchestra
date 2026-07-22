import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Copy,
  Maximize2,
  X,
  Loader2,
  Ratio,
  Palette,
} from 'lucide-react';
import { GeneratedImageItem } from '../types';

export const VisualGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [gallery, setGallery] = useState<GeneratedImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImageItem | null>(null);

  const styleChips = [
    { label: 'Photorealistic', suffix: ', highly detailed photorealistic, 8k resolution, cinematic lighting' },
    { label: 'Anime & Manga', suffix: ', vibrant anime style, clean line-art, makoto shinkai aesthetic' },
    { label: 'Minimalist 3D', suffix: ', clean minimalist 3D render, soft clay material, studio lighting' },
    { label: 'Cyberpunk Neon', suffix: ', glowing neon cyberpunk aesthetic, rain-slicked futuristic streets' },
    { label: 'Oil Painting', suffix: ', rich textured impasto oil painting, impressionist brushstrokes' },
  ];

  const samplePrompts = [
    'A futuristic floating glass citadel suspended above a calm cloud ocean at sunset',
    'An adorable mechanical fox exploring an overgrown mossy ancient ruin',
    'A cozy minimalist coffee shop interior with warm ambient lighting and rain outside',
    'A majestic cosmic whale swimming through a starry nebula in deep space',
  ];

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    const fullPrompt = selectedStyle
      ? `${prompt.trim()}${styleChips.find((s) => s.label === selectedStyle)?.suffix || ''}`
      : prompt.trim();

    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          aspectRatio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      const newItem: GeneratedImageItem = {
        id: Date.now().toString(),
        prompt: fullPrompt,
        aspectRatio,
        imageUrl: data.imageUrl,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        caption: data.caption,
      };

      setGallery((prev) => [newItem, ...prev]);
    } catch (err: any) {
      alert(`Image Generation Error: ${err.message || 'An error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, promptText: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `gemini-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto p-4 lg:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Gemini Visual Studio</h2>
            <p className="text-xs text-slate-500">
              Generate images from text prompts using Gemini's image generation model (`gemini-3.1-flash-lite-image`).
            </p>
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create..."
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none resize-none"
          />

          {/* Quick Style Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-purple-600" />
              Style:
            </span>
            {styleChips.map((style) => (
              <button
                key={style.label}
                onClick={() => setSelectedStyle(selectedStyle === style.label ? '' : style.label)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                  selectedStyle === style.label
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            {/* Aspect Ratio Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Ratio className="w-3.5 h-3.5 text-indigo-600" />
                Aspect Ratio:
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {['1:1', '4:3', '16:9', '9:16', '3:4'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                      aspectRatio === ratio
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateImage}
              disabled={isLoading || !prompt.trim()}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Art...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Image
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prompt Starters */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sample Inspirations</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePrompts.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(sample)}
                className="text-left text-xs text-slate-600 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 p-2 rounded-lg border border-slate-200/60 transition-colors line-clamp-1"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Gallery Stream */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span>Generated Gallery</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-mono">
            {gallery.length}
          </span>
        </h3>

        {gallery.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-400 space-y-2">
            <ImageIcon className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No images generated yet.</p>
            <p className="text-[11px] text-slate-400">Enter a prompt above and click "Generate Image" to create artwork.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative overflow-hidden bg-slate-100 flex items-center justify-center min-h-[200px]">
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedImage(item)}
                      className="p-2 bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-colors shadow-md"
                      title="Enlarge"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(item.imageUrl, item.prompt)}
                      className="p-2 bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-colors shadow-md"
                      title="Download PNG"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-800 font-medium line-clamp-2">{item.prompt}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="font-mono">{item.aspectRatio}</span>
                    <span>{item.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-4 overflow-hidden shadow-2xl relative space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">Generated Artwork</span>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.prompt}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {selectedImage.prompt}
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleDownload(selectedImage.imageUrl, selectedImage.prompt)}
                className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Download Full Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
