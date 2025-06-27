// LLM Provider Integration Service
// Supports: OpenAI GPT, Anthropic Claude, Google Gemini, Meta Llama

export interface LLMResponse {
  id: string;
  provider: string;
  model: string;
  query: string;
  response: string;
  success: boolean;
  confidence: number;
  latency: number;
  tokenUsage: {
    input: number;
    output: number;
    cost: number;
  };
  timestamp: Date;
  errorMessage?: string;
}

export interface PromptTestConfig {
  query: string;
  context: string;
  expectedAnswer?: string;
  category: string;
  industry: string;
}

// API Client configurations
interface APIConfig {
  openai?: {
    apiKey: string;
    organization?: string;
  };
  anthropic?: {
    apiKey: string;
  };
  google?: {
    apiKey: string;
    projectId?: string;
  };
  replicate?: {
    apiKey: string; // For Llama via Replicate
  };
  together?: {
    apiKey: string; // Alternative for Llama
  };
}

class LLMProviderService {
  private config: APIConfig;
  private pricing = {
    // Pricing per 1K tokens (as of 2024)
    "gpt-4": { input: 0.03, output: 0.06 },
    "gpt-4-turbo": { input: 0.01, output: 0.03 },
    "gpt-3.5-turbo": { input: 0.001, output: 0.002 },
    "claude-3-opus": { input: 0.015, output: 0.075 },
    "claude-3-sonnet": { input: 0.003, output: 0.015 },
    "claude-3-haiku": { input: 0.00025, output: 0.00125 },
    "gemini-pro": { input: 0.001, output: 0.002 },
    "gemini-pro-vision": { input: 0.002, output: 0.004 },
    "llama-2-70b": { input: 0.0007, output: 0.0009 },
    "llama-2-13b": { input: 0.0002, output: 0.0003 },
    "codellama-34b": { input: 0.0008, output: 0.0008 },
  };

  constructor(config: APIConfig) {
    this.config = config;
  }

  // OpenAI GPT Integration
  async queryOpenAI(
    model: string,
    prompt: string,
    context: string
  ): Promise<LLMResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.openai?.apiKey}`,
            "Content-Type": "application/json",
            ...(this.config.openai?.organization && {
              "OpenAI-Organization": this.config.openai.organization,
            }),
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  'Answer the question based only on the provided context. If the information is not available in the context, respond with "Information not available in provided content."',
              },
              {
                role: "user",
                content: `Context: ${context}\n\nQuestion: ${prompt}`,
              },
            ],
            temperature: 0.1,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      const usage = data.usage;

      return {
        id: data.id,
        provider: "openai",
        model,
        query: prompt,
        response: responseText,
        success: this.evaluateSuccess(responseText),
        confidence: this.calculateConfidence(responseText),
        latency: Date.now() - startTime,
        tokenUsage: {
          input: usage.prompt_tokens,
          output: usage.completion_tokens,
          cost: this.calculateCost(
            model,
            usage.prompt_tokens,
            usage.completion_tokens
          ),
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return this.createErrorResponse(
        "openai",
        model,
        prompt,
        error as Error,
        startTime
      );
    }
  }

  // Anthropic Claude Integration
  async queryClaude(
    model: string,
    prompt: string,
    context: string
  ): Promise<LLMResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": this.config.anthropic?.apiKey || "",
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Based on the following context, answer the question. If the information is not available, say "Information not available in provided content."

Context: ${context}

Question: ${prompt}

Answer:`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Claude API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const responseText = data.content[0].text;
      const usage = data.usage;

      return {
        id: data.id,
        provider: "anthropic",
        model,
        query: prompt,
        response: responseText,
        success: this.evaluateSuccess(responseText),
        confidence: this.calculateConfidence(responseText),
        latency: Date.now() - startTime,
        tokenUsage: {
          input: usage.input_tokens,
          output: usage.output_tokens,
          cost: this.calculateCost(
            model,
            usage.input_tokens,
            usage.output_tokens
          ),
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return this.createErrorResponse(
        "anthropic",
        model,
        prompt,
        error as Error,
        startTime
      );
    }
  }

  // Google Gemini Integration
  async queryGemini(
    model: string,
    prompt: string,
    context: string
  ): Promise<LLMResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.google?.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Based on the following context, answer the question. If the information is not available, say "Information not available in provided content."

Context: ${context}

Question: ${prompt}

Answer:`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1000,
              topP: 0.8,
              topK: 10,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      const usage = data.usageMetadata;

      return {
        id: `gemini-${Date.now()}`,
        provider: "google",
        model,
        query: prompt,
        response: responseText,
        success: this.evaluateSuccess(responseText),
        confidence: this.calculateConfidence(responseText),
        latency: Date.now() - startTime,
        tokenUsage: {
          input: usage.promptTokenCount || 0,
          output: usage.candidatesTokenCount || 0,
          cost: this.calculateCost(
            model,
            usage.promptTokenCount || 0,
            usage.candidatesTokenCount || 0
          ),
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return this.createErrorResponse(
        "google",
        model,
        prompt,
        error as Error,
        startTime
      );
    }
  }

  // Meta Llama Integration (via Replicate)
  async queryLlama(
    model: string,
    prompt: string,
    context: string
  ): Promise<LLMResponse> {
    const startTime = Date.now();

    try {
      // Using Replicate API for Llama models
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          Authorization: `Token ${this.config.replicate?.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: this.getLlamaVersionId(model),
          input: {
            prompt: `Based on the following context, answer the question. If the information is not available, say "Information not available in provided content."

Context: ${context}

Question: ${prompt}

Answer:`,
            max_new_tokens: 1000,
            temperature: 0.1,
            top_p: 0.9,
            repetition_penalty: 1,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Replicate API error: ${response.status} ${response.statusText}`
        );
      }

      const prediction = await response.json();

      // Poll for completion
      const result = await this.pollReplicateResult(prediction.id);
      const responseText = Array.isArray(result.output)
        ? result.output.join("")
        : result.output;

      // Estimate token usage (Replicate doesn't provide exact counts)
      const estimatedInputTokens = Math.ceil(
        (prompt.length + context.length) / 4
      );
      const estimatedOutputTokens = Math.ceil(responseText.length / 4);

      return {
        id: prediction.id,
        provider: "replicate",
        model,
        query: prompt,
        response: responseText,
        success: this.evaluateSuccess(responseText),
        confidence: this.calculateConfidence(responseText),
        latency: Date.now() - startTime,
        tokenUsage: {
          input: estimatedInputTokens,
          output: estimatedOutputTokens,
          cost: this.calculateCost(
            model,
            estimatedInputTokens,
            estimatedOutputTokens
          ),
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return this.createErrorResponse(
        "replicate",
        model,
        prompt,
        error as Error,
        startTime
      );
    }
  }

  // Alternative Llama Integration (via Together AI)
  async queryLlamaTogether(
    model: string,
    prompt: string,
    context: string
  ): Promise<LLMResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch("https://api.together.xyz/inference", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.together?.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt: `Based on the following context, answer the question. If the information is not available, say "Information not available in provided content."

Context: ${context}

Question: ${prompt}

Answer:`,
          max_tokens: 1000,
          temperature: 0.1,
          top_p: 0.9,
          stop: ["</s>", "[INST]"],
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Together API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const responseText = data.output.choices[0].text;
      const usage = data.output.usage;

      return {
        id: `together-${Date.now()}`,
        provider: "together",
        model,
        query: prompt,
        response: responseText,
        success: this.evaluateSuccess(responseText),
        confidence: this.calculateConfidence(responseText),
        latency: Date.now() - startTime,
        tokenUsage: {
          input: usage.prompt_tokens || 0,
          output: usage.completion_tokens || 0,
          cost: this.calculateCost(
            model,
            usage.prompt_tokens || 0,
            usage.completion_tokens || 0
          ),
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return this.createErrorResponse(
        "together",
        model,
        prompt,
        error as Error,
        startTime
      );
    }
  }

  // Unified query method
  async queryModel(
    provider: string,
    model: string,
    prompt: string,
    context: string
  ): Promise<LLMResponse> {
    switch (provider.toLowerCase()) {
      case "openai":
        return this.queryOpenAI(model, prompt, context);
      case "anthropic":
      case "claude":
        return this.queryClaude(model, prompt, context);
      case "google":
      case "gemini":
        return this.queryGemini(model, prompt, context);
      case "replicate":
      case "llama":
        return this.queryLlama(model, prompt, context);
      case "together":
        return this.queryLlamaTogether(model, prompt, context);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  // Batch testing across multiple models
  async testContentAcrossModels(
    content: string,
    prompts: PromptTestConfig[],
    models: { provider: string; model: string }[]
  ): Promise<LLMResponse[]> {
    const results: LLMResponse[] = [];

    for (const prompt of prompts) {
      for (const { provider, model } of models) {
        try {
          const result = await this.queryModel(
            provider,
            model,
            prompt.query,
            content
          );
          results.push(result);

          // Small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error testing ${provider}/${model}:`, error);
        }
      }
    }

    return results;
  }

  // Helper methods
  private evaluateSuccess(response: string): boolean {
    const failureIndicators = [
      "information not available",
      "not available in provided content",
      "i don't have",
      "cannot find",
      "unclear from the content",
      "not mentioned in the context",
      "insufficient information",
    ];

    return !failureIndicators.some((indicator) =>
      response.toLowerCase().includes(indicator)
    );
  }

  private calculateConfidence(response: string): number {
    if (response.toLowerCase().includes("information not available")) return 0;
    if (response.includes("might be") || response.includes("possibly"))
      return 0.3;
    if (response.includes("likely") || response.includes("probably"))
      return 0.6;
    if (response.includes("according to") || response.includes("based on"))
      return 0.8;
    return 0.7; // Default confidence
  }

  private calculateCost(
    model: string,
    inputTokens: number,
    outputTokens: number
  ): number {
    const pricing = this.pricing[model as keyof typeof this.pricing];
    if (!pricing) return 0;

    return (inputTokens * pricing.input + outputTokens * pricing.output) / 1000;
  }

  private createErrorResponse(
    provider: string,
    model: string,
    query: string,
    error: Error,
    startTime: number
  ): LLMResponse {
    return {
      id: `error-${Date.now()}`,
      provider,
      model,
      query,
      response: "",
      success: false,
      confidence: 0,
      latency: Date.now() - startTime,
      tokenUsage: { input: 0, output: 0, cost: 0 },
      timestamp: new Date(),
      errorMessage: error.message,
    };
  }

  private getLlamaVersionId(model: string): string {
    // Replicate version IDs for Llama models (these change, so check Replicate docs)
    const versions = {
      "llama-2-70b":
        "f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980970978018d",
      "llama-2-13b":
        "6667827e3db8d30c4b4e9a92e27c6b2f0d64b7c93b0c6b3a8f3a9e3b0e3c3d3e",
      "llama-2-7b":
        "13c3cdee13ee059ab779f0291d29054dab00a47dad8261375654de5540165fb0",
      "codellama-34b":
        "2d19859030ff705a87c746f7e96eea03aefb71f166725aee39692f1476566d48",
    };

    return versions[model as keyof typeof versions] || versions["llama-2-13b"];
  }

  private async pollReplicateResult(predictionId: string): Promise<any> {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            Authorization: `Token ${this.config.replicate?.apiKey}`,
          },
        }
      );

      const prediction = await response.json();

      if (prediction.status === "succeeded") {
        return prediction;
      } else if (prediction.status === "failed") {
        throw new Error(`Prediction failed: ${prediction.error}`);
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    }

    throw new Error("Prediction timed out");
  }
}

export default LLMProviderService;
