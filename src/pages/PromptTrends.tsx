import { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Search,
  Clock,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw,
  Construction,
  AlertTriangle,
} from "lucide-react";

const PromptTrends = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data for prompt trends
  const promptVolumeData = [
    { time: "00:00", volume: 1200, unique: 800 },
    { time: "04:00", volume: 800, unique: 600 },
    { time: "08:00", volume: 2400, unique: 1800 },
    { time: "12:00", volume: 3200, unique: 2400 },
    { time: "16:00", volume: 2800, unique: 2100 },
    { time: "20:00", volume: 1800, unique: 1400 },
  ];

  const topPrompts = [
    {
      prompt: "What are the side effects of [drug name]?",
      volume: 15420,
      change: 12.5,
      trend: "up",
      therapeuticArea: "Oncology",
      avgResponseTime: "2.3s",
    },
    {
      prompt: "How does [drug] compare to alternatives?",
      volume: 12890,
      change: 8.2,
      trend: "up",
      therapeuticArea: "Cardiology",
      avgResponseTime: "3.1s",
    },
    {
      prompt: "Dosing guidelines for [medication]",
      volume: 11340,
      change: -5.2,
      trend: "down",
      therapeuticArea: "Diabetes",
      avgResponseTime: "1.8s",
    },
    {
      prompt: "Patient education materials for [condition]",
      volume: 9875,
      change: 22.1,
      trend: "up",
      therapeuticArea: "Mental Health",
      avgResponseTime: "2.7s",
    },
    {
      prompt: "Clinical trial data for [treatment]",
      volume: 8960,
      change: 6.8,
      trend: "up",
      therapeuticArea: "Rare Diseases",
      avgResponseTime: "4.2s",
    },
  ];

  const therapeuticAreaData = [
    { area: "Oncology", volume: 28450, percentage: 32, color: "#3b82f6" },
    { area: "Cardiology", volume: 21230, percentage: 24, color: "#10b981" },
    { area: "Diabetes", volume: 15680, percentage: 18, color: "#f59e0b" },
    { area: "Mental Health", volume: 12340, percentage: 14, color: "#ef4444" },
    { area: "Rare Diseases", volume: 10560, percentage: 12, color: "#8b5cf6" },
  ];

  const contentGapsByPrompt = [
    {
      missingTopic: "Drug interaction warnings",
      promptVolume: 5420,
      priority: "High",
      therapeuticArea: "Cardiology",
      estimatedImpact: "High",
    },
    {
      missingTopic: "Pediatric dosing guidelines",
      promptVolume: 4890,
      priority: "High",
      therapeuticArea: "Oncology",
      estimatedImpact: "Medium",
    },
    {
      missingTopic: "Long-term safety data",
      promptVolume: 4230,
      priority: "Medium",
      therapeuticArea: "Mental Health",
      estimatedImpact: "High",
    },
    {
      missingTopic: "Patient lifestyle recommendations",
      promptVolume: 3650,
      priority: "Medium",
      therapeuticArea: "Diabetes",
      estimatedImpact: "Medium",
    },
  ];

  const promptPerformanceData = [
    { day: "Mon", successful: 8450, failed: 450, avgTime: 2.4 },
    { day: "Tue", successful: 9200, failed: 380, avgTime: 2.2 },
    { day: "Wed", successful: 8900, failed: 420, avgTime: 2.6 },
    { day: "Thu", successful: 9800, failed: 320, avgTime: 2.1 },
    { day: "Fri", successful: 10200, failed: 280, avgTime: 1.9 },
    { day: "Sat", successful: 6800, failed: 200, avgTime: 2.0 },
    { day: "Sun", successful: 5900, failed: 180, avgTime: 2.2 },
  ];

  const refreshData = () => {
    setLastUpdated(new Date());
    // In real app, this would trigger API calls
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Under Construction Banner */}
      <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-500/50 rounded-lg p-6">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <Construction className="h-8 w-8 text-yellow-400 animate-pulse" />
            <AlertTriangle className="h-6 w-6 text-orange-400" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-yellow-300 mb-2">
              🚧 Under Construction 🚧
            </h2>
            <p className="text-yellow-200 text-lg">
              Prompt Trend Analytics is currently being developed
            </p>
            <p className="text-yellow-300 text-sm mt-2">
              This feature will provide real-time insights into prompt patterns,
              trending topics, and content performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-orange-400" />
            <Construction className="h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Prompt Trend Analytics
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time insights into prompt patterns and content performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button
            onClick={refreshData}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Prompts</p>
              <p className="text-2xl font-bold text-white">89,430</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20">
              <Search className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUp className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium status-positive ml-1">
              +12.5%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Unique Queries
              </p>
              <p className="text-2xl font-bold text-white">23,840</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-600/20 to-emerald-600/20">
              <Target className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUp className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium status-positive ml-1">
              +8.2%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Avg Response Time
              </p>
              <p className="text-2xl font-bold text-white">2.4s</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-600/20 to-orange-600/20">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowDown className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium status-positive ml-1">
              -0.3s
            </span>
            <span className="text-sm text-gray-500 ml-1">improvement</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-white">96.8%</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20">
              <Zap className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUp className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium status-positive ml-1">
              +1.2%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
      </div>

      {/* Last Updated Info */}
      <div className="text-sm text-gray-500">
        Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refresh enabled
      </div>

      {/* Prompt Volume Trends */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          Prompt Volume Trends
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={promptVolumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f9fafb",
              }}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Total Prompts"
            />
            <Area
              type="monotone"
              dataKey="unique"
              stackId="2"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Unique Queries"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Prompts and Therapeutic Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Prompts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Top Prompts</h3>
            <button className="btn-secondary text-sm flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
          <div className="space-y-4">
            {topPrompts.map((prompt, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm leading-5">
                      {prompt.prompt}
                    </h4>
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <span className="text-gray-400">
                        {prompt.therapeuticArea}
                      </span>
                      <span className="text-gray-400">
                        Avg: {prompt.avgResponseTime}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-white">
                      {prompt.volume.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end">
                      {prompt.trend === "up" ? (
                        <ArrowUp className="h-3 w-3 text-green-400" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-400" />
                      )}
                      <span
                        className={`text-xs ml-1 ${
                          prompt.trend === "up"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {Math.abs(prompt.change)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Therapeutic Area Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-6">
            Prompts by Therapeutic Area
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={therapeuticAreaData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ area, percentage }) => `${area}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="volume"
              >
                {therapeuticAreaData.map((entry, index) => (
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
          <div className="mt-4 space-y-2">
            {therapeuticAreaData.map((area, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: area.color }}
                  ></div>
                  <span className="text-gray-300">{area.area}</span>
                </div>
                <span className="text-white font-medium">
                  {area.volume.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Gaps by Prompt Analysis */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-6">
          Content Gaps Identified from Prompt Patterns
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">
                  Missing Content
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">
                  Prompt Volume
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">
                  Therapeutic Area
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">
                  Priority
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">
                  Estimated Impact
                </th>
              </tr>
            </thead>
            <tbody>
              {contentGapsByPrompt.map((gap, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800 hover:bg-gray-700/30"
                >
                  <td className="py-3 px-4 text-white">{gap.missingTopic}</td>
                  <td className="py-3 px-4 text-gray-300">
                    {gap.promptVolume.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {gap.therapeuticArea}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        gap.priority === "High"
                          ? "bg-red-900/30 text-red-300 border border-red-700/50"
                          : "bg-yellow-900/30 text-yellow-300 border border-yellow-700/50"
                      }`}
                    >
                      {gap.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        gap.estimatedImpact === "High"
                          ? "bg-red-900/30 text-red-300"
                          : "bg-yellow-900/30 text-yellow-300"
                      }`}
                    >
                      {gap.estimatedImpact}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prompt Performance */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-6">
          Weekly Prompt Performance
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={promptPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f9fafb",
              }}
            />
            <Bar
              dataKey="successful"
              fill="#10b981"
              name="Successful"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="failed"
              fill="#ef4444"
              name="Failed"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PromptTrends;
