// LLM Configuration and Testing Component
// Allows users to configure API keys and run real LLM tests

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Play,
  Key,
  Settings,
  Upload,
  FileText,
  Eye,
  Loader2,
  TrendingUp,
  Zap,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  RefreshCw,
  X,
  Plus,
  Edit3,
  Check,
} from "lucide-react";
import LLMConfigManager, { DEFAULT_MODELS } from "../services/llmConfig";
import LLMTestingService, {
  ContentAnalysisReport,
  CompetitiveAnalysisResult,
} from "../services/llmTesting";
import LLMTestResults from "./LLMTestResults";
import ContentPreview from "./ContentPreview";
import demoContentService, {
  DemoAdvertisement,
  DemoLandingPage,
  DemoImage,
} from "../services/demoContent";

interface Props {
  selectedIndustry: string;
  onTestComplete?: (report: ContentAnalysisReport) => void;
}

interface UploadedContent {
  id: string;
  name: string;
  content: string;
  type: string;
  uploadDate: Date;
}

const LLMConfiguration: React.FC<Props> = ({
  selectedIndustry,
  onTestComplete,
}) => {
  const [configManager] = useState(() => new LLMConfigManager());
  const [testingService, setTestingService] = useState(
    () => new LLMTestingService()
  );
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [testResults, setTestResults] = useState<ContentAnalysisReport | null>(
    null
  );
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<UploadedContent | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Configuration state
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    google: "",
    replicate: "",
    together: "",
  });
  const [selectedModels, setSelectedModels] = useState<{
    [provider: string]: string[];
  }>({});
  const [configuredProviders, setConfiguredProviders] = useState<string[]>([]);

  // Test configuration state
  const [selectedContent, setSelectedContent] = useState<UploadedContent[]>([]);
  const [promptCount, setPromptCount] = useState(5);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedContent[]>([]);

  const [competitiveResults, setCompetitiveResults] = useState<
    CompetitiveAnalysisResult[] | null
  >(null);
  const [isRunningCompetitiveTest, setIsRunningCompetitiveTest] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [selectedCompetitiveContent, setSelectedCompetitiveContent] = useState<
    UploadedContent[]
  >([]);
  const [showCompetitiveTooltip, setShowCompetitiveTooltip] = useState(false);
  const [showCustomTestTooltip, setShowCustomTestTooltip] = useState(false);

  // Custom prompts state
  const [customPrompts, setCustomPrompts] = useState<string[]>([]);
  const [newPrompt, setNewPrompt] = useState("");
  const [promptMode, setPromptMode] = useState<"generated" | "custom" | "both">(
    "generated"
  );
  const [editingPromptIndex, setEditingPromptIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    // Ensure we have a fresh testing service instance
    setTestingService(new LLMTestingService());

    // Load existing configuration
    const providers = configManager.getConfiguredProviders();
    setConfiguredProviders(providers);

    // Load API keys (masked for security)
    const newApiKeys = { ...apiKeys };
    providers.forEach((provider) => {
      const config = configManager.getProvider(provider);
      if (config?.apiKey) {
        newApiKeys[provider as keyof typeof newApiKeys] = "•".repeat(20);
      }
    });
    setApiKeys(newApiKeys);

    // Load selected models
    const newSelectedModels: { [provider: string]: string[] } = {};
    providers.forEach((provider) => {
      newSelectedModels[provider] =
        configManager.getModelsForProvider(provider);
    });
    setSelectedModels(newSelectedModels);

    // Load mock uploaded files with a small delay to ensure demo content service is ready
    setTimeout(() => {
      loadMockUploadedFiles();

      // If no content loaded, try again after a longer delay
      setTimeout(() => {
        if (uploadedFiles.length === 0) {
          console.log("No content found, retrying...");
          loadMockUploadedFiles();
        }
      }, 1000);
    }, 100);
  }, []);

  const loadMockUploadedFiles = () => {
    const mockFiles: UploadedContent[] = [];

    // Check if we're running locally to load pharmaceutical demo content
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "";

    console.log("Loading content, isLocalhost:", isLocalhost);

    if (isLocalhost) {
      try {
        // Get pharmaceutical demo content
        const advertisements = demoContentService.getAdvertisements();
        const landingPages = demoContentService.getLandingPages();
        const images = demoContentService.getImages();

        console.log("Demo content loaded:", {
          ads: advertisements.length,
          pages: landingPages.length,
          images: images.length,
        });

        // Convert advertisements to content files
        advertisements.forEach((ad, index) => {
          mockFiles.push({
            id: `ad-${index + 1}`,
            name: `${ad.title} - ${ad.platform} Ad`,
            content: `${ad.content.headline}\n\n${
              ad.content.description
            }\n\nCall to Action: ${ad.content.cta}\n\nBody Text: ${
              ad.content.body_text
            }\n\nKey Benefits: ${ad.content.benefits?.join(
              ", "
            )}\n\nTarget Audience: ${
              ad.content.target_audience
            }\n\nKeywords: ${ad.content.keywords?.join(", ")}`,
            type: "advertisement",
            uploadDate: new Date("2024-01-20"),
          });
        });

        // Convert landing pages to content files
        landingPages.forEach((page, index) => {
          mockFiles.push({
            id: `page-${index + 1}`,
            name: page.title,
            content: `${page.content.main_headline}\n\n${
              page.content.subheadline
            }\n\nHero Text: ${
              page.content.hero_text
            }\n\nKey Features: ${page.content.key_features?.join(
              ", "
            )}\n\nSocial Proof: ${page.content.social_proof}\n\nPrimary CTA: ${
              page.content.cta_primary
            }\n\nSecondary CTA: ${page.content.cta_secondary}`,
            type: "landing-page",
            uploadDate: new Date("2024-01-18"),
          });
        });

        // Convert images to content files
        images.forEach((image, index) => {
          mockFiles.push({
            id: `img-${index + 1}`,
            name: image.title,
            content: `Primary Message: ${
              image.content.primary_text
            }\n\nExtracted Text: ${image.content.extracted_text?.join(
              ", "
            )}\n\nVisual Elements: ${image.content.visual_elements?.join(
              ", "
            )}\n\nBrand Elements: ${image.content.brand_elements?.join(
              ", "
            )}\n\nDominant Colors: ${image.ai_analysis?.color_analysis?.dominant_colors?.join(
              ", "
            )}\n\nTarget Queries: ${image.ai_optimization?.query_coverage?.join(
              ", "
            )}\n\nOptimization Opportunities: ${image.ai_optimization?.optimization_opportunities?.join(
              ", "
            )}`,
            type: image.file_type.toLowerCase(),
            uploadDate: new Date("2024-01-22"),
          });
        });
      } catch (error) {
        console.error("Error loading demo content:", error);
      }
    }

    // Add pharmaceutical-specific content for comprehensive testing
    const pharmaceuticalContent: UploadedContent[] = [
      {
        id: "pharma-1",
        name: "Loramin Allergy Medication - Product Information",
        content:
          "Loramin (Loratadine) is a second-generation antihistamine for treating seasonal and perennial allergic rhinitis and allergic conjunctivitis. Standard adult dosage: 10mg once daily. Pediatric dosage (6-12 years): 5mg once daily. Can be taken with or without food. Do not exceed recommended dosage. Common side effects may include drowsiness, dry mouth, and fatigue. Contraindications include hypersensitivity to loratadine. ZADA Pharmaceuticals - committed to allergy relief. Available in tablet and syrup formulations.",
        type: "product-info",
        uploadDate: new Date("2024-01-15"),
      },
      {
        id: "pharma-2",
        name: "ERASTAPEX TRIO - Hypertension Management Guide",
        content:
          "ERASTAPEX TRIO combines Olmesartan medoxomil/Amlodipine/Hydrochlorothiazide (40mg/5mg/12.5mg) for comprehensive blood pressure control. Triple combination therapy indicated for patients requiring multiple antihypertensive agents to achieve target blood pressure goals. Monitor blood pressure regularly during treatment. Contains 30 film-coated tablets per package. APEX Pharma - CRASH HYPERTENSION, KEEP IT UNDER CONTROL. Mechanism: ARB blocks angiotensin II receptors, calcium channel blocker relaxes vessels, diuretic reduces fluid retention.",
        type: "product-info",
        uploadDate: new Date("2024-01-16"),
      },
      {
        id: "pharma-3",
        name: "LDL Cholesterol Management - Treatment Guidelines",
        content:
          "For patients with poorly controlled LDL-C despite statin therapy, additional treatment options are available. Millions of high-risk patients with hypercholesterolemia in the US continue to have poorly controlled LDL-C levels. Sanofi and Regeneron are committed to providing comprehensive resources for lipid management. Going beyond today's treatment approaches. Consider combination therapy, lifestyle modifications, and regular monitoring. Target LDL-C levels vary based on cardiovascular risk assessment.",
        type: "clinical-guidelines",
        uploadDate: new Date("2024-01-17"),
      },
      {
        id: "pharma-4",
        name: "Pharmaceutical Safety and Compliance Documentation",
        content:
          "All pharmaceutical products require proper safety information disclosure and regulatory compliance. Report adverse events promptly to appropriate authorities. Ensure patient counseling on proper medication use, potential side effects, and drug interactions. Maintain MLR review for all promotional materials. FDA regulations require accurate and balanced presentation of efficacy and safety data. Healthcare provider education on prescribing guidelines and patient monitoring protocols.",
        type: "compliance",
        uploadDate: new Date("2024-01-14"),
      },
      {
        id: "pharma-5",
        name: "Patient Education and Medication Adherence Resources",
        content:
          "Effective patient education improves medication adherence and clinical outcomes. Provide clear instructions on dosage timing, administration methods, and lifestyle modifications. Include information about when to contact healthcare providers. Address common concerns about side effects and drug interactions. Develop multilingual resources for diverse patient populations. Utilize digital tools and mobile apps to support medication reminders and patient engagement.",
        type: "patient-education",
        uploadDate: new Date("2024-01-13"),
      },
    ];

    mockFiles.push(...pharmaceuticalContent);

    console.log("Total content files loaded:", mockFiles.length);
    console.log(
      "Content files:",
      mockFiles.map((f) => f.name)
    );

    setUploadedFiles(mockFiles);
  };

  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [provider]: value,
    }));
  };

  const handleSaveConfiguration = () => {
    Object.entries(apiKeys).forEach(([provider, apiKey]) => {
      if (apiKey && !apiKey.startsWith("•")) {
        configManager.setProvider(provider, {
          apiKey,
          models: DEFAULT_MODELS[provider as keyof typeof DEFAULT_MODELS] || [],
        });
      }
    });

    setConfiguredProviders(configManager.getConfiguredProviders());

    // Recreate testing service with new configuration
    setTestingService(new LLMTestingService());

    setIsConfigOpen(false);
  };

  const handleModelToggle = (provider: string, model: string) => {
    setSelectedModels((prev) => {
      const current = prev[provider] || [];
      const newSelection = current.includes(model)
        ? current.filter((m) => m !== model)
        : [...current, model];
      return {
        ...prev,
        [provider]: newSelection,
      };
    });
  };

  const handleContentToggle = (content: UploadedContent) => {
    setSelectedContent((prev) => {
      const isSelected = prev.some((c) => c.id === content.id);
      return isSelected
        ? prev.filter((c) => c.id !== content.id)
        : [...prev, content];
    });
  };

  const handlePreviewContent = (content: UploadedContent) => {
    setPreviewContent(content);
    setIsPreviewOpen(true);
  };

  const handleSelectFromPreview = (content: UploadedContent) => {
    handleContentToggle(content);
    setIsPreviewOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newFile: UploadedContent = {
          id: Date.now().toString(),
          name: file.name,
          content: content.substring(0, 2000), // Limit content length
          type: file.type || "unknown",
          uploadDate: new Date(),
        };
        setUploadedFiles((prev) => [...prev, newFile]);
      };
      reader.readAsText(file);
    });
  };

  const generateIndustryPrompts = async () => {
    if (configuredProviders.length === 0) {
      alert("Please configure at least one LLM provider first.");
      return;
    }

    setIsGeneratingPrompts(true);
    try {
      // Create a fresh testing service instance to ensure it has the latest methods
      const freshTestingService = new LLMTestingService();
      const prompts = await freshTestingService.generateIndustryPrompts(
        selectedIndustry,
        promptCount
      );
      setGeneratedPrompts(prompts);
    } catch (error) {
      console.error("Prompt generation failed:", error);
      alert(
        `Failed to generate prompts: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  const getSelectedModelsForTesting = () => {
    const models: { provider: string; model: string }[] = [];
    Object.entries(selectedModels).forEach(([provider, modelList]) => {
      modelList.forEach((model) => {
        models.push({ provider, model });
      });
    });
    return models;
  };

  const handleRunCustomTest = async () => {
    if (configuredProviders.length === 0) {
      alert("Please configure at least one LLM provider before running tests.");
      return;
    }

    if (selectedContent.length === 0) {
      alert("Please select at least one content file to test.");
      return;
    }

    const promptsToTest = getPromptsForTesting();
    if (promptsToTest.length === 0) {
      alert("Please generate industry prompts or add custom prompts first.");
      return;
    }

    setIsTesting(true);
    try {
      const testModels = getSelectedModelsForTesting();
      if (testModels.length === 0) {
        alert("Please select at least one model for testing.");
        return;
      }

      const contentChunks = selectedContent.map((c) => c.content);

      const report = await testingService.testIndustryContent(
        selectedIndustry,
        contentChunks,
        promptsToTest,
        testModels
      );

      setTestResults(report);
      if (onTestComplete) {
        onTestComplete(report);
      }
    } catch (error) {
      console.error("Custom test failed:", error);
      alert(
        `Test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsTesting(false);
    }
  };

  // Keep the original quick test for backward compatibility
  const handleRunTest = async () => {
    if (configuredProviders.length === 0) {
      alert("Please configure at least one LLM provider before running tests.");
      return;
    }

    setIsTesting(true);
    try {
      const report = await testingService.quickTest(selectedIndustry, 3);
      setTestResults(report);
      if (onTestComplete) {
        onTestComplete(report);
      }
    } catch (error) {
      console.error("Test failed:", error);
      alert(
        `Test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsTesting(false);
    }
  };

  const handleCompetitiveAnalysis = async () => {
    if (!testingService) return;

    setIsRunningCompetitiveTest(true);
    try {
      // Use selected competitive content or pharmaceutical demo content
      let contentToTest: string[];

      if (selectedCompetitiveContent.length > 0) {
        contentToTest = selectedCompetitiveContent.map((c) => c.content);
      } else {
        // Use pharmaceutical demo content when nothing is selected
        contentToTest = [
          "Loramin (Loratadine) 10mg - Antihistamine for seasonal allergic rhinitis and allergic conjunctivitis. ZADA Pharmaceuticals. Don't let allergy ruin your day!",
          "ERASTAPEX TRIO (Olmesartan/Amlodipine/HCT) 40mg/5mg/12.5mg - Triple combination therapy for hypertension. CRASH HYPERTENSION - KEEP IT UNDER CONTROL. APEX Pharma.",
          "LDL Cholesterol Management - Poorly controlled LDL-C despite statin therapy. Millions of high-risk patients with hypercholesterolemia. Sanofi and Regeneron resources for lipid management.",
        ];
      }

      const results = await testingService.performCompetitiveAnalysis(
        contentToTest,
        selectedIndustry
      );

      setCompetitiveResults(results);
      setCurrentPage(1); // Reset to first page when new results are loaded
    } catch (error) {
      console.error("Competitive analysis failed:", error);
    } finally {
      setIsRunningCompetitiveTest(false);
    }
  };

  // Pagination logic
  const totalPages = competitiveResults
    ? Math.ceil(competitiveResults.length / resultsPerPage)
    : 0;
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = competitiveResults
    ? competitiveResults.slice(startIndex, endIndex)
    : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleResultsPerPageChange = (newResultsPerPage: number) => {
    setResultsPerPage(newResultsPerPage);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleCompetitiveContentToggle = (content: UploadedContent) => {
    setSelectedCompetitiveContent((prev) => {
      const isSelected = prev.some((c) => c.id === content.id);
      return isSelected
        ? prev.filter((c) => c.id !== content.id)
        : [...prev, content];
    });
  };

  // Custom prompts management functions
  const addCustomPrompt = () => {
    if (newPrompt.trim()) {
      setCustomPrompts((prev) => [...prev, newPrompt.trim()]);
      setNewPrompt("");
    }
  };

  const updateCustomPrompt = (index: number, prompt: string) => {
    setCustomPrompts((prev) =>
      prev.map((p, i) => (i === index ? prompt.trim() : p))
    );
    setEditingPromptIndex(null);
  };

  const deleteCustomPrompt = (index: number) => {
    setCustomPrompts((prev) => prev.filter((_, i) => i !== index));
  };

  const getPromptsForTesting = () => {
    if (promptMode === "custom") {
      return customPrompts;
    } else if (promptMode === "both") {
      return [...generatedPrompts, ...customPrompts];
    } else {
      return generatedPrompts;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            LLM Integration
          </h3>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 hover:text-gray-900"
          >
            <Key className="h-4 w-4" />
            <span>Configure APIs</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isConfigOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Provider Status */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Configured Providers
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.keys(DEFAULT_MODELS).map((provider) => (
            <div
              key={provider}
              className={`p-3 rounded-lg border-2 text-center ${
                configuredProviders.includes(provider)
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                  configuredProviders.includes(provider)
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              />
              <span className="text-xs font-medium text-gray-900 capitalize">
                {provider}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Panel */}
      {isConfigOpen && (
        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            API Configuration
          </h4>
          <div className="space-y-4">
            {Object.entries(DEFAULT_MODELS).map(([provider, models]) => (
              <div
                key={provider}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900 capitalize">
                    {provider}
                  </h5>
                  <span className="text-xs text-gray-500">
                    {models.length} models
                  </span>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeys[provider as keyof typeof apiKeys]}
                    onChange={(e) =>
                      handleApiKeyChange(provider, e.target.value)
                    }
                    placeholder={`Enter ${provider} API key`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Models
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {models.map((model) => (
                      <label
                        key={model}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedModels[provider]?.includes(model) || false
                          }
                          onChange={() => handleModelToggle(provider, model)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{model}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSaveConfiguration}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Custom Test Configuration */}
      <div className="mb-6 border rounded-lg p-4 bg-blue-50">
        <div className="flex items-center space-x-2 mb-4">
          <h4 className="text-sm font-medium text-gray-700">
            Custom Industry Test
          </h4>
          <div className="relative">
            <button
              onMouseEnter={() => setShowCustomTestTooltip(true)}
              onMouseLeave={() => setShowCustomTestTooltip(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            {showCustomTestTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                <div className="font-semibold mb-1">Custom Industry Test</div>
                <div className="space-y-1">
                  <div>
                    • Test your specific content with custom industry prompts
                  </div>
                  <div>
                    • Generate relevant prompts tailored to your industry
                  </div>
                  <div>
                    • Measure how well LLMs understand and respond to your
                    content
                  </div>
                  <div>
                    • Get detailed performance metrics across multiple AI models
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        </div>

        {/* Content Selection */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Content to Test
            </label>
            <label className="flex items-center space-x-2 cursor-pointer text-sm text-blue-600 hover:text-blue-800">
              <Upload className="h-4 w-4" />
              <span>Upload Files</span>
              <input
                type="file"
                multiple
                accept=".txt,.pdf,.doc,.docx,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedContent.some((c) => c.id === file.id)}
                  onChange={() => handleContentToggle(file)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <FileText className="h-4 w-4 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-700 truncate block">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">{file.type}</span>
                </div>
                <button
                  onClick={() => handlePreviewContent(file)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                >
                  <Eye className="h-3 w-3" />
                  <span>Preview</span>
                </button>
              </div>
            ))}
          </div>

          {selectedContent.length > 0 && (
            <p className="text-sm text-green-600 mt-2">
              {selectedContent.length} file(s) selected for testing
            </p>
          )}
        </div>

        {/* Prompt Mode Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Prompt Source
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="generated"
                checked={promptMode === "generated"}
                onChange={(e) => setPromptMode(e.target.value as any)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Generated Prompts Only
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="custom"
                checked={promptMode === "custom"}
                onChange={(e) => setPromptMode(e.target.value as any)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Custom Prompts Only</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="both"
                checked={promptMode === "both"}
                onChange={(e) => setPromptMode(e.target.value as any)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Both</span>
            </label>
          </div>
        </div>

        {/* Generated Prompts Section */}
        {(promptMode === "generated" || promptMode === "both") && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry Prompts Generation
            </label>
            <div className="flex items-center space-x-4 mb-2">
              <input
                type="number"
                min="3"
                max="20"
                value={promptCount}
                onChange={(e) => setPromptCount(parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
              <button
                onClick={generateIndustryPrompts}
                disabled={
                  isGeneratingPrompts || configuredProviders.length === 0
                }
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
              >
                {isGeneratingPrompts
                  ? "Generating..."
                  : `Generate ${promptCount} ${selectedIndustry} Prompts`}
              </button>
            </div>

            {generatedPrompts.length > 0 && (
              <div>
                <div className="text-xs text-gray-600 mb-2">
                  {generatedPrompts.length} generated prompts
                </div>
                <div className="bg-white border rounded-md p-3 max-h-24 overflow-y-auto">
                  {generatedPrompts.map((prompt, index) => (
                    <div key={index} className="text-sm text-gray-700 mb-1">
                      {index + 1}. {prompt}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Prompts Section */}
        {(promptMode === "custom" || promptMode === "both") && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Prompts
            </label>

            {/* Add New Custom Prompt */}
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomPrompt()}
                placeholder="Enter your custom prompt..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
              <button
                onClick={addCustomPrompt}
                disabled={!newPrompt.trim()}
                className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Custom Prompts List */}
            {customPrompts.length > 0 && (
              <div>
                <div className="text-xs text-gray-600 mb-2">
                  {customPrompts.length} custom prompts
                </div>
                <div className="bg-white border rounded-md p-3 max-h-32 overflow-y-auto">
                  {customPrompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2 last:mb-0"
                    >
                      {editingPromptIndex === index ? (
                        <>
                          <input
                            type="text"
                            value={prompt}
                            onChange={(e) => {
                              const newPrompts = [...customPrompts];
                              newPrompts[index] = e.target.value;
                              setCustomPrompts(newPrompts);
                            }}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                updateCustomPrompt(index, prompt);
                              }
                            }}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => updateCustomPrompt(index, prompt)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingPromptIndex(null)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm text-gray-700">
                            {index + 1}. {prompt}
                          </span>
                          <button
                            onClick={() => setEditingPromptIndex(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => deleteCustomPrompt(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Test Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleRunCustomTest}
            disabled={
              isTesting ||
              configuredProviders.length === 0 ||
              selectedContent.length === 0 ||
              getPromptsForTesting().length === 0
            }
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            <Play className="h-4 w-4" />
            <span>
              {isTesting
                ? "Testing..."
                : `Run Custom Test (${getPromptsForTesting().length} prompts)`}
            </span>
          </button>
        </div>

        {/* Test Requirements */}
        {(configuredProviders.length === 0 ||
          selectedContent.length === 0 ||
          getPromptsForTesting().length === 0) && (
          <div className="mt-3 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
            <p>To run custom test:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {configuredProviders.length === 0 && (
                <li>Configure at least one LLM provider</li>
              )}
              {selectedContent.length === 0 && (
                <li>Select content files to test</li>
              )}
              {getPromptsForTesting().length === 0 && (
                <li>
                  {promptMode === "generated" &&
                    "Generate industry-specific prompts"}
                  {promptMode === "custom" && "Add custom prompts"}
                  {promptMode === "both" &&
                    "Generate industry prompts or add custom prompts"}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Current Prompt Summary */}
        {getPromptsForTesting().length > 0 && (
          <div className="mt-3 text-sm text-green-600 bg-green-50 p-3 rounded-md">
            <p className="font-medium">Ready to test with:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {promptMode === "generated" && generatedPrompts.length > 0 && (
                <li>
                  {generatedPrompts.length} generated {selectedIndustry} prompts
                </li>
              )}
              {promptMode === "custom" && customPrompts.length > 0 && (
                <li>{customPrompts.length} custom prompts</li>
              )}
              {promptMode === "both" && (
                <>
                  {generatedPrompts.length > 0 && (
                    <li>
                      {generatedPrompts.length} generated {selectedIndustry}{" "}
                      prompts
                    </li>
                  )}
                  {customPrompts.length > 0 && (
                    <li>{customPrompts.length} custom prompts</li>
                  )}
                </>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Competitive Analysis Section */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <h4 className="text-sm font-medium text-purple-900 flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Competitive Analysis</span>
          </h4>
          <div className="relative">
            <button
              onMouseEnter={() => setShowCompetitiveTooltip(true)}
              onMouseLeave={() => setShowCompetitiveTooltip(false)}
              className="text-purple-400 hover:text-purple-600 focus:outline-none"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            {showCompetitiveTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                <div className="font-semibold mb-1">Competitive Analysis</div>
                <div className="space-y-1">
                  <div>
                    • Test how often YOUR content appears vs competitors in LLM
                    responses
                  </div>
                  <div>
                    • Measure your "content win rate" in the AI landscape
                  </div>
                  <div>
                    • Identify missed opportunities where competitors are
                    mentioned instead
                  </div>
                  <div>
                    • Get competitive rankings and visibility scores across
                    multiple AI models
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        </div>

        {/* Content Selection for Competitive Analysis */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Content for Competitive Analysis
            </label>
            <button
              onClick={loadMockUploadedFiles}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reload Content</span>
            </button>
          </div>
          {uploadedFiles.length === 0 && (
            <div className="text-sm text-gray-500 p-4 text-center border border-gray-200 rounded-lg bg-gray-50">
              No content loaded. Click "Reload Content" to refresh or check
              console for details.
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="text-sm text-gray-600 mb-2">
              {uploadedFiles.length} content files available
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-2 border rounded ${
                  selectedCompetitiveContent.some((c) => c.id === file.id)
                    ? "border-purple-300 bg-purple-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCompetitiveContent.some(
                      (c) => c.id === file.id
                    )}
                    onChange={() => handleCompetitiveContentToggle(file)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {file.type} • {file.uploadDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handlePreviewContent(file)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
                >
                  <Eye className="h-3 w-3" />
                  <span>Preview</span>
                </button>
              </div>
            ))}
          </div>

          {selectedCompetitiveContent.length > 0 && (
            <p className="text-sm text-purple-600 mt-2">
              {selectedCompetitiveContent.length} file(s) selected for
              competitive analysis
            </p>
          )}
        </div>

        {/* Competitive Analysis Button */}
        <div className="flex space-x-3">
          <button
            onClick={handleCompetitiveAnalysis}
            disabled={
              isRunningCompetitiveTest || configuredProviders.length === 0
            }
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
          >
            {isRunningCompetitiveTest ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                <span>
                  {selectedCompetitiveContent.length > 0
                    ? `Analyze ${selectedCompetitiveContent.length} File(s)`
                    : "Analyze Pharmaceutical Demo Content"}
                </span>
              </>
            )}
          </button>
        </div>

        {configuredProviders.length === 0 && (
          <div className="mt-3 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
            <p>To run competitive analysis:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {configuredProviders.length === 0 && (
                <li>Configure at least one LLM provider</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Original Testing Actions */}
      <div className="space-y-4">
        <div className="flex space-x-3">
          <button
            onClick={handleRunTest}
            disabled={isTesting || configuredProviders.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Play className="h-4 w-4" />
            <span>{isTesting ? "Testing..." : "Quick Test (3 prompts)"}</span>
          </button>
        </div>

        {configuredProviders.length === 0 && (
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
            Configure at least one LLM provider to run real prompt tests and get
            accurate performance data.
          </p>
        )}
      </div>

      {/* Test Results Preview */}
      {testResults && (
        <div className="mt-6 border-t pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Latest Test Results
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {(testResults.overallSuccessRate * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {testResults.averageLatency.toFixed(0)}ms
              </div>
              <div className="text-xs text-gray-500">Avg Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                ${testResults.totalCost.toFixed(4)}
              </div>
              <div className="text-xs text-gray-500">Total Cost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {testResults.totalResponses}
              </div>
              <div className="text-xs text-gray-500">Responses</div>
            </div>
          </div>

          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setIsResultsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Eye className="h-4 w-4" />
              <span>View Detailed Results</span>
            </button>
            <button
              onClick={() => {
                const dataStr = testingService.exportResults(testResults);
                const dataBlob = new Blob([dataStr], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `llm-test-results-${selectedIndustry}-${
                  new Date().toISOString().split("T")[0]
                }.json`;
                link.click();
              }}
              className="text-sm text-blue-600 hover:text-blue-800 px-3 py-2 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              Export JSON
            </button>
          </div>
        </div>
      )}

      {/* Test Results Modal */}
      {testResults && (
        <LLMTestResults
          report={testResults}
          isOpen={isResultsModalOpen}
          onClose={() => setIsResultsModalOpen(false)}
          onExport={() => {
            const dataStr = testingService.exportResults(testResults);
            const dataBlob = new Blob([dataStr], {
              type: "application/json",
            });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `llm-test-results-${selectedIndustry}-${
              new Date().toISOString().split("T")[0]
            }.json`;
            link.click();
          }}
        />
      )}

      {/* Content Preview Modal */}
      <ContentPreview
        content={previewContent}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onSelect={handleSelectFromPreview}
        isSelected={
          previewContent
            ? selectedContent.some((c) => c.id === previewContent.id)
            : false
        }
        showSelectButton={true}
      />

      {/* Competitive Analysis Results */}
      {competitiveResults && (
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <span>Competitive Analysis Results</span>
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-400">Show:</label>
                <select
                  value={resultsPerPage}
                  onChange={(e) =>
                    handleResultsPerPageChange(Number(e.target.value))
                  }
                  className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:border-purple-500 focus:outline-none"
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-sm text-gray-400">per page</span>
              </div>
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1}-
                {Math.min(endIndex, competitiveResults.length)} of{" "}
                {competitiveResults.length} results
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {currentResults.map((result, index) => (
              <div key={result.promptId} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">
                    Test {startIndex + index + 1}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        result.overallVisibilityScore > 50
                          ? "bg-green-900 text-green-200"
                          : result.overallVisibilityScore > 20
                          ? "bg-yellow-900 text-yellow-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {result.overallVisibilityScore}% Visibility
                    </span>
                    {result.missedOpportunity && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-900 text-red-200">
                        Missed Opportunity
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-3">{result.prompt}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.responses.map((response, respIndex) => (
                    <div key={respIndex} className="bg-gray-600 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">
                          {response.provider}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-300">
                            Rank #
                            {response.competitiveRank > 0
                              ? response.competitiveRank
                              : "N/A"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              response.visibilityScore > 50
                                ? "bg-green-800 text-green-200"
                                : response.visibilityScore > 20
                                ? "bg-yellow-800 text-yellow-200"
                                : "bg-red-800 text-red-200"
                            }`}
                          >
                            {response.visibilityScore}%
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400">
                        <div>
                          Your mentions: {response.userContentMentions.length}
                        </div>
                        <div>
                          Competitor mentions:{" "}
                          {response.competitorMentions.length}
                        </div>
                      </div>

                      {response.userContentMentions.length > 0 && (
                        <div className="mt-2 p-2 bg-gray-500 rounded text-xs">
                          <div className="font-medium text-green-200 mb-1">
                            Your Content Found:
                          </div>
                          {response.userContentMentions
                            .slice(0, 2)
                            .map((mention, mIndex) => (
                              <div
                                key={mIndex}
                                className="text-gray-200 truncate"
                              >
                                "{mention.snippet}"
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-1">
                {totalPages <= 7 ? (
                  // Show all pages if 7 or fewer
                  Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === page
                            ? "bg-purple-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )
                ) : (
                  // Show compact pagination for many pages
                  <>
                    {currentPage > 3 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className="px-3 py-2 rounded-md text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600"
                        >
                          1
                        </button>
                        {currentPage > 4 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                      </>
                    )}

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page =
                        Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                        i;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            currentPage === page
                              ? "bg-purple-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-2 rounded-md text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-6 bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Total Prompts Tested:</span>
                <div className="text-white font-medium">
                  {competitiveResults.length}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Average Visibility:</span>
                <div className="text-white font-medium">
                  {Math.round(
                    competitiveResults.reduce(
                      (sum, r) => sum + r.overallVisibilityScore,
                      0
                    ) / competitiveResults.length
                  )}
                  %
                </div>
              </div>
              <div>
                <span className="text-gray-400">Missed Opportunities:</span>
                <div className="text-white font-medium">
                  {competitiveResults.filter((r) => r.missedOpportunity).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LLMConfiguration;
