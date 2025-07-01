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
  Plus,
  Upload,
  X,
  File,
  FileImage,
  FileSpreadsheet,
} from "lucide-react";
import { getIndustryById } from "../utils/industryData";
import IndustrySelector from "../components/IndustrySelector";
import LLMConfiguration from "../components/LLMConfiguration";
import demoContentService, {
  DemoAdvertisement,
  DemoLandingPage,
  DemoImage,
} from "../services/demoContent";

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

  // Content management states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userContentChunks, setUserContentChunks] = useState<ContentChunk[]>(
    []
  );

  // Get pharmaceutical content from demo content library
  const createContentChunksFromDemoContent = (): ContentChunk[] => {
    const chunks: ContentChunk[] = [];

    // Check if we're running locally
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "";

    if (isLocalhost) {
      // Get demo content
      const advertisements = demoContentService.getAdvertisements();
      const landingPages = demoContentService.getLandingPages();
      const images = demoContentService.getImages();

      // Convert advertisements to content chunks
      advertisements.forEach((ad, index) => {
        chunks.push({
          id: `ad-${index + 1}`,
          title: ad.title,
          content: `${ad.content.headline}\n\n${
            ad.content.description
          }\n\nCall to Action: ${ad.content.cta}\n\nBody Text: ${
            ad.content.body_text
          }\n\nKey Benefits: ${ad.content.benefits?.join(
            ", "
          )}\n\nTarget Keywords: ${ad.content.keywords?.join(", ")}`,
          source: `${ad.platform} Advertisement`,
          type: "product_info",
          lastUpdated: "2024-01-15",
        });
      });

      // Convert landing pages to content chunks
      landingPages.forEach((page, index) => {
        chunks.push({
          id: `page-${index + 1}`,
          title: page.title,
          content: `${page.content.main_headline}\n\n${
            page.content.subheadline
          }\n\nHero Text: ${
            page.content.hero_text
          }\n\nKey Features: ${page.content.key_features?.join(
            ", "
          )}\n\nSocial Proof: ${page.content.social_proof}\n\nPrimary CTA: ${
            page.content.cta_primary
          }\n\nSecondary CTA: ${page.content.cta_secondary}`,
          source: `Landing Page - Pharmaceutical`,
          type: "product_info",
          lastUpdated: "2024-01-16",
        });
      });

      // Convert images to content chunks
      images.forEach((image, index) => {
        chunks.push({
          id: `img-${index + 1}`,
          title: image.title,
          content: `Primary Message: ${
            image.content.primary_text
          }\n\nExtracted Text: ${image.content.extracted_text?.join(
            ", "
          )}\n\nVisual Elements: ${image.content.visual_elements?.join(
            ", "
          )}\n\nBrand Elements: ${image.content.brand_elements?.join(
            ", "
          )}\n\nTarget Queries: ${image.ai_optimization?.query_coverage?.join(
            ", "
          )}`,
          source: `${image.format} - Visual Content`,
          type: "product_info",
          lastUpdated: "2024-01-17",
        });
      });
    }

    // Add pharmaceutical-specific content chunks for better coverage
    chunks.push(
      {
        id: "pharma-1",
        title: "Loramin Allergy Medication - Dosage Information",
        content:
          "Loramin (Loratadine) is an antihistamine for treating seasonal and perennial allergic rhinitis and allergic conjunctivitis. Standard adult dosage is 10mg once daily. For children 6-12 years: 5mg once daily. Can be taken with or without food. Do not exceed recommended dosage.",
        source: "Loramin Prescribing Information",
        type: "product_info",
        lastUpdated: "2024-01-15",
      },
      {
        id: "pharma-2",
        title: "ERASTAPEX TRIO - Hypertension Management",
        content:
          "ERASTAPEX TRIO combines Erastapex/Amlodipine/HCT (40mg/5mg/12.5mg) for comprehensive blood pressure control. Triple combination therapy for patients requiring multiple antihypertensive agents. Monitor blood pressure regularly. Contains 30 film-coated tablets per package.",
        source: "ERASTAPEX TRIO Product Information",
        type: "product_info",
        lastUpdated: "2024-01-16",
      },
      {
        id: "pharma-3",
        title: "LDL Cholesterol Management - Beyond Statins",
        content:
          "For patients with poorly controlled LDL-C despite statin therapy, additional treatment options are available. Millions of high-risk patients with hypercholesterolemia continue to have elevated LDL-C levels. Sanofi and Regeneron provide comprehensive resources for lipid management.",
        source: "Cholesterol Management Guidelines",
        type: "clinical",
        lastUpdated: "2024-01-17",
      },
      {
        id: "pharma-4",
        title: "Pharmaceutical Safety Information",
        content:
          "All pharmaceutical products require proper safety information disclosure. Report adverse events promptly. Ensure patient counseling on proper medication use, potential side effects, and drug interactions. Maintain regulatory compliance in all marketing materials.",
        source: "FDA Safety Guidelines",
        type: "compliance",
        lastUpdated: "2024-01-14",
      },
      {
        id: "pharma-5",
        title: "Patient Education Resources",
        content:
          "Effective patient education improves medication adherence and outcomes. Provide clear instructions on dosage timing, administration methods, and lifestyle modifications. Include information about when to contact healthcare providers.",
        source: "Patient Education Guidelines",
        type: "faq",
        lastUpdated: "2024-01-13",
      }
    );

    return chunks;
  };

  const mockContentChunks = createContentChunksFromDemoContent();
  const originalMockContentChunks = mockContentChunks; // Keep reference for confidence calculation

  // Combine mock content with user content
  const allContentChunks = [...mockContentChunks, ...userContentChunks];

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
    const scoredChunks = allContentChunks
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

  const examplePrompts = [
    "What is the correct Loramin dosage for adults?",
    "How does ERASTAPEX TRIO help with blood pressure?",
    "What are the side effects of Loramin?",
    "Can I take ERASTAPEX TRIO with other medications?",
    "How should I manage LDL cholesterol beyond statins?",
    "What safety information should patients know?",
    "How often should blood pressure be monitored?",
    "What allergy symptoms does Loramin treat?",
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

  // Content management functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const processUploadedFiles = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file processing
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create content chunk from file
      const contentChunk: ContentChunk = {
        id: `user-${Date.now()}-${i}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        content: `Content extracted from ${file.name}. This is a sample content chunk that would be created from your uploaded file. In a real implementation, this would use OCR, text extraction, or other processing methods to extract actual content from the file.`,
        source: `Uploaded: ${file.name}`,
        type: inferContentType(file),
        lastUpdated: new Date().toISOString().split("T")[0],
      };

      setUserContentChunks((prev) => [...prev, contentChunk]);
      setUploadProgress(((i + 1) / uploadedFiles.length) * 100);
    }

    setIsUploading(false);
    setUploadedFiles([]);
    setShowUploadModal(false);
  };

  const inferContentType = (file: File): ContentChunk["type"] => {
    const name = file.name.toLowerCase();
    if (name.includes("faq") || name.includes("question")) return "faq";
    if (name.includes("train") || name.includes("guide")) return "training";
    if (name.includes("compliance") || name.includes("policy"))
      return "compliance";
    if (name.includes("clinical") || name.includes("study")) return "clinical";
    return "product_info";
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith("image/")) return <FileImage className="h-4 w-4" />;
    if (type.includes("spreadsheet") || type.includes("excel"))
      return <FileSpreadsheet className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const removeUserContent = (id: string) => {
    setUserContentChunks((prev) => prev.filter((chunk) => chunk.id !== id));
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
              Content Library - What Gets Tested
            </h2>
            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-sm rounded-full">
              {allContentChunks.length} content pieces
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Content</span>
            </button>
            <button
              onClick={() => setShowContentLibrary(!showContentLibrary)}
              className="btn-secondary flex items-center space-x-2"
            >
              {showContentLibrary ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span>Hide Details</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>Show Details</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Always visible content summary */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-300 mb-2">
            📋 What Content Is Being Tested Against Your Prompts:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-800/50 rounded p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span>📋</span>
                <span className="font-medium text-white">Product Info</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {
                    allContentChunks.filter((c) => c.type === "product_info")
                      .length
                  }
                </span>
              </div>
              <p className="text-gray-300 text-xs">
                Pharmaceutical products: Loramin, ERASTAPEX TRIO, LDL
                cholesterol management
              </p>
            </div>

            <div className="bg-gray-800/50 rounded p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span>🩺</span>
                <span className="font-medium text-white">Clinical Info</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  {allContentChunks.filter((c) => c.type === "clinical").length}
                </span>
              </div>
              <p className="text-gray-300 text-xs">
                Clinical guidelines, treatment protocols, safety information
              </p>
            </div>

            <div className="bg-gray-800/50 rounded p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span>⚖️</span>
                <span className="font-medium text-white">Compliance</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  {
                    allContentChunks.filter((c) => c.type === "compliance")
                      .length
                  }
                </span>
              </div>
              <p className="text-gray-300 text-xs">
                FDA guidelines, regulatory requirements, safety protocols
              </p>
            </div>

            <div className="bg-gray-800/50 rounded p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span>❓</span>
                <span className="font-medium text-white">FAQ Content</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {allContentChunks.filter((c) => c.type === "faq").length}
                </span>
              </div>
              <p className="text-gray-300 text-xs">
                Common questions, patient education, usage instructions
              </p>
            </div>

            <div className="bg-gray-800/50 rounded p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span>🎓</span>
                <span className="font-medium text-white">Training</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {allContentChunks.filter((c) => c.type === "training").length}
                </span>
              </div>
              <p className="text-gray-300 text-xs">
                Training materials, educational guides, best practices
              </p>
            </div>

            {userContentChunks.length > 0 && (
              <div className="bg-gray-800/50 rounded p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span>📁</span>
                  <span className="font-medium text-white">Your Content</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {userContentChunks.length}
                  </span>
                </div>
                <p className="text-gray-300 text-xs">
                  Content you've uploaded for testing
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-400 mb-4">
          <strong>How it works:</strong> When you enter a prompt, the simulator
          compares it against all {allContentChunks.length} content pieces above
          using keyword matching to find the best match. The similarity score
          shows how well your prompt matches each piece of content.
          {userContentChunks.length === 0 && (
            <span className="text-blue-400">
              {" "}
              Click "Add Content" to test your own materials alongside the
              pharmaceutical demo content.
            </span>
          )}
        </div>

        {showContentLibrary && (
          <div className="space-y-3">
            {allContentChunks.map((chunk) => (
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
                        {chunk.id.startsWith("user-") && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Your Content
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span>Source: {chunk.source}</span>
                        <span>•</span>
                        <span>Updated: {chunk.lastUpdated}</span>
                        <span>•</span>
                        <span>
                          Confidence:{" "}
                          {chunk.id.startsWith("user-")
                            ? "95"
                            : chunk.id.startsWith("pharma-")
                            ? "92"
                            : "88"}
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

                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => toggleChunkExpansion(chunk.id)}
                        className="flex items-center space-x-1 px-3 py-1 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded"
                      >
                        <Eye className="h-3 w-3" />
                        <span>
                          {expandedChunks.has(chunk.id) ? "Collapse" : "Expand"}
                        </span>
                      </button>
                      {chunk.id.startsWith("user-") && (
                        <button
                          onClick={() => removeUserContent(chunk.id)}
                          className="flex items-center space-x-1 px-3 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
                        >
                          <X className="h-3 w-3" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
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
            {examplePrompts.map((example: string, index: number) => (
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

          {/* Primary Result */}
          <div className="bg-gray-800/50 border border-green-500/30 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-medium text-white">
                    Best Match Found
                  </h3>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getConfidenceColor(
                      result.confidenceLevel
                    )}`}
                  >
                    {result.confidenceLevel} confidence
                  </span>
                </div>

                {/* Content source indicator */}
                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-300 font-medium">
                      📄 Matched Content:
                    </span>
                    <span className="text-white font-semibold">
                      {result.topMatch.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-blue-200">
                    <span>Source: {result.topMatch.source}</span>
                    <span>•</span>
                    <span>Type: {result.topMatch.type.replace("_", " ")}</span>
                    <span>•</span>
                    <span>Updated: {result.topMatch.lastUpdated}</span>
                  </div>
                </div>

                <h4 className="font-medium text-white mb-2">AI Response:</h4>
                <p className="text-gray-300 leading-relaxed">
                  {result.response}
                </p>
              </div>
              <div className="ml-6 text-right">
                <div className="bg-gray-700 rounded-lg p-3">
                  <span
                    className={`text-2xl font-bold ${getScoreColor(
                      result.similarityScore
                    )}`}
                  >
                    {result.similarityScore.toFixed(1)}%
                  </span>
                  <p className="text-xs text-gray-400 mt-1">similarity</p>
                </div>
              </div>
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Add Content to Library
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedFiles([]);
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
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="btn-primary inline-flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Choose Files</span>
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">
                    Files to Process ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-blue-400">
                            {getFileIcon(file)}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {file.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeUploadedFile(index)}
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
                      Processing files...
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
                    setUploadedFiles([]);
                  }}
                  className="btn-secondary"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  onClick={processUploadedFiles}
                  disabled={uploadedFiles.length === 0 || isUploading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="h-4 w-4" />
                  <span>
                    {isUploading
                      ? "Processing..."
                      : `Process ${uploadedFiles.length} file(s)`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptSimulator;
