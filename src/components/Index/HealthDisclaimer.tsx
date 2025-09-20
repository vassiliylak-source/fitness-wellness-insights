import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const HealthDisclaimer = () => {
  return (
    <Card className="card-modern bg-gradient-to-br from-amber-50/90 to-orange-50/90 border-amber-300 py-4 sm:py-6">
      <CardContent className="pt-6 sm:pt-8">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex-shrink-0">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-amber-800 mb-2 sm:mb-3 text-base sm:text-lg">Health Disclaimer</h4>
            <p className="text-sm sm:text-base text-amber-700 font-medium leading-relaxed">AI analysis can make mistakes and should not replace professional medical or mental health advice. If you're experiencing persistent health concerns, please consult with a qualified healthcare provider or therapist.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthDisclaimer;