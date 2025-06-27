import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Users,
  AlertTriangle,
  Target,
  FileText,
  Calendar,
  TrendingUp,
  Shield,
  Download,
} from "lucide-react";

interface ContentPlanData {
  gapTitle: string;
  priority: number;
  failedPrompts: number;
  timeToFix: number;
  audience: string;
  urgency: string;
  description: string;
  complianceRisk: boolean;
}

const ContentPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const planData = location.state as ContentPlanData;

  if (!planData) {
    navigate("/content-gaps");
    return null;
  }

  const actionItems = [
    {
      phase: "Planning & Research",
      duration: "Week 1",
      tasks: [
        "Assign content team lead and subject matter experts",
        "Analyze failed prompt patterns in detail",
        "Research competitive content and best practices",
        "Define content scope and requirements",
      ],
      status: "pending",
    },
    {
      phase: "Content Development",
      duration: `Week 2-${Math.ceil(planData.timeToFix * 0.7)}`,
      tasks: [
        "Draft initial content addressing key failure points",
        "Create supporting materials and examples",
        "Develop FAQ and edge case scenarios",
        "Incorporate compliance and regulatory requirements",
      ],
      status: "pending",
    },
    {
      phase: "Review & Approval",
      duration: `Week ${Math.ceil(planData.timeToFix * 0.7)}-${
        planData.timeToFix - 1
      }`,
      tasks: [
        "Internal content review and fact-checking",
        "Medical/legal review (if required)",
        "Stakeholder approval and sign-off",
        "Final content optimization",
      ],
      status: "pending",
    },
    {
      phase: "Deployment & Monitoring",
      duration: `Week ${planData.timeToFix}`,
      tasks: [
        "Deploy content to AI knowledge base",
        "Test AI responses and accuracy",
        "Monitor prompt success rates",
        "Gather feedback and iterate",
      ],
      status: "pending",
    },
  ];

  const exportPlan = () => {
    const planContent = `
SEARCH-READY AI CONTENT PLAN
========================

Gap: ${planData.gapTitle}
Priority: #${planData.priority}
Urgency: ${planData.urgency}

BUSINESS IMPACT:
- Failed prompts/month: ${planData.failedPrompts.toLocaleString()}
- Target audience: ${planData.audience}
- Estimated time to fix: ${planData.timeToFix} weeks

DESCRIPTION:
${planData.description}

COMPLIANCE NOTES:
${
  planData.complianceRisk
    ? "⚠️ HIGH COMPLIANCE RISK - Regulatory review required"
    : "✅ Standard content review process"
}

ACTION PLAN:
${actionItems
  .map(
    (item) => `
${item.phase} (${item.duration}):
${item.tasks.map((task) => `  • ${task}`).join("\n")}
`
  )
  .join("\n")}

Generated: ${new Date().toLocaleDateString()}
    `.trim();

    const blob = new Blob([planContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-plan-${planData.gapTitle
      .toLowerCase()
      .replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/content-gaps")}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Gaps</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Content Action Plan
            </h1>
            <p className="text-gray-400 mt-1">
              Detailed implementation plan for addressing content gap
            </p>
          </div>
        </div>
        <button
          onClick={exportPlan}
          className="btn-primary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Plan</span>
        </button>
      </div>

      {/* Gap Overview */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl font-bold text-blue-400">
                #{planData.priority}
              </span>
              <h2 className="text-xl font-bold text-white">
                {planData.gapTitle}
              </h2>
              <span
                className={`px-3 py-1 text-sm font-medium rounded border ${
                  planData.urgency === "Critical"
                    ? "bg-red-900/30 border-red-500/50 text-red-300"
                    : planData.urgency === "High"
                    ? "bg-orange-900/30 border-orange-500/50 text-orange-300"
                    : "bg-yellow-900/30 border-yellow-500/50 text-yellow-300"
                }`}
              >
                {planData.urgency} Priority
              </span>
            </div>
            <p className="text-gray-300">{planData.description}</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Failed Prompts
                </p>
                <p className="text-2xl font-bold text-white">
                  {planData.failedPrompts.toLocaleString()}
                </p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">per month</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Urgency Level
                </p>
                <p className="text-2xl font-bold text-white">
                  {planData.urgency}
                </p>
              </div>
              <AlertTriangle className="h-6 w-6 text-orange-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">priority level</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Time to Fix</p>
                <p className="text-2xl font-bold text-white">
                  {planData.timeToFix}
                </p>
              </div>
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">weeks estimated</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Target Audience
                </p>
                <p className="text-lg font-bold text-white">
                  {planData.audience.split(" ")[0]}
                </p>
              </div>
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">{planData.audience}</p>
          </div>
        </div>

        {/* Compliance Alert */}
        {planData.complianceRisk && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-red-400" />
              <div>
                <h4 className="font-semibold text-red-300">
                  High Compliance Risk
                </h4>
                <p className="text-sm text-red-200">
                  This content gap requires regulatory review and approval.
                  Additional time may be needed for compliance validation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Plan Timeline */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-400" />
          <span>Implementation Timeline</span>
        </h3>

        <div className="space-y-6">
          {actionItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    item.status === "completed"
                      ? "bg-green-600 border-green-500"
                      : "bg-gray-700 border-gray-600"
                  }`}
                >
                  {item.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {index + 1}
                    </span>
                  )}
                </div>
                {index < actionItems.length - 1 && (
                  <div className="w-0.5 h-16 bg-gray-600 mt-2"></div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{item.phase}</h4>
                  <span className="text-sm text-blue-400 font-medium">
                    {item.duration}
                  </span>
                </div>
                <div className="space-y-2">
                  {item.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-300">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Target className="h-5 w-5 text-green-400" />
          <span>Success Metrics</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="font-medium text-green-300">
                Prompt Success Rate
              </span>
            </div>
            <p className="text-2xl font-bold text-white">85%+</p>
            <p className="text-xs text-gray-400">Target improvement</p>
          </div>

          <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="font-medium text-blue-300">
                Time to Complete
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {planData.timeToFix} weeks
            </p>
            <p className="text-xs text-gray-400">Estimated timeline</p>
          </div>

          <div className="p-4 bg-purple-900/20 border border-purple-700/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-purple-400" />
              <span className="font-medium text-purple-300">
                User Satisfaction
              </span>
            </div>
            <p className="text-2xl font-bold text-white">90%+</p>
            <p className="text-xs text-gray-400">Target rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPlan;
