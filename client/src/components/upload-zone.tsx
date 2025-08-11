import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFileUpload, disabled }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      });
      return false;
    }

    // Allow any file type since encrypted files might not have proper MIME types
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileUpload(file);
      }
    }
  }, [onFileUpload, disabled, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileUpload(file);
      }
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [onFileUpload, toast]);

  const handleClick = () => {
    if (!disabled) {
      document.getElementById('fileInput')?.click();
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <span className="material-icons text-blue-600">cloud_upload</span>
          <h2 className="text-lg font-medium text-gray-900">Upload Encrypted Image</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`upload-zone border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="material-icons text-blue-600 text-2xl">image</span>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {disabled ? 'Processing...' : 'Drop encrypted image here'}
              </p>
              <p className="text-sm text-gray-500">
                {disabled ? 'Please wait while we decrypt your image' : 'or click to browse files'}
              </p>
            </div>
            <div className="text-xs text-gray-500">
              Supports: JPG, PNG, GIF, BMP • Max size: 10MB
            </div>
          </div>
        </div>
        
        <input
          type="file"
          id="fileInput"
          accept="image/*,.enc,.encrypted"
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
}
