import React, { useState } from "react";
import {
  Brain,
  Edit3,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  FileText,
  Zap,
} from "lucide-react";
import { AnalysisResult } from "../services/api";
import { getIndustryById } from "../utils/industryData";

interface Insight {
  id: string;
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  effort: "Low" | "Medium" | "High";
  category: "Structure" | "Content" | "Formatting" | "Style";
  hasRewrite?: boolean;
  originalText?: string;
  suggestedText?: string;
}

interface ActionableInsightsProps {
  fileName?: string;
  analysisResult?: AnalysisResult;
  selectedIndustry?: string;
}

const ActionableInsights: React.FC<ActionableInsightsProps> = ({
  fileName = "your document",
  analysisResult,
  selectedIndustry = "life-sciences",
}) => {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [appliedRewrites, setAppliedRewrites] = useState<Set<string>>(
    new Set()
  );

  // Generate insights based on analysis results
  const generateInsightsFromAnalysis = (): Insight[] => {
    if (!analysisResult) {
      return getDefaultInsights();
    }

    const generatedInsights: Insight[] = [];

    // Convert analysis issues to insights
    analysisResult.issues?.forEach((issue, index) => {
      let category: Insight["category"] = "Content";
      let impact: Insight["impact"] = "Medium";
      let effort: Insight["effort"] = "Medium";

      // Map issue types to categories and priorities
      if (
        issue.type.toLowerCase().includes("structure") ||
        issue.type.toLowerCase().includes("heading")
      ) {
        category = "Structure";
      } else if (
        issue.type.toLowerCase().includes("format") ||
        issue.type.toLowerCase().includes("list")
      ) {
        category = "Formatting";
      } else if (
        issue.type.toLowerCase().includes("style") ||
        issue.type.toLowerCase().includes("voice")
      ) {
        category = "Style";
      }

      // Map severity to impact
      if (issue.severity === "high" || issue.severity === "critical") {
        impact = "High";
        effort = "Low"; // High impact issues should be prioritized
      } else if (issue.severity === "low") {
        impact = "Low";
        effort = "Low";
      }

      generatedInsights.push({
        id: `analysis-${index + 1}`,
        title: `Fix ${issue.type}`,
        description: issue.description,
        impact,
        effort,
        category,
        hasRewrite: category === "Style" || category === "Formatting",
        originalText:
          category === "Style"
            ? "Content may use passive voice or unclear phrasing."
            : undefined,
        suggestedText:
          category === "Style"
            ? "Use active voice and clear, direct language for better AI comprehension."
            : undefined,
      });
    });

    // Convert analysis recommendations to insights
    analysisResult.recommendations?.forEach((rec, index) => {
      const insightIndex = generatedInsights.length + index + 1;
      generatedInsights.push({
        id: `recommendation-${insightIndex}`,
        title: rec.title,
        description: rec.description,
        impact:
          rec.expectedImprovement > 15
            ? "High"
            : rec.expectedImprovement > 8
            ? "Medium"
            : "Low",
        effort: "Medium",
        category: "Content",
        hasRewrite: true,
        originalText: "Current content structure",
        suggestedText: `Improved content following ${rec.title.toLowerCase()} guidelines`,
      });
    });

    // Add structure-specific insights based on scores
    if (analysisResult.structureScore < 70) {
      generatedInsights.push({
        id: "structure-improvement",
        title: "Improve document structure",
        description: `Document structure score is ${analysisResult.structureScore}%. Add clear headings, sections, and logical flow to improve AI understanding.`,
        impact: "High",
        effort: "Medium",
        category: "Structure",
        hasRewrite: true,
        originalText: "Unstructured content without clear hierarchy",
        suggestedText:
          "# Main Title\n\n## Section 1: Overview\nContent here...\n\n## Section 2: Details\nContent here...\n\n### Subsection\nMore specific content...",
      });
    }

    // Add clarity insights
    if (analysisResult.clarityScore < 70) {
      generatedInsights.push({
        id: "clarity-improvement",
        title: "Simplify complex sentences",
        description: `Clarity score is ${analysisResult.clarityScore}%. Break down complex sentences and use simpler language for better AI processing.`,
        impact: "Medium",
        effort: "Low",
        category: "Style",
        hasRewrite: true,
        originalText:
          "Complex, multi-clause sentences that are difficult to parse",
        suggestedText:
          "Clear, concise sentences. Each sentence focuses on one main idea. This improves AI comprehension.",
      });
    }

    // Add token efficiency insights
    if (analysisResult.tokenEfficiency < 70) {
      generatedInsights.push({
        id: "token-efficiency",
        title: "Optimize token usage",
        description: `Token efficiency is ${analysisResult.tokenEfficiency}%. Remove redundant words and optimize content density.`,
        impact: "Medium",
        effort: "Low",
        category: "Content",
        hasRewrite: true,
        originalText:
          "Verbose content with unnecessary words and repetitive phrasing that reduces efficiency",
        suggestedText:
          "Concise content that delivers key information efficiently without redundancy",
      });
    }

    return generatedInsights.slice(0, 5); // Limit to top 5 insights
  };

  const getDefaultInsights = (): Insight[] => {
    // Get industry-specific insights
    const industryData = getIndustryById(selectedIndustry);
    const industryInsights = industryData?.insights || [];

    // Convert industry insights to our format
    const convertedInsights = industryInsights.map((insight) => ({
      id: insight.id,
      title: insight.title,
      description: insight.description,
      impact: insight.impact,
      effort: insight.effort,
      category: insight.category,
      hasRewrite: insight.hasRewrite,
      originalText: insight.originalText,
      suggestedText: insight.suggestedText,
    }));

    // If we have industry insights, use them; otherwise use fallback
    if (convertedInsights.length > 0) {
      return convertedInsights;
    }

    // Fallback insights
    return [
      {
        id: "1",
        title: "Add headings to Section 4",
        description:
          "Section 4 lacks clear headings, making it difficult for AI to understand content hierarchy and retrieve specific information.",
        impact: "High",
        effort: "Low",
        category: "Structure",
        hasRewrite: true,
        originalText:
          "The drug should be administered twice daily with food. Monitor liver function regularly. Discontinue if severe reactions occur.",
        suggestedText:
          "## Administration Guidelines\n\n### Dosing Schedule\nThe drug should be administered twice daily with food.\n\n### Monitoring Requirements\nMonitor liver function regularly.\n\n### Safety Protocols\nDiscontinue if severe reactions occur.",
      },
      {
        id: "2",
        title: "Split paragraph 2.2 — it's too long for AI chunking",
        description:
          "Paragraph 2.2 contains 347 words, exceeding optimal chunk size. AI systems work better with focused, shorter content blocks.",
        impact: "High",
        effort: "Medium",
        category: "Structure",
        hasRewrite: true,
        originalText:
          "Clinical trials demonstrated efficacy in treating moderate to severe plaque psoriasis in adults. The study included 1,296 patients across multiple centers with primary endpoints of PASI 75 response at week 16. Secondary endpoints included PASI 90 and PASI 100 responses, as well as Investigator Global Assessment scores. Safety data was collected throughout the study period with particular attention to infection rates and laboratory abnormalities.",
        suggestedText:
          "Clinical trials demonstrated efficacy in treating moderate to severe plaque psoriasis in adults.\n\n**Study Design**: The study included 1,296 patients across multiple centers.\n\n**Primary Endpoints**: PASI 75 response at week 16.\n\n**Secondary Endpoints**: PASI 90 and PASI 100 responses, plus Investigator Global Assessment scores.\n\n**Safety Monitoring**: Data collected throughout the study with focus on infection rates and laboratory abnormalities.",
      },
      {
        id: "3",
        title: "Avoid passive phrasing in conclusion",
        description:
          "Passive voice reduces AI comprehension and makes key information harder to extract. Active voice improves discoverability.",
        impact: "Medium",
        effort: "Low",
        category: "Style",
        hasRewrite: true,
        originalText:
          "It is recommended that patients be monitored regularly and that adverse events be reported immediately.",
        suggestedText:
          "Healthcare providers should monitor patients regularly and report adverse events immediately.",
      },
      {
        id: "4",
        title: "Add specific keywords for dosing information",
        description:
          'Include explicit keywords like "dosage", "administration", and "frequency" to improve AI search matching.',
        impact: "Medium",
        effort: "Low",
        category: "Content",
        hasRewrite: true,
        originalText: "Take one tablet by mouth twice daily.",
        suggestedText:
          "**Dosage and Administration:**\nTake one tablet by mouth twice daily.\n\n**Frequency:** Twice daily (every 12 hours)\n**Route:** Oral administration\n**Dosage form:** Tablet",
      },
      {
        id: "5",
        title: "Format contraindications as a bulleted list",
        description:
          "Current paragraph format makes contraindications harder for AI to parse. Structured lists improve extraction.",
        impact: "Medium",
        effort: "Low",
        category: "Formatting",
        hasRewrite: true,
        originalText:
          "Contraindicated in patients with known hypersensitivity to the active ingredient, severe hepatic impairment, or concurrent use of live vaccines.",
        suggestedText:
          "**Contraindications:**\n• Known hypersensitivity to the active ingredient\n• Severe hepatic impairment\n• Concurrent use of live vaccines",
      },
    ];
  };

  // Use analysis-based insights or fallback to defaults
  const insights = generateInsightsFromAnalysis();

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "Low":
        return "text-green-600 bg-green-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "High":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Structure":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "Content":
        return <Brain className="w-4 h-4 text-purple-600" />;
      case "Formatting":
        return <Edit3 className="w-4 h-4 text-green-600" />;
      case "Style":
        return <Lightbulb className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleApplyRewrite = (insightId: string) => {
    setAppliedRewrites((prev) => new Set([...prev, insightId]));
  };

  const toggleExpanded = (insightId: string) => {
    setExpandedInsight(expandedInsight === insightId ? null : insightId);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
          <Brain className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Actionable Insights
          </h2>
          <p className="text-gray-600">How can I improve AI discoverability?</p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center mb-2">
          <Brain className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="font-semibold text-blue-900">
            5 recommendations for {fileName}
          </h3>
        </div>
        <p className="text-blue-700 text-sm">
          These AI-powered suggestions will improve content discoverability and
          search accuracy.
        </p>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="p-4 bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg mr-3 border">
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {insight.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {insight.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getImpactColor(
                        insight.impact
                      )}`}
                    >
                      {insight.impact} Impact
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getEffortColor(
                        insight.effort
                      )}`}
                    >
                      {insight.effort} Effort
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-600">
                      {insight.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {insight.hasRewrite && (
                    <button
                      onClick={() => toggleExpanded(insight.id)}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      AI Rewrite
                    </button>
                  )}
                </div>
              </div>
            </div>

            {expandedInsight === insight.id && insight.hasRewrite && (
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      Original Text
                    </h4>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                        {insight.originalText}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-green-500" />
                      AI-Optimized Version
                    </h4>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                        {insight.suggestedText}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    This rewrite improves AI chunking and keyword matching
                  </div>

                  {!appliedRewrites.has(insight.id) ? (
                    <button
                      onClick={() => handleApplyRewrite(insight.id)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Apply Rewrite
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Applied</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">
              Implementation Priority
            </h3>
            <p className="text-sm text-gray-600">
              Start with High Impact + Low Effort recommendations for quick wins
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Export Recommendations
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionableInsights;
