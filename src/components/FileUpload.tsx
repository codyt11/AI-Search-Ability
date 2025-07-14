import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File } from "lucide-react";

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
        border-2 border-dashed rounded-lg p-4 sm:p-8 text-center cursor-pointer transition-all duration-200
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
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 bg-gray-700/50 rounded-full">
          <Upload className="h-6 w-6 text-gray-400" />
        </div>
        <div>
          <p className="text-base sm:text-lg font-medium text-white mb-1">
            {isDragActive ? "Drop your file here" : "Upload your content"}
          </p>
          <p className="text-sm text-gray-400">
            Drag & drop or click to select a file
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <File className="h-3 w-3" />
            <span>PDF</span>
          </div>
          <div className="flex items-center space-x-1">
            <File className="h-3 w-3" />
            <span>HTML</span>
          </div>
          <div className="flex items-center space-x-1">
            <File className="h-3 w-3" />
            <span>DOCX</span>
          </div>
          <div className="flex items-center space-x-1">
            <File className="h-3 w-3" />
            <span>TXT</span>
          </div>
        </div>
        {isAnalyzing && (
          <p className="text-sm text-blue-400">Analyzing your content...</p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
