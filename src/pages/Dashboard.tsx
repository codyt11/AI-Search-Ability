import {
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Info,
  Building2,
  Zap,
  Users,
  Clock,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { getIndustryById } from "../utils/industryData";
import IndustrySelector from "../components/IndustrySelector";
import DataExplanation from "../components/DataExplanation";
import demoContentService from "../services/demoContent";

const Dashboard = () => {
  const [selectedIndustry, setSelectedIndustry] = useState("life-sciences");
  const industryData = getIndustryById(selectedIndustry);

  // Demo content metrics (for local development)
  const [isLocalDemo, setIsLocalDemo] = useState(false);
  const [demoMetrics, setDemoMetrics] = useState({
    averageOptimization: 87,
    totalPrompts: 145,
    successfulPrompts: 42,
    aiMentions: 18,
    conversionRate: 15.2,
    avgEngagement: 9.1,
  });

  // Check if running locally and calculate demo metrics
  useEffect(() => {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "";

    if (isLocalhost) {
      setIsLocalDemo(true);

      // Calculate metrics from demo content
      const avgOptimization = demoContentService.getAverageOptimizationScore();
      const ads = demoContentService.getAdvertisements();
      const landingPages = demoContentService.getLandingPages();

      // Calculate average AI mentions from ads
      const totalAiMentions = ads.reduce(
        (sum, ad) => sum + ad.performance_metrics.ai_mention_frequency,
        0
      );
      const avgAiMentions =
        ads.length > 0 ? Math.round(totalAiMentions / ads.length) : 18;

      // Calculate average conversion rate
      const totalConversion = ads.reduce(
        (sum, ad) => sum + ad.performance_metrics.conversion_rate,
        0
      );
      const avgConversion =
        ads.length > 0
          ? Number((totalConversion / ads.length).toFixed(1))
          : 15.2;

      // Calculate average engagement rate
      const totalEngagement = ads.reduce(
        (sum, ad) => sum + ad.performance_metrics.engagement_rate,
        0
      );
      const avgEngagement =
        ads.length > 0
          ? Number((totalEngagement / ads.length).toFixed(1))
          : 9.1;

      // Calculate realistic prompt numbers based on content
      const totalContent = ads.length + landingPages.length;
      const estimatedPrompts = totalContent * 24; // ~24 prompts per content piece
      const successfulPrompts = Math.round(
        estimatedPrompts * (avgOptimization / 100)
      );

      setDemoMetrics({
        averageOptimization: avgOptimization,
        totalPrompts: estimatedPrompts,
        successfulPrompts,
        aiMentions: avgAiMentions,
        conversionRate: avgConversion,
        avgEngagement,
      });
    }
  }, []);

  // Use demo metrics if running locally, otherwise use industry data
  const visibilityScore = isLocalDemo
    ? demoMetrics.averageOptimization
    : industryData
    ? industryData.keyMetrics.successRate
    : 89.8;
  const weeklyChange = isLocalDemo ? 2.3 : 1;

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

  const visibilityData = isLocalDemo
    ? [
        { day: "Jan 29", value: 82 },
        { day: "Jan 30", value: 84 },
        { day: "Jan 31", value: 83 },
        { day: "Feb 01", value: 86 },
        { day: "Feb 02", value: 88 },
        { day: "Feb 03", value: 86 },
        { day: "Feb 04", value: Math.round(visibilityScore) },
      ]
    : [
        { day: "Jan 29", value: 85 },
        { day: "Jan 30", value: 87 },
        { day: "Jan 31", value: 84 },
        { day: "Feb 01", value: 89 },
        { day: "Feb 02", value: 91 },
        { day: "Feb 03", value: 88 },
        { day: "Feb 04", value: 89.8 },
      ];

  // Stats based on demo content or industry data
  const stats = [
    {
      label: "Relevant Prompts",
      value: isLocalDemo
        ? demoMetrics.totalPrompts.toLocaleString()
        : industryData
        ? industryData.keyMetrics.totalPrompts.toLocaleString()
        : "145",
      change: isLocalDemo ? "+15%" : "+12%",
      changeType: "positive",
      icon: FileText,
    },
    {
      label: "Content Win Rate",
      value: `${Math.round(visibilityScore)}%`,
      change: isLocalDemo ? "+8%" : "+5%",
      changeType: "positive",
      icon: CheckCircle,
    },
    {
      label: "Missed Opportunities",
      value: isLocalDemo
        ? (demoMetrics.totalPrompts - demoMetrics.successfulPrompts).toString()
        : industryData
        ? (
            (industryData.keyMetrics.totalPrompts *
              (100 - industryData.keyMetrics.successRate)) /
            100
          ).toFixed(0)
        : "103",
      change: isLocalDemo ? "-12%" : "-8%",
      changeType: "positive",
      icon: AlertTriangle,
    },
    {
      label: "AI Mentions/Month",
      value: isLocalDemo
        ? demoMetrics.aiMentions.toString()
        : industryData
        ? `#${Math.ceil(industryData.keyMetrics.successRate / 20)}`
        : "18",
      change: isLocalDemo ? "+6%" : "+1",
      changeType: "positive",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Demo Content Notice */}
      {isLocalDemo && (
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Demo Mode Active</h3>
              <p className="text-blue-200 text-sm">
                You're running locally, so we're showing metrics based on your
                sample content library. These numbers reflect the performance of
                the demo advertisements and landing pages.
              </p>
            </div>
          </div>
        </div>
      )}

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
                {isLocalDemo ? (
                  <>
                    Your sample content mentioned in{" "}
                    {demoMetrics.successfulPrompts} of{" "}
                    {demoMetrics.totalPrompts} relevant prompts
                  </>
                ) : (
                  <>
                    Your content mentioned in{" "}
                    {Math.round(visibilityScore * 2.47)} of 247 relevant prompts
                  </>
                )}
              </div>
            </div>

            {/* Competitive Context */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">
                {isLocalDemo ? "Demo Content Analysis" : "How This Works"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300">
                {isLocalDemo ? (
                  <>
                    <div>
                      <span className="text-blue-400">•</span> Based on your
                      sample content library (ads & landing pages)
                    </div>
                    <div>
                      <span className="text-blue-400">•</span> AI optimization
                      scores: 87-94% across content
                    </div>
                    <div>
                      <span className="text-blue-400">•</span>{" "}
                      {Math.round(visibilityScore)}% = Content found in{" "}
                      {demoMetrics.successfulPrompts} of{" "}
                      {demoMetrics.totalPrompts} queries
                    </div>
                    <div>
                      <span className="text-blue-400">•</span>{" "}
                      {demoMetrics.totalPrompts - demoMetrics.successfulPrompts}{" "}
                      opportunities for optimization
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-blue-400">•</span> We test
                      industry-relevant prompts across major LLMs
                    </div>
                    <div>
                      <span className="text-blue-400">•</span> Track when your
                      content appears vs competitors
                    </div>
                    <div>
                      <span className="text-blue-400">•</span> 34% = Your
                      content mentioned in 84 of 247 prompts
                    </div>
                    <div>
                      <span className="text-blue-400">•</span> 163 missed
                      opportunities where competitors won
                    </div>
                  </>
                )}
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
                if (label.includes("Relevant Prompts"))
                  return "relevant-prompts";
                if (label.includes("Content Win Rate"))
                  return "content-win-rate";
                if (label.includes("Missed Opportunities"))
                  return "missed-opportunities";
                if (label.includes("AI Mentions")) return "ai-mentions";
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
          <div className="card p-6">
            <h3 className="text-lg font-bold text-white mb-6">
              Content Performance by Type
            </h3>
            <div className="space-y-4">
              {isLocalDemo ? (
                <>
                  {demoContentService.getAdvertisements().map((ad, index) => (
                    <div
                      key={ad.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400 text-sm font-medium w-4">
                          {index + 1}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-white font-medium text-sm">
                            {ad.title}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {ad.platform} • {ad.industry}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                          <span className="text-xs">Score:</span>
                        </div>
                        <span className="text-white font-bold text-sm min-w-[3rem] text-right">
                          {ad.ai_optimization.semantic_relevance}%
                        </span>
                      </div>
                    </div>
                  ))}
                  {demoContentService.getLandingPages().map((page, index) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400 text-sm font-medium w-4">
                          {demoContentService.getAdvertisements().length +
                            index +
                            1}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-white font-medium text-sm">
                            {page.title}
                          </span>
                          <span className="text-gray-400 text-xs">
                            Landing Page • {page.industry}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                          <span className="text-xs">Score:</span>
                        </div>
                        <span className="text-white font-bold text-sm min-w-[3rem] text-right">
                          {page.ai_readiness_analysis.conversion_optimization}%
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
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
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                          <span className="text-xs">Score:</span>
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
                </>
              )}
            </div>
          </div>

          {/* Common Prompts Preview */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Top Prompts This Week
            </h3>
            <div className="space-y-3">
              {isLocalDemo ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">
                      "best AI marketing tools 2024"
                    </span>
                    <span className="text-white font-medium">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">
                      "workflow automation software"
                    </span>
                    <span className="text-white font-medium">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">
                      "team productivity tools"
                    </span>
                    <span className="text-white font-medium">83%</span>
                  </div>
                </>
              ) : (
                <>
                  {industryData?.commonPrompts
                    .slice(0, 3)
                    .map((prompt, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
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
                </>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-blue-300">
                  Success rates for{" "}
                  {isLocalDemo ? "demo" : industryData?.name || "sample"}{" "}
                  content
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
