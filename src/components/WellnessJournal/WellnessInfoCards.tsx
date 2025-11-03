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
      
    </>;
};
export default WellnessInfoCards;