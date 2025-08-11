import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfigurationCardProps {
  config: {
    imageKey: string;
    clientKeySuffix: string;
  };
  onConfigChange: (config: { imageKey: string; clientKeySuffix: string }) => void;
}

export default function ConfigurationCard({ config, onConfigChange }: ConfigurationCardProps) {
  const handleImageKeyChange = (value: string) => {
    onConfigChange({ ...config, imageKey: value });
  };

  const handleClientKeyChange = (value: string) => {
    onConfigChange({ ...config, clientKeySuffix: value });
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <span className="material-icons text-blue-600">vpn_key</span>
          <h2 className="text-lg font-medium text-gray-900">Decryption Settings</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="imgKey" className="text-sm font-medium text-gray-700 mb-2">
              Image Key
            </Label>
            <Input
              id="imgKey"
              type="text"
              value={config.imageKey}
              onChange={(e) => handleImageKeyChange(e.target.value)}
              className="font-mono text-sm"
              placeholder="Enter image encryption key"
            />
          </div>
          <div>
            <Label htmlFor="clientKey" className="text-sm font-medium text-gray-700 mb-2">
              Client Key Suffix
            </Label>
            <Input
              id="clientKey"
              type="text"
              value={config.clientKeySuffix}
              onChange={(e) => handleClientKeyChange(e.target.value)}
              className="font-mono text-sm"
              placeholder="Enter client key suffix"
            />
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 rounded-md">
          <div className="flex items-start space-x-2">
            <span className="material-icons text-blue-600 text-sm mt-0.5">info</span>
            <div className="text-sm text-blue-800">
              <p className="font-medium">Key Configuration</p>
              <p>The system uses AES encryption with the combined key: [Image Key] + [Client Key Suffix]</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
