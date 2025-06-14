
import { Shield, Lock, Monitor } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DataPrivacyNotice = () => {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Shield className="h-5 w-5" />
          Your Privacy is Protected
        </CardTitle>
        <CardDescription className="text-green-700">
          Complete data privacy with local-only processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Monitor className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-green-800">Local Processing</h4>
              <p className="text-xs text-green-700">All data stays in your browser</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-blue-800">No Data Collection</h4>
              <p className="text-xs text-blue-700">We don't store or track anything</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-purple-800">Secure by Design</h4>
              <p className="text-xs text-purple-700">Your data never leaves your device</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="text-xs bg-white/50">
            No Server Storage
          </Badge>
          <Badge variant="outline" className="text-xs bg-white/50">
            No Third-party Sharing
          </Badge>
          <Badge variant="outline" className="text-xs bg-white/50">
            GDPR Compliant
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPrivacyNotice;
