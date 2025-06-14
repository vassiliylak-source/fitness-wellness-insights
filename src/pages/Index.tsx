
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PhotoUpload from "@/components/PhotoUpload";
import InsightsDashboard from "@/components/InsightsDashboard";
import MetricsOverview from "@/components/MetricsOverview";
import WellnessJournal from "@/components/WellnessJournal";
import BreathingExercises from "@/components/BreathingExercises";
import DataPrivacyNotice from "@/components/DataPrivacyNotice";
import HeroSection from "@/components/Index/HeroSection";
import FeatureNavigation from "@/components/Index/FeatureNavigation";
import HowItWorksSection from "@/components/Index/HowItWorksSection";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [activeFeature, setActiveFeature] = useState<'screenshot' | 'breathing' | 'journal'>('screenshot');
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsAnalyzing(true);
    
    toast({
      title: "Image uploaded successfully!",
      description: "Analyzing your fitness data...",
    });

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowInsights(true);
      toast({
        title: "Analysis complete!",
        description: "Your pro-level insights are ready.",
      });
    }, 3000);
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setShowInsights(false);
    setIsAnalyzing(false);
  };

  const renderScreenshotContent = () => {
    if (!showInsights) {
      return (
        <div className="space-y-8">
          {/* Upload Section */}
          <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800">
                <Upload className="h-6 w-6 text-blue-600" />
                Upload Your Fitness Screenshot
              </CardTitle>
              <CardDescription className="text-lg">
                Drag and drop or click to upload your fitness app data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhotoUpload onImageUpload={handleImageUpload} />
              
              {uploadedImage && (
                <div className="mt-6 text-center">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded fitness data" 
                    className="max-w-md mx-auto rounded-lg shadow-lg"
                  />
                  <Button 
                    onClick={resetAnalysis}
                    variant="outline" 
                    className="mt-4"
                  >
                    Upload Different Image
                  </Button>
                </div>
              )}

              {isAnalyzing && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
                    <span className="text-lg font-medium">AI is analyzing your data...</span>
                  </div>
                  <Progress value={66} className="w-full max-w-md mx-auto" />
                  <div className="text-center text-sm text-gray-600">
                    Processing metrics, patterns, and generating insights
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <MetricsOverview />

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
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Your Fitness Insights Are Ready! 🎯
          </h2>
          <Button onClick={resetAnalysis} variant="outline">
            Analyze Another Image
          </Button>
        </div>
        <InsightsDashboard uploadedImage={uploadedImage} />

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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <HeroSection />

      {/* Data Privacy Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataPrivacyNotice />
      </div>

      {/* Feature Selection and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeatureNavigation 
          activeFeature={activeFeature} 
          onFeatureChange={setActiveFeature} 
        />

        {/* Content based on active feature */}
        {activeFeature === 'screenshot' && renderScreenshotContent()}
        {activeFeature === 'breathing' && <BreathingExercises />}
        {activeFeature === 'journal' && <WellnessJournal />}

        <HowItWorksSection />
      </div>

      {/* Copyright Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Vassiliy Lakhonin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
