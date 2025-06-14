
import { Shield, Lock, Monitor } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DataPrivacyNotice = () => {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-800 text-2xl">
          <Shield className="h-6 w-6" />
          Your Privacy is Protected
        </CardTitle>
        <CardDescription className="text-green-700 text-lg">
          Complete data privacy with local-only processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Monitor className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-base text-green-800">Local Processing</h4>
              <p className="text-sm text-green-700">All data stays in your browser</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Lock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-base text-blue-800">No Data Collection</h4>
              <p className="text-sm text-blue-700">We don't store or track anything</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-base text-purple-800">Secure by Design</h4>
              <p className="text-sm text-purple-700">Your data never leaves your device</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPrivacyNotice;
