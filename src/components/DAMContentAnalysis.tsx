// DAM Content Analysis Integration Component
// Shows how DAM content flows into AI analysis

import React, { useState, useEffect } from "react";
import {
  Database,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Tag,
  Calendar,
  BarChart3,
  ArrowRight,
  Zap,
} from "lucide-react";
import { DAMAsset } from "../services/damIntegration";

interface DAMAnalysisResult {
  assetId: string;
  assetName: string;
  analysisScore: number;
  aiReadinessLevel: "High" | "Medium" | "Low";
  contentGaps: string[];
  recommendations: string[];
  performanceMetrics: {
    searchability: number;
    relevance: number;
    completeness: number;
    accuracy: number;
  };
  lastAnalyzed: Date;
}

interface Props {
  damAssets: DAMAsset[];
  onAnalysisComplete?: (results: DAMAnalysisResult[]) => void;
}

const DAMContentAnalysis: React.FC<Props> = ({
  damAssets,
  onAnalysisComplete,
}) => {
  const [analysisResults, setAnalysisResults] = useState<DAMAnalysisResult[]>(
    []
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Mock analysis results for demonstration
  const mockAnalysisResults: DAMAnalysisResult[] = [
    {
      assetId: "dam_asset_1",
      assetName: "Product Brochure 2024.pdf",
      analysisScore: 87,
      aiReadinessLevel: "High",
      contentGaps: [
        "Missing competitive comparison data",
        "Limited technical specifications detail",
      ],
      recommendations: [
        "Add more detailed technical specifications",
        "Include competitive analysis section",
        "Enhance visual elements for AI recognition",
      ],
      performanceMetrics: {
        searchability: 92,
        relevance: 88,
        completeness: 85,
        accuracy: 94,
      },
      lastAnalyzed: new Date(),
    },
    {
      assetId: "dam_asset_2",
      assetName: "Technical Specifications.docx",
      analysisScore: 78,
      aiReadinessLevel: "Medium",
      contentGaps: [
        "Outdated API documentation",
        "Missing integration examples",
        "Incomplete troubleshooting section",
      ],
      recommendations: [
        "Update API documentation to latest version",
        "Add practical integration examples",
        "Expand troubleshooting guide",
        "Include performance benchmarks",
      ],
      performanceMetrics: {
        searchability: 85,
        relevance: 82,
        completeness: 72,
        accuracy: 89,
      },
      lastAnalyzed: new Date(),
    },
    {
      assetId: "dam_asset_3",
      assetName: "Compliance Guidelines.pdf",
      analysisScore: 95,
      aiReadinessLevel: "High",
      contentGaps: ["Regional compliance variations not covered"],
      recommendations: [
        "Add regional compliance variations",
        "Include compliance checklist",
        "Update regulatory references",
      ],
      performanceMetrics: {
        searchability: 96,
        relevance: 94,
        completeness: 93,
        accuracy: 98,
      },
      lastAnalyzed: new Date(),
    },
  ];

  const runAnalysis = async () => {
    if (damAssets.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Filter results to match available assets
    const relevantResults = mockAnalysisResults.filter((result) =>
      damAssets.some((asset) => asset.id === result.assetId)
    );

    setAnalysisResults(relevantResults);
    setIsAnalyzing(false);

    if (onAnalysisComplete) {
      onAnalysisComplete(relevantResults);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getReadinessColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-green-900/30 text-green-300 border-green-600";
      case "Medium":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-600";
      case "Low":
        return "bg-red-900/30 text-red-300 border-red-600";
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-600";
    }
  };

  const selectedResult = analysisResults.find(
    (result) => result.assetId === selectedAsset
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-900/30 rounded-lg">
            <Brain className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              DAM Content Analysis
            </h2>
            <p className="text-sm text-gray-400">
              AI-powered analysis of your DAM assets for search readiness
            </p>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing || damAssets.length === 0}
          className="btn-primary flex items-center space-x-2"
        >
          <Zap className="h-4 w-4" />
          <span>{isAnalyzing ? "Analyzing..." : "Analyze Content"}</span>
        </button>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">
              Analyzing DAM Content
            </span>
            <span className="text-sm text-gray-400">{analysisProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Running AI analysis on {damAssets.length} assets...
          </p>
        </div>
      )}

      {/* Analysis Results Overview */}
      {analysisResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Assets Analyzed</p>
                <p className="text-xl font-bold text-white">
                  {analysisResults.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Avg. AI Readiness</p>
                <p className="text-xl font-bold text-white">
                  {Math.round(
                    analysisResults.reduce(
                      (sum, r) => sum + r.analysisScore,
                      0
                    ) / analysisResults.length
                  )}
                  %
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">High Readiness</p>
                <p className="text-xl font-bold text-white">
                  {
                    analysisResults.filter((r) => r.aiReadinessLevel === "High")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Content Gaps</p>
                <p className="text-xl font-bold text-white">
                  {analysisResults.reduce(
                    (sum, r) => sum + r.contentGaps.length,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Results */}
      {analysisResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Results List */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Analysis Results
            </h3>
            <div className="space-y-3">
              {analysisResults.map((result) => (
                <div
                  key={result.assetId}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAsset === result.assetId
                      ? "border-purple-500 bg-purple-900/20"
                      : "border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                  }`}
                  onClick={() => setSelectedAsset(result.assetId)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white truncate">
                      {result.assetName}
                    </h4>
                    <span
                      className={`text-sm font-bold ${getScoreColor(
                        result.analysisScore
                      )}`}
                    >
                      {result.analysisScore}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 text-xs rounded border ${getReadinessColor(
                        result.aiReadinessLevel
                      )}`}
                    >
                      {result.aiReadinessLevel} Readiness
                    </span>
                    <span className="text-xs text-gray-400">
                      {result.contentGaps.length} gaps identified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed View */}
          <div>
            {selectedResult ? (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Detailed Analysis
                </h3>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">
                      {selectedResult.assetName}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">AI Readiness:</span>
                        <span
                          className={`ml-2 font-medium ${getScoreColor(
                            selectedResult.analysisScore
                          )}`}
                        >
                          {selectedResult.analysisScore}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Level:</span>
                        <span className="ml-2 font-medium text-white">
                          {selectedResult.aiReadinessLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-300 mb-2">
                      Performance Metrics
                    </h5>
                    <div className="space-y-2">
                      {Object.entries(selectedResult.performanceMetrics).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <span className="text-xs text-gray-400 capitalize">
                              {key}:
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-700 rounded-full h-1">
                                <div
                                  className="bg-purple-500 h-1 rounded-full"
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                              <span className="text-xs text-white w-8">
                                {value}%
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Content Gaps */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-300 mb-2">
                      Content Gaps
                    </h5>
                    <div className="space-y-1">
                      {selectedResult.contentGaps.map((gap, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-300">{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-300 mb-2">
                      Recommendations
                    </h5>
                    <div className="space-y-1">
                      {selectedResult.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <ArrowRight className="h-3 w-3 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-300">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select an asset</p>
                <p>Choose an analysis result to view detailed insights</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {damAssets.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No DAM Assets Available</p>
          <p>Import content from your DAM system to begin AI analysis</p>
        </div>
      )}

      {/* No Results State */}
      {damAssets.length > 0 && analysisResults.length === 0 && !isAnalyzing && (
        <div className="text-center py-12 text-gray-400">
          <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Ready for Analysis</p>
          <p>Click "Analyze Content" to run AI analysis on your DAM assets</p>
        </div>
      )}
    </div>
  );
};

export default DAMContentAnalysis;
