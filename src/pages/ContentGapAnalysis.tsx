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
  HelpCircle,
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
  const [showFailedPromptsTooltip, setShowFailedPromptsTooltip] =
    useState(false);

  // Mock dynamic content gaps based on prompt analysis
  const contentGaps: ContentGap[] = [
    {
      id: "gap-001",
      gapType: "Dosage Information",
      title: "Loramin Dosage Guidelines for Different Age Groups",
      description:
        "High-volume prompts seeking specific dosage information for Loramin (Loratadine) across different age groups that current advertising doesn't adequately address",
      promptVolume: 4250,
      failureRate: 72,
      therapeuticArea: "Allergy/Immunology",
      urgencyScore: 88,
      businessImpact: "High",
      contentType: "Product Information",
      estimatedEffort: "2-3 weeks",
      complianceRisk: "High",
      trend: "increasing",
      relatedPrompts: [
        "What is the correct Loramin dose for children?",
        "How much Loratadine for adults vs children?",
        "Loramin dosage for seasonal allergies",
      ],
      recommendedActions: [
        "Add clear dosage charts to advertisements",
        "Include age-specific dosing guidance",
        "Create patient information leaflets",
      ],
      regulatoryImplications: [
        "FDA dosing label requirements",
        "Pediatric safety information needed",
      ],
    },
    {
      id: "gap-002",
      gapType: "Drug Interactions",
      title: "ERASTAPEX TRIO Combination Therapy Contraindications",
      description:
        "Patients and healthcare providers seeking detailed interaction information for the three-drug combination (Erastapex/Amlodipine/HCT) that isn't readily accessible",
      promptVolume: 3890,
      failureRate: 83,
      therapeuticArea: "Cardiology",
      urgencyScore: 92,
      businessImpact: "High",
      contentType: "Safety Information",
      estimatedEffort: "4-5 weeks",
      complianceRisk: "High",
      trend: "increasing",
      relatedPrompts: [
        "What drugs interact with ERASTAPEX TRIO?",
        "Can I take other blood pressure meds with ERASTAPEX?",
        "ERASTAPEX TRIO contraindications and warnings",
      ],
      recommendedActions: [
        "Develop comprehensive interaction matrix",
        "Create healthcare provider quick reference",
        "Update digital prescribing information",
      ],
      regulatoryImplications: [
        "Complete drug interaction profile required",
        "Black box warning considerations",
      ],
    },
    {
      id: "gap-003",
      gapType: "Clinical Evidence",
      title: "LDL-C Treatment Efficacy Data Beyond Statins",
      description:
        "Healthcare professionals requesting specific clinical trial data and effectiveness comparisons for LDL cholesterol management beyond traditional statin therapy",
      promptVolume: 3420,
      failureRate: 67,
      therapeuticArea: "Cardiovascular",
      urgencyScore: 85,
      businessImpact: "Medium",
      contentType: "Clinical Data",
      estimatedEffort: "6-8 weeks",
      complianceRisk: "Medium",
      trend: "stable",
      relatedPrompts: [
        "Clinical trial results for LDL-C lowering therapies",
        "Effectiveness vs statins alone",
        "Long-term cardiovascular outcomes data",
      ],
      recommendedActions: [
        "Compile clinical evidence summaries",
        "Create comparative effectiveness materials",
        "Develop physician education resources",
      ],
      regulatoryImplications: [
        "FDA-approved indication language",
        "Clinical trial data substantiation",
      ],
    },
    {
      id: "gap-004",
      gapType: "Patient Education",
      title: "Allergy Trigger Identification and Loramin Usage",
      description:
        "Patients seeking guidance on when and how to use Loramin for different allergy triggers (seasonal vs perennial) with lifestyle modifications",
      promptVolume: 2980,
      failureRate: 58,
      therapeuticArea: "Allergy/Immunology",
      urgencyScore: 74,
      businessImpact: "Medium",
      contentType: "Patient Education",
      estimatedEffort: "3-4 weeks",
      complianceRisk: "Low",
      trend: "increasing",
      relatedPrompts: [
        "When should I take Loramin for pollen allergies?",
        "How to identify allergy triggers",
        "Seasonal vs year-round allergy treatment",
      ],
      recommendedActions: [
        "Create seasonal allergy calendars",
        "Develop trigger identification guides",
        "Partner with allergy specialists",
      ],
      regulatoryImplications: [
        "Patient education review required",
        "Medical accuracy verification",
      ],
    },
    {
      id: "gap-005",
      gapType: "Monitoring Guidelines",
      title: "Blood Pressure Monitoring with ERASTAPEX TRIO",
      description:
        "Insufficient content addressing proper blood pressure monitoring protocols and target ranges for patients on triple combination therapy",
      promptVolume: 2650,
      failureRate: 75,
      therapeuticArea: "Cardiology",
      urgencyScore: 81,
      businessImpact: "High",
      contentType: "Clinical Guidelines",
      estimatedEffort: "3-4 weeks",
      complianceRisk: "Medium",
      trend: "stable",
      relatedPrompts: [
        "How often to check BP on ERASTAPEX TRIO?",
        "Target blood pressure goals",
        "Signs of blood pressure too low",
      ],
      recommendedActions: [
        "Create monitoring schedule templates",
        "Develop patient tracking tools",
        "Update clinical guidance materials",
      ],
      regulatoryImplications: [
        "Clinical monitoring recommendations",
        "Safety monitoring protocols",
      ],
    },
    {
      id: "gap-006",
      gapType: "Side Effects",
      title: "Comprehensive Adverse Event Information",
      description:
        "Patients and providers seeking detailed side effect profiles and management strategies for all three pharmaceutical products",
      promptVolume: 2180,
      failureRate: 69,
      therapeuticArea: "Multi-Therapeutic",
      urgencyScore: 79,
      businessImpact: "High",
      contentType: "Safety Information",
      estimatedEffort: "4-5 weeks",
      complianceRisk: "High",
      trend: "decreasing",
      relatedPrompts: [
        "Loramin side effects and warnings",
        "ERASTAPEX TRIO adverse reactions",
        "How to manage medication side effects",
      ],
      recommendedActions: [
        "Develop side effect management guides",
        "Create patient-friendly safety sheets",
        "Update physician prescribing tools",
      ],
      regulatoryImplications: [
        "FDA adverse event reporting",
        "Updated safety labeling",
      ],
    },
  ];

  const therapeuticAreaImpact = [
    { area: "Cardiology", gaps: 12, volume: 6540, risk: "High" },
    { area: "Allergy/Immunology", gaps: 8, volume: 7230, risk: "Medium" },
    { area: "Cardiovascular", gaps: 6, volume: 3420, risk: "Medium" },
    { area: "Multi-Therapeutic", gaps: 4, volume: 2180, risk: "High" },
  ];

  const gapsByContentType = [
    { type: "Safety Information", count: 8, priority: "Critical" },
    { type: "Product Information", count: 7, priority: "High" },
    { type: "Clinical Guidelines", count: 6, priority: "High" },
    { type: "Patient Education", count: 5, priority: "Medium" },
    { type: "Clinical Data", count: 4, priority: "Medium" },
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
              <p className="text-2xl font-bold text-white">6</p>
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
              <p className="text-2xl font-bold text-white">4</p>
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
              <p className="text-2xl font-bold text-white">71%</p>
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
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-sm font-medium text-gray-400">
                  Failed Prompts/Month
                </p>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowFailedPromptsTooltip(true)}
                    onMouseLeave={() => setShowFailedPromptsTooltip(false)}
                    className="text-gray-400 hover:text-gray-300 focus:outline-none"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                  {showFailedPromptsTooltip && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-[9999] border border-gray-700">
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                      <div className="font-semibold mb-1 text-yellow-300">
                        What are Failed Prompts?
                      </div>
                      <div className="space-y-1">
                        <div>
                          • User questions that AI systems cannot answer
                          adequately
                        </div>
                        <div>
                          • Occurs when content gaps prevent accurate responses
                        </div>
                        <div>
                          • Includes incomplete, outdated, or missing
                          information
                        </div>
                        <div>
                          • Results in poor user experience and reduced trust
                        </div>
                        <div className="text-blue-300 mt-2">
                          Reducing failed prompts improves user satisfaction and
                          content effectiveness.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-2xl font-bold text-white">19.4K</p>
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
            <option value="allergy/immunology">Allergy/Immunology</option>
            <option value="cardiology">Cardiology</option>
            <option value="cardiovascular">Cardiovascular</option>
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
