import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ProcessingIndicator() {
  return (
    <Card className="bg-white shadow-sm border border-gray-200 fade-in">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="progress-circle">
            <span className="material-icons text-blue-600 text-2xl">sync</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Decrypting Image...</h3>
            <p className="text-sm text-gray-500">Please wait while we process your file</p>
          </div>
        </div>
        
        <div className="mt-4">
          <Progress value={33} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
