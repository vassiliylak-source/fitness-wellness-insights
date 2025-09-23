import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
const HealthDisclaimer = () => {
  return <div className="card-elegant border-accent/20">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-gradient-to-br from-primary to-accent rounded-xl flex-shrink-0 shadow-lg">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold gradient-text text-lg">Health Disclaimer</h4>
          <p className="text-muted-foreground leading-relaxed">These tools should not replace professional medical or mental health advice. If you're experiencing persistent health concerns, please consult with a qualified healthcare provider or therapist.</p>
        </div>
      </div>
    </div>;
};
export default HealthDisclaimer;