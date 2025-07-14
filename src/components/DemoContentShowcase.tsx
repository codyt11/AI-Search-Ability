import React, { useState, useEffect } from "react";
import {
  Eye,
  BarChart3,
  TrendingUp,
  Target,
  Image,
  FileText,
  Globe,
  MessageSquare,
  Star,
  ArrowRight,
  Play,
  ExternalLink,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Brain,
  Clock,
  Calendar,
  FileQuestion,
} from "lucide-react";
import demoContentService, {
  DemoAdvertisement,
  DemoLandingPage,
} from "../services/demoContent";

interface Props {
  onContentSelect?: (content: DemoAdvertisement | DemoLandingPage) => void;
  selectedCategory?: string;
}

const DemoContentShowcase: React.FC<Props> = ({
  onContentSelect,
  selectedCategory,
}) => {
  const [advertisements, setAdvertisements] = useState<DemoAdvertisement[]>([]);
  const [landingPages, setLandingPages] = useState<DemoLandingPage[]>([]);
  const [contentCategories, setContentCategories] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<"ads" | "pages" | "all">(
    "all"
  );
  const [selectedContent, setSelectedContent] = useState<
    DemoAdvertisement | DemoLandingPage | null
  >(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Load demo content
    setAdvertisements(demoContentService.getAdvertisements());
    setLandingPages(demoContentService.getLandingPages());
    setContentCategories(demoContentService.getContentCategories());
  }, []);

  const handleContentClick = (content: DemoAdvertisement | DemoLandingPage) => {
    setSelectedContent(content);
    setShowDetails(true);
    if (onContentSelect) {
      onContentSelect(content);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "facebook":
        return <Globe className="h-4 w-4 text-blue-600" />;
      case "instagram":
        return <Image className="h-4 w-4 text-pink-500" />;
      default:
        return <Globe className="h-4 w-4 text-gray-400" />;
    }
  };

  const getOptimizationScore = (
    content: DemoAdvertisement | DemoLandingPage
  ): number => {
    if ("ai_optimization" in content) {
      return content.ai_optimization.semantic_relevance;
    } else if ("ai_readiness_analysis" in content) {
      return content.ai_readiness_analysis.ai_query_coverage;
    }
    return 0;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    return "text-red-400";
  };

  const allContent = [...advertisements, ...landingPages];
  const filteredContent =
    selectedTab === "ads"
      ? advertisements
      : selectedTab === "pages"
      ? landingPages
      : allContent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Demo Content Showcase
          </h2>
          <p className="text-gray-400">
            Explore sample advertisements and landing pages with AI optimization analysis
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedTab("all")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            All Content
          </button>
          <button
            onClick={() => setSelectedTab("ads")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === "ads"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Advertisements
          </button>
          <button
            onClick={() => setSelectedTab("pages")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === "pages"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Landing Pages
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredContent.map((content) => (
          <div
            key={content.id}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6 hover:bg-gray-800 transition-all duration-200 cursor-pointer group"
            onClick={() => handleContentClick(content)}
          >
            {/* Content Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  {"platform" in content && getPlatformIcon(content.platform)}
                  <span className="text-xs text-gray-400 uppercase tracking-wide truncate">
                    {"platform" in content ? content.platform : "Landing Page"}
                  </span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                  {content.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1 truncate">{content.industry}</p>
              </div>
              <div className="text-right ml-4">
                <div
                  className={`text-lg font-bold ${getScoreColor(
                    getOptimizationScore(content)
                  )}`}
                >
                  {getOptimizationScore(content)}%
                </div>
                <div className="text-xs text-gray-500">AI Score</div>
              </div>
            </div>

            {/* Content Preview */}
            <div className="text-sm text-gray-400 line-clamp-3">
              {content.description || "No description available"}
            </div>

            {/* Content Stats */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <FileText className="h-3 w-3" />
                <span>{content.wordCount} words</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{content.readTime} min read</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(content.lastUpdated).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Details Modal */}
      {showDetails && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedContent.title}
                </h3>
                <p className="text-gray-400">{selectedContent.industry}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Detailed AI Discoverability Data */}
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-5 w-5 text-blue-400" />
                  <h4 className="font-semibold text-white">
                    What AI Systems Analyze
                  </h4>
                </div>
                <p className="text-blue-200 text-sm">
                  This shows the actual data points that determine AI
                  discoverability. Each metric directly impacts how often your
                  content appears in AI responses.
                </p>
              </div>

              {/* AI Optimization Analysis */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <span>AI Optimization Analysis</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {"ai_optimization" in selectedContent && (
                    <>
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="text-sm text-gray-400">Readability</div>
                        <div className="text-2xl font-bold text-white">
                          {selectedContent.ai_optimization.readability_score}%
                        </div>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="text-sm text-gray-400">
                          Keyword Density
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {selectedContent.ai_optimization.keyword_density}%
                        </div>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="text-sm text-gray-400">
                          Semantic Relevance
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {selectedContent.ai_optimization.semantic_relevance}%
                        </div>
                      </div>
                    </>
                  )}
                  {"ai_readiness_analysis" in selectedContent && (
                    <>
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="text-sm text-gray-400">
                          Structure Score
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {
                            selectedContent.ai_readiness_analysis
                              .structure_score
                          }
                          %
                        </div>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="text-sm text-gray-400">
                          Content Clarity
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {
                            selectedContent.ai_readiness_analysis
                              .content_clarity
                          }
                          %
                        </div>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="text-sm text-gray-400">
                          AI Query Coverage
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {
                            selectedContent.ai_readiness_analysis
                              .ai_query_coverage
                          }
                          %
                        </div>
                      </div>
                    </>
                  )}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Overall Score</div>
                    <div
                      className={`text-2xl font-bold ${getScoreColor(
                        getOptimizationScore(selectedContent)
                      )}`}
                    >
                      {getOptimizationScore(selectedContent)}%
                    </div>
                  </div>
                </div>

                {/* Strengths and Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-white mb-3 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Strengths</span>
                    </h5>
                    <ul className="space-y-2">
                      {("ai_optimization" in selectedContent
                        ? selectedContent.ai_optimization.query_coverage
                        : selectedContent.ai_readiness_analysis.strengths
                      )
                        .slice(0, 4)
                        .map((item, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-300 flex items-start space-x-2"
                          >
                            <Star className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-white mb-3 flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <span>Improvement Areas</span>
                    </h5>
                    <ul className="space-y-2">
                      {("ai_optimization" in selectedContent
                        ? selectedContent.ai_optimization
                            .optimization_opportunities
                        : selectedContent.ai_readiness_analysis
                            .improvement_areas
                      )
                        .slice(0, 4)
                        .map((item, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-300 flex items-start space-x-2"
                          >
                            <TrendingUp className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Content Preview */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <span>Content Preview</span>
                </h4>

                <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Headline</div>
                    <div className="text-white font-medium">
                      {"platform" in selectedContent
                        ? selectedContent.content.headline
                        : selectedContent.content.main_headline}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      Description
                    </div>
                    <div className="text-gray-300 text-sm">
                      {"platform" in selectedContent
                        ? selectedContent.content.description
                        : selectedContent.content.subheadline}
                    </div>
                  </div>

                  {"platform" in selectedContent &&
                  selectedContent.content.cta ? (
                    <div className="pt-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        {selectedContent.content.cta}
                      </button>
                    </div>
                  ) : (
                    "cta_primary" in selectedContent.content && (
                      <div className="pt-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          {selectedContent.content.cta_primary}
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Detailed AI Discoverability Breakdown */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  <span>AI Discoverability Data Points</span>
                </h4>

                {/* Keywords and Content Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-3">
                      Target Keywords
                    </h5>
                    <div className="space-y-2">
                      {"platform" in selectedContent
                        ? selectedContent.content.keywords.map(
                            (keyword, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs mr-2 mb-1"
                              >
                                {keyword}
                              </span>
                            )
                          )
                        : selectedContent.seo_optimization.target_keywords.map(
                            (keyword, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs mr-2 mb-1"
                              >
                                {keyword}
                              </span>
                            )
                          )}
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-3">
                      Performance Metrics
                    </h5>
                    {"performance_metrics" in selectedContent && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            AI Mentions/Month:
                          </span>
                          <span className="text-white font-medium">
                            {
                              selectedContent.performance_metrics
                                .ai_mention_frequency
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Click-Through Rate:
                          </span>
                          <span className="text-white font-medium">
                            {
                              selectedContent.performance_metrics
                                .click_through_rate
                            }
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Conversion Rate:
                          </span>
                          <span className="text-white font-medium">
                            {
                              selectedContent.performance_metrics
                                .conversion_rate
                            }
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Engagement Rate:
                          </span>
                          <span className="text-white font-medium">
                            {
                              selectedContent.performance_metrics
                                .engagement_rate
                            }
                            %
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Target Audience and Pain Points */}
                {"platform" in selectedContent && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Target Audience
                      </h5>
                      <p className="text-gray-300 text-sm">
                        {selectedContent.content.target_audience}
                      </p>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Pain Points Addressed
                      </h5>
                      <ul className="space-y-1">
                        {selectedContent.content.pain_points.map(
                          (point, index) => (
                            <li
                              key={index}
                              className="text-gray-300 text-sm flex items-start space-x-2"
                            >
                              <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{point}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Query Coverage */}
              {"ai_readiness_analysis" in selectedContent && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                    <span>AI Query Matches</span>
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    These are actual AI prompts this content successfully
                    answers. Higher coverage = better discoverability.
                  </p>

                  <div className="space-y-2">
                    {selectedContent.ai_readiness_analysis.ai_discovery_potential.query_matches.map(
                      (query, index) => (
                        <div
                          key={index}
                          className="bg-gray-700/30 rounded-lg p-3 flex items-center justify-between"
                        >
                          <span className="text-gray-300 text-sm">
                            "{query}"
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-green-400 font-medium">
                              High Match
                            </div>
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Content Gaps */}
                  <div className="mt-6 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-3 flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <span>Missing Content That AI Looks For</span>
                    </h5>
                    <ul className="space-y-2">
                      {selectedContent.ai_readiness_analysis.ai_discovery_potential.content_gaps.map(
                        (gap, index) => (
                          <li
                            key={index}
                            className="text-yellow-200 text-sm flex items-start space-x-2"
                          >
                            <Info className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span>{gap}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Advertisement-specific AI Analysis */}
              {"platform" in selectedContent && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                    <span>AI Query Analysis</span>
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    These queries show what AI systems ask when looking for
                    content like this advertisement.
                  </p>

                  <div className="space-y-2">
                    {selectedContent.ai_optimization.query_coverage.map(
                      (query, index) => (
                        <div
                          key={index}
                          className="bg-gray-700/30 rounded-lg p-3 flex items-center justify-between"
                        >
                          <span className="text-gray-300 text-sm">
                            "{query}"
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-green-400 font-medium">
                              Answers This
                            </div>
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Technical & SEO Analysis */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <span>Technical AI Analysis</span>
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  These technical factors determine how easily AI systems can
                  process and understand your content.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">
                      Content Length
                    </h5>
                    <div className="text-xl font-bold text-white">
                      {"platform" in selectedContent
                        ? `${selectedContent.content.body_text.length} chars`
                        : `${selectedContent.content.hero_text.length} chars`}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Optimal: 300-1500 characters
                    </p>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">
                      Visual Content
                    </h5>
                    <div className="text-xl font-bold text-white">
                      {"visual" in selectedContent ? "Yes" : "Included"}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {"visual" in selectedContent
                        ? selectedContent.visual.dimensions
                        : "Optimized imagery"}
                    </p>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">
                      Industry Focus
                    </h5>
                    <div className="text-xl font-bold text-white">
                      {selectedContent.industry}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Specialized content domain
                    </p>
                  </div>
                </div>

                {/* SEO Optimization Details */}
                {"seo_optimization" in selectedContent && (
                  <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-white mb-3">
                      SEO & Meta Data
                    </h5>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-400">Title Tag:</span>
                        <p className="text-white mt-1">
                          {selectedContent.seo_optimization.title_tag}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Meta Description:</span>
                        <p className="text-white mt-1">
                          {selectedContent.seo_optimization.meta_description}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">H1 Header:</span>
                        <p className="text-white mt-1">
                          {selectedContent.seo_optimization.h1}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Competitive Benchmarking */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <span>Competitive Benchmarking</span>
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  How this content performs compared to industry standards and
                  competitors.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-3">
                      Industry Comparison
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Your Score:</span>
                        <span
                          className={`font-bold ${getScoreColor(
                            getOptimizationScore(selectedContent)
                          )}`}
                        >
                          {getOptimizationScore(selectedContent)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Industry Average:</span>
                        <span className="text-yellow-400 font-medium">72%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Top Performers:</span>
                        <span className="text-green-400 font-medium">90%+</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-3">
                      AI Mention Ranking
                    </h5>
                    {"performance_metrics" in selectedContent && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">
                            Current Ranking:
                          </span>
                          <span className="text-white font-bold">
                            #
                            {Math.ceil(
                              (100 -
                                selectedContent.performance_metrics
                                  .ai_mention_frequency) /
                                10
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">
                            Monthly Mentions:
                          </span>
                          <span className="text-white font-medium">
                            {
                              selectedContent.performance_metrics
                                .ai_mention_frequency
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">
                            Growth Potential:
                          </span>
                          <span className="text-green-400 font-medium">
                            +
                            {Math.round(
                              (90 -
                                selectedContent.performance_metrics
                                  .ai_mention_frequency) /
                                5
                            )}{" "}
                            mentions
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-green-400" />
                  <span>Actionable Recommendations</span>
                </h4>
                <p className="text-green-200 text-sm mb-4">
                  Specific steps to improve your content's AI discoverability
                  and ranking.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-white mb-3 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Quick Wins (1-2 weeks)</span>
                    </h5>
                    <ul className="space-y-2">
                      {("ai_optimization" in selectedContent
                        ? selectedContent.ai_optimization
                            .optimization_opportunities
                        : selectedContent.ai_readiness_analysis
                            .improvement_areas
                      )
                        .slice(0, 3)
                        .map((item, index) => (
                          <li
                            key={index}
                            className="text-sm text-green-200 flex items-start space-x-2"
                          >
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-white mb-3 flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-400" />
                      <span>Long-term Strategy (1-3 months)</span>
                    </h5>
                    <ul className="space-y-2">
                      <li className="text-sm text-blue-200 flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          Create FAQ section addressing common AI queries
                        </span>
                      </li>
                      <li className="text-sm text-blue-200 flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Develop industry-specific case studies</span>
                      </li>
                      <li className="text-sm text-blue-200 flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Build topic authority with related content</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Expected Impact */}
                <div className="mt-6 pt-4 border-t border-green-700/30">
                  <h6 className="font-medium text-white mb-2">
                    Expected Impact:
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        +15%
                      </div>
                      <div className="text-green-200">AI Visibility</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">+8</div>
                      <div className="text-blue-200">Query Matches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        +25%
                      </div>
                      <div className="text-purple-200">Engagement</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analyze Similar Content</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <FileQuestion className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No content found</h3>
          <p className="text-gray-400">
            Try selecting a different content type or check back later
          </p>
        </div>
      )}
    </div>
  );
};

export default DemoContentShowcase;
