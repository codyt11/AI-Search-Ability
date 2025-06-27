import { useState } from "react";
import {
  Play,
  Search,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Edit3,
  Copy,
  RotateCcw,
  Zap,
  FileText,
  Brain,
  Gauge,
  Eye,
  ChevronDown,
  ChevronUp,
  Database,
  HelpCircle,
} from "lucide-react";
import { getIndustryById } from "../utils/industryData";
import IndustrySelector from "../components/IndustrySelector";
import LLMConfiguration from "../components/LLMConfiguration";

interface ContentChunk {
  id: string;
  title: string;
  content: string;
  source: string;
  type: "product_info" | "training" | "compliance" | "faq" | "clinical";
  lastUpdated: string;
}

interface SimulationResult {
  prompt: string;
  topMatch: ContentChunk;
  similarityScore: number;
  confidenceLevel: "high" | "medium" | "low";
  response: string;
  alternativeMatches: ContentChunk[];
  suggestions: string[];
}

const PromptSimulator = () => {
  const [prompt, setPrompt] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [history, setHistory] = useState<SimulationResult[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState("life-sciences");
  const [showContentLibrary, setShowContentLibrary] = useState(false);
  const [expandedChunks, setExpandedChunks] = useState<Set<string>>(new Set());
  const [showAskAnythingTooltip, setShowAskAnythingTooltip] = useState(false);

  // Get industry-specific content chunks
  const industryData = getIndustryById(selectedIndustry);
  const originalMockContentChunks = industryData?.mockContentChunks || [];
  const mockContentChunks: ContentChunk[] = originalMockContentChunks.map(
    (chunk) => ({
      id: chunk.id,
      title: chunk.title,
      content: chunk.content,
      source: chunk.source,
      type: chunk.category as
        | "product_info"
        | "training"
        | "compliance"
        | "faq"
        | "clinical",
      lastUpdated: chunk.lastUpdated,
    })
  ) || [
    {
      id: "chunk-1",
      title: "FDA Approval Status",
      content:
        "Skyrizi (risankizumab-rzaa) is FDA-approved for the treatment of moderate-to-severe plaque psoriasis in adults who are candidates for systemic therapy or phototherapy. It received initial approval in April 2019.",
      source: "Product Labeling v2.1",
      type: "product_info",
      lastUpdated: "2024-01-15",
    },
    {
      id: "chunk-2",
      title: "Sales Training Basics",
      content:
        "New sales representatives should complete the foundational training program which includes: product knowledge modules, competitive landscape overview, compliance requirements, and customer interaction guidelines. The program takes 2-3 weeks to complete.",
      source: "Sales Training Manual v4.2",
      type: "training",
      lastUpdated: "2024-01-10",
    },
    {
      id: "chunk-3",
      title: "Dosing and Administration",
      content:
        "The recommended dose is 150 mg administered by subcutaneous injection at weeks 0 and 4, and every 12 weeks thereafter. Pre-filled syringes and pen injectors are available.",
      source: "Prescribing Information",
      type: "product_info",
      lastUpdated: "2024-01-12",
    },
    {
      id: "chunk-4",
      title: "Adverse Event Reporting",
      content:
        "All adverse events must be reported within 24 hours to the safety department. Use form AE-2024 and include patient details, event description, concomitant medications, and outcome.",
      source: "Safety Procedures Guide",
      type: "compliance",
      lastUpdated: "2024-01-08",
    },
    {
      id: "chunk-5",
      title: "Insurance Coverage",
      content:
        "Most major insurance plans cover Skyrizi with prior authorization. The manufacturer offers patient assistance programs for eligible patients. Average copay with insurance is $10-50.",
      source: "Access & Reimbursement Guide",
      type: "faq",
      lastUpdated: "2024-01-14",
    },
  ];

  const calculateSimilarity = (prompt: string, chunk: ContentChunk): number => {
    // Simple similarity calculation (in real app, this would use embeddings/semantic search)
    const promptLower = prompt.toLowerCase();
    const contentLower = (chunk.title + " " + chunk.content).toLowerCase();

    const promptWords = promptLower.split(/\s+/);
    const matches = promptWords.filter((word) =>
      contentLower.includes(word)
    ).length;

    return Math.min((matches / promptWords.length) * 100, 95);
  };

  const getConfidenceLevel = (score: number): "high" | "medium" | "low" => {
    if (score >= 70) return "high";
    if (score >= 40) return "medium";
    return "low";
  };

  const generateResponse = (
    chunk: ContentChunk,
    confidence: string
  ): string => {
    if (confidence === "high") {
      return chunk.content;
    } else if (confidence === "medium") {
      return `Based on available information: ${chunk.content.substring(
        0,
        100
      )}... (Note: This match has medium confidence - consider reviewing content for better coverage)`;
    } else {
      return `I found some related information, but it may not fully answer your question: ${chunk.content.substring(
        0,
        80
      )}... (Note: Low confidence match - this topic may need additional content)`;
    }
  };

  const simulatePrompt = async () => {
    if (!prompt.trim()) return;

    setIsSimulating(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Calculate similarities and find best match
    const scoredChunks = mockContentChunks
      .map((chunk) => ({
        chunk,
        score: calculateSimilarity(prompt, chunk),
      }))
      .sort((a, b) => b.score - a.score);

    const topMatch = scoredChunks[0];
    const confidence = getConfidenceLevel(topMatch.score);

    const simulationResult: SimulationResult = {
      prompt,
      topMatch: topMatch.chunk,
      similarityScore: topMatch.score,
      confidenceLevel: confidence,
      response: generateResponse(topMatch.chunk, confidence),
      alternativeMatches: scoredChunks.slice(1, 4).map((s) => s.chunk),
      suggestions: [
        confidence === "low"
          ? "Consider adding more specific content about this topic"
          : "Content coverage looks good",
        topMatch.score < 80
          ? "Adding synonyms or alternative phrasings could improve matching"
          : "Strong keyword alignment",
        "Consider user feedback to refine this content further",
      ],
    };

    setResult(simulationResult);
    setHistory((prev) => [simulationResult, ...prev.slice(0, 4)]);
    setIsSimulating(false);
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-400 bg-green-900/30";
      case "medium":
        return "text-yellow-400 bg-yellow-900/30";
      case "low":
        return "text-red-400 bg-red-900/30";
      default:
        return "text-gray-400 bg-gray-900/30";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const examplePrompts = industryData?.commonPrompts || [
    "Is this product FDA approved?",
    "How do I train new sales reps?",
    "What's the recommended dosage?",
    "How do I report side effects?",
    "Does insurance cover this medication?",
  ];

  const toggleChunkExpansion = (chunkId: string) => {
    setExpandedChunks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chunkId)) {
        newSet.delete(chunkId);
      } else {
        newSet.add(chunkId);
      }
      return newSet;
    });
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "product_info":
        return "bg-blue-100 text-blue-800";
      case "training":
        return "bg-green-100 text-green-800";
      case "compliance":
        return "bg-red-100 text-red-800";
      case "faq":
        return "bg-purple-100 text-purple-800";
      case "clinical":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "product_info":
        return "📋";
      case "training":
        return "🎓";
      case "compliance":
        return "⚖️";
      case "faq":
        return "❓";
      case "clinical":
        return "🩺";
      default:
        return "📄";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Prompt Simulator</h1>
        <p className="text-gray-400">
          Test your content with mock simulations and real LLMs. See how your
          content performs against user prompts and how it competes with other
          companies in the AI landscape.
        </p>
      </div>

      {/* Industry Selector */}
      <IndustrySelector
        selectedIndustry={selectedIndustry}
        onIndustryChange={setSelectedIndustry}
      />

      {/* Content Library Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Database className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">
              Available Content Library
            </h2>
            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-sm rounded-full">
              {mockContentChunks.length} items
            </span>
          </div>
          <button
            onClick={() => setShowContentLibrary(!showContentLibrary)}
            className="btn-secondary flex items-center space-x-2"
          >
            {showContentLibrary ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Hide Library</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>Show Library</span>
              </>
            )}
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          These are the content pieces your prompts will be compared against.
          Each has different categories and confidence levels.
        </p>

        {showContentLibrary && (
          <div className="space-y-3">
            {mockContentChunks.map((chunk) => (
              <div
                key={chunk.id}
                className="border border-gray-700 rounded-lg bg-gray-800/30"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg">
                          {getContentTypeIcon(chunk.type)}
                        </span>
                        <h3 className="font-medium text-white">
                          {chunk.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getContentTypeColor(
                            chunk.type
                          )}`}
                        >
                          {chunk.type.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span>Source: {chunk.source}</span>
                        <span>•</span>
                        <span>Updated: {chunk.lastUpdated}</span>
                        <span>•</span>
                        <span>
                          Confidence:{" "}
                          {(originalMockContentChunks.find(
                            (c) => c.id === chunk.id
                          )?.confidence || 0.9) * 100}
                          %
                        </span>
                      </div>

                      <div className="text-sm text-gray-300">
                        {expandedChunks.has(chunk.id) ? (
                          <div className="bg-gray-900/50 p-3 rounded border">
                            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                              {chunk.content}
                            </pre>
                          </div>
                        ) : (
                          <p className="line-clamp-2">
                            {chunk.content.substring(0, 150)}
                            {chunk.content.length > 150 && "..."}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleChunkExpansion(chunk.id)}
                      className="ml-4 flex items-center space-x-1 px-3 py-1 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded"
                    >
                      <Eye className="h-3 w-3" />
                      <span>
                        {expandedChunks.has(chunk.id) ? "Collapse" : "Expand"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prompt Input Section */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Mock Simulation</h2>
          <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-sm rounded-full">
            Preview Mode
          </span>
          <div className="relative">
            <button
              onMouseEnter={() => setShowAskAnythingTooltip(true)}
              onMouseLeave={() => setShowAskAnythingTooltip(false)}
              className="text-gray-400 hover:text-gray-300 focus:outline-none"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            {showAskAnythingTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                <div className="font-semibold mb-1">
                  Mock Simulation - Preview Mode
                </div>
                <div className="space-y-1">
                  <div>
                    • Quick preview of how your content matches user questions
                  </div>
                  <div>
                    • See similarity scores and confidence levels instantly
                  </div>
                  <div>• Test different prompts without using API credits</div>
                  <div>
                    • Identify potential content gaps before real LLM testing
                  </div>
                  <div>
                    • Use this to refine prompts before testing with real LLMs
                    below
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your question here... (e.g., 'Is this product FDA approved?')"
              className="w-full h-24 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isSimulating}
            />
            <Search className="absolute top-3 right-3 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={simulatePrompt}
                disabled={!prompt.trim() || isSimulating}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSimulating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Simulating...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Simulate</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setPrompt("");
                  setResult(null);
                }}
                className="btn-secondary flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>

            <span className="text-sm text-gray-400">
              {prompt.length}/500 characters
            </span>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Try these examples:
          </h3>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">Simulation Results</h2>
          </div>

          {/* Top Match */}
          <div className="space-y-6">
            <div className="border border-gray-700 rounded-lg p-5 bg-gray-800/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Top Match: {result.topMatch.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-400">
                      Source: {result.topMatch.source}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">
                      Updated: {result.topMatch.lastUpdated}
                    </span>
                  </div>
                </div>
                <button className="btn-secondary btn-sm flex items-center space-x-2">
                  <Edit3 className="h-4 w-4" />
                  <span>Improve</span>
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Gauge className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Similarity:</span>
                  <span
                    className={`font-semibold ${getScoreColor(
                      result.similarityScore
                    )}`}
                  >
                    {result.similarityScore.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-gray-400">Confidence:</span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getConfidenceColor(
                      result.confidenceLevel
                    )}`}
                  >
                    {result.confidenceLevel.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-400">Type:</span>
                  <span className="text-sm text-white">
                    {result.topMatch.type.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* AI Response */}
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  AI Response:
                </h4>
                <p className="text-gray-200 leading-relaxed">
                  {result.response}
                </p>
                <button className="mt-3 text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1">
                  <Copy className="h-3 w-3" />
                  <span>Copy Response</span>
                </button>
              </div>
            </div>

            {/* Alternative Matches */}
            {result.alternativeMatches.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Alternative Matches
                </h3>
                <div className="space-y-3">
                  {result.alternativeMatches.map((chunk, index) => {
                    const score = calculateSimilarity(result.prompt, chunk);
                    return (
                      <div
                        key={chunk.id}
                        className="border border-gray-700 rounded-lg p-4 bg-gray-800/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-white">
                              {chunk.title}
                            </h4>
                            <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                              {chunk.content.substring(0, 120)}...
                            </p>
                          </div>
                          <div className="ml-4 text-right">
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                score
                              )}`}
                            >
                              {score.toFixed(1)}%
                            </span>
                            <p className="text-xs text-gray-400">
                              {chunk.source}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Improvement Suggestions */}
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold text-white">
                  Improvement Suggestions
                </h3>
              </div>
              <div className="space-y-2">
                {result.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-blue-200">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Recent Simulations
          </h2>
          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-white font-medium">"{item.prompt}"</p>
                  <p className="text-sm text-gray-400">
                    Matched: {item.topMatch.title}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-sm font-medium ${getScoreColor(
                      item.similarityScore
                    )}`}
                  >
                    {item.similarityScore.toFixed(1)}%
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded ${getConfidenceColor(
                      item.confidenceLevel
                    )}`}
                  >
                    {item.confidenceLevel}
                  </span>
                  <button
                    onClick={() => setResult(item)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflow Connector */}
      {result && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-3 text-gray-400">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-gray-600 flex-1"></div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">Ready for real LLM testing?</span>
            </div>
            <div className="h-px bg-gradient-to-r from-gray-600 via-gray-600 to-transparent flex-1"></div>
          </div>
        </div>
      )}

      {/* LLM Integration Section */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-6 w-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Test with Real LLMs</h2>
          <span className="px-2 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full">
            Live Testing
          </span>
        </div>

        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700/50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Why Test with Real LLMs?
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            The mock simulation above shows how your content matches prompts,
            but real LLMs (GPT-4, Claude, Gemini, Llama) will show you exactly
            how your content performs in the wild and how it competes against
            other companies' content.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">
                See actual LLM responses to your prompts
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">
                Measure your content's competitive visibility
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">
                Identify gaps where competitors appear instead
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">
                Get real performance metrics and costs
              </span>
            </div>
          </div>
        </div>

        <LLMConfiguration selectedIndustry={selectedIndustry} />
      </div>
    </div>
  );
};

export default PromptSimulator;
