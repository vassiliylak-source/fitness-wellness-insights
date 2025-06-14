
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, AlertTriangle } from "lucide-react";

const WellnessHeader = () => {
  return (
    <>
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800">
            <BookOpen className="h-6 w-6 text-green-600" />
            Daily Recovery & Wellness Journal
          </CardTitle>
          <CardDescription className="text-lg">
            🧘 Track wellness inside and out. Go beyond metrics to reflect on how you feel, 
            spot patterns, and support recovery from burnout, training fatigue, or daily stress.
          </CardDescription>
        </CardHeader>
      </Card>

      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Health Disclaimer:</strong> This wellness journal is for self-reflection purposes only. 
          AI analysis can make mistakes and should not replace professional medical or mental health advice. 
          If you're experiencing persistent health concerns, please consult with a qualified healthcare provider or therapist.
        </AlertDescription>
      </Alert>
    </>
  );
};

export default WellnessHeader;
