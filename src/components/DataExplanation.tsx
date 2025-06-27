import React, { useState } from "react";
import {
  Info,
  X,
  Database,
  AlertCircle,
  CheckCircle,
  Target,
  Clock,
} from "lucide-react";

interface DataExplanationProps {
  metric?: "failed-prompts" | "success-rate" | "critical-gaps" | "fix-time";
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
