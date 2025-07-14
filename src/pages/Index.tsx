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
    return <div className="space-y-8">
        <Card className="card-modern bg-gradient-to-br from-purple-50/90 to-pink-50/90 border-purple-200">
          <CardContent className="pt-8">
            <div className="text-center space-y-6">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl inline-block">
                <Brain className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-800">
                AI Fitness Insights
              </h2>
              <p className="text-lg font-medium text-gray-700 max-w-2xl mx-auto">
                Get personalized AI analysis of your fitness data, sleep patterns, and health metrics with advanced recommendations
              </p>
              <div className="flex justify-center">
                <a href="https://chatgpt.com/g/g-67c6e2ead288819186d3be7d91466783-fitness-sleep-metrics-insights" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                  🧠 Get AI Insights
                </a>
              </div>
            </div>
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
  };
  return <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <HeroSection />

      {/* Complete Wellness Platform - moved up after hero section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[45px]">
        <HowItWorksSection />
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
            <p className="text-lg font-medium">&copy; Vassiliy Lakhonin. All rights reserved. ✨</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;