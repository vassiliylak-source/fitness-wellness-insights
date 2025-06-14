
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Wind, BookOpen } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <Card className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-gray-800">
          Complete Wellness Platform
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Screenshot Analysis</h3>
            <p className="text-gray-600">
              Upload fitness app screenshots for instant AI-powered insights on metrics, patterns, and performance
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wind className="h-8 w-8 text-cyan-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">4-6 Breathing</h3>
            <p className="text-gray-600">
              Guided breathing exercises with visual cues to reduce stress, promote relaxation, and improve focus
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Wellness Journaling</h3>
            <p className="text-gray-600">
              Track mood, energy, stress, and recovery daily. Export for AI analysis to discover patterns and get recommendations
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HowItWorksSection;
