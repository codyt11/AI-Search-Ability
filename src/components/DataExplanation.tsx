import React, { useState } from "react";
import {
  Info,
  X,
  Database,
  AlertCircle,
  CheckCircle,
  Target,
  Clock,
  FileText,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

interface DataExplanationProps {
  metric?:
    | "failed-prompts"
    | "success-rate"
    | "critical-gaps"
    | "fix-time"
    | "relevant-prompts"
    | "content-win-rate"
    | "missed-opportunities"
    | "ai-mentions";
  industryName?: string;
}

const DataExplanation: React.FC<DataExplanationProps> = ({
  metric = "failed-prompts",
  industryName = "industry",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const explanations = {
    "failed-prompts": {
      title: "Failed Prompts Explained",
      icon: AlertCircle,
      color: "red",
      content: (
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-red-300 mb-2">
              What is a "Failed Prompt"?
            </h4>
            <p className="text-red-200 text-sm">
              A failed prompt occurs when an AI system cannot provide a
              relevant, accurate, or complete answer to a user's question due to
              gaps in the underlying content.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Failure Criteria:</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <X className="h-4 w-4 text-red-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    No Relevant Content Found
                  </p>
                  <p className="text-xs text-gray-400">
                    Knowledge base lacks information to answer the query
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <X className="h-4 w-4 text-red-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Incomplete Response
                  </p>
                  <p className="text-xs text-gray-400">
                    Answer provided but missing critical details
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <X className="h-4 w-4 text-red-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Outdated Information
                  </p>
                  <p className="text-xs text-gray-400">
                    Content exists but is no longer current or accurate
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <X className="h-4 w-4 text-red-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Poor Format/Structure
                  </p>
                  <p className="text-xs text-gray-400">
                    Information exists but isn't properly formatted for AI
                    retrieval
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2">
              Data Sources for {industryName}:
            </h4>
            <div className="space-y-2 text-sm text-blue-200">
              <div className="flex items-center space-x-2">
                <Database className="h-3 w-3" />
                <span>Simulated user query logs and AI response analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="h-3 w-3" />
                <span>Industry-specific content gap analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="h-3 w-3" />
                <span>
                  Benchmarking data from similar {industryName.toLowerCase()}{" "}
                  organizations
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-300 mb-2">
              How to Reduce Failed Prompts:
            </h4>
            <ul className="text-sm text-yellow-200 space-y-1">
              <li>• Identify and fill content gaps in your knowledge base</li>
              <li>• Improve content structure and formatting for AI systems</li>
              <li>• Keep information current with regular updates</li>
              <li>• Add detailed examples and step-by-step guides</li>
              <li>• Include FAQs covering edge cases and common questions</li>
            </ul>
          </div>

          <div className="text-xs text-gray-400 italic">
            Note: The data shown in this demo represents typical patterns
            observed in {industryName.toLowerCase()} content analysis. In a real
            implementation, this would connect to your actual AI query logs,
            user feedback systems, and content management platforms.
          </div>
        </div>
      ),
    },
    "success-rate": {
      title: "Success Rate Explained",
      icon: CheckCircle,
      color: "green",
      content: (
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-green-300 mb-2">
              AI Search Success Rate
            </h4>
            <p className="text-green-200 text-sm">
              Percentage of user prompts that receive complete, accurate, and
              helpful responses from your AI system.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Success Criteria:</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Relevant Content Retrieved
                  </p>
                  <p className="text-xs text-gray-400">
                    AI finds appropriate information for the query
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Complete Response
                  </p>
                  <p className="text-xs text-gray-400">
                    Answer includes all necessary details
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    User Satisfaction
                  </p>
                  <p className="text-xs text-gray-400">
                    Response meets user's information needs
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 italic">
            Success rate is calculated as: (Total Prompts - Failed Prompts) /
            Total Prompts × 100
          </div>
        </div>
      ),
    },
    "critical-gaps": {
      title: "Critical Gaps Explained",
      icon: Target,
      color: "red",
      content: (
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-red-300 mb-2">
              What are Critical Gaps?
            </h4>
            <p className="text-red-200 text-sm">
              Content gaps that pose immediate risks to compliance, safety, or
              business operations and require urgent attention.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">
              Classification Criteria:
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-white">High failure rate ({">"}60%)</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-white">
                  Compliance or safety implications
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-white">
                  High query volume ({">"}1000/month)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-white">
                  Business-critical information
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    "fix-time": {
      title: "Fix Time Explained",
      icon: Clock,
      color: "yellow",
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-300 mb-2">
              Average Fix Time
            </h4>
            <p className="text-yellow-200 text-sm">
              Estimated time required to research, create, review, and deploy
              content that addresses identified gaps.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Time Factors:</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div>• Content complexity and research requirements</div>
              <div>• Review and approval processes</div>
              <div>• Compliance and legal validation needs</div>
              <div>• Content creation and formatting time</div>
              <div>• Testing and deployment procedures</div>
            </div>
          </div>
        </div>
      ),
    },
    "relevant-prompts": {
      title: "Relevant Prompts Explained",
      icon: FileText,
      color: "blue",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2">
              What are Relevant Prompts?
            </h4>
            <p className="text-blue-200 text-sm">
              The total number of AI queries or prompts that are related to your
              industry, products, or services that users ask across various AI
              platforms monthly.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Includes:</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <FileText className="h-4 w-4 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Product Questions
                  </p>
                  <p className="text-xs text-gray-400">
                    Queries about your specific products or services
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <FileText className="h-4 w-4 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Industry Topics
                  </p>
                  <p className="text-xs text-gray-400">
                    General questions about your industry or market
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <FileText className="h-4 w-4 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Competitive Comparisons
                  </p>
                  <p className="text-xs text-gray-400">
                    Questions comparing you to competitors
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 italic">
            Higher relevant prompt volumes indicate greater market interest and
            more opportunities for your content to be discovered.
          </div>
        </div>
      ),
    },
    "content-win-rate": {
      title: "Content Win Rate Explained",
      icon: CheckCircle,
      color: "green",
      content: (
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-green-300 mb-2">
              What is Content Win Rate?
            </h4>
            <p className="text-green-200 text-sm">
              The percentage of relevant prompts where your content appears in
              AI responses, competing against other companies in your industry.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">How It Works:</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div>• AI systems are tested with industry-relevant prompts</div>
              <div>
                • Responses are analyzed for mentions of your content vs
                competitors
              </div>
              <div>
                • Your "win rate" = prompts where you appear ÷ total relevant
                prompts
              </div>
              <div>• Higher win rates mean better AI discoverability</div>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-300 mb-2">
              Competitive Context:
            </h4>
            <div className="space-y-1 text-sm text-yellow-200">
              <div>• Industry Average: 15-25%</div>
              <div>• Good Performance: 35-50%</div>
              <div>• Excellent Performance: 60%+</div>
            </div>
          </div>
        </div>
      ),
    },
    "missed-opportunities": {
      title: "Missed Opportunities Explained",
      icon: AlertTriangle,
      color: "orange",
      content: (
        <div className="space-y-4">
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-orange-300 mb-2">
              What are Missed Opportunities?
            </h4>
            <p className="text-orange-200 text-sm">
              The number of relevant prompts where competitors' content appeared
              in AI responses but your content did not, representing lost
              visibility.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Why This Matters:</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Lost Market Share
                  </p>
                  <p className="text-xs text-gray-400">
                    Users discover competitors instead of your brand
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Reduced Visibility
                  </p>
                  <p className="text-xs text-gray-400">
                    Your content is not AI-discoverable enough
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Growth Potential
                  </p>
                  <p className="text-xs text-gray-400">
                    Each missed opportunity is a chance to improve
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 italic">
            Formula: Total Relevant Prompts - Your Content Appearances = Missed
            Opportunities
          </div>
        </div>
      ),
    },
    "ai-mentions": {
      title: "AI Mentions Explained",
      icon: TrendingUp,
      color: "purple",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-purple-300 mb-2">
              What are AI Mentions?
            </h4>
            <p className="text-purple-200 text-sm">
              The number of times your content, products, or company are
              mentioned in AI responses across various platforms per month.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Sources Include:</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div>• Direct product or company name mentions</div>
              <div>• References to your unique features or claims</div>
              <div>• Indirect mentions through content connections</div>
              <div>• Recommendations in AI-generated lists</div>
            </div>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-green-300 mb-2">
              Ranking Context:
            </h4>
            <div className="space-y-1 text-sm text-green-200">
              <div>• #1-5: Market leaders (40+ mentions/month)</div>
              <div>• #6-15: Strong presence (20-39 mentions/month)</div>
              <div>• #16+: Emerging visibility (&lt;20 mentions/month)</div>
            </div>
          </div>
        </div>
      ),
    },
  };

  const explanation = explanations[metric];
  const IconComponent = explanation.icon;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors text-xs"
      >
        <Info className="h-3 w-3" />
        <span>What does this mean?</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-${explanation.color}-900/30 rounded-lg`}>
                <IconComponent
                  className={`h-5 w-5 text-${explanation.color}-400`}
                />
              </div>
              <h3 className="text-lg font-bold text-white">
                {explanation.title}
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {explanation.content}

          <div className="mt-6 pt-4 border-t border-gray-700">
            <button
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExplanation;
