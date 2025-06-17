import { Shield, Lock, Monitor } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
const DataPrivacyNotice = () => {
  return <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      
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
      </CardContent>
    </Card>;
};
export default DataPrivacyNotice;