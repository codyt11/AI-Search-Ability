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
  Info,
} from "lucide-react";
import { getAnalytics, AnalyticsData } from "../services/api";
import demoContentService from "../services/demoContent";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("frequency");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLocalDemo, setIsLocalDemo] = useState(false);
  const [analyticsType, setAnalyticsType] = useState<
    "social" | "print" | "webpage"
  >("social");

  // Generate demo analytics data based on sample content
  const generateDemoAnalytics = (
    type: "social" | "print" | "webpage"
  ): AnalyticsData => {
    // Each category has 3 pharmaceutical assets from content library
    const totalAssets = 3; // 3 assets for the selected category

    // Calculate average optimization score specific to each content type
    const avgOptimization =
      type === "social"
        ? 89.5 // Social media average
        : type === "print"
        ? 93.1 // Print average (highest due to more control)
        : 91.0; // Web page average

    // Different issues and gaps based on content type
    const webpageAnalytics = {
      commonIssues: [
        {
          type: "Missing Patient Resources",
          frequency: 67,
          impact: "High",
        },
        {
          type: "Insufficient Safety Information",
          frequency: 58,
          impact: "Critical",
        },
        {
          type: "Poor Mobile Experience",
          frequency: 42,
          impact: "High",
        },
        {
          type: "Missing Healthcare Provider Info",
          frequency: 33,
          impact: "Medium",
        },
      ],
      contentGapTrends: [
        { topic: "Clinical Trial Data", frequency: 32, priority: "High" },
        { topic: "Patient Support Programs", frequency: 28, priority: "High" },
        {
          topic: "Drug Interaction Information",
          frequency: 24,
          priority: "High",
        },
        {
          topic: "Insurance Coverage Details",
          frequency: 18,
          priority: "Medium",
        },
        {
          topic: "Healthcare Provider Portal",
          frequency: 16,
          priority: "Medium",
        },
      ],
    };

    const socialMediaAnalytics = {
      commonIssues: [
        {
          type: "Character Limit Constraints",
          frequency: 67,
          impact: "High",
        },
        {
          type: "Missing Regulatory Disclaimers",
          frequency: 56,
          impact: "Critical",
        },
        {
          type: "Poor Mobile Visual Quality",
          frequency: 44,
          impact: "High",
        },
        {
          type: "Unclear Call-to-Action",
          frequency: 33,
          impact: "Medium",
        },
      ],
      contentGapTrends: [
        { topic: "Dosage Information", frequency: 35, priority: "Critical" },
        { topic: "Side Effects Visibility", frequency: 32, priority: "High" },
        { topic: "Brand Recognition", frequency: 28, priority: "High" },
        { topic: "Patient Education", frequency: 24, priority: "Medium" },
        { topic: "Engagement Optimization", frequency: 20, priority: "Medium" },
      ],
    };

    const printAnalytics = {
      commonIssues: [
        {
          type: "Regulatory Text Too Small",
          frequency: 78,
          impact: "Critical",
        },
        {
          type: "Poor OCR Text Quality",
          frequency: 67,
          impact: "High",
        },
        {
          type: "Insufficient Color Contrast",
          frequency: 44,
          impact: "High",
        },
        {
          type: "Missing Product Identification",
          frequency: 33,
          impact: "Medium",
        },
      ],
      contentGapTrends: [
        {
          topic: "Safety Information Clarity",
          frequency: 42,
          priority: "Critical",
        },
        { topic: "Mechanism of Action", frequency: 35, priority: "High" },
        { topic: "Visual Hierarchy", frequency: 28, priority: "High" },
        { topic: "Brand Consistency", frequency: 25, priority: "Medium" },
        { topic: "Accessibility Compliance", frequency: 22, priority: "High" },
      ],
    };

    const selectedAnalytics =
      type === "webpage"
        ? webpageAnalytics
        : type === "social"
        ? socialMediaAnalytics
        : printAnalytics;

    // Generate improvement trends specific to each content type
    const getImprovementTrends = () => {
      if (type === "social") {
        return [
          { month: "Sep", avgScore: 85, assetsAnalyzed: 1 },
          { month: "Oct", avgScore: 87, assetsAnalyzed: 2 },
          { month: "Nov", avgScore: 88, assetsAnalyzed: 2 },
          { month: "Dec", avgScore: 89, assetsAnalyzed: 3 },
          { month: "Jan", avgScore: 89.5, assetsAnalyzed: 3 },
        ];
      } else if (type === "print") {
        return [
          { month: "Sep", avgScore: 90, assetsAnalyzed: 1 },
          { month: "Oct", avgScore: 91, assetsAnalyzed: 2 },
          { month: "Nov", avgScore: 92, assetsAnalyzed: 2 },
          { month: "Dec", avgScore: 92.5, assetsAnalyzed: 3 },
          { month: "Jan", avgScore: 93.1, assetsAnalyzed: 3 },
        ];
      } else {
        // webpage
        return [
          { month: "Sep", avgScore: 87, assetsAnalyzed: 1 },
          { month: "Oct", avgScore: 89, assetsAnalyzed: 2 },
          { month: "Nov", avgScore: 90, assetsAnalyzed: 2 },
          { month: "Dec", avgScore: 90.5, assetsAnalyzed: 3 },
          { month: "Jan", avgScore: 91.0, assetsAnalyzed: 3 },
        ];
      }
    };

    return {
      totalAssets,
      avgCompatibilityScore: avgOptimization,
      improvementTrends: getImprovementTrends(),
      commonIssues: selectedAnalytics.commonIssues,
      contentGapTrends: selectedAnalytics.contentGapTrends,
    };
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Check if running locally
        const isLocalhost =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1" ||
          window.location.hostname === "";

        if (isLocalhost) {
          setIsLocalDemo(true);
          const demoData = generateDemoAnalytics(analyticsType);
          setAnalyticsData(demoData);
        } else {
          const data = await getAnalytics();
          setAnalyticsData(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        // Fallback to demo data if API fails
        setIsLocalDemo(true);
        const demoData = generateDemoAnalytics(analyticsType);
        setAnalyticsData(demoData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [analyticsType]);

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
      {/* Demo Content Notice */}
      {isLocalDemo && (
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Demo Analytics Active
              </h3>
              <p className="text-blue-200 text-sm">
                Analytics for{" "}
                {analyticsType === "social"
                  ? "3 social media"
                  : analyticsType === "print"
                  ? "3 print"
                  : "3 web page"}{" "}
                pharmaceutical assets including
                {analyticsType === "social"
                  ? " Loramin allergy social posts, ERASTAPEX TRIO social campaigns, and LDL cholesterol awareness content."
                  : analyticsType === "print"
                  ? " Loramin allergy print materials, ERASTAPEX TRIO print advertisements, and LDL cholesterol management brochures."
                  : " Loramin allergy landing pages, ERASTAPEX TRIO web portals, and LDL cholesterol information websites."}{" "}
                Real analytics would show data from your actual content
                analysis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Type Explanation */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white mb-1">
              {analyticsType === "webpage"
                ? "Web Page Analytics"
                : analyticsType === "social"
                ? "Social Media Analytics"
                : "Print Analytics"}
            </h3>
            <p className="text-gray-300 text-sm">
              {analyticsType === "webpage"
                ? "Analysis focused on pharmaceutical websites, patient portals, and healthcare provider landing pages. Includes 3 assets with metrics like patient resource availability and safety information completeness."
                : analyticsType === "social"
                ? "Analysis focused on pharmaceutical social media content including 3 assets like Loramin allergy posts, ERASTAPEX TRIO campaigns, and LDL cholesterol awareness content. Includes regulatory compliance, character constraints, and mobile optimization."
                : "Analysis focused on pharmaceutical print advertisements including 3 assets featuring Loramin allergy materials, ERASTAPEX TRIO print ads, and LDL cholesterol management brochures. Includes OCR text quality, regulatory compliance visibility, and visual hierarchy."}
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-2">
            {analyticsType === "social"
              ? "Social media pharmaceutical content insights and AI optimization trends"
              : analyticsType === "print"
              ? "Print pharmaceutical advertisement insights and AI optimization trends"
              : "Web page pharmaceutical content insights and AI optimization trends"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={analyticsType}
            onChange={(e) =>
              setAnalyticsType(e.target.value as "social" | "print" | "webpage")
            }
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="social">Social Media</option>
            <option value="print">Print</option>
            <option value="webpage">Web Page</option>
          </select>
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
              <p className="text-sm font-medium text-gray-400">
                {analyticsType === "social"
                  ? "Social Media"
                  : analyticsType === "print"
                  ? "Print"
                  : "Web Page"}{" "}
                Assets
              </p>
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
            Most Common Issues -{" "}
            {analyticsType === "webpage"
              ? "Web Pages"
              : analyticsType === "social"
              ? "Social Media"
              : "Print"}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={sortMetrics(analyticsData.commonIssues, sortBy)}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 80,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="type"
                angle={-45}
                textAnchor="end"
                height={80}
                stroke="#9CA3AF"
                fontSize={11}
                interval={0}
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
