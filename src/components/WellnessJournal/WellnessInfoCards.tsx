
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { JournalEntry } from "@/types/wellness";

interface WellnessInfoCardsProps {
  savedEntries: JournalEntry[];
}

const WellnessInfoCards = ({ savedEntries }: WellnessInfoCardsProps) => {
  return (
    <>
      {/* AI Integration Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Maximize Your Journaling with AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-gray-700">
              🤖 <strong>Get instant AI insights</strong> from your wellness entries:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
              <li>Discover mood and energy patterns over time</li>
              <li>Get personalized recovery recommendations</li>
              <li>Identify triggers for stress or low energy</li>
              <li>Receive gentle suggestions to enhance well-being</li>
              <li>Track progress toward your wellness goals</li>
            </ul>
            <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
              <p className="text-sm text-purple-700 font-medium">
                💡 Tip: Keep journaling consistently to get more accurate and valuable insights!
              </p>
            </div>
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Remember:</strong> AI can make mistakes. These insights are for general wellness reflection only. 
                For health concerns, always consult with a qualified healthcare provider or therapist.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries Summary */}
      {savedEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Wellness Journey ({savedEntries.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-600">
              <p>Keep tracking consistently to build insights! 🌱</p>
              <p className="text-sm mt-2">
                Your data is stored locally and privately. Use AI Analysis for instant insights.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Support Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-700">
              💜 If you find this wellness tracker helpful and would like to show appreciation,
              you're welcome to buy Vassiliy a coffee via a small donation:
            </p>
            <div className="flex justify-center">
              <a 
                href="https://paypal.me/vaskenzy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                ☕ Buy me a coffee
              </a>
            </div>
            <p className="text-xs text-gray-600">
              Thank you for your support!
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default WellnessInfoCards;
