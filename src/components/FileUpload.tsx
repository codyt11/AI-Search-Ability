import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Loader2 } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isAnalyzing: boolean;
  disabled?: boolean;
}

const FileUpload = ({
  onFileUpload,
  isAnalyzing,
  disabled = false,
}: FileUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && !disabled) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/html": [".html"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
      "application/msword": [".doc"],
    },
    maxFiles: 1,
    disabled: disabled || isAnalyzing,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
        ${
          isDragActive
            ? "border-blue-500 bg-blue-900/20 scale-[1.02]"
            : "border-gray-600 hover:border-gray-500 bg-gray-800/50"
        }
        ${
          disabled || isAnalyzing
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-700/30"
        }
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center space-y-4">
        {isAnalyzing ? (
          <div className="p-3 rounded-full bg-blue-600/20">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          </div>
        ) : (
          <div className="p-3 rounded-full bg-gray-700/50">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
        )}

        <div>
          <p className="text-lg font-medium text-white">
            {isAnalyzing
              ? "Analyzing your asset..."
              : isDragActive
              ? "Drop your file here"
              : "Upload your digital asset"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {isAnalyzing
              ? "This may take a few moments"
              : "Drag and drop a file or click to browse"}
          </p>
        </div>

        {!isAnalyzing && (
          <div className="text-xs text-gray-500 bg-gray-700/30 px-3 py-1 rounded-full">
            Supported formats: PDF, HTML, DOCX, TXT (Max 50MB)
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
