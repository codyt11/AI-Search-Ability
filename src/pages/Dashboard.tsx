import {
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Info,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import RealtimePromptMonitor from "../components/RealtimePromptMonitor";
import { useState } from "react";
import { getIndustryById } from "../utils/industryData";
import IndustrySelector from "../components/IndustrySelector";
import DataExplanation from "../components/DataExplanation";

const Dashboard = () => {
  const [selectedIndustry, setSelectedIndustry] = useState("life-sciences");
  const industryData = getIndustryById(selectedIndustry);

  // Industry-specific metrics
  const visibilityScore = industryData
    ? industryData.keyMetrics.successRate
    : 89.8;
  const weeklyChange = 1;

  const brandRankings = [
    {
      rank: 1,
      name: "OpenAI",
      icon: "🤖",
      change: 5,
      score: 92,
      trend: "up",
    },
    {
      rank: 2,
      name: "Claude",
      icon: "🧠",
      change: 1,
      score: 89.8,
      trend: "up",
    },
    {
      rank: 3,
      name: "Gemini",
      icon: "✨",
      change: -1,
      score: 85.2,
      trend: "down",
    },
    {
      rank: 4,
      name: "GPT-4",
      icon: "⭐",
      change: 5,
      score: 78,
      trend: "up",
    },
    {
      rank: 5,
      name: "Llama",
      icon: "🦙",
      change: -2,
      score: 76.9,
      trend: "down",
    },
    {
      rank: 6,
      name: "Cohere",
      icon: "🔗",
      change: 1.8,
      score: 72.3,
      trend: "up",
    },
  ];

  const visibilityData = [
    { day: "Jan 29", value: 85 },
    { day: "Jan 30", value: 87 },
    { day: "Jan 31", value: 84 },
    { day: "Feb 01", value: 89 },
    { day: "Feb 02", value: 91 },
    { day: "Feb 03", value: 88 },
    { day: "Feb 04", value: 89.8 },
  ];

  // Industry-specific stats
  const stats = [
    {
      label: "Relevant Prompts",
      value: industryData
        ? industryData.keyMetrics.totalPrompts.toLocaleString()
        : "247",
      change: "+12%",
      changeType: "positive",
      icon: FileText,
    },
    {
      label: "Content Win Rate",
      value: industryData ? `${industryData.keyMetrics.successRate}%` : "34%",
      change: "+5%",
      changeType: "positive",
      icon: CheckCircle,
    },
    {
      label: "Missed Opportunities",
      value: industryData
        ? (
            (industryData.keyMetrics.totalPrompts *
              (100 - industryData.keyMetrics.successRate)) /
            100
          ).toFixed(0)
        : "163",
      change: "-8%",
      changeType: "positive",
      icon: AlertTriangle,
    },
    {
      label: "Competitive Rank",
      value: industryData
        ? `#${Math.ceil(industryData.keyMetrics.successRate / 20)}`
        : "#3",
      change: "+1",
      changeType: "positive",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Home
          </h1>
          <p className="text-gray-300 mt-2 text-lg">
            Monitor your digital assets' search-readiness and optimization
            progress
          </p>
        </div>
        <Link to="/analyze" className="btn-primary flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Analyze New Asset</span>
        </Link>
      </div>

      {/* Industry Selector */}
      <IndustrySelector
        selectedIndustry={selectedIndustry}
        onIndustryChange={setSelectedIndustry}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Brand Visibility Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visibility Score Card */}
          <div className="card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">
                Content Visibility Score
              </h2>
              <p className="text-gray-400 text-sm">
                Percentage of relevant AI prompts where your content appears in
                responses, competing against other{" "}
                {industryData?.name?.toLowerCase() || "industry"} companies
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Info className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-blue-300">
                  Based on competitive analysis across major LLM platforms
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-gray-400 text-sm mb-2">
                Your Content Win Rate
              </h3>
              <div className="flex items-end space-x-4">
                <span className="text-4xl font-bold text-white">
                  {visibilityScore}%
                </span>
                <div className="flex items-center space-x-1 text-green-400 text-sm font-medium mb-2">
                  <ArrowUp className="h-4 w-4" />
                  <span>{weeklyChange}%</span>
                  <span className="text-gray-500">vs last week</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Your content mentioned in {Math.round(visibilityScore * 2.47)}{" "}
                of 247 relevant prompts
              </div>
            </div>

            {/* Competitive Context */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">
                How This Works
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300">
                <div>
                  <span className="text-blue-400">•</span> We test
                  industry-relevant prompts across major LLMs
                </div>
                <div>
                  <span className="text-blue-400">•</span> Track when your
                  content appears vs competitors
                </div>
                <div>
                  <span className="text-blue-400">•</span> 34% = Your content
                  mentioned in 84 of 247 prompts
                </div>
                <div>
                  <span className="text-blue-400">•</span> 163 missed
                  opportunities where competitors won
                </div>
              </div>
            </div>

            {/* Visibility Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visibilityData}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 4, fill: "#22c55e" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const getMetricType = (label: string) => {
                if (label.includes("Prompts")) return "failed-prompts";
                if (label.includes("Success")) return "success-rate";
                if (label.includes("Gaps")) return "critical-gaps";
                if (label.includes("Fix")) return "fix-time";
                return "failed-prompts";
              };

              return (
                <div key={index} className="metric-card">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-400">
                          {stat.label}
                        </p>
                        <DataExplanation
                          metric={getMetricType(stat.label) as any}
                          industryName={industryData?.name}
                        />
                      </div>
                      <p className="text-2xl font-bold text-white mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 ml-3">
                      <stat.icon className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium status-positive">
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      from last month
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brand Rankings Sidebar */}
        <div className="space-y-6">
          {/* Real-time Prompt Monitor */}
          <RealtimePromptMonitor />

          <div className="card p-6">
            <h3 className="text-lg font-bold text-white mb-6">
              Content Performance by Type
            </h3>
            <div className="space-y-4">
              {industryData?.mockContentChunks.map((chunk, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 text-sm font-medium w-4">
                      {index + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm">
                        {chunk.title}
                      </span>
                      <span className="text-gray-400 text-xs capitalize">
                        {chunk.category.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-sm text-green-400">
                      <ArrowUp className="h-3 w-3" />
                      <span>2%</span>
                    </div>
                    <span className="text-white font-bold text-sm min-w-[3rem] text-right">
                      {Math.round(chunk.confidence * 100)}%
                    </span>
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-400 py-4">
                  <p>No content data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Common Prompts Preview */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Top Prompts This Week
            </h3>
            <div className="space-y-3">
              {industryData?.commonPrompts.slice(0, 3).map((prompt, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">
                    "
                    {prompt.length > 30
                      ? prompt.substring(0, 30) + "..."
                      : prompt}
                    "
                  </span>
                  <span className="text-white font-medium">
                    {85 - index * 7}%
                  </span>
                </div>
              )) || (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">
                      Sample prompt 1
                    </span>
                    <span className="text-white font-medium">89.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">
                      Sample prompt 2
                    </span>
                    <span className="text-white font-medium">76.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">
                      Sample prompt 3
                    </span>
                    <span className="text-white font-medium">68.5%</span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-blue-300">
                  Success rates for {industryData?.name || "sample"} content
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
