import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Activity, Heart, Brain, TrendingUp, Clock, Zap, BookOpen, Sparkles, Wind } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PhotoUpload from "@/components/PhotoUpload";
import InsightsDashboard from "@/components/InsightsDashboard";
import MetricsOverview from "@/components/MetricsOverview";
import WellnessJournal from "@/components/WellnessJournal";
import BreathingExercises from "@/components/BreathingExercises";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Activity className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Complete Fitness & Wellness Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Decode your fitness screenshots, practice guided breathing, AND track holistic wellness. Get 
              <span className="text-yellow-300 font-semibold"> pro-level insights </span>
              from data analysis plus mindfulness tools for complete well-being
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Heart className="h-4 w-4 mr-2" />
                Heart Rate Analysis
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Wind className="h-4 w-4 mr-2" />
                Guided Breathing
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <BookOpen className="h-4 w-4 mr-2" />
                Wellness Journaling
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Clock className="h-4 w-4 mr-2" />
                Sleep & Recovery
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <TrendingUp className="h-4 w-4 mr-2" />
                Pattern Recognition
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg shadow-md p-1 border">
            <Button
              onClick={() => setActiveFeature('screenshot')}
              variant={activeFeature === 'screenshot' ? 'default' : 'ghost'}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Screenshot Analysis
            </Button>
            <Button
              onClick={() => setActiveFeature('breathing')}
              variant={activeFeature === 'breathing' ? 'default' : 'ghost'}
              className="flex items-center gap-2"
            >
              <Wind className="h-4 w-4" />
              4-6 Breathing
            </Button>
            <Button
              onClick={() => setActiveFeature('journal')}
              variant={activeFeature === 'journal' ? 'default' : 'ghost'}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Wellness Journal
            </Button>
          </div>
        </div>

        {/* Content based on active feature */}
        {activeFeature === 'screenshot' ? (
          <div>
            {!showInsights ? (
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

                {/* Features Preview */}
                <MetricsOverview />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Analysis Results */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Your Fitness Insights Are Ready! 🎯
                  </h2>
                  <Button onClick={resetAnalysis} variant="outline">
                    Analyze Another Image
                  </Button>
                </div>

                <InsightsDashboard uploadedImage={uploadedImage} />
              </div>
            )}
          </div>
        ) : activeFeature === 'breathing' ? (
          <BreathingExercises />
        ) : (
          <WellnessJournal />
        )}

        {/* How It Works */}
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
