// Content Preview Modal Component
// Shows content details for selection and analysis

import React from "react";
import { X, FileText, Calendar, Type, Eye } from "lucide-react";

interface UploadedContent {
  id: string;
  name: string;
  content: string;
  type: string;
  uploadDate: Date;
}

interface Props {
  content: UploadedContent | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (content: UploadedContent) => void;
  isSelected?: boolean;
  showSelectButton?: boolean;
  title?: string;
}

const ContentPreview: React.FC<Props> = ({
  content,
  isOpen,
  onClose,
  onSelect,
  isSelected = false,
  showSelectButton = true,
  title = "Content Preview",
}) => {
  if (!isOpen || !content) return null;

  const getFileTypeIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("doc")) return "📝";
    if (type.includes("text")) return "📄";
    if (type.includes("markdown")) return "📋";
    if (
      type.includes("image") ||
      type.includes("jpeg") ||
      type.includes("jpg") ||
      type.includes("png")
    )
      return "🖼️";
    return "📄";
  };

  const getFileTypeColor = (type: string) => {
    if (type.includes("pdf")) return "text-red-600 bg-red-50";
    if (type.includes("doc")) return "text-blue-600 bg-blue-50";
    if (type.includes("text")) return "text-gray-600 bg-gray-50";
    if (type.includes("markdown")) return "text-purple-600 bg-purple-50";
    if (
      type.includes("image") ||
      type.includes("jpeg") ||
      type.includes("jpg") ||
      type.includes("png")
    )
      return "text-green-600 bg-green-50";
    return "text-gray-600 bg-gray-50";
  };

  const wordCount = content.content
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = content.content.length;
  const estimatedReadTime = Math.ceil(wordCount / 200); // Average reading speed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getFileTypeIcon(content.type)}</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600 text-sm">{content.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {showSelectButton && onSelect && (
              <button
                onClick={() => onSelect(content)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium ${
                  isSelected
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>{isSelected ? "Selected" : "Select for Testing"}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content Metadata */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-xs text-gray-500">File Type</div>
                <div
                  className={`text-sm font-medium px-2 py-1 rounded ${getFileTypeColor(
                    content.type
                  )}`}
                >
                  {content.type || "Unknown"}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-xs text-gray-500">Upload Date</div>
                <div className="text-sm font-medium text-gray-900">
                  {content.uploadDate.toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-xs text-gray-500">Word Count</div>
                <div className="text-sm font-medium text-gray-900">
                  {wordCount.toLocaleString()} words
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-xs text-gray-500">Read Time</div>
                <div className="text-sm font-medium text-gray-900">
                  ~{estimatedReadTime} min
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Display */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Content</h3>
              <div className="text-sm text-gray-500">
                {charCount.toLocaleString()} characters
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                {content.content}
              </pre>
            </div>

            {content.content.length >= 2000 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="text-yellow-600">⚠️</div>
                  <div className="text-sm text-yellow-800">
                    <strong>Note:</strong> Content may be truncated to 2000
                    characters for testing purposes. Full content is displayed
                    here for preview.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Content ID: {content.id}
            </div>
            {showSelectButton && onSelect && (
              <div className="text-sm text-gray-600">
                {isSelected
                  ? "✅ Selected for analysis"
                  : 'Click "Select for Testing" to include in analysis'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;
