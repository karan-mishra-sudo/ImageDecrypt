import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  imageId: string;
  fileName: string;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
  onReset: () => void;
}

export default function ImagePreview({ imageId, fileName, metadata, onReset }: ImagePreviewProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `/api/image/${imageId}`;
    link.download = `decrypted_${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200 overflow-hidden fade-in">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="material-icons text-green-500">check_circle</span>
            <div>
              <h3 className="font-medium text-gray-900">Decryption Successful</h3>
              <p className="text-sm text-gray-500">{fileName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-blue-600 hover:bg-blue-50"
            >
              <span className="material-icons text-sm mr-1">download</span>
              Download
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-gray-600 hover:bg-gray-100"
            >
              <span className="material-icons text-sm mr-1">refresh</span>
              New Image
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="text-center">
          <img 
            src={`/api/image/${imageId}`}
            alt="Decrypted image preview" 
            className="image-preview mx-auto rounded-lg shadow-md max-w-full"
          />
        </div>
        
        {metadata && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-900">{metadata.width}</div>
              <div className="text-sm text-gray-500">Width (px)</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-900">{metadata.height}</div>
              <div className="text-sm text-gray-500">Height (px)</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-900">{metadata.size}</div>
              <div className="text-sm text-gray-500">Size (MB)</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-900">{metadata.format?.toUpperCase()}</div>
              <div className="text-sm text-gray-500">Format</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
