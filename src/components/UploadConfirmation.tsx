import { CheckCircle, FileText, Hash, Package, Loader2 } from "lucide-react";
import { QuickSummary } from "../services/api";

interface UploadConfirmationProps {
  summary: QuickSummary;
  isScanning?: boolean;
}

const UploadConfirmation = ({
  summary,
  isScanning = false,
}: UploadConfirmationProps) => {
  return (
    <div className="card p-6 bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-700/50">
      {/* Success Message */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-full bg-green-600/20">
          <CheckCircle className="h-6 w-6 text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Your file was successfully uploaded. Let's see how discoverable it
            is to AI.
          </h3>
        </div>
      </div>

      {/* File Summary */}
      <div className="space-y-4">
        {/* File Name */}
        <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
          <div className="p-2 rounded-lg bg-blue-600/20">
            <FileText className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">📄 File name</p>
            <p className="font-medium text-white">{summary.filename}</p>
            <p className="text-xs text-gray-500">
              {summary.fileType} • {summary.fileSize}
            </p>
          </div>
        </div>

        {/* Word Count / Token Count */}
        <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
          <div className="p-2 rounded-lg bg-purple-600/20">
            <Hash className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">🔢 Word count / token count</p>
            <p className="font-medium text-white">
              {summary.wordCount.toLocaleString()} words •{" "}
              {summary.tokenCount.toLocaleString()} tokens
            </p>
          </div>
        </div>

        {/* Estimated Content Chunks */}
        <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
          <div className="p-2 rounded-lg bg-amber-600/20">
            <Package className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">
              🧩 Estimated # of content chunks
            </p>
            <p className="font-medium text-white">
              ~{summary.estimatedChunks} chunks
            </p>
            <p className="text-xs text-gray-500">
              (how it would be split for AI retrieval)
            </p>
          </div>
        </div>

        {/* Scanning Indicator */}
        {isScanning && (
          <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="p-2 rounded-lg bg-cyan-600/20">
              <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
            </div>
            <div>
              <p className="text-sm text-gray-400">
                🔍 Scanning for structure...
              </p>
              <p className="font-medium text-white">
                Analyzing content for AI compatibility
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Why It Matters */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
        <p className="text-sm text-blue-300">
          <span className="font-medium">🧠 Why it matters:</span> Gives you
          instant feedback and transitions you into deeper insight.
        </p>
      </div>
    </div>
  );
};

export default UploadConfirmation;
