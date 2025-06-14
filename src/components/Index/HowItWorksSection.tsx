
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Wind, BookOpen } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <Card className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-gray-800">
          Complete Wellness Platform
        </CardTitle>
        
        {/* Support Section */}
        <div className="text-center space-y-3 pt-4">
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
