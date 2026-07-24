export interface NvidiaNimConfig {
  baseUrl: string;
  apiKey?: string;
  defaultModel: string;
}

export interface NvidiaTokenRequest {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface NvidiaTokenResponse {
  success: boolean;
  model: string;
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
  rawResponse?: any;
}

export class NvidiaTokenApi {
  private config: NvidiaNimConfig;

  constructor(config?: Partial<NvidiaNimConfig>) {
    this.config = {
      baseUrl: 'https://integrate.api.nvidia.com/v1',
      apiKey: process.env.NVIDIA_API_KEY || '',
      defaultModel: 'meta/llama-3.3-70b-instruct',
      ...config,
    };
  }

  /**
   * Check connection status to Nvidia NIM Token API
   */
  public async getStatus(): Promise<{ configured: boolean; model: string; endpoint: string }> {
    return {
      configured: Boolean(process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY.length > 5),
      model: this.config.defaultModel,
      endpoint: this.config.baseUrl,
    };
  }

  /**
   * Directly generates response using Nvidia Native NIM Token API
   */
  public async generateCompletion(req: NvidiaTokenRequest): Promise<NvidiaTokenResponse> {
    const startTime = Date.now();
    const apiKey = process.env.NVIDIA_API_KEY || this.config.apiKey;
    const modelToUse = req.model || this.config.defaultModel;

    if (!apiKey) {
      // Fallback simulation when API key is not configured in .env
      const latencyMs = Date.now() - startTime + 250;
      return {
        success: true,
        model: `${modelToUse} [Nvidia NIM Mock]`,
        content: `[NVIDIA NIM Token API - Simulação Nativa]\n\nModelo: ${modelToUse}\nStatus Key: NVIDIA_API_KEY não configurada na interface de Secrets.\n\nResposta processada com aceleração de tensor de simulação:\n"${req.prompt}"`,
        usage: {
          promptTokens: Math.floor(req.prompt.length / 4),
          completionTokens: 85,
          totalTokens: Math.floor(req.prompt.length / 4) + 85,
        },
        latencyMs,
      };
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            ...(req.systemPrompt ? [{ role: 'system', content: req.systemPrompt }] : []),
            { role: 'user', content: req.prompt },
          ],
          temperature: req.temperature ?? 0.2,
          max_tokens: req.maxTokens ?? 2048,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Nvidia Token API HTTP Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'Sem resposta do modelo Nvidia NIM.';
      const latencyMs = Date.now() - startTime;

      return {
        success: true,
        model: modelToUse,
        content,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        latencyMs,
        rawResponse: data,
      };
    } catch (err: any) {
      console.error('Erro na Nvidia Token API:', err);
      throw err;
    }
  }
}

export const nvidiaTokenApi = new NvidiaTokenApi();
