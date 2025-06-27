// Content & Assets Management Page
// Dedicated page for DAM integration and content management
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useCallback } from "react";
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
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import DAMIntegration from "../components/DAMIntegration";
import DAMContentAnalysis from "../components/DAMContentAnalysis";
import FileUpload from "../components/FileUpload";
import UploadConfirmation from "../components/UploadConfirmation";
import AnalysisResults from "../components/AnalysisResults";
import ActionableInsights from "../components/ActionableInsights";
import { DAMAsset } from "../services/damIntegration";
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
    "overview" | "dam" | "library" | "analysis"
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

  const supportedFormats = [
    {
      type: "PDF",
      icon: FileText,
      description: "PDF documents, reports, guides",
      color: "text-red-400",
      bgColor: "bg-red-900/20",
    },
    {
      type: "Email",
      icon: Mail,
      description: "HTML emails, newsletters",
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
    },
    {
      type: "Web Copy",
      icon: Globe,
      description: "HTML content, landing pages",
      color: "text-green-400",
      bgColor: "bg-green-900/20",
    },
    {
      type: "Training",
      icon: BookOpen,
      description: "DOCX, training materials",
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
          <button className="btn-secondary flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload Files</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
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

          {/* Assets Display */}
          {damAssets.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {damAssets.map((asset) => (
                <div
                  key={asset.id}
                  className={`bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors ${
                    viewMode === "list"
                      ? "p-4 flex items-center space-x-4"
                      : "p-6"
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      viewMode === "list"
                        ? "space-x-4 flex-1"
                        : "justify-between mb-4"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getFileTypeIcon(asset.fileType)}
                      <div>
                        <h3 className="font-medium text-white truncate">
                          {asset.name}
                        </h3>
                        {viewMode === "grid" && (
                          <p className="text-sm text-gray-400">
                            {asset.fileType.toUpperCase()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-blue-400">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-green-400">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {viewMode === "grid" && (
                    <>
                      <div className="text-sm text-gray-400 space-y-1 mb-4">
                        <div>Size: {formatFileSize(asset.size)}</div>
                        <div>
                          Modified: {asset.lastModified.toLocaleDateString()}
                        </div>
                        {asset.author && <div>Author: {asset.author}</div>}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {asset.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {asset.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                            +{asset.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {viewMode === "list" && (
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <span>{formatFileSize(asset.size)}</span>
                      <span>{asset.lastModified.toLocaleDateString()}</span>
                      <div className="flex flex-wrap gap-1">
                        {asset.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
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
    </div>
  );
};

export default ContentAssets;
