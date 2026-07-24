import { Router, Request, Response } from 'express';
import { GoogleGenAI, Modality } from '@google/genai';

export const geminiRouter = Router();

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Check configuration status
geminiRouter.get('/status', (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({ configured: hasKey });
});

// Text & Chat Generation
geminiRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      systemInstruction,
      temperature = 0.7,
      topP = 0.95,
      searchGrounding = false,
      history = [],
      image,
      video,
      media,
    } = req.body;

    if (!prompt && !image && !video && !media) {
      res.status(400).json({ error: 'Prompt, image, or video input is required.' });
      return;
    }

    const ai = getGenAIClient();

    // Build contents array for chat/multimodal
    const contents: any[] = [];

    // Add prior context if history exists
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text || msg.content }],
        });
      }
    }

    // Build current prompt part
    const currentParts: any[] = [];
    if (image && image.data && image.mimeType) {
      currentParts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      });
    }

    if (video && video.data && video.mimeType) {
      currentParts.push({
        inlineData: {
          mimeType: video.mimeType,
          data: video.data,
        },
      });
    }

    if (media && media.data && media.mimeType) {
      currentParts.push({
        inlineData: {
          mimeType: media.mimeType,
          data: media.data,
        },
      });
    }

    if (prompt) {
      currentParts.push({ text: prompt });
    }

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    const config: any = {
      temperature: Number(temperature),
      topP: Number(topP),
    };

    if (systemInstruction) {
      config.systemInstruction = String(systemInstruction);
    }

    if (searchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents.length === 1 ? contents[0] : contents,
      config,
    });

    const outputText = response.text || '';
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({
      text: outputText,
      groundingChunks,
    });
  } catch (err: any) {
    console.error('Gemini Generate Error:', err);
    res.status(500).json({
      error: err?.message || 'An error occurred during text generation.',
    });
  }
});

// Image Generation
geminiRouter.post('/image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '1:1' } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Image prompt is required.' });
      return;
    }

    const ai = getGenAIClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    let imageUrl: string | null = null;
    let caption: string | null = null;

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${base64Data}`;
        } else if (part.text) {
          caption = part.text;
        }
      }
    }

    if (!imageUrl) {
      res.status(500).json({ error: 'No image was returned by Gemini.' });
      return;
    }

    res.json({ imageUrl, caption });
  } catch (err: any) {
    console.error('Gemini Image Generation Error:', err);
    res.status(500).json({
      error: err?.message || 'An error occurred during image generation.',
    });
  }
});

// Text to Speech
geminiRouter.post('/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Text input is required for TTS.' });
      return;
    }

    const ai = getGenAIClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      res.status(500).json({ error: 'No audio was generated.' });
      return;
    }

    const audioUrl = `data:audio/wav;base64,${base64Audio}`;
    res.json({ audioUrl });
  } catch (err: any) {
    console.error('Gemini TTS Error:', err);
    res.status(500).json({
      error: err?.message || 'An error occurred during speech synthesis.',
    });
  }
});
