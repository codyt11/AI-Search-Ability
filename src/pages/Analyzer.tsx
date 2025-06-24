import { useState, useCallback } from "react";
import {
  FileText,
  Mail,
  Globe,
  BookOpen,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import FileUpload from "../components/FileUpload";
import AnalysisResults from "../components/AnalysisResults";
import { analyzeAsset, AnalysisResult } from "../services/api";

const Analyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setSelectedFile(file);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeAsset(file);
      setAnalysisResult(result);
      toast.success("Analysis completed successfully!");
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Asset Analyzer</h1>
        <p className="text-gray-400 mt-2">
          Upload and analyze your digital assets for AI compatibility and
          optimization opportunities
        </p>
      </div>

      {/* Supported Formats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {supportedFormats.map((format, index) => (
          <div
            key={index}
            className="card p-4 hover:bg-gray-700/30 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${format.bgColor}`}>
                <format.icon className={`h-6 w-6 ${format.color}`} />
              </div>
              <div>
                <h3 className="font-medium text-white">{format.type}</h3>
                <p className="text-sm text-gray-400">{format.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Section */}
      <div className="card p-8">
        <h2 className="text-xl font-bold text-white mb-6">
          Upload Asset for Analysis
        </h2>
        <FileUpload
          onFileUpload={handleFileUpload}
          isAnalyzing={isAnalyzing}
          disabled={isAnalyzing}
        />

        {selectedFile && (
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-600/20">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-white">{selectedFile.name}</p>
                <p className="text-sm text-blue-300">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResult && <AnalysisResults result={analysisResult} />}

      {/* Analysis Features Info */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-4">What We Analyze</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-1 rounded-full bg-green-900/30 mt-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Structure & Clarity</h3>
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
                <h3 className="font-medium text-white">Token Analysis</h3>
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
                <h3 className="font-medium text-white">Embedding Potential</h3>
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
                <h3 className="font-medium text-white">Prompt Coverage</h3>
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
                <h3 className="font-medium text-white">Content Gaps</h3>
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
                <h3 className="font-medium text-white">
                  Optimization Recommendations
                </h3>
                <p className="text-sm text-gray-400">
                  Actionable improvements for AI compatibility
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
