import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Users,
  Target,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  Info,
  ChevronLeft,
  ChevronRight,
  Brain,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getIndustryById } from "../utils/industryData";

interface ContentGap {
  id: string;
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  urgency: "Critical" | "High" | "Medium";
  failedPrompts: number;
  failureRate: number;
  promptVolume: number;
  timeToFixWeeks: number;
  complianceRisk: boolean;
  primaryAudience: string;
  actionable: boolean;
  improvementPercentage: number;
}

interface GapPerformanceMetric {
  metric: string;
  current: number;
  target: number;
  trend: "up" | "down" | "stable";
  impact: string;
}

interface ContentGapInsightsProps {
  selectedIndustry?: string;
}

const ContentGapInsights: React.FC<ContentGapInsightsProps> = ({
  selectedIndustry = "life-sciences",
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const gapsPerPage = 3;

  // Get industry-specific data
  const industryData = getIndustryById(selectedIndustry);
  const rawGaps: ContentGap[] = industryData?.contentGaps || [
    {
      id: "gap-1",
      title: "Drug Interaction Warnings Missing",
      description:
        "67% of combination therapy questions fail due to missing interaction data",
      impact: "High",
      urgency: "Critical",
      failedPrompts: Math.round(8420 * 0.67), // 5,641 failed prompts (67% of 8,420 total volume)
      failureRate: 0.67,
      promptVolume: 8420,
      timeToFixWeeks: 3,
      complianceRisk: true,
      primaryAudience: "Healthcare Providers",
      actionable: true,
      improvementPercentage: 85,
    },
    {
      id: "gap-2",
      title: "Pediatric Dosing Guidelines",
      description: "78% failure rate for under-18 dosing questions",
      impact: "High",
      urgency: "High",
      failedPrompts: Math.round(6230 * 0.78), // 4,859 failed prompts (78% of 6,230 total volume)
      failureRate: 0.78,
      promptVolume: 6230,
      timeToFixWeeks: 5,
      complianceRisk: true,
      primaryAudience: "Pediatric Specialists",
      actionable: true,
      improvementPercentage: 78,
    },
    {
      id: "gap-3",
      title: "Lifestyle Modification Content",
      description:
        "45% of patient education prompts need diet/exercise guidance",
      impact: "Medium",
      urgency: "Medium",
      failedPrompts: Math.round(5680 * 0.45), // 2,556 failed prompts (45% of 5,680 total volume)
      failureRate: 0.45,
      promptVolume: 5680,
      timeToFixWeeks: 2,
      complianceRisk: false,
      primaryAudience: "Patients & Caregivers",
      actionable: true,
      improvementPercentage: 45,
    },
    {
      id: "gap-4",
      title: "Head-to-Head Study Results",
      description: "82% failure rate for competitive comparison requests",
      impact: "High",
      urgency: "High",
      failedPrompts: Math.round(4920 * 0.82), // 4,034 failed prompts (82% of 4,920 total volume)
      failureRate: 0.82,
      promptVolume: 4920,
      timeToFixWeeks: 8,
      complianceRisk: false,
      primaryAudience: "Healthcare Providers",
      actionable: true,
      improvementPercentage: 92,
    },
    {
      id: "gap-5",
      title: "Long-term Safety Monitoring",
      description: "71% failure rate for long-term safety monitoring questions",
      impact: "High",
      urgency: "High",
      failedPrompts: Math.round(3840 * 0.71), // 2,726 failed prompts (71% of 3,840 total volume)
      failureRate: 0.71,
      promptVolume: 3840,
      timeToFixWeeks: 6,
      complianceRisk: true,
      primaryAudience: "Healthcare Providers",
      actionable: true,
      improvementPercentage: 71,
    },
  ];

  // Sort gaps by priority (impact + urgency)
  const prioritizedGaps = rawGaps.sort((a, b) => {
    const aPriority =
      (a.impact === "High" ? 3 : a.impact === "Medium" ? 2 : 1) +
      (a.urgency === "Critical" ? 3 : a.urgency === "High" ? 2 : 1);
    const bPriority =
      (b.impact === "High" ? 3 : b.impact === "Medium" ? 2 : 1) +
      (b.urgency === "Critical" ? 3 : b.urgency === "High" ? 2 : 1);
    return bPriority - aPriority;
  });

  // Pagination logic
  const totalPages = Math.ceil(prioritizedGaps.length / gapsPerPage);
  const startIndex = currentPage * gapsPerPage;
  const endIndex = startIndex + gapsPerPage;
  const currentGaps = prioritizedGaps.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate simple totals
  const totalFailedPrompts = rawGaps.reduce(
    (sum, gap) => sum + gap.failedPrompts,
    0
  );

  const performanceMetrics: GapPerformanceMetric[] = [
    {
      metric: "Overall Success Rate",
      current: industryData?.keyMetrics.successRate || 32,
      target: 85,
      trend: "down",
      impact: "Critical for user satisfaction and adoption",
    },
    {
      metric: "Average Time to Fix",
      current:
        industryData?.keyMetrics.averageFixTime ||
        parseFloat(
          (
            prioritizedGaps.reduce((sum, gap) => sum + gap.timeToFixWeeks, 0) /
            prioritizedGaps.length
          ).toFixed(1)
        ),
      target: 3.0,
      trend: "stable",
      impact: "Faster fixes improve user experience",
    },
    {
      metric: "Critical Gap Count",
      current:
        industryData?.keyMetrics.criticalGaps ||
        prioritizedGaps.filter((g) => g.urgency === "Critical").length,
      target: 0,
      trend: "up",
      impact: "Each critical gap significantly impacts compliance",
    },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical":
        return "bg-red-900/30 border-red-500/50 text-red-300";
      case "High":
        return "bg-orange-900/30 border-orange-500/50 text-orange-300";
      case "Medium":
        return "bg-yellow-900/30 border-yellow-500/50 text-yellow-300";
      default:
        return "bg-gray-900/30 border-gray-500/50 text-gray-300";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />;
      default:
        return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPerformanceColor = (
    current: number,
    target: number,
    trend: string
  ) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return "text-green-400";
    if (percentage >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const handleExportGaps = () => {
    const csvContent = [
      ["ID", "Title", "Description", "Impact", "Urgency", "Failed Prompts", "Failure Rate", "Time to Fix", "Compliance Risk", "Primary Audience", "Actionable", "Improvement Percentage"],
      ...currentGaps.map(gap => [
        gap.id,
        gap.title,
        gap.description,
        gap.impact,
        gap.urgency,
        gap.failedPrompts.toLocaleString(),
        `${(gap.failureRate * 100).toFixed(0)}%`,
        `${gap.timeToFixWeeks}w`,
        gap.complianceRisk ? "Yes" : "No",
        gap.primaryAudience,
        gap.actionable ? "Yes" : "No",
        `${gap.improvementPercentage.toFixed(0)}%`
      ])
    ];
    const csvString = csvContent.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${industryData?.name || "content_gaps"}_insights.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const keyMessage = `Content gaps are impacting user experience. ${totalFailedPrompts.toLocaleString()} failed prompts monthly are preventing users from getting the information they need. Fixing these gaps will significantly improve satisfaction and platform effectiveness.`;

  return (
    <div className="space-y-6">
      {/* Header with Action Summary */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {industryData?.name || "Business"} Impact Analysis
            </h2>
            <p className="text-gray-400">
              Transform content gaps into strategic opportunities for{" "}
              {industryData?.name?.toLowerCase() || "your business"}
            </p>
          </div>
          <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-lg w-full sm:w-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-300">
                {totalFailedPrompts.toLocaleString()}
              </p>
              <p className="text-blue-400 text-sm">Failed prompts monthly</p>
            </div>
          </div>
        </div>

        {/* Key Message */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <Brain className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Key Insight</h3>
              <p className="text-gray-400 mt-1">
                {keyMessage || "No key insights available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-lg font-bold text-white mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{metric.metric}</span>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="flex items-baseline space-x-2 mb-1">
                <span
                  className={`text-xl sm:text-2xl font-bold ${getPerformanceColor(
                    metric.current,
                    metric.target,
                    metric.trend
                  )}`}
                >
                  {metric.current}
                  {metric.metric.includes("Rate")
                    ? "%"
                    : metric.metric.includes("Time")
                    ? "w"
                    : ""}
                </span>
                <span className="text-sm text-gray-500">
                  / {metric.target}
                  {metric.metric.includes("Rate")
                    ? "%"
                    : metric.metric.includes("Time")
                    ? "w"
                    : ""}{" "}
                  target
                </span>
              </div>
              <p className="text-xs text-gray-400">{metric.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Priority Gaps */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-bold text-white">Top Priority Gaps</h3>
            <p className="text-sm text-gray-400">
              Focus on these content gaps for maximum impact
            </p>
          </div>
          <button
            onClick={handleExportGaps}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto justify-center sm:justify-start"
          >
            <Download className="h-4 w-4" />
            <span>Export Gaps</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {currentGaps.map((gap, index) => (
            <div
              key={gap.id}
              className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 hover:bg-gray-800/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg font-bold text-blue-300">
                      #{startIndex + index + 1}
                    </span>
                    <h4 className="text-lg font-bold text-white">
                      {gap.title}
                    </h4>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded border ${getUrgencyColor(
                        gap.urgency
                      )}`}
                    >
                      {gap.urgency}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {gap.description}
                  </p>
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="text-gray-400">
                      <strong className="text-white">
                        {gap.failedPrompts.toLocaleString()}
                      </strong>{" "}
                      failed prompts
                    </span>
                    <span className="text-gray-400">
                      <strong className="text-red-300">
                        {(gap.failureRate * 100).toFixed(0)}%
                      </strong>{" "}
                      failure rate
                    </span>
                    <span className="text-gray-400">
                      <strong className="text-yellow-300">
                        {gap.timeToFixWeeks}w
                      </strong>{" "}
                      to resolve
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded">
                      {gap.improvementPercentage.toFixed(0)}% improvement
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {gap.primaryAudience}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                <div className="flex items-center space-x-4">
                  {gap.complianceRisk && (
                    <span className="flex items-center space-x-1 text-xs text-red-300">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Compliance Risk</span>
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    Impact: {gap.impact}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const planData = {
                      gapTitle: gap.title,
                      priority: startIndex + index + 1,
                      failedPrompts: gap.failedPrompts,
                      timeToFix: gap.timeToFixWeeks,
                      audience: gap.primaryAudience,
                      urgency: gap.urgency,
                      description: gap.description,
                      complianceRisk: gap.complianceRisk,
                    };
                    navigate("/content-plan", { state: planData });
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <span>Create Plan</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-center space-x-2 mt-6 pt-6 border-t border-gray-700/50">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                currentPage === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              // Use the first (highest priority) gap for the quick action
              const topGap = prioritizedGaps[0];
              if (topGap) {
                const planData = {
                  gapTitle: topGap.title,
                  priority: 1,
                  failedPrompts: topGap.failedPrompts,
                  timeToFix: topGap.timeToFixWeeks,
                  audience: topGap.primaryAudience,
                  urgency: topGap.urgency,
                  description: topGap.description,
                  complianceRisk: topGap.complianceRisk,
                };
                navigate("/content-plan", { state: planData });
              }
            }}
            className="flex items-center space-x-3 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg hover:bg-blue-900/50 transition-colors text-left"
          >
            <Target className="h-8 w-8 text-blue-400" />
            <div>
              <h4 className="font-medium text-white">Create Content Plan</h4>
              <p className="text-sm text-blue-300">
                Generate action plan for top priority gap
              </p>
            </div>
          </button>
          <button
            onClick={() => navigate("/prompt-simulator")}
            className="flex items-center space-x-3 p-4 bg-purple-900/30 border border-purple-700/50 rounded-lg hover:bg-purple-900/50 transition-colors text-left"
          >
            <Zap className="h-8 w-8 text-purple-400" />
            <div>
              <h4 className="font-medium text-white">Test Content</h4>
              <p className="text-sm text-purple-300">
                Simulate prompts against existing content
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentGapInsights;
