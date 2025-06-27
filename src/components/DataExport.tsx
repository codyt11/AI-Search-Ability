import React from "react";
import { Download, FileText, Database, Code } from "lucide-react";
import {
  generateDataExport,
  contentGapsData,
  mockContentChunks,
  defaultInsights,
  performanceMetrics,
} from "../utils/sampleData";
import { getIndustryById } from "../utils/industryData";

interface DataExportProps {
  selectedIndustry?: string;
}

const DataExport: React.FC<DataExportProps> = ({
  selectedIndustry = "life-sciences",
}) => {
  const industryData = getIndustryById(selectedIndustry);
  const industryGaps = industryData?.contentGaps || contentGapsData;
  const industryContent = industryData?.mockContentChunks || mockContentChunks;
  const industryInsights = industryData?.insights || defaultInsights;
  const downloadTextFile = () => {
    const content = generateDataExport();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-readiness-sample-data-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const data = {
      metadata: {
        exportDate: new Date().toISOString(),
        applicationName: "Search-Ready AI Analyzer",
        version: "1.0",
        description:
          "Sample data export containing all hardcoded data used in the application",
      },
      contentGaps: industryGaps,
      mockContentChunks: industryContent,
      actionableInsights: industryInsights,
      performanceMetrics: performanceMetrics,
      summary: {
        totalContentGaps: industryGaps.length,
        totalFailedPrompts: performanceMetrics.totalFailedPrompts,
        overallSuccessRate: performanceMetrics.overallSuccessRate.current,
        totalMockContentChunks: industryContent.length,
        totalInsights: industryInsights.length,
      },
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-readiness-sample-data-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    // Create CSV for content gaps (the main data)
    const headers = [
      "ID",
      "Title",
      "Description",
      "Impact",
      "Urgency",
      "Failed Prompts",
      "Failure Rate (%)",
      "Prompt Volume",
      "Time to Fix (weeks)",
      "Compliance Risk",
      "Primary Audience",
      "Therapeutic Area",
      "Content Type",
      "Improvement %",
    ];

    const csvContent = [
      headers.join(","),
      ...industryGaps.map((gap) =>
        [
          gap.id,
          `"${gap.title}"`,
          `"${gap.description}"`,
          gap.impact,
          gap.urgency,
          gap.failedPrompts,
          (gap.failureRate * 100).toFixed(0),
          gap.promptVolume,
          gap.timeToFixWeeks,
          gap.complianceRisk ? "Yes" : "No",
          `"${gap.primaryAudience}"`,
          gap.therapeuticArea || "",
          gap.contentType || "",
          gap.improvementPercentage,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-readiness-content-gaps-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      const content = generateDataExport();
      await navigator.clipboard.writeText(content);
      alert("Sample data copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      alert("Failed to copy to clipboard. Please try downloading instead.");
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Database className="h-6 w-6 text-blue-400" />
        <div>
          <h3 className="text-lg font-bold text-white">Sample Data Export</h3>
          <p className="text-gray-400 text-sm">
            Download all hardcoded sample data used throughout the application
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Data Included</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>
              • {industryGaps.length} Content Gaps with detailed analysis (
              {industryData?.name || "Selected Industry"})
            </li>
            <li>
              • {industryContent.length} Mock content chunks for simulation
            </li>
            <li>• {industryInsights.length} Actionable insights examples</li>
            <li>• Performance metrics and benchmarks</li>
            <li>• Example prompts and therapeutic areas</li>
            <li>• Content types and categorization data</li>
          </ul>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Summary Statistics</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>
              • Total Failed Prompts:{" "}
              {performanceMetrics.totalFailedPrompts.toLocaleString()}/month
            </li>
            <li>
              • Overall Success Rate:{" "}
              {performanceMetrics.overallSuccessRate.current}%
            </li>
            <li>
              • Critical Gaps: {performanceMetrics.criticalGapCount.current}
            </li>
            <li>
              • Average Fix Time: {performanceMetrics.averageTimeToFix.current}{" "}
              weeks
            </li>
            <li>• Therapeutic Areas: 8 categories</li>
            <li>• Content Types: 8 categories</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-white">Download Options</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={downloadTextFile}
            className="flex items-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            <FileText className="h-4 w-4" />
            <span>Text Report</span>
          </button>

          <button
            onClick={downloadJSON}
            className="flex items-center space-x-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
          >
            <Code className="h-4 w-4" />
            <span>JSON Data</span>
          </button>

          <button
            onClick={downloadCSV}
            className="flex items-center space-x-2 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
          >
            <Database className="h-4 w-4" />
            <span>CSV Export</span>
          </button>

          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-2 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Copy Text</span>
          </button>
        </div>

        <div className="text-xs text-gray-500 bg-gray-800/30 p-3 rounded-lg">
          <strong>Note:</strong> All data is sample/mock data for demonstration
          purposes. Content gaps, metrics, and examples represent realistic
          scenarios but are not based on actual customer data. Use this export
          to understand the application's data structure and content modeling
          approach.
        </div>
      </div>
    </div>
  );
};

export default DataExport;
