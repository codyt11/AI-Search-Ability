import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  AlertTriangle,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
  XCircle,
  RefreshCw,
  Brain,
  Shield,
} from "lucide-react";
import ContentGapInsights from "../components/ContentGapInsights";
import ActionableInsights from "../components/ActionableInsights";
import DataExport from "../components/DataExport";
import IndustrySelector from "../components/IndustrySelector";

interface ContentGap {
  id: string;
  gapType: string;
  title: string;
  description: string;
  promptVolume: number;
  failureRate: number;
  therapeuticArea: string;
  urgencyScore: number;
  businessImpact: "High" | "Medium" | "Low";
  contentType: string;
  estimatedEffort: string;
  complianceRisk: "High" | "Medium" | "Low";
  trend: "increasing" | "stable" | "decreasing";
  relatedPrompts: string[];
  recommendedActions: string[];

  regulatoryImplications: string[];
}

const ContentGapAnalysis = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");
  const [sortBy, setSortBy] = useState("urgencyScore");
  const [selectedIndustry, setSelectedIndustry] = useState("life-sciences");

  // Mock dynamic content gaps based on prompt analysis
  const contentGaps: ContentGap[] = [
    {
      id: "gap-001",
      gapType: "Safety Information",
      title: "Drug Interaction Warnings for Combination Therapies",
      description:
        "High-volume prompts seeking specific drug interaction data that current content doesn't adequately address",
      promptVolume: 8420,
      failureRate: 67,
      therapeuticArea: "Cardiology",
      urgencyScore: 94,
      businessImpact: "High",
      contentType: "Safety Documentation",
      estimatedEffort: "4-6 weeks",
      complianceRisk: "High",
      trend: "increasing",
      relatedPrompts: [
        "Can [drug A] be taken with [drug B]?",
        "What are contraindications for [combination]?",
        "Monitoring parameters for dual therapy",
      ],
      recommendedActions: [
        "Create comprehensive interaction matrix",
        "Develop patient counseling materials",
        "Update prescribing information",
      ],

      regulatoryImplications: [
        "FDA labeling update required",
        "MLR review mandatory",
      ],
    },
    {
      id: "gap-002",
      gapType: "Dosing Guidelines",
      title: "Pediatric Dosing Protocols",
      description:
        "Significant gap in age-specific dosing information for patients under 18",
      promptVolume: 6230,
      failureRate: 78,
      therapeuticArea: "Oncology",
      urgencyScore: 89,
      businessImpact: "High",
      contentType: "Clinical Guidelines",
      estimatedEffort: "6-8 weeks",
      complianceRisk: "High",
      trend: "increasing",
      relatedPrompts: [
        "Pediatric dosing for [medication]",
        "Safety in children under 12",
        "Weight-based dosing calculations",
      ],
      recommendedActions: [
        "Collaborate with pediatric specialists",
        "Develop dosing calculators",
        "Create age-appropriate materials",
      ],

      regulatoryImplications: [
        "Pediatric study data review",
        "Label expansion needed",
      ],
    },
    {
      id: "gap-003",
      gapType: "Patient Education",
      title: "Lifestyle Modification Guidance",
      description:
        "Patients and HCPs seeking comprehensive lifestyle recommendations alongside medication therapy",
      promptVolume: 5680,
      failureRate: 45,
      therapeuticArea: "Diabetes",
      urgencyScore: 76,
      businessImpact: "Medium",
      contentType: "Educational Materials",
      estimatedEffort: "3-4 weeks",
      complianceRisk: "Low",
      trend: "stable",
      relatedPrompts: [
        "Diet recommendations with [medication]",
        "Exercise guidelines for [condition]",
        "Lifestyle changes to improve outcomes",
      ],
      recommendedActions: [
        "Partner with nutrition experts",
        "Create multimedia content",
        "Develop mobile-friendly resources",
      ],

      regulatoryImplications: [
        "Medical review required",
        "Claims substantiation",
      ],
    },
    {
      id: "gap-004",
      gapType: "Comparative Effectiveness",
      title: "Head-to-Head Study Results",
      description:
        "HCPs requesting direct comparisons with competitor therapies that aren't readily available",
      promptVolume: 4920,
      failureRate: 82,
      therapeuticArea: "Mental Health",
      urgencyScore: 85,
      businessImpact: "High",
      contentType: "Clinical Evidence",
      estimatedEffort: "8-12 weeks",
      complianceRisk: "Medium",
      trend: "increasing",
      relatedPrompts: [
        "How does [our drug] compare to [competitor]?",
        "Efficacy comparison studies",
        "Comparative effectiveness analysis",
      ],
      recommendedActions: [
        "Conduct systematic literature review",
        "Develop evidence summaries",
        "Create comparison matrices",
      ],

      regulatoryImplications: [
        "Fair balance required",
        "Substantiation needed",
      ],
    },
    {
      id: "gap-005",
      gapType: "Adverse Events",
      title: "Long-term Safety Monitoring",
      description:
        "Insufficient content addressing long-term safety profiles and monitoring protocols",
      promptVolume: 3840,
      failureRate: 71,
      therapeuticArea: "Rare Diseases",
      urgencyScore: 82,
      businessImpact: "High",
      contentType: "Safety Monitoring",
      estimatedEffort: "5-7 weeks",
      complianceRisk: "High",
      trend: "stable",
      relatedPrompts: [
        "Long-term side effects of [drug]",
        "Monitoring schedule for [therapy]",
        "When to discontinue treatment",
      ],
      recommendedActions: [
        "Compile post-marketing data",
        "Create monitoring guidelines",
        "Develop physician resources",
      ],

      regulatoryImplications: ["REMS consideration", "Periodic safety updates"],
    },
  ];

  const therapeuticAreaImpact = [
    { area: "Cardiology", gaps: 23, volume: 34500, risk: "High" },
    { area: "Oncology", gaps: 19, volume: 28900, risk: "High" },
    { area: "Diabetes", gaps: 15, volume: 22100, risk: "Medium" },
    { area: "Mental Health", gaps: 12, volume: 18600, risk: "Medium" },
    { area: "Rare Diseases", gaps: 8, volume: 12400, risk: "High" },
  ];

  const gapsByContentType = [
    { type: "Safety Information", count: 18, priority: "Critical" },
    { type: "Dosing Guidelines", count: 15, priority: "High" },
    { type: "Patient Education", count: 12, priority: "Medium" },
    { type: "Clinical Evidence", count: 10, priority: "High" },
    { type: "Regulatory Info", count: 8, priority: "Critical" },
  ];

  const filteredGaps = contentGaps.filter((gap) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "critical") return gap.urgencyScore >= 85;
    if (selectedFilter === "high-volume") return gap.promptVolume >= 5000;
    if (selectedFilter === "compliance-risk")
      return gap.complianceRisk === "High";
    return gap.therapeuticArea.toLowerCase() === selectedFilter.toLowerCase();
  });

  const sortedGaps = [...filteredGaps].sort((a, b) => {
    if (sortBy === "urgencyScore") return b.urgencyScore - a.urgencyScore;
    if (sortBy === "promptVolume") return b.promptVolume - a.promptVolume;
    if (sortBy === "failureRate") return b.failureRate - a.failureRate;
    return 0;
  });

  const getUrgencyColor = (score: number) => {
    if (score >= 90) return "text-red-400 bg-red-900/30 border-red-700/50";
    if (score >= 75)
      return "text-yellow-400 bg-yellow-900/30 border-yellow-700/50";
    return "text-green-400 bg-green-900/30 border-green-700/50";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "increasing")
      return <TrendingUp className="h-4 w-4 text-red-400" />;
    if (trend === "decreasing")
      return <TrendingUp className="h-4 w-4 text-green-400 rotate-180" />;
    return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Content Gap Analysis
          </h1>
          <p className="text-gray-400 mt-2">
            AI-powered insights from prompt patterns to identify critical
            content needs
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Total Content Gaps
              </p>
              <p className="text-2xl font-bold text-white">57</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-red-600/20 to-orange-600/20">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium status-negative">+12%</span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Critical Gaps</p>
              <p className="text-2xl font-bold text-white">19</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium status-positive">-3</span>
            <span className="text-sm text-gray-500 ml-1">from last week</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Avg Failure Rate
              </p>
              <p className="text-2xl font-bold text-white">68%</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-600/20 to-orange-600/20">
              <XCircle className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium status-negative">+5%</span>
            <span className="text-sm text-gray-500 ml-1">needs attention</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Failed Prompts/Month
              </p>
              <p className="text-2xl font-bold text-white">19.8K</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-600/20 to-blue-600/20">
              <Target className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium status-positive">
              Improvement opportunity
            </span>
          </div>
        </div>
      </div>

      {/* Industry Selector */}
      <IndustrySelector
        selectedIndustry={selectedIndustry}
        onIndustryChange={setSelectedIndustry}
      />

      {/* Content Gap Insights - Replaces confusing line chart */}
      <ContentGapInsights selectedIndustry={selectedIndustry} />

      {/* Actionable Insights */}
      <ActionableInsights
        fileName="uploaded document"
        selectedIndustry={selectedIndustry}
      />

      {/* Data Export */}
      <DataExport selectedIndustry={selectedIndustry} />

      {/* Filter and Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Gaps</option>
            <option value="critical">Critical Only</option>
            <option value="high-volume">High Volume</option>
            <option value="compliance-risk">Compliance Risk</option>
            <option value="cardiology">Cardiology</option>
            <option value="oncology">Oncology</option>
            <option value="diabetes">Diabetes</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="urgencyScore">Sort by Urgency</option>
            <option value="promptVolume">Sort by Volume</option>
            <option value="failureRate">Sort by Failure Rate</option>
          </select>
        </div>
        <div className="text-sm text-gray-400">
          Showing {sortedGaps.length} of {contentGaps.length} gaps
        </div>
      </div>

      {/* Detailed Gap Analysis */}
      <div className="space-y-6">
        {sortedGaps.map((gap) => (
          <div
            key={gap.id}
            className="card p-6 hover:bg-gray-700/30 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{gap.title}</h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(
                      gap.urgencyScore
                    )}`}
                  >
                    Urgency: {gap.urgencyScore}/100
                  </span>
                  <span className="flex items-center space-x-1">
                    {getTrendIcon(gap.trend)}
                    <span className="text-xs text-gray-400 capitalize">
                      {gap.trend}
                    </span>
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-3">{gap.description}</p>
                <div className="flex items-center space-x-6 text-sm">
                  <span className="text-gray-400">
                    <strong className="text-white">
                      {gap.promptVolume.toLocaleString()}
                    </strong>{" "}
                    prompts affected
                  </span>
                  <span className="text-gray-400">
                    <strong className="text-red-300">{gap.failureRate}%</strong>{" "}
                    failure rate
                  </span>
                  <span className="text-gray-400">
                    <strong className="text-blue-300">
                      {gap.therapeuticArea}
                    </strong>
                  </span>
                  <span className="text-gray-400">
                    <strong className="text-yellow-300">
                      {gap.estimatedEffort}
                    </strong>{" "}
                    to resolve
                  </span>
                </div>
              </div>
            </div>

            {/* Gap Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Related Prompts */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>Related Prompts</span>
                </h4>
                <div className="space-y-2">
                  {gap.relatedPrompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-400 bg-gray-700/30 p-2 rounded"
                    >
                      "{prompt}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>Recommended Actions</span>
                </h4>
                <div className="space-y-2">
                  {gap.recommendedActions.map((action, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <ArrowRight className="h-3 w-3 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-300">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Impact */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Business Impact</span>
                </h4>
                <div className="space-y-2">
                  <div className="text-xs">
                    <span className="text-gray-400">Compliance Risk: </span>
                    <span
                      className={`${
                        gap.complianceRisk === "High"
                          ? "text-red-300"
                          : gap.complianceRisk === "Medium"
                          ? "text-yellow-300"
                          : "text-green-300"
                      }`}
                    >
                      {gap.complianceRisk}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-400">Content Type: </span>
                    <span className="text-blue-300">{gap.contentType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regulatory Implications */}
            {gap.regulatoryImplications.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                <h5 className="text-xs font-medium text-yellow-300 mb-2 flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Regulatory Considerations</span>
                </h5>
                <div className="flex flex-wrap gap-2">
                  {gap.regulatoryImplications.map((implication, index) => (
                    <span
                      key={index}
                      className="text-xs bg-yellow-800/30 text-yellow-200 px-2 py-1 rounded"
                    >
                      {implication}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Therapeutic Area Impact */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-6">
            Impact by Therapeutic Area
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={therapeuticAreaImpact}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="area"
                stroke="#9CA3AF"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={80}
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
              <Bar
                dataKey="gaps"
                fill="#ef4444"
                name="Content Gaps"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gaps by Content Type */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-6">
            Gaps by Content Type
          </h3>
          <div className="space-y-4">
            {gapsByContentType.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30"
              >
                <div>
                  <span className="text-white font-medium">{item.type}</span>
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      item.priority === "Critical"
                        ? "bg-red-900/30 text-red-300"
                        : item.priority === "High"
                        ? "bg-yellow-900/30 text-yellow-300"
                        : "bg-blue-900/30 text-blue-300"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <span className="text-xl font-bold text-white">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGapAnalysis;
