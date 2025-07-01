// Content & Assets Management Page
// Dedicated page for DAM integration and content management
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useCallback, useEffect } from "react";
import {
  Database,
  FolderOpen,
  Upload,
  Download,
  BarChart3,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Trash2,
  Eye,
  Edit3,
  HardDrive,
  Cloud,
  Zap,
  Mail,
  Globe,
  BookOpen,
  AlertCircle,
  AlertTriangle,
  MessageSquare,
  Brain,
  Lightbulb,
  Target,
  Layers,
  Network,
  SearchIcon,
  CheckCircle,
  TrendingUp,
  X,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import DAMIntegration from "../components/DAMIntegration";
import DAMContentAnalysis from "../components/DAMContentAnalysis";
import FileUpload from "../components/FileUpload";
import UploadConfirmation from "../components/UploadConfirmation";
import AnalysisResults from "../components/AnalysisResults";
import ActionableInsights from "../components/ActionableInsights";
import DemoContentShowcase from "../components/DemoContentShowcase";
import { DAMAsset } from "../services/damIntegration";
import demoContentService, {
  DemoAdvertisement,
  DemoLandingPage,
  DemoImage,
} from "../services/demoContent";
import {
  analyzeAsset,
  getQuickSummary,
  AnalysisResult,
  QuickSummary,
} from "../services/api";

interface ContentLibrary {
  id: string;
  name: string;
  description: string;
  assetCount: number;
  totalSize: number;
  lastUpdated: Date;
  source: "dam" | "upload" | "manual";
  tags: string[];
}

const ContentAssets = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "dam" | "library" | "analysis" | "education"
  >("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [damAssets, setDamAssets] = useState<DAMAsset[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Analyzer state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGettingSummary, setIsGettingSummary] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [quickSummary, setQuickSummary] = useState<QuickSummary | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisMode, setAnalysisMode] = useState<"upload" | "dam">("upload");

  // Content upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Demo content state (for local development)
  const [demoContent, setDemoContent] = useState<
    (DemoAdvertisement | DemoLandingPage | DemoImage)[]
  >([]);
  const [showDemoContent, setShowDemoContent] = useState(false);
  const [selectedDemoContent, setSelectedDemoContent] = useState<
    DemoAdvertisement | DemoLandingPage | DemoImage | null
  >(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Full-screen image viewer state
  const [fullScreenImage, setFullScreenImage] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);

  // Report generation state
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Modal tabs state for detailed analysis view
  const [activeModalTab, setActiveModalTab] = useState<
    "analysis" | "metadata" | "methodology"
  >("analysis");

  // Load demo content for local development
  useEffect(() => {
    // Check if we're running locally
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "";

    if (isLocalhost) {
      // Add a small delay to ensure demo content service is initialized
      setTimeout(() => {
        const advertisements = demoContentService.getAdvertisements();
        const landingPages = demoContentService.getLandingPages();
        const images = demoContentService.getImages();

        console.log("Demo content loaded:", {
          ads: advertisements.length,
          pages: landingPages.length,
          images: images.length,
        });

        setDemoContent([...advertisements, ...landingPages, ...images]);
        setShowDemoContent(true);
      }, 100);
    }
  }, []);

  // Handle keyboard events for image viewer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showImageViewer) {
        setShowImageViewer(false);
        setFullScreenImage(null);
      }
    };

    if (showImageViewer) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [showImageViewer]);

  // File upload handler for analyzer
  const handleFileUpload = useCallback(async (file: File) => {
    setSelectedFile(file);
    setIsGettingSummary(true);
    setAnalysisResult(null);
    setQuickSummary(null);

    try {
      // First get quick summary
      const summary = await getQuickSummary(file);
      setQuickSummary(summary);
      setIsGettingSummary(false);

      // Show scanning indicator and start full analysis
      setIsAnalyzing(true);
      const result = await analyzeAsset(file);
      setAnalysisResult(result);
      toast.success("Analysis completed successfully!");
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
      console.error("Analysis error:", error);
      setQuickSummary(null);
    } finally {
      setIsAnalyzing(false);
      setIsGettingSummary(false);
    }
  }, []);

  // Content upload handlers
  const handleContentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadFiles((prev) => [...prev, ...files]);
  };

  const removeUploadFile = (index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const processContentUpload = async () => {
    if (uploadFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload process
    for (let i = 0; i < uploadFiles.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create mock DAM asset from uploaded file
      const file = uploadFiles[i];
      const isImage = isImageFile(file.name);

      const newAsset: DAMAsset = {
        id: `upload-${Date.now()}-${i}`,
        name: file.name,
        description: isImage
          ? `Image file: ${file.name}. Visual content analysis would extract text, identify objects, and analyze composition in a real implementation.`
          : `Uploaded file: ${file.name}. Content would be extracted and analyzed in a real implementation.`,
        content: isImage
          ? `Visual content analysis for ${file.name}:\n- Image dimensions and quality\n- Text extraction (OCR)\n- Visual elements identification\n- Color scheme analysis\n- Composition and layout assessment\n- Brand element detection`
          : `Content extracted from uploaded file: ${file.name}. This would contain the actual extracted text in a real implementation.`,
        fileType: file.name.split(".").pop() || "unknown",
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        tags: isImage
          ? ["uploaded", "image", "visual-content"]
          : ["uploaded", "document"],
        categories: isImage
          ? ["user-upload", "images", "visual-assets"]
          : ["user-upload", "documents"],
        lastModified: new Date(),
        createdDate: new Date(),
        author: "You",
        version: "1.0",
        metadata: {
          originalFileName: file.name,
          uploadDate: new Date().toISOString(),
          source: "direct-upload",
          contentType: isImage ? "visual" : "text",
          ...(isImage && {
            imageInfo: {
              format: file.name.split(".").pop()?.toUpperCase(),
              estimatedDimensions: "Analysis pending",
              colorAnalysis: "Available after processing",
            },
          }),
        },
      };

      setDamAssets((prev) => [...prev, newAsset]);
      setUploadProgress(((i + 1) / uploadFiles.length) * 100);
    }

    setIsUploading(false);
    setUploadFiles([]);
    setShowUploadModal(false);
    toast.success(`Successfully uploaded ${uploadFiles.length} file(s)!`);
  };

  const handleUploadFilesClick = () => {
    setShowUploadModal(true);
  };

  const handleAddContentClick = () => {
    // Switch to analysis tab for content analysis
    setActiveTab("analysis");
    setAnalysisMode("upload");
  };

  const supportedFormats = [
    {
      type: "Images",
      icon: Image,
      description: "JPG, PNG, GIF, WebP - Ads, graphics, visuals",
      color: "text-green-400",
      bgColor: "bg-green-900/20",
    },
    {
      type: "PDF",
      icon: FileText,
      description: "PDF documents, reports, guides",
      color: "text-red-400",
      bgColor: "bg-red-900/20",
    },
    {
      type: "Web Copy",
      icon: Globe,
      description: "HTML content, landing pages",
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
    },
    {
      type: "Documents",
      icon: BookOpen,
      description: "DOCX, TXT, MD - Text content",
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
    },
  ];

  // Mock content libraries for demonstration
  const contentLibraries: ContentLibrary[] = [
    {
      id: "lib_1",
      name: "Marketing Materials",
      description: "Product brochures, case studies, and marketing collateral",
      assetCount: 156,
      totalSize: 245000000, // ~245MB
      lastUpdated: new Date("2024-01-15"),
      source: "dam",
      tags: ["marketing", "approved", "current"],
    },
    {
      id: "lib_2",
      name: "Technical Documentation",
      description: "API docs, user guides, and technical specifications",
      assetCount: 89,
      totalSize: 127000000, // ~127MB
      lastUpdated: new Date("2024-01-12"),
      source: "dam",
      tags: ["technical", "documentation", "api"],
    },
    {
      id: "lib_3",
      name: "Compliance & Legal",
      description: "Regulatory documents, policies, and compliance materials",
      assetCount: 34,
      totalSize: 89000000, // ~89MB
      lastUpdated: new Date("2024-01-10"),
      source: "upload",
      tags: ["compliance", "legal", "regulatory"],
    },
    {
      id: "lib_4",
      name: "Training Content",
      description: "Employee training materials and educational resources",
      assetCount: 72,
      totalSize: 156000000, // ~156MB
      lastUpdated: new Date("2024-01-08"),
      source: "manual",
      tags: ["training", "education", "internal"],
    },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "dam":
        return <Database className="h-4 w-4 text-blue-400" />;
      case "upload":
        return <Upload className="h-4 w-4 text-green-400" />;
      case "manual":
        return <Edit3 className="h-4 w-4 text-purple-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
        return <FileText className="h-5 w-5 text-red-400" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
      case "webp":
        return <Image className="h-5 w-5 text-green-400" />;
      case "mp4":
      case "avi":
      case "mov":
        return <Video className="h-5 w-5 text-blue-400" />;
      case "mp3":
      case "wav":
        return <Music className="h-5 w-5 text-purple-400" />;
      case "zip":
      case "rar":
        return <Archive className="h-5 w-5 text-yellow-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  // Helper function to check if file is an image
  const isImageFile = (fileName: string) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp"];
    const extension = fileName.split(".").pop()?.toLowerCase();
    return imageExtensions.includes(extension || "");
  };

  // Create object URL for image preview
  const createImagePreview = (file: File) => {
    return URL.createObjectURL(file);
  };

  // Handle image click for full-screen view
  const handleImageClick = (
    imageUrl: string,
    title: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent card click from triggering
    setFullScreenImage({ url: imageUrl, title });
    setShowImageViewer(true);
  };

  // Generate and download report
  const handleGenerateReport = async () => {
    if (!selectedDemoContent) return;

    setIsGeneratingReport(true);

    try {
      // Simulate report generation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate report content
      const reportContent = generateReportContent(selectedDemoContent);

      // Create and download the report
      const blob = new Blob([reportContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `AI_Analysis_Report_${selectedDemoContent.title
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "_")}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Report generated and downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate report. Please try again.");
      console.error("Report generation error:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Generate report content based on demo content analysis
  const generateReportContent = (
    content: DemoAdvertisement | DemoLandingPage | DemoImage
  ) => {
    const currentDate = new Date().toLocaleDateString();
    const contentType =
      "platform" in content
        ? "Advertisement"
        : "url" in content
        ? "Landing Page"
        : "Image File";

    return `# AI Discoverability Analysis Report

**Content:** ${content.title}  
**Type:** ${contentType}  
**Industry:** ${content.industry}  
**Generated:** ${currentDate}  

---

## Executive Summary

This report provides a comprehensive analysis of how well your ${contentType.toLowerCase()} content is optimized for AI discovery and search engine understanding. The analysis covers key metrics that impact your content's visibility in AI-powered search results.

## Content Overview

- **Content Title:** ${content.title}
- **Content Type:** ${contentType}
- **Industry Focus:** ${content.industry}
${"platform" in content ? `- **Platform:** ${content.platform}` : ""}
${
  !("platform" in content) && !("url" in content) && "format" in content
    ? `- **Format:** ${content.format}`
    : ""
}
- **Target Audience:** ${
      "content" in content && "target_audience" in content.content
        ? content.content.target_audience
        : "General business audience"
    }

## AI Optimization Metrics

${
  "ai_optimization" in content
    ? `
### Core Performance Metrics
- **Readability Score:** ${content.ai_optimization.readability_score}%
- **Semantic Relevance:** ${content.ai_optimization.semantic_relevance}%
${
  "keyword_density" in content.ai_optimization
    ? `- **Keyword Density:** ${content.ai_optimization.keyword_density}%`
    : ""
}
- **Query Matches:** ${
        content.ai_optimization.query_coverage.length
      } relevant queries

### AI Query Coverage
The following queries are likely to surface your content in AI search results:
${content.ai_optimization.query_coverage
  .map((query) => `- "${query}"`)
  .join("\n")}

### Optimization Opportunities
${content.ai_optimization.optimization_opportunities
  .map((opp) => `- ${opp}`)
  .join("\n")}
`
    : `
### AI Readiness Metrics
- **AI Query Coverage:** ${content.ai_readiness_analysis.ai_query_coverage}%
- **Content Clarity:** ${content.ai_readiness_analysis.content_clarity}%
- **Conversion Optimization:** ${
        content.ai_readiness_analysis.conversion_optimization
      }%
- **Keyword Optimization:** ${
        content.ai_readiness_analysis.keyword_optimization
      }%

### Strengths
${content.ai_readiness_analysis.strengths
  .map((strength) => `- ${strength}`)
  .join("\n")}

### Improvement Areas
${content.ai_readiness_analysis.improvement_areas
  .map((area) => `- ${area}`)
  .join("\n")}

### AI Discovery Potential
**Query Matches:**
${content.ai_readiness_analysis.ai_discovery_potential.query_matches
  .map((query) => `- "${query}"`)
  .join("\n")}
`
}

## Target Keywords Analysis

${
  "content" in content && "keywords" in content.content
    ? `Your content targets the following keywords:
${content.content.keywords.map((keyword) => `- ${keyword}`).join("\n")}`
    : "seo_optimization" in content
    ? `Your content targets the following keywords:
${content.seo_optimization.target_keywords
  .map((keyword) => `- ${keyword}`)
  .join("\n")}`
    : "No specific keyword targeting identified."
}

${
  "performance_metrics" in content
    ? `
## Performance Data

- **AI Mentions per Month:** ${content.performance_metrics.ai_mention_frequency}
- **Click-Through Rate:** ${content.performance_metrics.click_through_rate}%
- **Conversion Rate:** ${content.performance_metrics.conversion_rate}%
- **Engagement Rate:** ${content.performance_metrics.engagement_rate}%
`
    : ""
}

## Recommendations

### Immediate Actions
1. **Improve Content Structure:** Ensure clear headings and logical flow
2. **Enhance Semantic Richness:** Use varied vocabulary and natural language patterns
3. **Target User Intent:** Focus on answering specific questions your audience has
4. **Optimize for Context:** Provide comprehensive information that AI systems can understand

### Long-term Strategy
1. **Monitor AI Query Performance:** Track how often your content appears in AI-generated responses
2. **Update Content Regularly:** Keep information current and comprehensive
3. **Build Topical Authority:** Create content clusters around your core topics
4. **Measure and Iterate:** Use analytics to understand what works and optimize accordingly

## Conclusion

${
  "ai_optimization" in content
    ? `Your content shows a ${
        content.ai_optimization.semantic_relevance
      }% semantic relevance score, indicating ${
        content.ai_optimization.semantic_relevance >= 80
          ? "strong"
          : content.ai_optimization.semantic_relevance >= 60
          ? "moderate"
          : "limited"
      } optimization for AI discovery.`
    : `Your content shows a ${
        content.ai_readiness_analysis.ai_query_coverage
      }% AI query coverage score, indicating ${
        content.ai_readiness_analysis.ai_query_coverage >= 80
          ? "strong"
          : content.ai_readiness_analysis.ai_query_coverage >= 60
          ? "moderate"
          : "limited"
      } readiness for AI search.`
}

Focus on the optimization opportunities identified in this report to improve your content's discoverability in AI-powered search results.

---

*This report was generated by the AI Readiness Analyzer. For more detailed analysis and recommendations, please contact our team.*
`;
  };

  // Generate contextual recommendations based on content analysis
  const getRecommendations = (
    content: DemoAdvertisement | DemoLandingPage | DemoImage
  ) => {
    const contentType =
      "platform" in content
        ? "advertisement"
        : "url" in content
        ? "landing page"
        : "image";
    const aiScore =
      "ai_optimization" in content
        ? content.ai_optimization.semantic_relevance
        : content.ai_readiness_analysis.ai_query_coverage;

    const isPharmaceutical = content.industry === "Pharmaceutical";

    // Base recommendations that apply to all content types
    const baseRecommendations = {
      priority: [
        {
          title: "Enhance Content Structure",
          description: `Add clear headings and subheadings to help AI systems understand your ${contentType} hierarchy and main topics.`,
          impact: "High",
          effort: "Low",
        },
        {
          title: "Improve Semantic Richness",
          description: `Use varied vocabulary and natural language patterns. Include synonyms and related terms for key concepts in your ${contentType}.`,
          impact: "High",
          effort: "Medium",
        },
        {
          title: "Target User Intent",
          description: `Focus on answering specific questions your audience asks about ${
            isPharmaceutical
              ? "medical treatments and conditions"
              : "your products/services"
          }.`,
          impact: "Very High",
          effort: "Medium",
        },
      ],
      longTerm: [
        {
          title: "Build Topical Authority",
          description: `Create content clusters around your core ${
            isPharmaceutical ? "therapeutic areas" : "business topics"
          } to establish expertise.`,
          impact: "Very High",
          timeline: "3-6 months",
        },
        {
          title: "Monitor AI Query Performance",
          description:
            "Track how often your content appears in AI-generated responses and optimize based on performance data.",
          impact: "High",
          timeline: "Ongoing",
        },
      ],
    };

    // Content-specific recommendations
    if (contentType === "advertisement") {
      baseRecommendations.priority.push({
        title: "Optimize Call-to-Action",
        description:
          "Make your CTA clear and action-oriented. AI systems need to understand the desired user action.",
        impact: "High",
        effort: "Low",
      });

      if (isPharmaceutical) {
        baseRecommendations.priority.push({
          title: "Include Safety Information",
          description:
            "Ensure important safety information is structured and clearly labeled for AI extraction.",
          impact: "Critical",
          effort: "Medium",
        });

        baseRecommendations.longTerm.push({
          title: "Regulatory Compliance Optimization",
          description:
            "Structure regulatory disclaimers and safety information for better AI understanding while maintaining compliance.",
          impact: "High",
          timeline: "2-3 months",
        });
      }
    } else if (contentType === "landing page") {
      baseRecommendations.priority.push({
        title: "Add FAQ Section",
        description:
          "Include a comprehensive FAQ section that addresses common user questions in natural language.",
        impact: "Very High",
        effort: "Medium",
      });

      baseRecommendations.longTerm.push({
        title: "Implement Schema Markup",
        description:
          "Add structured data markup to help AI systems better understand your content context.",
        impact: "High",
        timeline: "1-2 months",
      });
    } else if (contentType === "image") {
      baseRecommendations.priority.push({
        title: "Optimize Alt Text",
        description:
          "Write descriptive, keyword-rich alt text that explains the image content and context.",
        impact: "High",
        effort: "Low",
      });

      baseRecommendations.priority.push({
        title: "Add Image Context",
        description:
          "Provide surrounding text that explains the image's relevance and key information for AI extraction.",
        impact: "High",
        effort: "Medium",
      });

      if (isPharmaceutical) {
        baseRecommendations.longTerm.push({
          title: "OCR-Optimize Text in Images",
          description:
            "Ensure any text within pharmaceutical ads is clear and readable for AI text extraction.",
          impact: "Medium",
          timeline: "1-2 months",
        });
      }
    }

    // Score-based recommendations
    if (aiScore < 60) {
      baseRecommendations.priority.unshift({
        title: "Comprehensive Content Audit",
        description: `Your ${contentType} needs significant optimization. Start with a complete content review and restructuring.`,
        impact: "Critical",
        effort: "High",
      });
    } else if (aiScore < 80) {
      baseRecommendations.priority.push({
        title: "Content Enhancement",
        description: `Your ${contentType} is moderately optimized. Focus on adding more comprehensive information and improving readability.`,
        impact: "High",
        effort: "Medium",
      });
    }

    return baseRecommendations;
  };

  const totalAssets = contentLibraries.reduce(
    (sum, lib) => sum + lib.assetCount,
    0
  );
  const totalSize = contentLibraries.reduce(
    (sum, lib) => sum + lib.totalSize,
    0
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "dam", label: "DAM Integration", icon: Database },
    { id: "library", label: "Content Library", icon: FolderOpen },
    { id: "analysis", label: "Content Analysis", icon: Zap },
    { id: "education", label: "Education", icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content & Assets</h1>
          <p className="text-gray-400">
            Manage your content library, DAM integrations, and asset analysis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleUploadFilesClick}
            className="btn-secondary flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Files</span>
          </button>
          <button
            onClick={handleAddContentClick}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Content</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-900/30 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Assets</p>
                  <p className="text-2xl font-bold text-white">
                    {totalAssets.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-900/30 rounded-lg">
                  <HardDrive className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Size</p>
                  <p className="text-2xl font-bold text-white">
                    {formatFileSize(totalSize)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-900/30 rounded-lg">
                  <Database className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">DAM Sources</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      contentLibraries.filter((lib) => lib.source === "dam")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-900/30 rounded-lg">
                  <Cloud className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">AI Ready</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round((damAssets.length / totalAssets) * 100) || 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Libraries Overview */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Content Libraries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contentLibraries.map((library) => (
                <div
                  key={library.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getSourceIcon(library.source)}
                      <div>
                        <h3 className="font-medium text-white">
                          {library.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {library.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Assets:</span>
                      <span className="ml-2 font-medium text-white">
                        {library.assetCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Size:</span>
                      <span className="ml-2 font-medium text-white">
                        {formatFileSize(library.totalSize)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Updated:</span>
                      <span className="ml-2 font-medium text-white">
                        {library.lastUpdated.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {library.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab("dam")}
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-left"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Database className="h-5 w-5 text-blue-400" />
                  <span className="font-medium text-white">Connect DAM</span>
                </div>
                <p className="text-sm text-gray-400">
                  Connect to your Digital Asset Management system
                </p>
              </button>

              <button
                onClick={() => setActiveTab("analysis")}
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-left"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  <span className="font-medium text-white">
                    Analyze Content
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  Run AI analysis on your content library
                </p>
              </button>

              <button className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-left">
                <div className="flex items-center space-x-3 mb-2">
                  <Upload className="h-5 w-5 text-green-400" />
                  <span className="font-medium text-white">Upload Files</span>
                </div>
                <p className="text-sm text-gray-400">
                  Upload files directly to your content library
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "dam" && (
        <DAMIntegration
          onAssetsImported={(assets) => {
            setDamAssets(assets);
            console.log(`Imported ${assets.length} assets from DAM`);
          }}
        />
      )}

      {activeTab === "library" && (
        <div className="space-y-6">
          {/* Library Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    File Type
                  </label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                    <option value="">All Types</option>
                    <option value="pdf">PDF</option>
                    <option value="docx">Word Documents</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Source
                  </label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                    <option value="">All Sources</option>
                    <option value="dam">DAM</option>
                    <option value="upload">Upload</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date Range
                  </label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                    <option value="">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Size
                  </label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                    <option value="">All Sizes</option>
                    <option value="small">&lt; 1MB</option>
                    <option value="medium">1MB - 10MB</option>
                    <option value="large">&gt; 10MB</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Demo Content Notice (Local Development) */}
          {showDemoContent && (
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Info className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white">
                  Demo Content Available
                </h3>
              </div>
              <p className="text-blue-200 text-sm">
                You're running locally, so we're showing sample advertisements
                and landing pages. Click any content to see{" "}
                <strong>exactly what AI systems analyze</strong> for
                discoverability.
              </p>
            </div>
          )}

          {/* Assets Display */}
          {damAssets.length > 0 || showDemoContent ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
                  : "space-y-4"
              }
            >
              {/* Demo Images First (Priority Display) */}
              {showDemoContent &&
                demoContent
                  .filter(
                    (content) => !("platform" in content) && !("url" in content)
                  ) // Images only
                  .map((content) => (
                    <div
                      key={content.id}
                      className={`bg-gray-800/50 border border-blue-700/30 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group relative ${
                        viewMode === "list"
                          ? "p-4 flex items-center space-x-4"
                          : "p-6 flex flex-col h-full"
                      }`}
                      onClick={() => {
                        setSelectedDemoContent(content);
                        setShowDemoModal(true);
                      }}
                    >
                      {/* AI Score Badge - Positioned in top-right corner for grid view */}
                      {viewMode === "grid" && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-blue-600/20 border border-blue-500/30 rounded-full px-2 py-1">
                            <div className="text-xs font-bold text-blue-400">
                              {"ai_optimization" in content
                                ? content.ai_optimization.semantic_relevance
                                : "ai_readiness_analysis" in content
                                ? content.ai_readiness_analysis
                                    .ai_query_coverage
                                : 90}
                              % AI
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Header Section */}
                      <div
                        className={`flex items-start ${
                          viewMode === "list" ? "space-x-4 flex-1" : "mb-4"
                        }`}
                      >
                        <div
                          className={`flex items-center space-x-3 flex-1 ${
                            viewMode === "grid" ? "pr-20" : ""
                          }`}
                        >
                          <div className="p-2 bg-blue-600/20 rounded-lg flex-shrink-0">
                            <Image className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors mb-1 line-clamp-2">
                              {content.title}
                            </h3>
                            <p className="text-sm text-gray-400 line-clamp-1">
                              Image File • {content.industry}
                            </p>
                          </div>
                        </div>

                        {/* Actions for list view */}
                        {viewMode === "list" && (
                          <div className="flex items-center space-x-3 flex-shrink-0">
                            <div className="text-right">
                              <div className="text-sm font-bold text-blue-400">
                                {"ai_optimization" in content
                                  ? content.ai_optimization.semantic_relevance
                                  : "ai_readiness_analysis" in content
                                  ? content.ai_readiness_analysis
                                      .ai_query_coverage
                                  : 90}
                                %
                              </div>
                              <div className="text-xs text-gray-500">
                                AI Score
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-blue-400">
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Content Details for Grid View */}
                      {viewMode === "grid" && (
                        <>
                          {/* Image Preview for Demo Images */}
                          <div className="mb-4">
                            {"image_url" in content && content.image_url ? (
                              <div
                                className="w-full h-48 rounded-lg overflow-hidden border border-gray-600 cursor-pointer hover:border-blue-500 transition-colors group relative"
                                onClick={(e) =>
                                  content.image_url &&
                                  handleImageClick(
                                    content.image_url,
                                    content.title,
                                    e
                                  )
                                }
                                title="Click to view full screen"
                              >
                                <img
                                  src={content.image_url}
                                  alt={content.title}
                                  className="w-full h-full object-contain bg-gray-800 group-hover:opacity-90 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <div className="bg-black bg-opacity-50 rounded-full p-2">
                                    <Eye className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg border border-gray-600 flex items-center justify-center">
                                <div className="text-center">
                                  <Image className="h-8 w-8 text-green-400 mx-auto mb-2" />
                                  <div className="text-xs text-gray-400">
                                    {"filename" in content
                                      ? content.filename
                                      : "Image Preview"}
                                  </div>
                                  <div className="text-xs text-green-400">
                                    {"file_type" in content
                                      ? content.file_type
                                      : "JPG"}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="text-sm text-gray-400 space-y-1 mb-4 flex-1">
                            <div>
                              <span className="text-gray-500">Type:</span> Image
                              File
                            </div>
                            <div>
                              <span className="text-gray-500">Industry:</span>{" "}
                              {content.industry}
                            </div>
                            {"format" in content && (
                              <div>
                                <span className="text-gray-500">Format:</span>{" "}
                                {content.format}
                              </div>
                            )}
                            <div>
                              <span className="text-gray-500">Status:</span>{" "}
                              <span className="text-green-400">
                                AI Optimized ✓
                              </span>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-auto">
                            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full border border-blue-700/30">
                              Demo Content
                            </span>
                            <span className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded-full border border-green-700/30">
                              AI Analyzed
                            </span>
                            <span className="px-2 py-1 bg-orange-900/30 text-orange-300 text-xs rounded-full border border-orange-700/30">
                              Visual Content
                            </span>
                            <span className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-700/30">
                              {content.industry}
                            </span>
                          </div>

                          {/* View Details Button */}
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <button className="w-full text-center text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center justify-center space-x-2">
                              <Eye className="h-4 w-4" />
                              <span>View AI Analysis</span>
                            </button>
                          </div>
                        </>
                      )}

                      {/* List View Tags */}
                      {viewMode === "list" && (
                        <div className="flex items-center space-x-6 text-sm text-gray-400 flex-shrink-0">
                          <span>Image File</span>
                          <span>{content.industry}</span>
                          {"file_type" in content && (
                            <span className="text-green-400">
                              {content.file_type}
                            </span>
                          )}
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded border border-blue-700/30">
                              Demo
                            </span>
                            <span className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded border border-green-700/30">
                              AI
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

              {/* Other Demo Content (Ads & Landing Pages) */}
              {showDemoContent &&
                demoContent
                  .filter(
                    (content) => "platform" in content || "url" in content
                  ) // Ads and Landing Pages
                  .map((content) => (
                    <div
                      key={content.id}
                      className={`bg-gray-800/50 border border-blue-700/30 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group relative ${
                        viewMode === "list"
                          ? "p-4 flex items-center space-x-4"
                          : "p-6 flex flex-col h-full"
                      }`}
                      onClick={() => {
                        setSelectedDemoContent(content);
                        setShowDemoModal(true);
                      }}
                    >
                      {/* AI Score Badge - Positioned in top-right corner for grid view */}
                      {viewMode === "grid" && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-blue-600/20 border border-blue-500/30 rounded-full px-2 py-1">
                            <div className="text-xs font-bold text-blue-400">
                              {"ai_optimization" in content
                                ? content.ai_optimization.semantic_relevance
                                : "ai_readiness_analysis" in content
                                ? content.ai_readiness_analysis
                                    .ai_query_coverage
                                : 90}
                              % AI
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Header Section */}
                      <div
                        className={`flex items-start ${
                          viewMode === "list" ? "space-x-4 flex-1" : "mb-4"
                        }`}
                      >
                        <div
                          className={`flex items-center space-x-3 flex-1 ${
                            viewMode === "grid" ? "pr-20" : ""
                          }`}
                        >
                          <div className="p-2 bg-blue-600/20 rounded-lg flex-shrink-0">
                            {"platform" in content ? (
                              <MessageSquare className="h-5 w-5 text-blue-400" />
                            ) : "url" in content ? (
                              <Globe className="h-5 w-5 text-blue-400" />
                            ) : (
                              <Image className="h-5 w-5 text-green-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors mb-1 line-clamp-2">
                              {content.title}
                            </h3>
                            <p className="text-sm text-gray-400 line-clamp-1">
                              {"platform" in content
                                ? `${content.platform} • ${content.industry}`
                                : "url" in content
                                ? `Landing Page • ${content.industry}`
                                : `Image File • ${content.industry}`}
                            </p>
                          </div>
                        </div>

                        {/* Actions for list view */}
                        {viewMode === "list" && (
                          <div className="flex items-center space-x-3 flex-shrink-0">
                            <div className="text-right">
                              <div className="text-sm font-bold text-blue-400">
                                {"ai_optimization" in content
                                  ? content.ai_optimization.semantic_relevance
                                  : "ai_readiness_analysis" in content
                                  ? content.ai_readiness_analysis
                                      .ai_query_coverage
                                  : 90}
                                %
                              </div>
                              <div className="text-xs text-gray-500">
                                AI Score
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-blue-400">
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Content Details for Grid View */}
                      {viewMode === "grid" && (
                        <>
                          <div className="text-sm text-gray-400 space-y-1 mb-4 flex-1">
                            <div>
                              <span className="text-gray-500">Type:</span>{" "}
                              {"platform" in content
                                ? "Advertisement"
                                : "url" in content
                                ? "Landing Page"
                                : "Image File"}
                            </div>
                            <div>
                              <span className="text-gray-500">Industry:</span>{" "}
                              {content.industry}
                            </div>
                            {/* Image-specific details */}
                            {!("platform" in content) &&
                              !("url" in content) &&
                              "format" in content && (
                                <div>
                                  <span className="text-gray-500">Format:</span>{" "}
                                  {content.format}
                                </div>
                              )}
                            <div>
                              <span className="text-gray-500">Status:</span>{" "}
                              <span className="text-green-400">
                                AI Optimized ✓
                              </span>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-auto">
                            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full border border-blue-700/30">
                              Demo Content
                            </span>
                            <span className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded-full border border-green-700/30">
                              AI Analyzed
                            </span>
                            {/* Image-specific tag */}
                            {!("platform" in content) &&
                              !("url" in content) && (
                                <span className="px-2 py-1 bg-orange-900/30 text-orange-300 text-xs rounded-full border border-orange-700/30">
                                  Visual Content
                                </span>
                              )}
                            <span className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-700/30">
                              {content.industry}
                            </span>
                          </div>

                          {/* View Details Button */}
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <button className="w-full text-center text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center justify-center space-x-2">
                              <Eye className="h-4 w-4" />
                              <span>View AI Analysis</span>
                            </button>
                          </div>
                        </>
                      )}

                      {/* List View Tags */}
                      {viewMode === "list" && (
                        <div className="flex items-center space-x-6 text-sm text-gray-400 flex-shrink-0">
                          <span>
                            {"platform" in content
                              ? "Advertisement"
                              : "url" in content
                              ? "Landing Page"
                              : "Image File"}
                          </span>
                          <span>{content.industry}</span>
                          {/* Show image format for images */}
                          {!("platform" in content) &&
                            !("url" in content) &&
                            "file_type" in content && (
                              <span className="text-green-400">
                                {content.file_type}
                              </span>
                            )}
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded border border-blue-700/30">
                              Demo
                            </span>
                            <span className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded border border-green-700/30">
                              AI
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No Assets Found</p>
              <p>Import content from your DAM or upload files to get started</p>
              <button
                onClick={() => setActiveTab("dam")}
                className="mt-4 btn-primary flex items-center space-x-2 mx-auto"
              >
                <Database className="h-4 w-4" />
                <span>Connect DAM</span>
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "analysis" && (
        <div className="space-y-8">
          {/* Analysis Header */}
          <div>
            <h2 className="text-2xl font-bold text-white">Content Analysis</h2>
            <p className="text-gray-400 mt-2">
              Upload and analyze your digital assets for AI compatibility and
              optimization opportunities, or analyze DAM assets
            </p>
          </div>

          {/* Analysis Type Selector */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => {
                setAnalysisMode("upload");
                // Reset analyzer state when switching
                setAnalysisResult(null);
                setQuickSummary(null);
                setSelectedFile(null);
              }}
              className={
                analysisMode === "upload" ? "btn-primary" : "btn-secondary"
              }
            >
              File Upload Analysis
            </button>
            <span className="text-gray-400">or</span>
            <button
              onClick={() => {
                setAnalysisMode("dam");
                // Reset analyzer state when switching
                setAnalysisResult(null);
                setQuickSummary(null);
                setSelectedFile(null);
              }}
              className={
                analysisMode === "dam" ? "btn-primary" : "btn-secondary"
              }
            >
              DAM Asset Analysis
            </button>
          </div>

          {/* File Upload Analysis Mode */}
          {analysisMode === "upload" && (
            <>
              {/* Supported Formats */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Supported Formats
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {supportedFormats.map((format, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${format.bgColor}`}>
                          <format.icon className={`h-6 w-6 ${format.color}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">
                            {format.type}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {format.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Section */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
                <h3 className="text-xl font-bold text-white mb-6">
                  Upload Asset for Analysis
                </h3>
                <FileUpload
                  onFileUpload={handleFileUpload}
                  isAnalyzing={isGettingSummary || isAnalyzing}
                  disabled={isGettingSummary || isAnalyzing}
                />

                {selectedFile && !quickSummary && !isGettingSummary && (
                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-blue-600/20">
                        <FileText className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-blue-300">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Confirmation with Quick Summary */}
              {quickSummary && (
                <UploadConfirmation
                  summary={quickSummary}
                  isScanning={isAnalyzing}
                />
              )}

              {/* Analysis Results */}
              {analysisResult && <AnalysisResults result={analysisResult} />}

              {/* Actionable Insights */}
              {analysisResult && (
                <ActionableInsights
                  fileName={selectedFile?.name || "your document"}
                  analysisResult={analysisResult}
                />
              )}
            </>
          )}

          {/* DAM Asset Analysis Mode */}
          {analysisMode === "dam" && (
            <div>
              {damAssets.length > 0 ? (
                <DAMContentAnalysis
                  damAssets={damAssets}
                  onAnalysisComplete={(results) => {
                    console.log(
                      `Analysis completed for ${results.length} assets`
                    );
                  }}
                />
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No DAM Assets Available</p>
                  <p>Import content from your DAM system to begin analysis</p>
                  <button
                    onClick={() => setActiveTab("dam")}
                    className="mt-4 btn-primary flex items-center space-x-2 mx-auto"
                  >
                    <Database className="h-4 w-4" />
                    <span>Go to DAM Integration</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analysis Features Info */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              What We Analyze
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-green-900/30 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      Structure & Clarity
                    </h4>
                    <p className="text-sm text-gray-400">
                      Heading hierarchy, paragraph length, readability scores
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-green-900/30 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Token Analysis</h4>
                    <p className="text-sm text-gray-400">
                      Token count, density, and optimization opportunities
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-green-900/30 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      Embedding Potential
                    </h4>
                    <p className="text-sm text-gray-400">
                      Semantic richness and vector embedding suitability
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-blue-900/30 mt-1">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Prompt Coverage</h4>
                    <p className="text-sm text-gray-400">
                      How well content answers common prompts
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-yellow-900/30 mt-1">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Content Gaps</h4>
                    <p className="text-sm text-gray-400">
                      Missing information based on prompt trends
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-green-900/30 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      Optimization Recommendations
                    </h4>
                    <p className="text-sm text-gray-400">
                      Actionable improvements for AI compatibility
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Upload Files to Library
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFiles([]);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Upload Content Files
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Drag and drop files here, or click to browse
                  <br />
                  <span className="text-green-400">✓ Images:</span> JPG, PNG,
                  GIF, WebP •<span className="text-blue-400">✓ Documents:</span>{" "}
                  PDF, DOCX, TXT
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.gif,.webp,.svg,.mp4,.avi,.mov"
                  onChange={handleContentUpload}
                  className="hidden"
                  id="content-file-upload"
                />
                <label
                  htmlFor="content-file-upload"
                  className="btn-primary inline-flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Choose Files</span>
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">
                    Files to Upload ({uploadFiles.length})
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {isImageFile(file.name) ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-600 flex-shrink-0">
                              <img
                                src={createImagePreview(file)}
                                alt={file.name}
                                className="w-full h-full object-cover"
                                onLoad={() => {
                                  // Clean up object URL after image loads
                                  const img = document.querySelector(
                                    `img[src="${createImagePreview(file)}"]`
                                  ) as HTMLImageElement;
                                  if (img) {
                                    setTimeout(
                                      () => URL.revokeObjectURL(img.src),
                                      1000
                                    );
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="text-blue-400">
                              {getFileTypeIcon(
                                file.name.split(".").pop() || ""
                              )}
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium">
                              {file.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                              {isImageFile(file.name) && (
                                <span className="ml-2 px-1 py-0.5 bg-green-900/30 text-green-300 rounded text-xs">
                                  Image
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeUploadFile(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">
                      Uploading files...
                    </span>
                    <span className="text-blue-400">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFiles([]);
                  }}
                  className="btn-secondary"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  onClick={processContentUpload}
                  disabled={uploadFiles.length === 0 || isUploading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="h-4 w-4" />
                  <span>
                    {isUploading
                      ? "Uploading..."
                      : `Upload ${uploadFiles.length} file(s)`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "education" && (
        <div className="space-y-8">
          {/* Education Header */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              AI Search Education
            </h2>
            <p className="text-gray-400 mt-2">
              Understanding how Large Language Models work and how to optimize
              your content for AI discovery
            </p>
          </div>

          {/* SEO vs LLM Search Comparison */}
          <div className="card p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Target className="h-6 w-6 text-blue-400 mr-3" />
              SEO vs. LLM Search: The Fundamental Difference
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Traditional SEO */}
              <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-orange-300 mb-4 flex items-center">
                  <SearchIcon className="h-5 w-5 mr-2" />
                  Traditional SEO
                </h4>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-white">Keyword Matching:</strong>
                      <p className="text-gray-300">
                        Search engines look for exact keyword matches and
                        variations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-white">Link Authority:</strong>
                      <p className="text-gray-300">
                        Backlinks and domain authority heavily influence
                        rankings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-white">Technical Factors:</strong>
                      <p className="text-gray-300">
                        Page speed, mobile-friendliness, structured data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-white">Result Format:</strong>
                      <p className="text-gray-300">
                        Returns list of web pages ranked by relevance
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* LLM Search */}
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  LLM AI Search
                </h4>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-white">
                        Semantic Understanding:
                      </strong>
                      <p className="text-gray-300">
                        Understands context, intent, and meaning behind queries
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-white">Content Quality:</strong>
                      <p className="text-gray-300">
                        Prioritizes comprehensive, accurate, and helpful
                        information
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-white">Context Awareness:</strong>
                      <p className="text-gray-300">
                        Considers surrounding content and relationships between
                        concepts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-white">Result Format:</strong>
                      <p className="text-gray-300">
                        Generates synthesized answers citing multiple sources
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insight Box */}
            <div className="mt-6 bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-yellow-300 mb-1">
                    Key Insight
                  </h5>
                  <p className="text-yellow-100 text-sm">
                    While SEO focuses on ranking web pages, LLM search focuses
                    on understanding and answering user intent. Your content
                    needs to be <strong>semantically rich</strong> and{" "}
                    <strong>contextually valuable</strong> rather than just
                    keyword-optimized.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How LLMs Are Trained */}
          <div className="card p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Layers className="h-6 w-6 text-purple-400 mr-3" />
              How Large Language Models Are Trained
            </h3>

            {/* Training Process Flow */}
            <div className="space-y-6">
              {/* Step 1: Data Collection */}
              <div className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-2">
                    Data Collection & Preprocessing
                  </h4>
                  <p className="text-gray-300 text-sm mb-3">
                    LLMs are trained on massive datasets containing text from
                    books, articles, websites, documentation, and other written
                    materials. This data is cleaned, filtered, and organized to
                    ensure quality.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-blue-900/30 p-2 rounded text-center">
                      <div className="font-medium text-blue-300">
                        Books & Literature
                      </div>
                    </div>
                    <div className="bg-green-900/30 p-2 rounded text-center">
                      <div className="font-medium text-green-300">
                        Web Content
                      </div>
                    </div>
                    <div className="bg-purple-900/30 p-2 rounded text-center">
                      <div className="font-medium text-purple-300">
                        Academic Papers
                      </div>
                    </div>
                    <div className="bg-orange-900/30 p-2 rounded text-center">
                      <div className="font-medium text-orange-300">
                        Documentation
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Pattern Learning */}
              <div className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-2">
                    Pattern Recognition & Language Understanding
                  </h4>
                  <p className="text-gray-300 text-sm mb-3">
                    During training, the model learns patterns in language,
                    relationships between concepts, and how to predict what
                    comes next in a sequence. It develops understanding of
                    grammar, context, and meaning.
                  </p>
                  <div className="bg-gray-600/30 p-3 rounded">
                    <div className="text-xs text-gray-400 mb-1">
                      Example Training Pattern:
                    </div>
                    <div className="text-sm text-white">
                      "Machine learning is a subset of{" "}
                      <span className="text-blue-400">[PREDICT]</span>" →
                      "artificial intelligence"
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Fine-tuning */}
              <div className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-2">
                    Fine-tuning & Alignment
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Models are then fine-tuned on specific tasks like
                    question-answering, summarization, and following
                    instructions. They learn to be helpful, accurate, and
                    provide well-structured responses that cite reliable
                    sources.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What LLMs Look For */}
          <div className="card p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Target className="h-6 w-6 text-green-400 mr-3" />
              What LLMs Look For in Content
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Content Quality */}
              <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-300 mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Content Quality
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Accurate and factual information</li>
                  <li>• Clear, well-structured writing</li>
                  <li>• Comprehensive coverage of topics</li>
                  <li>• Original insights and analysis</li>
                  <li>• Proper citations and sources</li>
                </ul>
              </div>

              {/* Semantic Richness */}
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-3 flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  Semantic Richness
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Natural language patterns</li>
                  <li>• Contextual relationships</li>
                  <li>• Varied vocabulary and synonyms</li>
                  <li>• Clear topic definitions</li>
                  <li>• Logical content flow</li>
                </ul>
              </div>

              {/* User Intent Matching */}
              <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-purple-300 mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Intent Matching
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Answers common questions</li>
                  <li>• Solves specific problems</li>
                  <li>• Provides actionable guidance</li>
                  <li>• Addresses user pain points</li>
                  <li>• Offers practical examples</li>
                </ul>
              </div>

              {/* Visual Content Analysis */}
              <div className="bg-orange-900/20 border border-orange-700/30 rounded-lg p-4 md:col-span-2 lg:col-span-1">
                <h4 className="font-semibold text-orange-300 mb-3 flex items-center">
                  <Image className="h-4 w-4 mr-2" />
                  Visual Content (Images)
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Text extraction (OCR) from images</li>
                  <li>• Brand element and logo recognition</li>
                  <li>• Visual composition analysis</li>
                  <li>• Color scheme and design quality</li>
                  <li>• Context and subject matter detection</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How AI Search Works */}
          <div className="card p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Network className="h-6 w-6 text-orange-400 mr-3" />
              How AI Search Actually Works
            </h3>

            <div className="space-y-6">
              {/* Search Process Flow */}
              <div className="bg-gray-700/30 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-4">
                  The AI Search Process
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Step 1 */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <SearchIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-white">
                      Query Analysis
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      AI understands user intent and context
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-8 h-0.5 bg-gray-500"></div>
                  </div>

                  {/* Step 2 */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-white">
                      Knowledge Retrieval
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Searches through trained knowledge
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-8 h-0.5 bg-gray-500"></div>
                  </div>

                  {/* Step 3 */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Layers className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-white">
                      Synthesis
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Combines information from multiple sources
                    </div>
                  </div>
                </div>
              </div>

              {/* What Makes Content Discoverable */}
              <div className="bg-gradient-to-r from-blue-900/10 to-purple-900/10 border border-blue-700/30 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-4">
                  What Makes Your Content AI-Discoverable
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-blue-300 mb-3">
                      High Priority Factors
                    </h5>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        Clear, descriptive headings and structure
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        Comprehensive topic coverage
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        Natural language and readability
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        Factual accuracy and authority
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-yellow-300 mb-3">
                      Optimization Opportunities
                    </h5>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                        FAQ sections for common queries
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                        Step-by-step explanations
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                        Context-rich examples
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                        Related concept connections
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Best Practices */}
          <div className="card p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Lightbulb className="h-6 w-6 text-yellow-400 mr-3" />
              LLM Optimization Best Practices
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Do's */}
              <div>
                <h4 className="font-semibold text-green-300 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  What TO Do
                </h4>
                <div className="space-y-4">
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">
                      Write for Understanding
                    </h5>
                    <p className="text-sm text-gray-300">
                      Use clear, natural language that explains concepts
                      thoroughly. Assume your reader needs context.
                    </p>
                  </div>
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">
                      Structure Content Logically
                    </h5>
                    <p className="text-sm text-gray-300">
                      Use hierarchical headings, bullet points, and clear
                      sections to organize information.
                    </p>
                  </div>
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">
                      Answer the "Why" and "How"
                    </h5>
                    <p className="text-sm text-gray-300">
                      Provide context, explanations, and step-by-step guidance,
                      not just facts.
                    </p>
                  </div>
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">
                      Use Semantic Relationships
                    </h5>
                    <p className="text-sm text-gray-300">
                      Connect related concepts and use varied vocabulary to
                      describe the same ideas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Don'ts */}
              <div>
                <h4 className="font-semibold text-red-300 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  What NOT to Do
                </h4>
                <div className="space-y-4">
                  <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">
                      Keyword Stuffing
                    </h5>
                    <p className="text-sm text-gray-300">
                      Avoid unnatural repetition of keywords. LLMs detect and
                      penalize this.
                    </p>
                  </div>
                  <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">
                      Shallow Content
                    </h5>
                    <p className="text-sm text-gray-300">
                      Don't create thin content that doesn't provide real value
                      or insight.
                    </p>
                  </div>
                  <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">
                      Misleading Information
                    </h5>
                    <p className="text-sm text-gray-300">
                      Accuracy is crucial. LLMs are trained to identify and
                      avoid unreliable sources.
                    </p>
                  </div>
                  <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">
                      Poor Structure
                    </h5>
                    <p className="text-sm text-gray-300">
                      Avoid wall-of-text content without clear organization or
                      headings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Guide */}
          <div className="card p-8 bg-gradient-to-br from-blue-900/10 to-purple-900/10 border-blue-700/30">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Zap className="h-6 w-6 text-blue-400 mr-3" />
              Quick Start: Optimize Your Content Today
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold text-white mb-2">
                  Audit Your Content
                </h4>
                <p className="text-sm text-gray-300">
                  Use our Content Analysis tool to see how your current content
                  performs for AI discoverability.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold text-white mb-2">
                  Apply Best Practices
                </h4>
                <p className="text-sm text-gray-300">
                  Implement the optimization strategies above, focusing on
                  clarity and comprehensive coverage.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold text-white mb-2">
                  Monitor & Improve
                </h4>
                <p className="text-sm text-gray-300">
                  Track your AI visibility metrics and continuously refine your
                  content strategy.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setActiveTab("analysis")}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Zap className="h-4 w-4" />
                <span>Start Analyzing Your Content</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demo Content Analysis Modal */}
      {showDemoModal && selectedDemoContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  AI Discoverability Analysis: {selectedDemoContent.title}
                </h2>
                <button
                  onClick={() => {
                    setShowDemoModal(false);
                    setSelectedDemoContent(null);
                    setActiveModalTab("analysis"); // Reset tab on close
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Tab Navigation */}
            <div className="border-b border-gray-700 bg-gray-800/50">
              <nav className="flex space-x-8 px-6">
                {[
                  {
                    id: "analysis",
                    label: "Analysis Results",
                    icon: BarChart3,
                  },
                  { id: "metadata", label: "Metadata & Details", icon: Info },
                  {
                    id: "methodology",
                    label: "Analysis Methodology",
                    icon: Search,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveModalTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeModalTab === tab.id
                          ? "border-blue-500 text-blue-400"
                          : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Tab Content */}
              {activeModalTab === "analysis" && (
                <>
                  {/* Image Preview for Demo Images */}
                  {!("platform" in selectedDemoContent) &&
                    !("url" in selectedDemoContent) &&
                    "image_url" in selectedDemoContent &&
                    selectedDemoContent.image_url && (
                      <div className="mb-6">
                        <div className="w-full max-w-4xl mx-auto">
                          <div
                            className="cursor-pointer hover:opacity-90 transition-opacity group relative"
                            onClick={() =>
                              selectedDemoContent.image_url &&
                              handleImageClick(
                                selectedDemoContent.image_url,
                                selectedDemoContent.title,
                                {} as React.MouseEvent
                              )
                            }
                            title="Click to view full screen"
                          >
                            <img
                              src={selectedDemoContent.image_url}
                              alt={selectedDemoContent.title}
                              className="w-full h-80 object-contain bg-gray-800 rounded-lg border border-gray-600"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
                              <div className="bg-black bg-opacity-50 rounded-full p-3">
                                <Eye className="h-8 w-8 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Basic Info & AI Metrics */}
                    <div className="space-y-6">
                      {/* Content Overview */}
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-4">
                          Content Overview
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Type:</span>
                            <span className="text-white">
                              {"platform" in selectedDemoContent
                                ? "Advertisement"
                                : "url" in selectedDemoContent
                                ? "Landing Page"
                                : "Image File"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Industry:</span>
                            <span className="text-white">
                              {selectedDemoContent.industry}
                            </span>
                          </div>
                          {"platform" in selectedDemoContent && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Platform:</span>
                              <span className="text-white">
                                {selectedDemoContent.platform}
                              </span>
                            </div>
                          )}
                          {!("platform" in selectedDemoContent) &&
                            !("url" in selectedDemoContent) &&
                            "format" in selectedDemoContent && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Format:</span>
                                <span className="text-white">
                                  {selectedDemoContent.format}
                                </span>
                              </div>
                            )}
                          {!("platform" in selectedDemoContent) &&
                            !("url" in selectedDemoContent) &&
                            "file_type" in selectedDemoContent && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">
                                  File Type:
                                </span>
                                <span className="text-white">
                                  {selectedDemoContent.file_type}
                                </span>
                              </div>
                            )}
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Target Audience:
                            </span>
                            <span className="text-white">
                              {"content" in selectedDemoContent &&
                              "target_audience" in selectedDemoContent.content
                                ? selectedDemoContent.content.target_audience
                                : !("platform" in selectedDemoContent) &&
                                  !("url" in selectedDemoContent)
                                ? "Visual content viewers"
                                : "General business audience"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* AI Optimization Metrics */}
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-4">
                          AI Optimization Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {"ai_optimization" in selectedDemoContent ? (
                            <>
                              <div className="text-center p-3 bg-gray-600/30 rounded">
                                <div className="text-2xl font-bold text-blue-400">
                                  {
                                    selectedDemoContent.ai_optimization
                                      .readability_score
                                  }
                                  %
                                </div>
                                <div className="text-xs text-gray-400">
                                  Readability
                                </div>
                              </div>
                              {"keyword_density" in
                                selectedDemoContent.ai_optimization && (
                                <div className="text-center p-3 bg-gray-600/30 rounded">
                                  <div className="text-2xl font-bold text-green-400">
                                    {
                                      selectedDemoContent.ai_optimization
                                        .keyword_density
                                    }
                                    %
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Keyword Density
                                  </div>
                                </div>
                              )}
                              <div className="text-center p-3 bg-gray-600/30 rounded">
                                <div className="text-2xl font-bold text-purple-400">
                                  {
                                    selectedDemoContent.ai_optimization
                                      .semantic_relevance
                                  }
                                  %
                                </div>
                                <div className="text-xs text-gray-400">
                                  Semantic Relevance
                                </div>
                              </div>
                              <div className="text-center p-3 bg-gray-600/30 rounded">
                                <div className="text-2xl font-bold text-yellow-400">
                                  {
                                    selectedDemoContent.ai_optimization
                                      .query_coverage.length
                                  }
                                </div>
                                <div className="text-xs text-gray-400">
                                  Query Matches
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-center p-3 bg-gray-600/30 rounded">
                                <div className="text-2xl font-bold text-blue-400">
                                  {
                                    selectedDemoContent.ai_readiness_analysis
                                      .ai_query_coverage
                                  }
                                  %
                                </div>
                                <div className="text-xs text-gray-400">
                                  Query Coverage
                                </div>
                              </div>
                              <div className="text-center p-3 bg-gray-600/30 rounded">
                                <div className="text-2xl font-bold text-green-400">
                                  {
                                    selectedDemoContent.ai_readiness_analysis
                                      .conversion_optimization
                                  }
                                  %
                                </div>
                                <div className="text-xs text-gray-400">
                                  Conversion Opt.
                                </div>
                              </div>
                              <div className="text-center p-3 bg-gray-600/30 rounded">
                                <div className="text-2xl font-bold text-purple-400">
                                  {
                                    selectedDemoContent.ai_readiness_analysis
                                      .content_clarity
                                  }
                                  %
                                </div>
                                <div className="text-xs text-gray-400">
                                  Content Clarity
                                </div>
                              </div>
                              <div className="text-center p-3 bg-gray-600/30 rounded">
                                <div className="text-2xl font-bold text-yellow-400">
                                  {
                                    selectedDemoContent.ai_readiness_analysis
                                      .keyword_optimization
                                  }
                                  %
                                </div>
                                <div className="text-xs text-gray-400">
                                  Keyword Opt.
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Performance Metrics (for Ads) */}
                      {"performance_metrics" in selectedDemoContent && (
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h3 className="font-semibold text-white mb-4">
                            Performance Data
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">
                                AI Mentions/Month:
                              </span>
                              <span className="ml-2 font-bold text-white">
                                {
                                  selectedDemoContent.performance_metrics
                                    .ai_mention_frequency
                                }
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">CTR:</span>
                              <span className="ml-2 font-bold text-white">
                                {
                                  selectedDemoContent.performance_metrics
                                    .click_through_rate
                                }
                                %
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">
                                Conversion Rate:
                              </span>
                              <span className="ml-2 font-bold text-white">
                                {
                                  selectedDemoContent.performance_metrics
                                    .conversion_rate
                                }
                                %
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Engagement:</span>
                              <span className="ml-2 font-bold text-white">
                                {
                                  selectedDemoContent.performance_metrics
                                    .engagement_rate
                                }
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Keywords & Insights */}
                    <div className="space-y-6">
                      {/* Target Keywords */}
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">
                          Target Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {"content" in selectedDemoContent &&
                          "keywords" in selectedDemoContent.content
                            ? selectedDemoContent.content.keywords.map(
                                (keyword: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-900/30 text-blue-300 text-sm rounded-full border border-blue-700/30"
                                  >
                                    {keyword}
                                  </span>
                                )
                              )
                            : "seo_optimization" in selectedDemoContent
                            ? selectedDemoContent.seo_optimization.target_keywords.map(
                                (keyword: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-900/30 text-blue-300 text-sm rounded-full border border-blue-700/30"
                                  >
                                    {keyword}
                                  </span>
                                )
                              )
                            : null}
                        </div>
                      </div>

                      {/* AI Query Coverage */}
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">
                          AI Query Matches
                        </h3>
                        <div className="space-y-2">
                          {"ai_optimization" in selectedDemoContent
                            ? selectedDemoContent.ai_optimization.query_coverage.map(
                                (query: string, index: number) => (
                                  <div
                                    key={index}
                                    className="text-sm text-gray-300 p-2 bg-gray-600/30 rounded"
                                  >
                                    "{query}"
                                  </div>
                                )
                              )
                            : "ai_readiness_analysis" in selectedDemoContent
                            ? selectedDemoContent.ai_readiness_analysis.ai_discovery_potential.query_matches.map(
                                (query: string, index: number) => (
                                  <div
                                    key={index}
                                    className="text-sm text-gray-300 p-2 bg-gray-600/30 rounded"
                                  >
                                    "{query}"
                                  </div>
                                )
                              )
                            : null}
                        </div>
                      </div>

                      {/* Strengths & Opportunities */}
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">
                          Optimization Insights
                        </h3>

                        {/* Strengths */}
                        {"ai_readiness_analysis" in selectedDemoContent && (
                          <div className="mb-4">
                            <h4 className="font-medium text-green-400 mb-2">
                              Strengths
                            </h4>
                            <ul className="space-y-1 text-sm">
                              {selectedDemoContent.ai_readiness_analysis.strengths.map(
                                (strength: string, index: number) => (
                                  <li
                                    key={index}
                                    className="text-gray-300 flex items-center"
                                  >
                                    <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                                    {strength}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Improvement Areas */}
                        <div>
                          <h4 className="font-medium text-yellow-400 mb-2">
                            Optimization Opportunities
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {"ai_optimization" in selectedDemoContent
                              ? selectedDemoContent.ai_optimization.optimization_opportunities.map(
                                  (opp: string, index: number) => (
                                    <li
                                      key={index}
                                      className="text-gray-300 flex items-center"
                                    >
                                      <TrendingUp className="h-3 w-3 text-yellow-400 mr-2 flex-shrink-0" />
                                      {opp}
                                    </li>
                                  )
                                )
                              : "ai_readiness_analysis" in selectedDemoContent
                              ? selectedDemoContent.ai_readiness_analysis.improvement_areas.map(
                                  (area: string, index: number) => (
                                    <li
                                      key={index}
                                      className="text-gray-300 flex items-center"
                                    >
                                      <TrendingUp className="h-3 w-3 text-yellow-400 mr-2 flex-shrink-0" />
                                      {area}
                                    </li>
                                  )
                                )
                              : null}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendations - Full Width Section */}
                  <div className="mt-8 bg-gradient-to-br from-blue-900/10 to-purple-900/10 border border-blue-700/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <Lightbulb className="h-6 w-6 text-blue-400 mr-3" />
                      AI Optimization Recommendations
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Priority Actions */}
                      <div>
                        <h4 className="font-medium text-blue-400 mb-4 flex items-center text-lg">
                          <Target className="h-5 w-5 mr-2" />
                          Priority Actions
                        </h4>
                        <div className="space-y-3">
                          {getRecommendations(selectedDemoContent).priority.map(
                            (rec, index) => (
                              <div
                                key={index}
                                className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 hover:bg-blue-900/30 transition-colors"
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-white text-base mb-2">
                                      {rec.title}
                                    </h5>
                                    <p className="text-blue-200 text-sm leading-relaxed mb-3">
                                      {rec.description}
                                    </p>
                                    <div className="flex items-center space-x-3">
                                      <span className="text-xs bg-blue-800/50 text-blue-300 px-3 py-1 rounded-full font-medium">
                                        Impact: {rec.impact}
                                      </span>
                                      <span className="text-xs bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full font-medium">
                                        Effort: {rec.effort}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Long-term Improvements */}
                      <div>
                        <h4 className="font-medium text-purple-400 mb-4 flex items-center text-lg">
                          <TrendingUp className="h-5 w-5 mr-2" />
                          Long-term Improvements
                        </h4>
                        <div className="space-y-3">
                          {getRecommendations(selectedDemoContent).longTerm.map(
                            (rec, index) => (
                              <div
                                key={index}
                                className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4 hover:bg-purple-900/30 transition-colors"
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-white text-base mb-2">
                                      {rec.title}
                                    </h5>
                                    <p className="text-purple-200 text-sm leading-relaxed mb-3">
                                      {rec.description}
                                    </p>
                                    <div className="flex items-center space-x-3">
                                      <span className="text-xs bg-purple-800/50 text-purple-300 px-3 py-1 rounded-full font-medium">
                                        Impact: {rec.impact}
                                      </span>
                                      <span className="text-xs bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full font-medium">
                                        Timeline: {rec.timeline}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 pt-6 border-t border-gray-700 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowDemoModal(false);
                        setSelectedDemoContent(null);
                        setActiveModalTab("analysis");
                      }}
                      className="btn-secondary"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleGenerateReport}
                      disabled={isGeneratingReport}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {isGeneratingReport ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Generate Report</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Metadata & Details Tab */}
              {activeModalTab === "metadata" && (
                <div className="space-y-6">
                  {/* File Metadata */}
                  {"visual_metrics" in selectedDemoContent && (
                    <div className="bg-gray-700/50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <Database className="h-6 w-6 text-blue-400 mr-3" />
                        File Metadata
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium text-blue-400 mb-3">
                            File Properties
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Filename:</span>
                              <span className="text-white">
                                {selectedDemoContent.filename}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">File Type:</span>
                              <span className="text-white">
                                {selectedDemoContent.file_type}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Dimensions:</span>
                              <span className="text-white">
                                {selectedDemoContent.visual_metrics.dimensions}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">File Size:</span>
                              <span className="text-white">
                                {selectedDemoContent.visual_metrics.file_size}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Resolution:</span>
                              <span className="text-white">
                                {selectedDemoContent.visual_metrics.resolution}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Color Depth:
                              </span>
                              <span className="text-white">
                                {selectedDemoContent.visual_metrics.color_depth}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-green-400 mb-3">
                            Content Analysis
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                OCR Confidence:
                              </span>
                              <span className="text-white">
                                {selectedDemoContent.ai_analysis.ocr_confidence}
                                %
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Text Quality:
                              </span>
                              <span className="text-white">
                                {
                                  selectedDemoContent.ai_analysis
                                    .text_extraction_quality
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Visual Score:
                              </span>
                              <span className="text-white">
                                {
                                  selectedDemoContent.ai_analysis
                                    .visual_composition_score
                                }
                                %
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Brand Recognition:
                              </span>
                              <span className="text-white">
                                {
                                  selectedDemoContent.ai_analysis
                                    .brand_recognition_accuracy
                                }
                                %
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-purple-400 mb-3">
                            Performance Metrics
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Engagement:</span>
                              <span className="text-white">
                                {
                                  selectedDemoContent.performance_data
                                    .estimated_engagement
                                }
                                /10
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Visual Appeal:
                              </span>
                              <span className="text-white">
                                {
                                  selectedDemoContent.performance_data
                                    .visual_appeal_score
                                }
                                %
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Message Clarity:
                              </span>
                              <span className="text-white">
                                {
                                  selectedDemoContent.performance_data
                                    .message_clarity
                                }
                                %
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                CTA Prominence:
                              </span>
                              <span className="text-white">
                                {
                                  selectedDemoContent.performance_data
                                    .call_to_action_prominence
                                }
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Extracted Content */}
                  {"content" in selectedDemoContent && (
                    <div className="bg-gray-700/50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <FileText className="h-6 w-6 text-green-400 mr-3" />
                        Extracted Content Analysis
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-blue-400 mb-3">
                            Text Extraction
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-gray-400 text-sm">
                                Primary Message:
                              </span>
                              <p className="text-white bg-gray-600/30 p-3 rounded mt-1 text-sm">
                                "{selectedDemoContent.content.primary_text}"
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">
                                All Extracted Text:
                              </span>
                              <div className="bg-gray-600/30 p-3 rounded mt-1 max-h-48 overflow-y-auto">
                                {selectedDemoContent.content.extracted_text.map(
                                  (text: string, index: number) => (
                                    <div
                                      key={index}
                                      className="text-white text-sm mb-1"
                                    >
                                      • {text}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-green-400 mb-3">
                            Visual Elements
                          </h4>
                          <div className="bg-gray-600/30 p-3 rounded max-h-48 overflow-y-auto">
                            {selectedDemoContent.content.visual_elements.map(
                              (element: string, index: number) => (
                                <div
                                  key={index}
                                  className="text-white text-sm mb-1"
                                >
                                  • {element}
                                </div>
                              )
                            )}
                          </div>

                          <h4 className="font-medium text-purple-400 mb-3 mt-4">
                            Brand Elements
                          </h4>
                          <div className="bg-gray-600/30 p-3 rounded">
                            {selectedDemoContent.content.brand_elements.map(
                              (brand: string, index: number) => (
                                <div
                                  key={index}
                                  className="text-white text-sm mb-1"
                                >
                                  • {brand}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Color and Composition Analysis */}
                  {"ai_analysis" in selectedDemoContent && (
                    <div className="bg-gray-700/50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <Layers className="h-6 w-6 text-yellow-400 mr-3" />
                        Visual Analysis Details
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-blue-400 mb-3">
                            Color Analysis
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-gray-400 text-sm">
                                Dominant Colors:
                              </span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {selectedDemoContent.ai_analysis.color_analysis.dominant_colors.map(
                                  (color: string, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2"
                                    >
                                      <div
                                        className="w-6 h-6 rounded border border-gray-500"
                                        style={{ backgroundColor: color }}
                                      ></div>
                                      <span className="text-white text-xs">
                                        {color}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">
                                Color Harmony:
                              </span>
                              <p className="text-white text-sm mt-1">
                                {
                                  selectedDemoContent.ai_analysis.color_analysis
                                    .color_harmony
                                }
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">
                                Brand Consistency:
                              </span>
                              <p className="text-white text-sm mt-1">
                                {
                                  selectedDemoContent.ai_analysis.color_analysis
                                    .brand_consistency
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-green-400 mb-3">
                            Composition Analysis
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="text-gray-400">
                                Focal Points:
                              </span>
                              <div className="bg-gray-600/30 p-2 rounded mt-1">
                                {selectedDemoContent.ai_analysis.composition_analysis.focal_points.map(
                                  (point: string, index: number) => (
                                    <div
                                      key={index}
                                      className="text-white mb-1"
                                    >
                                      • {point}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Visual Hierarchy:
                              </span>
                              <span className="text-white">
                                {
                                  selectedDemoContent.ai_analysis
                                    .composition_analysis.visual_hierarchy
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Rule of Thirds:
                              </span>
                              <span className="text-white">
                                {
                                  selectedDemoContent.ai_analysis
                                    .composition_analysis.rule_of_thirds
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                White Space:
                              </span>
                              <span className="text-white">
                                {
                                  selectedDemoContent.ai_analysis
                                    .composition_analysis.white_space_usage
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Analysis Methodology Tab */}
              {activeModalTab === "methodology" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <Search className="h-6 w-6 text-blue-400 mr-3" />
                      AI Analysis Methodology
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-blue-400 mb-3 flex items-center">
                            <Eye className="h-5 w-5 mr-2" />
                            Visual Content Analysis
                          </h4>
                          <div className="space-y-3 text-sm text-gray-300">
                            <p>
                              <strong className="text-white">
                                OCR (Optical Character Recognition):
                              </strong>{" "}
                              Advanced text extraction using machine learning
                              models trained on diverse image datasets.
                              Confidence scores indicate accuracy of text
                              detection and extraction.
                            </p>
                            <p>
                              <strong className="text-white">
                                Visual Composition:
                              </strong>{" "}
                              Analysis of design principles including focal
                              points, visual hierarchy, color harmony, and
                              layout balance using computer vision algorithms.
                            </p>
                            <p>
                              <strong className="text-white">
                                Brand Recognition:
                              </strong>{" "}
                              AI-powered identification of logos, brand
                              elements, and visual identity components through
                              pattern matching and feature detection.
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-green-400 mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Content Quality Assessment
                          </h4>
                          <div className="space-y-3 text-sm text-gray-300">
                            <p>
                              <strong className="text-white">
                                Readability Analysis:
                              </strong>{" "}
                              Natural language processing to assess text
                              complexity, sentence structure, and vocabulary
                              level for target audience appropriateness.
                            </p>
                            <p>
                              <strong className="text-white">
                                Semantic Relevance:
                              </strong>{" "}
                              Evaluation of content meaning, context, and
                              topical alignment using transformer-based language
                              models.
                            </p>
                            <p>
                              <strong className="text-white">
                                Query Coverage:
                              </strong>{" "}
                              Analysis of how well content answers potential
                              user queries through semantic similarity matching.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-purple-400 mb-3 flex items-center">
                            <Brain className="h-5 w-5 mr-2" />
                            AI Optimization Scoring
                          </h4>
                          <div className="space-y-3 text-sm text-gray-300">
                            <p>
                              <strong className="text-white">
                                Algorithm Integration:
                              </strong>{" "}
                              Multi-layer analysis combining computer vision,
                              natural language processing, and machine learning
                              models for comprehensive content evaluation.
                            </p>
                            <p>
                              <strong className="text-white">
                                Performance Prediction:
                              </strong>{" "}
                              Statistical models trained on engagement data to
                              predict content effectiveness and user interaction
                              likelihood.
                            </p>
                            <p>
                              <strong className="text-white">
                                Continuous Learning:
                              </strong>{" "}
                              Models updated regularly with new data to improve
                              accuracy and adapt to changing AI search patterns.
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-yellow-400 mb-3 flex items-center">
                            <Target className="h-5 w-5 mr-2" />
                            Recommendation Engine
                          </h4>
                          <div className="space-y-3 text-sm text-gray-300">
                            <p>
                              <strong className="text-white">
                                Gap Analysis:
                              </strong>{" "}
                              Identification of content weaknesses through
                              comparison with high-performing similar content
                              and industry benchmarks.
                            </p>
                            <p>
                              <strong className="text-white">
                                Optimization Opportunities:
                              </strong>{" "}
                              AI-generated suggestions based on proven
                              improvement patterns and search algorithm
                              preferences.
                            </p>
                            <p>
                              <strong className="text-white">
                                Impact Assessment:
                              </strong>{" "}
                              Prioritization of recommendations based on
                              potential improvement impact and implementation
                              effort.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 text-blue-400 mr-2" />
                      Technical Implementation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-blue-900/20 border border-blue-700/30 rounded p-4">
                        <h4 className="font-medium text-blue-400 mb-2">
                          Image Processing
                        </h4>
                        <ul className="text-gray-300 space-y-1">
                          <li>• OpenCV for image preprocessing</li>
                          <li>• TensorFlow for visual analysis</li>
                          <li>• Tesseract OCR engine</li>
                          <li>• Custom CNN models</li>
                        </ul>
                      </div>
                      <div className="bg-green-900/20 border border-green-700/30 rounded p-4">
                        <h4 className="font-medium text-green-400 mb-2">
                          Text Analysis
                        </h4>
                        <ul className="text-gray-300 space-y-1">
                          <li>• BERT/GPT transformers</li>
                          <li>• Sentiment analysis</li>
                          <li>• Named entity recognition</li>
                          <li>• Semantic similarity models</li>
                        </ul>
                      </div>
                      <div className="bg-purple-900/20 border border-purple-700/30 rounded p-4">
                        <h4 className="font-medium text-purple-400 mb-2">
                          Performance ML
                        </h4>
                        <ul className="text-gray-300 space-y-1">
                          <li>• Gradient boosting models</li>
                          <li>• Neural network ensembles</li>
                          <li>• A/B testing data integration</li>
                          <li>• Real-time scoring APIs</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Image Viewer */}
      {showImageViewer && fullScreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowImageViewer(false);
                setFullScreenImage(null);
              }}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
              title="Close (Press Esc)"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Image Title */}
            <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              <h3 className="font-medium text-lg">{fullScreenImage.title}</h3>
            </div>

            {/* Full-Screen Image */}
            <img
              src={fullScreenImage.url}
              alt={fullScreenImage.title}
              className="max-w-full max-h-full object-contain cursor-pointer"
              onClick={() => {
                setShowImageViewer(false);
                setFullScreenImage(null);
              }}
              title="Click to close"
            />

            {/* Navigation hint */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
              Click image or press Esc to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentAssets;
