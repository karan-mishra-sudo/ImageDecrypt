import { useState } from "react";
import ConfigurationCard from "@/components/configuration-card";
import UploadZone from "@/components/upload-zone";
import ProcessingIndicator from "@/components/processing-indicator";
import ImagePreview from "@/components/image-preview";
import ErrorCard from "@/components/error-card";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [decryptionConfig, setDecryptionConfig] = useState({
    imageKey: "n!$H@Nt84!09D3m0",
    clientKeySuffix: "kyc1"
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [decryptionResult, setDecryptionResult] = useState<{
    id: string;
    status: 'success' | 'failed';
    metadata?: {
      width: number;
      height: number;
      format: string;
      size: number;
    };
    fileName?: string;
    errorMessage?: string;
  } | null>(null);
  
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setDecryptionResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('imageKey', decryptionConfig.imageKey);
      formData.append('clientKeySuffix', decryptionConfig.clientKeySuffix);

      const response = await fetch('/api/decrypt', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setDecryptionResult({
          id: result.id,
          status: 'success',
          metadata: result.metadata,
          fileName: file.name
        });
        toast({
          title: "Success",
          description: "Image decrypted successfully!",
        });
      } else {
        setDecryptionResult({
          id: '',
          status: 'failed',
          errorMessage: result.error,
          fileName: file.name
        });
        toast({
          title: "Decryption Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      setDecryptionResult({
        id: '',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
        fileName: file.name
      });
      toast({
        title: "Error",
        description: "Failed to process the file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setDecryptionResult(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <span className="material-icons text-white text-2xl">lock_open</span>
            </div>
            <div>
              <h1 className="text-xl font-medium text-gray-900">Image Decryption Tool</h1>
              <p className="text-sm text-gray-500">Decrypt and view encrypted image files securely</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <ConfigurationCard 
          config={decryptionConfig}
          onConfigChange={setDecryptionConfig}
        />
        
        <UploadZone onFileUpload={handleFileUpload} disabled={isProcessing} />
        
        {isProcessing && <ProcessingIndicator />}
        
        {decryptionResult?.status === 'success' && (
          <ImagePreview
            imageId={decryptionResult.id}
            fileName={decryptionResult.fileName || 'Unknown'}
            metadata={decryptionResult.metadata}
            onReset={handleReset}
          />
        )}
        
        {decryptionResult?.status === 'failed' && (
          <ErrorCard
            message={decryptionResult.errorMessage || 'Unknown error occurred'}
            onRetry={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              Image Decryption Tool • Compatible with AES encrypted images
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <span className="material-icons text-xs">security</span>
                <span>All processing done locally</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="material-icons text-xs">privacy_tip</span>
                <span>No data uploaded to servers</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
