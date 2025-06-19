
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Brain, AlertTriangle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Added import for image analysis
import { analyzeImage, ImageAnalysisResult } from "@/services/imageAnalysis";
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
  // Added state for analysis result
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [activeFeature, setActiveFeature] = useState<'screenshot' | 'breathing' | 'journal'>('screenshot');
  const {
    toast
  } = useToast();
  const handleImageUpload = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsAnalyzing(true);
    setShowInsights(false);
    setAnalysisResult(null);
    toast({
      title: "Image uploaded successfully!",
      description: "Analyzing your image with OCR..."
    });
    try {
      // Call to analyze image
      const result = await analyzeImage(file);
      setAnalysisResult(result);
      if (result.isFitnessData) {
        setShowInsights(true);
        toast({
          title: "Analysis complete! 🎯",
          description: "Your fitness insights are ready."
        });
      } else {
        toast({
          title: "Analysis complete",
          description: result.error || "This doesn't appear to be a fitness screenshot.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  const resetAnalysis = () => {
    setUploadedImage(null);
    setShowInsights(false);
    setIsAnalyzing(false);
    setAnalysisResult(null);
  };
  const renderScreenshotContent = () => {
    if (!showInsights) {
      return <div className="space-y-8">
          {/* Upload Section */}
          <Card className="card-modern border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50/90 to-pink-50/90 backdrop-blur-sm hover-lift">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-3xl font-black text-gray-800">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                Upload Your Fitness Screenshot
                <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
              </CardTitle>
              <CardDescription className="text-lg font-medium text-gray-700">
                🚀 Drag and drop or click to upload your fitness app data for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhotoUpload onImageUpload={handleImageUpload} />
              
              {uploadedImage && <div className="mt-8 text-center">
                  <div className="relative inline-block">
                    <img src={uploadedImage} alt="Uploaded fitness data" className="max-w-md mx-auto rounded-2xl shadow-2xl border-4 border-white" />
                    <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-full">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <Button onClick={resetAnalysis} variant="outline" className="mt-6 rounded-full font-semibold border-2 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white">
                    Upload Different Image
                  </Button>
                </div>}

              {isAnalyzing && <div className="mt-8 space-y-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">Analyzing with AI Magic...</span>
                  </div>
                  <Progress value={66} className="w-full max-w-md mx-auto h-3 rounded-full" />
                  <div className="text-center text-base font-medium text-gray-700 bg-white/60 rounded-full px-6 py-2 inline-block">
                    ✨ Reading text and detecting fitness metrics
                  </div>
                </div>}

              {/* Show error message if analysis result shows not a fitness data */}
              {analysisResult && !analysisResult.isFitnessData && <div className="mt-8 p-8 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl">
                  <div className="text-center space-y-4">
                    <div className="text-red-600 text-xl font-bold">
                      ❌ Not a Fitness Screenshot
                    </div>
                    <p className="text-red-700 font-medium text-lg">
                      {analysisResult.error}
                    </p>
                    <div className="text-base text-red-600 bg-white/80 rounded-xl p-4">
                      <p className="font-bold mb-3">💪 Supported apps include:</p>
                      <p className="font-medium">Apple Health, Strava, Garmin Connect, Fitbit, Samsung Health, Google Fit, and more</p>
                    </div>
                  </div>
                </div>}
            </CardContent>
          </Card>

          <MetricsOverview />

          {/* Support Section */}
          <Card className="card-modern bg-gradient-to-br from-purple-50/90 to-blue-50/90 border-purple-200">
            <CardContent className="pt-8">
              <div className="text-center space-y-4">
                <p className="text-base font-medium text-gray-700">💜 Enjoying this app? If you'd like to support the creator, consider treating him to a coffee with a small donation:</p>
                <div className="flex justify-center">
                  <a href="https://paypal.me/vaskenzy" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                    ☕ Buy me a coffee
                  </a>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Thank you for your support! ✨
                </p>
              </div>
            </CardContent>
          </Card>
        </div>;
    }
    return <div className="space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black gradient-text mb-6">
            Your Fitness Insights Are Ready! 🎯
          </h2>
          <Button onClick={resetAnalysis} variant="outline" className="btn-secondary">
            Analyze Another Image
          </Button>
        </div>
        {/* Pass analysisResult to InsightsDashboard component */}
        <InsightsDashboard uploadedImage={uploadedImage} analysisResult={analysisResult} />

        {/* Support Section */}
        <Card className="card-modern bg-gradient-to-br from-purple-50/90 to-blue-50/90 border-purple-200">
          <CardContent className="pt-8">
            <div className="text-center space-y-4">
              <p className="text-base font-medium text-gray-700">
                💜 If you find this wellness tracker helpful and would like to show appreciation,
                you're welcome to buy Vassiliy a coffee via a small donation:
              </p>
              <div className="flex justify-center">
                <a href="https://paypal.me/vaskenzy" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                  ☕ Buy me a coffee
                </a>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Thank you for your support! ✨
              </p>
            </div>
          </CardContent>
        </Card>
      </div>;
  };
  return <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <HeroSection />

      {/* Complete Wellness Platform - moved up after hero section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HowItWorksSection />
      </div>

      {/* Data Privacy Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DataPrivacyNotice />
      </div>

      {/* Health Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="card-modern bg-gradient-to-br from-amber-50/90 to-orange-50/90 border-amber-300">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-amber-800 mb-3 text-lg">Health Disclaimer</h4>
                <p className="text-base text-amber-700 font-medium">
                  AI analysis can make mistakes and should not replace professional medical or mental health advice. 
                  If you're experiencing persistent health concerns, please consult with a qualified healthcare provider or therapist.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Selection and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FeatureNavigation activeFeature={activeFeature} onFeatureChange={setActiveFeature} />

        {/* Content based on active feature */}
        {activeFeature === 'screenshot' && renderScreenshotContent()}
        {activeFeature === 'breathing' && <BreathingExercises />}
        {activeFeature === 'journal' && <WellnessJournal />}
      </div>

      {/* Copyright Footer */}
      <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-medium">&copy; {new Date().getFullYear()} Vassiliy Lakhonin. All rights reserved. ✨</p>
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
