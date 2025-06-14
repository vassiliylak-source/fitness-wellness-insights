
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Database, Lock } from "lucide-react";

const DataPrivacyNotice = () => {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-cyan-50 border-green-200">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Your Privacy & Data Security
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex items-start gap-2">
                <Database className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>100% Local Storage:</strong> All your wellness data, journal entries, and uploaded images 
                  are stored locally in your browser. Nothing is sent to external servers.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>No Data Collection:</strong> We don't track, collect, or store any of your personal information, 
                  health data, or usage patterns.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>You're in Control:</strong> Your data stays on your device. You can clear it anytime through 
                  your browser settings or by using the reset options in the app.
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-600 bg-white/50 p-2 rounded border">
              <strong>Note:</strong> Since data is stored locally, clearing your browser data or switching devices 
              will remove your stored information. Consider exporting important data if needed.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPrivacyNotice;
