
import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  onImageUpload: (file: File) => void;
}

const PhotoUpload = ({ onImageUpload }: PhotoUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // File validation settings
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `File type not supported. Please upload: ${ALLOWED_TYPES.map(type => type.split('/')[1]).join(', ').toUpperCase()}`;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }
    
    return null;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setValidationError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {validationError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {validationError}
          </AlertDescription>
        </Alert>
      )}

      {!previewUrl ? (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
            isDragOver 
              ? "border-blue-500 bg-blue-50 scale-105" 
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-blue-100 rounded-full">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Drop your fitness screenshot here
              </h3>
              <p className="text-gray-600 mb-4">
                or click to browse files
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
            
            <div className="text-sm text-gray-500 space-y-1">
              <div>Supports: Apple Health, Strava, Garmin, Fitbit, and more</div>
              <div className="text-xs">
                Max file size: 10MB • Formats: JPEG, PNG, GIF, WebP
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Uploaded fitness data"
            className="w-full max-h-96 object-contain rounded-lg shadow-lg"
          />
          <Button
            onClick={clearPreview}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
