import {
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import RealtimePromptMonitor from "../components/RealtimePromptMonitor";

const Dashboard = () => {
  const visibilityScore = 89.8;
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

  const stats = [
    {
      label: "Total Assets Analyzed",
      value: "247",
      change: "+12%",
      changeType: "positive",
      icon: FileText,
    },
    {
      label: "AI Compatibility Score",
      value: "87%",
      change: "+5%",
      changeType: "positive",
      icon: CheckCircle,
    },
    {
      label: "Content Gaps Identified",
      value: "23",
      change: "-8%",
      changeType: "positive",
      icon: AlertTriangle,
    },
    {
      label: "Optimization Potential",
      value: "34%",
      change: "+3%",
      changeType: "positive",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Home</h1>
          <p className="text-gray-400 mt-2">
            Monitor your digital assets' AI readiness and optimization progress
          </p>
        </div>
        <Link to="/analyze" className="btn-primary flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Analyze New Asset</span>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Brand Visibility Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visibility Score Card */}
          <div className="card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">
                Brand visibility
              </h2>
              <p className="text-gray-400 text-sm">
                Percentage of AI answers about Business credit cards that
                mention your brand
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-gray-400 text-sm mb-2">Visibility score</h3>
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
            {stats.map((stat, index) => (
              <div key={index} className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20">
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
            ))}
          </div>
        </div>

        {/* Brand Rankings Sidebar */}
        <div className="space-y-6">
          {/* Real-time Prompt Monitor */}
          <RealtimePromptMonitor />

          <div className="card p-6">
            <h3 className="text-lg font-bold text-white mb-6">
              Brand Industry Ranking
            </h3>
            <div className="space-y-4">
              {brandRankings.map((brand, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 text-sm font-medium w-4">
                      {brand.rank}
                    </span>
                    <span className="text-lg">{brand.icon}</span>
                    <span className="text-white font-medium">{brand.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex items-center space-x-1 text-sm ${
                        brand.trend === "up" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {brand.trend === "up" ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      <span>{Math.abs(brand.change)}%</span>
                    </div>
                    <span className="text-white font-bold text-sm min-w-[3rem] text-right">
                      {brand.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Visibility Preview */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Topic visibility
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Business Credit</span>
                <span className="text-white font-medium">89.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">
                  Financial Services
                </span>
                <span className="text-white font-medium">76.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Payment Solutions</span>
                <span className="text-white font-medium">68.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
