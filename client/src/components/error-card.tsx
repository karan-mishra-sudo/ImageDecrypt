import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface ErrorCardProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorCard({ message, onRetry }: ErrorCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="bg-white shadow-sm border border-red-200 fade-in">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <span className="material-icons text-red-500">error</span>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Decryption Failed</h3>
            <p className="text-sm text-gray-500 mt-1">{message}</p>
            
            <div className="mt-4 space-y-2">
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                  Troubleshooting Tips
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 pl-4 space-y-1 text-sm text-gray-500">
                  <p>• Verify that the image key and client key suffix are correct</p>
                  <p>• Ensure the file is actually encrypted with AES encryption</p>
                  <p>• Check that the file hasn't been corrupted during transfer</p>
                  <p>• Make sure the file is a supported image format</p>
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={onRetry}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
