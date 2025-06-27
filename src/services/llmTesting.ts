// LLM Testing Service
// Integrates with existing content gap analysis and generates real performance data

import LLMProviderService, {
  LLMResponse,
  PromptTestConfig,
} from "./llmProviders";
import LLMConfigManager from "./llmConfig";
// Define simplified interfaces for LLM testing
export interface SimpleContentGap {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  failedPrompts: string[];
  estimatedHours: number;
}

export interface SimpleInsight {
  id: string;
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  effort: "Low" | "Medium" | "High";
  timeline: string;
  category: string;
  actions: string[];
}

export interface TestResult {
  prompt: string;
  contentChunk: string;
  results: LLMResponse[];
  overallSuccess: boolean;
  averageConfidence: number;
  averageLatency: number;
  totalCost: number;
  bestPerformer: LLMResponse | null;
  worstPerformer: LLMResponse | null;
}

export interface ContentAnalysisReport {
  industryId: string;
  testDate: Date;
  totalPrompts: number;
  totalResponses: number;
  overallSuccessRate: number;
  averageLatency: number;
  totalCost: number;
  testResults: TestResult[];
  gapAnalysis: SimpleContentGap[];
  recommendations: SimpleInsight[];
  providerPerformance: {
    provider: string;
    model: string;
    successRate: number;
    averageLatency: number;
    totalCost: number;
    responseCount: number;
  }[];
}

export interface CompetitiveAnalysisResult {
  promptId: string;
  prompt: string;
  responses: {
    provider: string;
    model: string;
    response: string;
    userContentMentions: ContentMention[];
    competitorMentions: ContentMention[];
    visibilityScore: number; // 0-100, how prominently user content appears
    competitiveRank: number; // 1-N, rank among all mentioned sources
  }[];
  overallVisibilityScore: number;
  missedOpportunity: boolean;
}

export interface ContentMention {
  source: string; // company/brand name
  contentType: string; // product, service, claim, etc.
  snippet: string; // actual text mentioning the content
  prominence: number; // 0-100, how prominently mentioned
  accuracy: number; // 0-100, how accurate the mention is
}

export interface ContentFingerprint {
  companyName: string;
  productNames: string[];
  uniqueClaims: string[];
  keyPhrases: string[];
  competitorNames: string[];
}

export class LLMTestingService {
  private llmService: LLMProviderService;
  private configManager: LLMConfigManager;

  constructor() {
    this.configManager = new LLMConfigManager();
    this.llmService = new LLMProviderService(
      this.configManager.getServiceConfig()
    );
  }

  // Test content against industry-specific prompts
  async testIndustryContent(
    industryId: string,
    contentChunks: string[],
    prompts: string[],
    selectedModels?: { provider: string; model: string }[]
  ): Promise<ContentAnalysisReport> {
    const startTime = Date.now();
    const testResults: TestResult[] = [];

    // Use all available models if none specified
    const modelsToTest =
      selectedModels || this.configManager.getAllAvailableModels();

    if (modelsToTest.length === 0) {
      throw new Error(
        "No LLM providers configured. Please add API keys for at least one provider."
      );
    }

    // Test each prompt against each content chunk
    for (const prompt of prompts) {
      for (const contentChunk of contentChunks) {
        const promptResults: LLMResponse[] = [];

        // Test with all selected models
        for (const { provider, model } of modelsToTest) {
          try {
            const result = await this.llmService.queryModel(
              provider,
              model,
              prompt,
              contentChunk
            );
            promptResults.push(result);

            // Small delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 200));
          } catch (error) {
            console.error(`Error testing ${provider}/${model}:`, error);
          }
        }

        // Analyze results for this prompt/content combination
        const testResult = this.analyzeTestResults(
          prompt,
          contentChunk,
          promptResults
        );
        testResults.push(testResult);
      }
    }

    // Generate comprehensive report
    return this.generateReport(industryId, testResults);
  }

  // Analyze results for a single prompt/content combination
  private analyzeTestResults(
    prompt: string,
    contentChunk: string,
    results: LLMResponse[]
  ): TestResult {
    const successfulResults = results.filter((r) => r.success);
    const overallSuccess = successfulResults.length > 0;

    const averageConfidence =
      results.length > 0
        ? results.reduce((sum, r) => sum + r.confidence, 0) / results.length
        : 0;

    const averageLatency =
      results.length > 0
        ? results.reduce((sum, r) => sum + r.latency, 0) / results.length
        : 0;

    const totalCost = results.reduce((sum, r) => sum + r.tokenUsage.cost, 0);

    // Find best and worst performers
    const sortedByConfidence = [...results].sort(
      (a, b) => b.confidence - a.confidence
    );
    const bestPerformer = sortedByConfidence[0] || null;
    const worstPerformer =
      sortedByConfidence[sortedByConfidence.length - 1] || null;

    return {
      prompt,
      contentChunk,
      results,
      overallSuccess,
      averageConfidence,
      averageLatency,
      totalCost,
      bestPerformer,
      worstPerformer,
    };
  }

  // Generate comprehensive analysis report
  private generateReport(
    industryId: string,
    testResults: TestResult[]
  ): ContentAnalysisReport {
    const allResults = testResults.flatMap((tr) => tr.results);
    const successfulResults = allResults.filter((r) => r.success);

    const overallSuccessRate =
      allResults.length > 0 ? successfulResults.length / allResults.length : 0;

    const averageLatency =
      allResults.length > 0
        ? allResults.reduce((sum, r) => sum + r.latency, 0) / allResults.length
        : 0;

    const totalCost = allResults.reduce((sum, r) => sum + r.tokenUsage.cost, 0);

    // Analyze provider performance
    const providerStats = new Map<
      string,
      {
        successCount: number;
        totalCount: number;
        totalLatency: number;
        totalCost: number;
      }
    >();

    for (const result of allResults) {
      const key = `${result.provider}/${result.model}`;
      const stats = providerStats.get(key) || {
        successCount: 0,
        totalCount: 0,
        totalLatency: 0,
        totalCost: 0,
      };

      stats.totalCount++;
      stats.totalLatency += result.latency;
      stats.totalCost += result.tokenUsage.cost;

      if (result.success) {
        stats.successCount++;
      }

      providerStats.set(key, stats);
    }

    const providerPerformance = Array.from(providerStats.entries()).map(
      ([key, stats]) => {
        const [provider, model] = key.split("/");
        return {
          provider,
          model,
          successRate: stats.successCount / stats.totalCount,
          averageLatency: stats.totalLatency / stats.totalCount,
          totalCost: stats.totalCost,
          responseCount: stats.totalCount,
        };
      }
    );

    // Generate content gaps based on failed tests
    const gapAnalysis = this.generateContentGaps(testResults);

    // Generate actionable recommendations
    const recommendations = this.generateRecommendations(
      testResults,
      providerPerformance
    );

    return {
      industryId,
      testDate: new Date(),
      totalPrompts: new Set(testResults.map((tr) => tr.prompt)).size,
      totalResponses: allResults.length,
      overallSuccessRate,
      averageLatency,
      totalCost,
      testResults,
      gapAnalysis,
      recommendations,
      providerPerformance,
    };
  }

  // Generate content gaps from failed tests
  private generateContentGaps(testResults: TestResult[]): SimpleContentGap[] {
    const gaps: SimpleContentGap[] = [];
    const failedPrompts = new Map<string, string[]>();

    // Group failed prompts by content chunk
    for (const result of testResults) {
      if (!result.overallSuccess) {
        const content = result.contentChunk.substring(0, 50) + "...";
        if (!failedPrompts.has(content)) {
          failedPrompts.set(content, []);
        }
        failedPrompts.get(content)!.push(result.prompt);
      }
    }

    // Create gap entries
    let gapId = 1;
    for (const [content, prompts] of failedPrompts.entries()) {
      gaps.push({
        id: `gap-${gapId++}`,
        title: `Content Gap: ${content}`,
        description: `This content failed to answer ${prompts.length} user queries effectively.`,
        priority:
          prompts.length > 3 ? "High" : prompts.length > 1 ? "Medium" : "Low",
        failedPrompts: prompts,
        estimatedHours: prompts.length * 2, // Estimate 2 hours per failed prompt
      });
    }

    return gaps;
  }

  // Generate actionable recommendations
  private generateRecommendations(
    testResults: TestResult[],
    providerPerformance: any[]
  ): SimpleInsight[] {
    const insights: SimpleInsight[] = [];
    let insightId = 1;

    // Content improvement recommendations
    const failedTests = testResults.filter((tr) => !tr.overallSuccess);
    if (failedTests.length > 0) {
      insights.push({
        id: `insight-${insightId++}`,
        title: "Improve Content Coverage",
        description: `${failedTests.length} content pieces failed to answer user queries. Consider expanding these sections with more comprehensive information.`,
        impact: "High",
        effort: "Medium",
        timeline: "2-4 weeks",
        category: "Content Quality",
        actions: [
          "Review failed queries to identify missing information",
          "Expand content with relevant details",
          "Add FAQ sections for common questions",
          "Ensure content directly addresses user intent",
        ],
      });
    }

    // Model performance recommendations
    const bestProvider = providerPerformance.sort(
      (a, b) => b.successRate - a.successRate
    )[0];
    const worstProvider = providerPerformance.sort(
      (a, b) => a.successRate - b.successRate
    )[0];

    if (
      bestProvider &&
      worstProvider &&
      bestProvider.successRate > worstProvider.successRate + 0.2
    ) {
      insights.push({
        id: `insight-${insightId++}`,
        title: "Optimize LLM Provider Selection",
        description: `${bestProvider.provider}/${
          bestProvider.model
        } significantly outperforms other models with ${(
          bestProvider.successRate * 100
        ).toFixed(1)}% success rate vs ${(
          worstProvider.successRate * 100
        ).toFixed(1)}% for ${worstProvider.provider}/${worstProvider.model}.`,
        impact: "Medium",
        effort: "Low",
        timeline: "1 week",
        category: "Technical Optimization",
        actions: [
          `Prioritize ${bestProvider.provider}/${bestProvider.model} for production use`,
          "Consider deprecating underperforming models",
          "Implement model selection logic based on query type",
          "Monitor performance metrics continuously",
        ],
      });
    }

    // Cost optimization recommendations
    const costPerSuccess = providerPerformance
      .map((p) => ({
        ...p,
        costPerSuccess:
          p.successRate > 0
            ? p.totalCost / (p.responseCount * p.successRate)
            : Infinity,
      }))
      .sort((a, b) => a.costPerSuccess - b.costPerSuccess);

    if (costPerSuccess.length >= 2) {
      const mostEfficient = costPerSuccess[0];
      const leastEfficient = costPerSuccess[costPerSuccess.length - 1];

      if (mostEfficient.costPerSuccess < leastEfficient.costPerSuccess * 0.5) {
        insights.push({
          id: `insight-${insightId++}`,
          title: "Reduce API Costs",
          description: `${mostEfficient.provider}/${
            mostEfficient.model
          } provides the best cost-per-success ratio at $${mostEfficient.costPerSuccess.toFixed(
            4
          )} compared to $${leastEfficient.costPerSuccess.toFixed(4)} for ${
            leastEfficient.provider
          }/${leastEfficient.model}.`,
          impact: "Medium",
          effort: "Low",
          timeline: "1 week",
          category: "Cost Optimization",
          actions: [
            "Switch to more cost-effective models for routine queries",
            "Implement tiered model selection based on query complexity",
            "Set up cost monitoring and alerts",
            "Review and optimize token usage",
          ],
        });
      }
    }

    return insights;
  }

  // Generate industry-specific prompts using LLM
  async generateIndustryPrompts(
    industry: string,
    promptCount: number = 5
  ): Promise<string[]> {
    const configuredProviders = this.configManager.getConfiguredProviders();
    if (configuredProviders.length === 0) {
      throw new Error(
        "No LLM providers configured. Please add API keys for at least one provider."
      );
    }

    // Use the first configured provider to generate prompts
    const provider = configuredProviders[0];
    const models = this.configManager.getModelsForProvider(provider);
    if (models.length === 0) {
      throw new Error(`No models available for provider: ${provider}`);
    }
    const model = models[0];

    const promptGenerationQuery = `Generate ${promptCount} realistic, specific questions that customers or users would commonly ask about ${industry} products, services, or information. 

Industry: ${industry}

Return only the questions, one per line, without numbering or bullet points. Focus on:
- Product features and capabilities
- Pricing and cost information  
- Technical specifications
- Support and service questions
- Compliance and regulatory topics
- Implementation and usage questions

Questions should be the type that would be answered by company documentation, websites, or customer service.`;

    const response = await this.llmService.queryModel(
      provider,
      model,
      promptGenerationQuery,
      `This is for the ${industry} industry.`
    );

    if (!response.success) {
      throw new Error("Failed to generate prompts");
    }

    const prompts = response.response
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0 && p.includes("?"))
      .slice(0, promptCount);

    return prompts;
  }

  // Quick test with sample prompts
  async quickTest(
    industryId: string,
    sampleSize: number = 5
  ): Promise<ContentAnalysisReport> {
    // This would integrate with your existing industry data
    const samplePrompts = [
      "What are the key features of this product?",
      "How much does this service cost?",
      "What are the system requirements?",
      "How do I get customer support?",
      "What are the security features?",
    ].slice(0, sampleSize);

    const sampleContent = [
      "Our product offers enterprise-grade security, 24/7 support, and flexible pricing plans starting at $99/month.",
      "We provide comprehensive customer support through chat, email, and phone. Our team is available Monday-Friday 9AM-6PM EST.",
      "System requirements include Windows 10 or macOS 10.15+, 8GB RAM minimum, and internet connection for cloud features.",
    ];

    return this.testIndustryContent(industryId, sampleContent, samplePrompts);
  }

  // Export test results
  exportResults(report: ContentAnalysisReport): string {
    return JSON.stringify(
      {
        summary: {
          industry: report.industryId,
          testDate: report.testDate,
          successRate: `${(report.overallSuccessRate * 100).toFixed(1)}%`,
          averageLatency: `${report.averageLatency.toFixed(0)}ms`,
          totalCost: `$${report.totalCost.toFixed(4)}`,
          totalTests: report.totalResponses,
        },
        providerPerformance: report.providerPerformance,
        contentGaps: report.gapAnalysis,
        recommendations: report.recommendations,
      },
      null,
      2
    );
  }

  /**
   * Performs competitive analysis testing to see when user content appears vs competitors
   */
  async performCompetitiveAnalysis(
    userContent: string[],
    industry: string,
    testPrompts?: string[]
  ): Promise<CompetitiveAnalysisResult[]> {
    try {
      // Step 1: Extract content fingerprints
      const fingerprint = await this.extractContentFingerprint(
        userContent,
        industry
      );

      // Step 2: Generate competitive prompts if not provided
      const prompts =
        testPrompts ||
        (await this.generateCompetitivePrompts(industry, fingerprint));

      // Step 3: Test across all configured providers
      const results: CompetitiveAnalysisResult[] = [];

      for (const prompt of prompts) {
        const analysisResult: CompetitiveAnalysisResult = {
          promptId: `comp_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          prompt,
          responses: [],
          overallVisibilityScore: 0,
          missedOpportunity: false,
        };

        // Test with each provider
        for (const provider of this.getAvailableProviders()) {
          try {
            const response = await this.testWithProvider(provider, prompt);

            // Analyze the response for competitive mentions
            const analysis = await this.analyzeCompetitiveMentions(
              response.response,
              fingerprint
            );

            analysisResult.responses.push({
              provider: provider.name,
              model: provider.model,
              response: response.response,
              userContentMentions: analysis.userMentions,
              competitorMentions: analysis.competitorMentions,
              visibilityScore: analysis.userVisibilityScore,
              competitiveRank: analysis.userRank,
            });
          } catch (error) {
            console.error(`Error testing with ${provider.name}:`, error);
          }
        }

        // Calculate overall visibility score
        analysisResult.overallVisibilityScore = this.calculateOverallVisibility(
          analysisResult.responses
        );
        analysisResult.missedOpportunity =
          analysisResult.overallVisibilityScore < 20; // Threshold for missed opportunity

        results.push(analysisResult);
      }

      return results;
    } catch (error) {
      console.error("Error in competitive analysis:", error);
      throw error;
    }
  }

  /**
   * Extract unique identifiers from user content for competitive tracking
   */
  private async extractContentFingerprint(
    userContent: string[],
    industry: string
  ): Promise<ContentFingerprint> {
    const combinedContent = userContent.join("\n\n");

    // Use LLM to extract key identifiers
    const extractionPrompt = `
Analyze this ${industry} content and extract key identifiers for competitive tracking:

Content:
${combinedContent}

Please identify:
1. Company/brand names mentioned
2. Product or service names
3. Unique claims or value propositions
4. Key phrases that identify this content
5. Likely competitor names in this space

Format as JSON with keys: companyName, productNames, uniqueClaims, keyPhrases, competitorNames
`;

    try {
      const provider = this.getAvailableProviders()[0]; // Use first available provider
      const response = await this.testWithProvider(provider, extractionPrompt);

      // Parse the JSON response
      const fingerprint = JSON.parse(response.response);
      return fingerprint;
    } catch (error) {
      console.error("Error extracting content fingerprint:", error);
      // Return default fingerprint
      return {
        companyName: "Unknown Company",
        productNames: [],
        uniqueClaims: [],
        keyPhrases: [],
        competitorNames: [],
      };
    }
  }

  /**
   * Generate prompts designed to trigger competitive responses
   */
  private async generateCompetitivePrompts(
    industry: string,
    fingerprint: ContentFingerprint
  ): Promise<string[]> {
    const promptTemplates = [
      `What are the best ${industry} solutions for [specific use case]?`,
      `Compare different ${industry} products for [specific need]`,
      `Which ${industry} companies offer [specific service/product]?`,
      `What are the pros and cons of ${industry} options?`,
      `Who are the leading ${industry} providers?`,
      `What should I know about ${industry} [specific topic]?`,
    ];

    const prompts: string[] = [];

    // Generate specific prompts based on user's content
    for (const product of fingerprint.productNames.slice(0, 3)) {
      prompts.push(`What are alternatives to ${product}?`);
      prompts.push(`How does ${product} compare to competitors?`);
    }

    for (const claim of fingerprint.uniqueClaims.slice(0, 2)) {
      prompts.push(`Which ${industry} companies ${claim.toLowerCase()}?`);
    }

    // Add generic industry prompts
    prompts.push(
      ...promptTemplates.map((template) =>
        template.replace(
          /\[specific [^\]]+\]/g,
          this.getIndustrySpecificTerm(industry)
        )
      )
    );

    return prompts.slice(0, 15); // Limit to 15 prompts for testing
  }

  /**
   * Analyze LLM response for competitive mentions
   */
  private async analyzeCompetitiveMentions(
    response: string,
    fingerprint: ContentFingerprint
  ): Promise<{
    userMentions: ContentMention[];
    competitorMentions: ContentMention[];
    userVisibilityScore: number;
    userRank: number;
  }> {
    const userMentions: ContentMention[] = [];
    const competitorMentions: ContentMention[] = [];

    // Check for user content mentions
    const companyMentions = this.findMentions(response, [
      fingerprint.companyName,
    ]);
    const productMentions = this.findMentions(
      response,
      fingerprint.productNames
    );
    const claimMentions = this.findMentions(response, fingerprint.uniqueClaims);

    userMentions.push(...companyMentions, ...productMentions, ...claimMentions);

    // Check for competitor mentions
    const competitorMentions_ = this.findMentions(
      response,
      fingerprint.competitorNames
    );
    competitorMentions.push(...competitorMentions_);

    // Calculate visibility score based on prominence and frequency
    const userVisibilityScore = this.calculateVisibilityScore(
      userMentions,
      response
    );

    // Calculate competitive rank
    const allMentions = [...userMentions, ...competitorMentions];
    const userRank = this.calculateCompetitiveRank(userMentions, allMentions);

    return {
      userMentions,
      competitorMentions,
      userVisibilityScore,
      userRank,
    };
  }

  /**
   * Find mentions of specific terms in response text
   */
  private findMentions(text: string, terms: string[]): ContentMention[] {
    const mentions: ContentMention[] = [];

    for (const term of terms) {
      const regex = new RegExp(term, "gi");
      const matches = text.match(regex);

      if (matches) {
        // Find the context around each mention
        const contextRegex = new RegExp(`.{0,50}${term}.{0,50}`, "gi");
        const contexts = text.match(contextRegex) || [];

        for (let i = 0; i < matches.length; i++) {
          mentions.push({
            source: term,
            contentType: this.classifyContentType(term),
            snippet: contexts[i] || matches[i],
            prominence: this.calculateProminence(text, term),
            accuracy: 85, // Placeholder - could be enhanced with semantic analysis
          });
        }
      }
    }

    return mentions;
  }

  /**
   * Calculate how prominently a term appears in the response
   */
  private calculateProminence(text: string, term: string): number {
    const position = text.toLowerCase().indexOf(term.toLowerCase());
    const textLength = text.length;

    // Higher score for earlier mentions
    const positionScore = Math.max(0, 100 - (position / textLength) * 100);

    // Count frequency
    const frequency = (text.match(new RegExp(term, "gi")) || []).length;
    const frequencyScore = Math.min(frequency * 20, 100);

    return Math.round((positionScore + frequencyScore) / 2);
  }

  /**
   * Calculate competitive rank among all mentions
   */
  private calculateCompetitiveRank(
    userMentions: ContentMention[],
    allMentions: ContentMention[]
  ): number {
    if (userMentions.length === 0) return -1; // Not mentioned

    // Sort all mentions by prominence
    const sortedMentions = allMentions.sort(
      (a, b) => b.prominence - a.prominence
    );

    // Find the highest-ranking user mention
    const bestUserMention = userMentions.reduce((best, current) =>
      current.prominence > best.prominence ? current : best
    );

    const rank =
      sortedMentions.findIndex(
        (mention) => mention.source === bestUserMention.source
      ) + 1;

    return rank;
  }

  /**
   * Calculate overall visibility score across all provider responses
   */
  private calculateOverallVisibility(responses: any[]): number {
    if (responses.length === 0) return 0;

    const totalScore = responses.reduce(
      (sum, response) => sum + response.visibilityScore,
      0
    );
    return Math.round(totalScore / responses.length);
  }

  /**
   * Classify the type of content (company, product, claim, etc.)
   */
  private classifyContentType(term: string): string {
    // Simple classification - could be enhanced
    if (term.includes("Inc") || term.includes("Corp") || term.includes("Ltd")) {
      return "company";
    }
    if (term.length < 20 && !term.includes(" ")) {
      return "product";
    }
    return "claim";
  }

  /**
   * Get industry-specific terms for prompt generation
   */
  private getIndustrySpecificTerm(industry: string): string {
    const terms: { [key: string]: string[] } = {
      "life-sciences": [
        "drug development",
        "clinical trials",
        "regulatory compliance",
      ],
      retail: ["customer experience", "inventory management", "e-commerce"],
      legal: ["compliance", "contract management", "legal research"],
      travel: ["booking systems", "customer service", "travel planning"],
    };

    const industryTerms = terms[industry] || ["solutions"];
    return industryTerms[Math.floor(Math.random() * industryTerms.length)];
  }

  /**
   * Get available providers for testing
   */
  private getAvailableProviders(): Array<{ name: string; model: string }> {
    return this.configManager.getAllAvailableModels().map((model) => ({
      name: model.provider,
      model: model.model,
    }));
  }

  /**
   * Test with a specific provider
   */
  private async testWithProvider(
    provider: { name: string; model: string },
    prompt: string
  ): Promise<{ response: string; success: boolean }> {
    try {
      const result = await this.llmService.queryModel(
        provider.name.toLowerCase(),
        provider.model,
        prompt,
        "" // Empty context for competitive analysis
      );

      return {
        response: result.response,
        success: result.success,
      };
    } catch (error) {
      console.error(`Error testing with ${provider.name}:`, error);
      return {
        response: "",
        success: false,
      };
    }
  }

  /**
   * Calculate visibility score based on content mentions
   */
  private calculateVisibilityScore(
    mentions: ContentMention[],
    fullResponse: string
  ): number {
    if (mentions.length === 0) return 0;

    // Calculate average prominence of all mentions
    const averageProminence =
      mentions.reduce((sum, mention) => sum + mention.prominence, 0) /
      mentions.length;

    // Bonus for multiple mentions
    const frequencyBonus = Math.min(mentions.length * 10, 30);

    // Penalty if response is very long and mentions are buried
    const lengthPenalty = fullResponse.length > 1000 ? 10 : 0;

    return Math.round(
      Math.max(0, averageProminence + frequencyBonus - lengthPenalty)
    );
  }
}

export default LLMTestingService;
