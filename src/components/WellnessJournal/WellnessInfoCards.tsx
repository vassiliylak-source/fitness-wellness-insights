import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { JournalEntry } from "@/types/wellness";
interface WellnessInfoCardsProps {
  savedEntries: JournalEntry[];
}
const WellnessInfoCards = ({
  savedEntries
}: WellnessInfoCardsProps) => {
  return <>
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
            <div className="flex justify-center mt-4">
              <a 
                href="https://chatgpt.com/g/g-67c6e2ead288819186d3be7d91466783-fitness-sleep-metrics-insights" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🧠 Get AI Insights
              </a>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
              <p className="text-sm text-purple-700 font-medium">
                💡 Tip: Keep journaling consistently to get more accurate and valuable insights!
              </p>
            </div>
            
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries Summary */}
      {savedEntries.length > 0 && <Card>
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
        </Card>}

      {/* Support Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-700">💜Enjoying this app? If you'd like to support the creator, consider treating him to a coffee with a small donation:</p>
            <div className="flex justify-center">
              <a href="https://paypal.me/vaskenzy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                ☕ Buy me a coffee
              </a>
            </div>
            <p className="text-xs text-gray-600">
              Thank you for your support!
            </p>
          </div>
        </CardContent>
      </Card>
    </>;
};
export default WellnessInfoCards;