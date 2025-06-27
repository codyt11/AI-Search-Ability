// LLM Configuration Management
// Handles API keys, model selection, and provider settings

export interface LLMConfig {
  openai?: {
    apiKey: string;
    organization?: string;
    models: string[];
  };
  anthropic?: {
    apiKey: string;
    models: string[];
  };
  google?: {
    apiKey: string;
    projectId?: string;
    models: string[];
  };
  replicate?: {
    apiKey: string;
    models: string[];
  };
  together?: {
    apiKey: string;
    models: string[];
  };
}

export const DEFAULT_MODELS = {
  openai: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
  anthropic: [
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
  ],
  google: ["gemini-pro", "gemini-pro-vision"],
  replicate: ["llama-2-70b", "llama-2-13b", "llama-2-7b", "codellama-34b"],
  together: [
    "meta-llama/Llama-2-70b-chat-hf",
    "meta-llama/Llama-2-13b-chat-hf",
    "meta-llama/Llama-2-7b-chat-hf",
    "codellama/CodeLlama-34b-Instruct-hf",
  ],
};

export class LLMConfigManager {
  private config: LLMConfig = {};

  constructor() {
    this.loadFromEnvironment();
    this.loadFromLocalStorage();
  }

  // Load API keys from environment variables
  private loadFromEnvironment(): void {
    // Check if we're in a Node.js environment
    const env =
      typeof window === "undefined"
        ? (globalThis as any).process?.env
        : undefined;

    if (env) {
      if (env.OPENAI_API_KEY) {
        this.config.openai = {
          apiKey: env.OPENAI_API_KEY,
          organization: env.OPENAI_ORGANIZATION,
          models: DEFAULT_MODELS.openai,
        };
      }

      if (env.ANTHROPIC_API_KEY) {
        this.config.anthropic = {
          apiKey: env.ANTHROPIC_API_KEY,
          models: DEFAULT_MODELS.anthropic,
        };
      }

      if (env.GOOGLE_API_KEY) {
        this.config.google = {
          apiKey: env.GOOGLE_API_KEY,
          projectId: env.GOOGLE_PROJECT_ID,
          models: DEFAULT_MODELS.google,
        };
      }

      if (env.REPLICATE_API_KEY) {
        this.config.replicate = {
          apiKey: env.REPLICATE_API_KEY,
          models: DEFAULT_MODELS.replicate,
        };
      }

      if (env.TOGETHER_API_KEY) {
        this.config.together = {
          apiKey: env.TOGETHER_API_KEY,
          models: DEFAULT_MODELS.together,
        };
      }
    }
  }

  // Load configuration from localStorage (for client-side)
  private loadFromLocalStorage(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = localStorage.getItem("llm-config");
      if (stored) {
        try {
          const parsedConfig = JSON.parse(stored);
          this.config = { ...this.config, ...parsedConfig };
        } catch (error) {
          console.warn("Failed to parse stored LLM config:", error);
        }
      }
    }
  }

  // Save configuration to localStorage
  saveToLocalStorage(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("llm-config", JSON.stringify(this.config));
    }
  }

  // Set provider configuration
  setProvider(provider: string, config: any): void {
    this.config[provider as keyof LLMConfig] = {
      ...config,
      models:
        config.models ||
        DEFAULT_MODELS[provider as keyof typeof DEFAULT_MODELS],
    };
    this.saveToLocalStorage();
  }

  // Get provider configuration
  getProvider(provider: string): any {
    return this.config[provider as keyof LLMConfig];
  }

  // Get all configured providers
  getConfiguredProviders(): string[] {
    return Object.keys(this.config).filter(
      (provider) => this.config[provider as keyof LLMConfig]?.apiKey
    );
  }

  // Get available models for a provider
  getModelsForProvider(provider: string): string[] {
    const providerConfig = this.getProvider(provider);
    return (
      providerConfig?.models ||
      DEFAULT_MODELS[provider as keyof typeof DEFAULT_MODELS] ||
      []
    );
  }

  // Get all available models across providers
  getAllAvailableModels(): {
    provider: string;
    model: string;
    displayName: string;
  }[] {
    const models: { provider: string; model: string; displayName: string }[] =
      [];

    for (const provider of this.getConfiguredProviders()) {
      const providerModels = this.getModelsForProvider(provider);
      for (const model of providerModels) {
        models.push({
          provider,
          model,
          displayName: `${provider.toUpperCase()}: ${model}`,
        });
      }
    }

    return models;
  }

  // Check if a provider is configured
  isProviderConfigured(provider: string): boolean {
    const config = this.getProvider(provider);
    return !!config?.apiKey;
  }

  // Get configuration for LLMProviderService
  getServiceConfig(): any {
    return {
      openai: this.config.openai
        ? {
            apiKey: this.config.openai.apiKey,
            organization: this.config.openai.organization,
          }
        : undefined,
      anthropic: this.config.anthropic
        ? {
            apiKey: this.config.anthropic.apiKey,
          }
        : undefined,
      google: this.config.google
        ? {
            apiKey: this.config.google.apiKey,
            projectId: this.config.google.projectId,
          }
        : undefined,
      replicate: this.config.replicate
        ? {
            apiKey: this.config.replicate.apiKey,
          }
        : undefined,
      together: this.config.together
        ? {
            apiKey: this.config.together.apiKey,
          }
        : undefined,
    };
  }

  // Clear all configuration
  clearConfig(): void {
    this.config = {};
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("llm-config");
    }
  }

  // Export configuration (without API keys for sharing)
  exportConfig(): Partial<LLMConfig> {
    const exportConfig: Partial<LLMConfig> = {};

    for (const [provider, config] of Object.entries(this.config)) {
      if (config) {
        exportConfig[provider as keyof LLMConfig] = {
          ...config,
          apiKey: "[REDACTED]",
        } as any;
      }
    }

    return exportConfig;
  }

  // Import configuration (preserving existing API keys)
  importConfig(importedConfig: Partial<LLMConfig>): void {
    for (const [provider, config] of Object.entries(importedConfig)) {
      if (config && config.apiKey !== "[REDACTED]") {
        this.setProvider(provider, config);
      } else if (config) {
        // Import everything except API key
        const existingConfig = this.getProvider(provider);
        this.setProvider(provider, {
          ...config,
          apiKey: existingConfig?.apiKey || "",
        });
      }
    }
  }
}

export default LLMConfigManager;
