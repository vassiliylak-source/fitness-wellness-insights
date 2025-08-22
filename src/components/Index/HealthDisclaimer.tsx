import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
const HealthDisclaimer = () => {
  return <Card className="card-modern bg-gradient-to-br from-amber-50/90 to-orange-50/90 border-amber-300 py-px">
      <CardContent className="pt-8">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-amber-800 mb-3 text-lg">Health Disclaimer</h4>
            <p className="text-base text-amber-700 font-medium">AI analysis can make mistakes and should not replace professional medical or mental health advice. If you're experiencing persistent health concerns, please consult with a qualified healthcare provider or therapist.</p>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default HealthDisclaimer;