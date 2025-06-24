import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText,
  Brain,
  Target,
} from "lucide-react";
import { AnalysisResult } from "../services/api";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  const scoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const scoreData = [
    { name: "Structure", score: result.structureScore },
    { name: "Clarity", score: result.clarityScore },
    { name: "Token Efficiency", score: result.tokenEfficiency },
    { name: "Embedding Potential", score: result.embeddingPotential },
    { name: "Prompt Coverage", score: result.promptCoverage },
  ];

  const tokenDistribution = [
    { name: "Headers", value: result.tokenAnalysis.headers, color: "#3b82f6" },
    { name: "Content", value: result.tokenAnalysis.content, color: "#10b981" },
    {
      name: "Metadata",
      value: result.tokenAnalysis.metadata,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Overall Score */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
          <div className="text-right">
            <p className="text-sm text-gray-400">Overall AI Compatibility</p>
            <p
              className={`text-3xl font-bold ${scoreColor(
                result.overallScore
              )}`}
            >
              {result.overallScore}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-blue-600/20">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <span className="font-medium text-white">File Details</span>
            </div>
            <div className="space-y-2 text-sm bg-gray-700/30 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="font-medium text-white">
                  {result.fileType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Size:</span>
                <span className="font-medium text-white">
                  {result.fileSize}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Tokens:</span>
                <span className="font-medium text-white">
                  {result.tokenCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-purple-600/20">
                <Brain className="h-5 w-5 text-purple-400" />
              </div>
              <span className="font-medium text-white">Readability</span>
            </div>
            <div className="space-y-2 text-sm bg-gray-700/30 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-400">Reading Level:</span>
                <span className="font-medium text-white">
                  {result.readabilityLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg. Sentence Length:</span>
                <span className="font-medium text-white">
                  {result.avgSentenceLength} words
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Complex Words:</span>
                <span className="font-medium text-white">
                  {result.complexWordsPercent}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-green-600/20">
                <Target className="h-5 w-5 text-green-400" />
              </div>
              <span className="font-medium text-white">Optimization</span>
            </div>
            <div className="space-y-2 text-sm bg-gray-700/30 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-400">Issues Found:</span>
                <span className="font-medium text-white">
                  {result.issues.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recommendations:</span>
                <span className="font-medium text-white">
                  {result.recommendations.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Potential Improvement:</span>
                <span className="font-medium text-green-400">
                  +{result.potentialImprovement}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-4">Score Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                stroke="#9CA3AF"
                fontSize={11}
              />
              <YAxis domain={[0, 100]} stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f9fafb",
                }}
              />
              <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Token Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tokenDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tokenDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f9fafb",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Issues and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 rounded-lg bg-yellow-600/20">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Issues Identified</h3>
          </div>
          <div className="space-y-3">
            {result.issues.map((issue, index) => (
              <div
                key={index}
                className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg hover:bg-yellow-900/30 transition-colors duration-200"
              >
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-300">
                      {issue.type}
                    </h4>
                    <p className="text-sm text-yellow-200/80 mt-1">
                      {issue.description}
                    </p>
                    <span className="text-xs text-yellow-400/70 mt-1 inline-block">
                      Impact: {issue.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 rounded-lg bg-green-600/20">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Recommendations</h3>
          </div>
          <div className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg hover:bg-green-900/30 transition-colors duration-200"
              >
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-4 w-4 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-300">{rec.title}</h4>
                    <p className="text-sm text-green-200/80 mt-1">
                      {rec.description}
                    </p>
                    <span className="text-xs text-green-400/70 mt-1 inline-block">
                      Expected improvement: +{rec.expectedImprovement}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Gaps */}
      {result.contentGaps.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Content Gaps Analysis
          </h3>
          <p className="text-gray-400 mb-4">
            Based on prompt trends and interaction analytics, we've identified
            missing content areas:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.contentGaps.map((gap, index) => (
              <div
                key={index}
                className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg hover:bg-blue-900/30 transition-colors duration-200"
              >
                <h4 className="font-medium text-blue-300">{gap.topic}</h4>
                <p className="text-sm text-blue-200/80 mt-1">
                  {gap.description}
                </p>
                <div className="mt-3 flex items-center space-x-4 text-xs">
                  <span className="px-2 py-1 bg-blue-800/30 text-blue-300 rounded-full">
                    Priority: {gap.priority}
                  </span>
                  <span className="text-blue-400/70">
                    Frequency: {gap.queryFrequency}% of queries
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
