import axios from "axios";

const API_BASE_URL = "/api";

export interface AnalysisResult {
  overallScore: number;
  structureScore: number;
  clarityScore: number;
  tokenEfficiency: number;
  embeddingPotential: number;
  promptCoverage: number;
  fileType: string;
  fileSize: string;
  tokenCount: number;
  readabilityLevel: string;
  avgSentenceLength: number;
  complexWordsPercent: number;
  potentialImprovement: number;
  tokenAnalysis: {
    headers: number;
    content: number;
    metadata: number;
  };
  issues: Array<{
    type: string;
    description: string;
    severity: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    expectedImprovement: number;
  }>;
  contentGaps: Array<{
    topic: string;
    description: string;
    priority: string;
    queryFrequency: number;
  }>;
}

export interface AnalyticsData {
  totalAssets: number;
  avgCompatibilityScore: number;
  commonIssues: Array<{
    type: string;
    frequency: number;
    impact: string;
  }>;
  improvementTrends: Array<{
    month: string;
    avgScore: number;
    assetsAnalyzed: number;
  }>;
  contentGapTrends: Array<{
    topic: string;
    frequency: number;
    priority: string;
  }>;
}

export const analyzeAsset = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Analysis API error:", error);
    throw new Error("Failed to analyze asset");
  }
};

export const getAnalytics = async (): Promise<AnalyticsData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics`);
    return response.data;
  } catch (error) {
    console.error("Analytics API error:", error);
    throw new Error("Failed to fetch analytics");
  }
};

export const getRecentAnalyses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analyses/recent`);
    return response.data;
  } catch (error) {
    console.error("Recent analyses API error:", error);
    throw new Error("Failed to fetch recent analyses");
  }
};

export const deleteAnalysis = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/analyses/${id}`);
  } catch (error) {
    console.error("Delete analysis API error:", error);
    throw new Error("Failed to delete analysis");
  }
};

export const getContentGaps = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/content-gaps`);
    return response.data;
  } catch (error) {
    console.error("Content gaps API error:", error);
    throw new Error("Failed to fetch content gaps");
  }
};

export const getPromptTrends = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prompt-trends`);
    return response.data;
  } catch (error) {
    console.error("Prompt trends API error:", error);
    throw new Error("Failed to fetch prompt trends");
  }
};
