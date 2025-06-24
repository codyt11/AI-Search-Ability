import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
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
} from "recharts";
import {
  TrendingUp,
  FileText,
  AlertTriangle,
  Users,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { getAnalytics, AnalyticsData } from "../services/api";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("frequency");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const sortMetrics = (metrics: any[], field: string) => {
    return [...metrics].sort((a, b) => {
      if (sortOrder === "desc") {
        return b[field] - a[field];
      }
      return a[field] - b[field];
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Failed to load analytics data</p>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Insights and trends from your digital asset analysis
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="frequency">Sort by Frequency</option>
            <option value="impact">Sort by Impact</option>
            <option value="priority">Sort by Priority</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="btn-secondary flex items-center space-x-2"
          >
            {sortOrder === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
            <span>{sortOrder === "desc" ? "Desc" : "Asc"}</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Assets</p>
              <p className="text-2xl font-bold text-white">
                {analyticsData.totalAssets}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium status-positive">+12%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Avg Compatibility
              </p>
              <p className="text-2xl font-bold text-white">
                {analyticsData.avgCompatibilityScore}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-600/20 to-emerald-600/20">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium status-positive">+5%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Common Issues</p>
              <p className="text-2xl font-bold text-white">
                {analyticsData.commonIssues.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-600/20 to-orange-600/20">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium status-negative">-8%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Content Gaps</p>
              <p className="text-2xl font-bold text-white">
                {analyticsData.contentGapTrends.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium status-positive">+3%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Improvement Trends */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          Improvement Trends
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={analyticsData.improvementTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
            <YAxis domain={[0, 100]} stroke="#9CA3AF" fontSize={12} />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f9fafb",
              }}
            />
            <Line
              type="monotone"
              dataKey="avgScore"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Avg Compatibility Score"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="assetsAnalyzed"
              stroke="#10b981"
              strokeWidth={3}
              name="Assets Analyzed"
              yAxisId="right"
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Common Issues & Content Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Most Common Issues
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortMetrics(analyticsData.commonIssues, sortBy)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="type"
                angle={-45}
                textAnchor="end"
                height={100}
                stroke="#9CA3AF"
                fontSize={11}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f9fafb",
                }}
              />
              <Bar dataKey="frequency" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Content Gap Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.contentGapTrends}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ topic, frequency }) => `${topic}: ${frequency}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="frequency"
              >
                {analyticsData.contentGapTrends.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
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

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white">Issue Breakdown</h3>
          </div>
          <div className="divide-y divide-gray-700">
            {sortMetrics(analyticsData.commonIssues, sortBy).map(
              (issue, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-gray-700/30 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{issue.type}</h4>
                      <p className="text-sm text-gray-400">
                        Impact: {issue.impact}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-400">
                        {issue.frequency}%
                      </p>
                      <p className="text-xs text-gray-500">of assets</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="card">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white">
              Content Gap Priorities
            </h3>
          </div>
          <div className="divide-y divide-gray-700">
            {analyticsData.contentGapTrends.map((gap, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-700/30 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">{gap.topic}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          gap.priority === "High"
                            ? "bg-red-900/30 text-red-300 border border-red-700/50"
                            : gap.priority === "Medium"
                            ? "bg-yellow-900/30 text-yellow-300 border border-yellow-700/50"
                            : "bg-green-900/30 text-green-300 border border-green-700/50"
                        }`}
                      >
                        {gap.priority}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-400">
                      {gap.frequency}%
                    </p>
                    <p className="text-xs text-gray-500">query frequency</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
