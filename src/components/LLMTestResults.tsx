// LLM Test Results Display Component
// Shows detailed test results in a dedicated modal window

import React, { useState } from "react";
import {
  X,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Target,
  Zap,
  AlertTriangle,
  TrendingUp,
  FileText,
  BarChart3,
  Eye,
} from "lucide-react";
import { ContentAnalysisReport } from "../services/llmTesting";
import ContentPreview from "./ContentPreview";

interface UploadedContent {
  id: string;
  name: string;
  content: string;
  type: string;
  uploadDate: Date;
}

interface Props {
  report: ContentAnalysisReport;
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
}

const LLMTestResults: React.FC<Props> = ({
  report,
  isOpen,
  onClose,
  onExport,
}) => {
  const [previewContent, setPreviewContent] = useState<UploadedContent | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => `$${amount.toFixed(4)}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
  const formatLatency = (ms: number) => `${ms.toFixed(0)}ms`;

  // Get top performing and worst performing providers
  const sortedProviders = [...report.providerPerformance].sort(
    (a, b) => b.successRate - a.successRate
  );
  const bestProvider = sortedProviders[0];
  const worstProvider = sortedProviders[sortedProviders.length - 1];

  // Calculate additional metrics
  const totalPrompts = report.testResults.length;
  const successfulTests = report.testResults.filter(
    (t) => t.overallSuccess
  ).length;
  const failedTests = totalPrompts - successfulTests;

  // Extract unique content from test results
  const uniqueContent = Array.from(
    new Map(
      report.testResults.map((result) => [
        result.contentChunk,
        {
          id: `content-${result.contentChunk
            .substring(0, 20)
            .replace(/\s+/g, "-")}`,
          name: `Content Chunk (${result.contentChunk.substring(0, 30)}...)`,
          content: result.contentChunk,
          type: "analyzed-content",
          uploadDate: report.testDate,
        },
      ])
    ).values()
  );

  const handleViewContent = (content: UploadedContent) => {
    setPreviewContent(content);
    setIsPreviewOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              LLM Test Results
            </h2>
            <p className="text-gray-600 mt-1">
              {report.industryId} Industry •{" "}
              {new Date(report.testDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Analyzed Content Section */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Analyzed Content ({uniqueContent.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {uniqueContent.map((content, index) => (
                <div
                  key={content.id}
                  className="bg-gray-50 p-3 rounded-lg border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        Content Chunk {index + 1}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewContent(content)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                    {content.content.substring(0, 120)}
                    {content.content.length > 120 && "..."}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {content.content.split(/\s+/).length} words •{" "}
                    {content.content.length} characters
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overview Metrics */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Success Rate
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-900 mt-1">
                  {formatPercentage(report.overallSuccessRate)}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {successfulTests} of {totalPrompts} tests passed
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Avg Latency
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-900 mt-1">
                  {formatLatency(report.averageLatency)}
                </div>
                <div className="text-xs text-blue-600 mt-1">Response time</div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    Total Cost
                  </span>
                </div>
                <div className="text-2xl font-bold text-purple-900 mt-1">
                  {formatCurrency(report.totalCost)}
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  {report.totalResponses} API calls
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border ${
                  failedTests > 0
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {failedTests > 0 ? (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  ) : (
                    <Target className="h-5 w-5 text-gray-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      failedTests > 0 ? "text-red-800" : "text-gray-800"
                    }`}
                  >
                    Content Gaps
                  </span>
                </div>
                <div
                  className={`text-2xl font-bold mt-1 ${
                    failedTests > 0 ? "text-red-900" : "text-gray-900"
                  }`}
                >
                  {report.gapAnalysis.length}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    failedTests > 0 ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  Areas to improve
                </div>
              </div>
            </div>
          </div>

          {/* Provider Performance */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Provider Performance</span>
            </h3>
            <div className="space-y-3">
              {report.providerPerformance.map((provider, index) => (
                <div
                  key={`${provider.provider}-${provider.model}`}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index === 0
                            ? "bg-green-500"
                            : index === report.providerPerformance.length - 1
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <span className="font-medium text-gray-900">
                        {provider.provider} / {provider.model}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Best
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatPercentage(provider.successRate)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {provider.responseCount} responses
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Latency:</span>
                      <span className="ml-2 font-medium">
                        {formatLatency(provider.averageLatency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cost:</span>
                      <span className="ml-2 font-medium">
                        {formatCurrency(provider.totalCost)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cost/Success:</span>
                      <span className="ml-2 font-medium">
                        {provider.successRate > 0
                          ? formatCurrency(
                              provider.totalCost /
                                (provider.responseCount * provider.successRate)
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          provider.successRate >= 0.8
                            ? "bg-green-500"
                            : provider.successRate >= 0.6
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${provider.successRate * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Gaps */}
          {report.gapAnalysis.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Content Gaps Identified</span>
              </h3>
              <div className="space-y-3">
                {report.gapAnalysis.map((gap) => (
                  <div
                    key={gap.id}
                    className="bg-red-50 border border-red-200 p-4 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900">
                          {gap.title}
                        </h4>
                        <p className="text-red-700 text-sm mt-1">
                          {gap.description}
                        </p>

                        <div className="mt-3">
                          <span className="text-xs text-red-600 font-medium">
                            Failed Prompts:
                          </span>
                          <div className="mt-1 space-y-1">
                            {gap.failedPrompts
                              .slice(0, 3)
                              .map((prompt, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs text-red-600 bg-red-100 p-2 rounded"
                                >
                                  "{prompt}"
                                </div>
                              ))}
                            {gap.failedPrompts.length > 3 && (
                              <div className="text-xs text-red-500">
                                +{gap.failedPrompts.length - 3} more prompts
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            gap.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : gap.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {gap.priority} Priority
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Est. {gap.estimatedHours}h to fix
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {report.recommendations.length > 0 && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Recommendations</span>
              </h3>
              <div className="space-y-4">
                {report.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-blue-50 border border-blue-200 p-4 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-blue-900">{rec.title}</h4>
                      <div className="flex space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.impact === "High"
                              ? "bg-red-100 text-red-800"
                              : rec.impact === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {rec.impact} Impact
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.effort === "High"
                              ? "bg-red-100 text-red-800"
                              : rec.effort === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {rec.effort} Effort
                        </span>
                      </div>
                    </div>

                    <p className="text-blue-700 text-sm mb-3">
                      {rec.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-blue-600 font-medium">
                          Timeline:
                        </span>
                        <div className="text-sm text-blue-800">
                          {rec.timeline}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-blue-600 font-medium">
                          Category:
                        </span>
                        <div className="text-sm text-blue-800">
                          {rec.category}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-xs text-blue-600 font-medium">
                        Action Items:
                      </span>
                      <ul className="mt-1 space-y-1">
                        {rec.actions.map((action, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-blue-700 flex items-start space-x-2"
                          >
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Preview Modal */}
      <ContentPreview
        content={previewContent}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        showSelectButton={false}
        title="Analyzed Content Preview"
      />
    </div>
  );
};

export default LLMTestResults;
