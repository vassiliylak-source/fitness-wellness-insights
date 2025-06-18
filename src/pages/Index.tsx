import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Brain, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();
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
          <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800">
                <Upload className="h-6 w-6 text-blue-600" />
                {t('upload.title')}
              </CardTitle>
              <CardDescription className="text-lg">
                {t('upload.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhotoUpload onImageUpload={handleImageUpload} />
              
              {uploadedImage && <div className="mt-6 text-center">
                  <img src={uploadedImage} alt="Uploaded fitness data" className="max-w-md mx-auto rounded-lg shadow-lg" />
                  <Button onClick={resetAnalysis} variant="outline" className="mt-4">
                    {t('upload.different')}
                  </Button>
                </div>}

              {isAnalyzing && <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
                    <span className="text-lg font-medium">{t('upload.analyzing')}</span>
                  </div>
                  <Progress value={66} className="w-full max-w-md mx-auto" />
                  <div className="text-center text-sm text-gray-600">
                    {t('upload.reading')}
                  </div>
                </div>}

              {/* Show error message if analysis result shows not a fitness data */}
              {analysisResult && !analysisResult.isFitnessData && <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-center space-y-3">
                    <div className="text-red-600 text-lg font-medium">
                      ❌ {t('upload.error.title')}
                    </div>
                    <p className="text-red-700">
                      {analysisResult.error}
                    </p>
                    <div className="text-sm text-red-600">
                      <p className="font-medium mb-2">{t('upload.error.supported')}</p>
                      <p>{t('upload.error.apps')}</p>
                    </div>
                  </div>
                </div>}
            </CardContent>
          </Card>

          <MetricsOverview />

          {/* Support Section */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-700">{t('support.text')}</p>
                <div className="flex justify-center">
                  <a href="https://paypal.me/vaskenzy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    {t('support.button')}
                  </a>
                </div>
                <p className="text-xs text-gray-600">
                  {t('support.thanks')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>;
    }
    return <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('insights.title')}
          </h2>
          <Button onClick={resetAnalysis} variant="outline">
            {t('upload.another')}
          </Button>
        </div>
        {/* Pass analysisResult to InsightsDashboard component */}
        <InsightsDashboard uploadedImage={uploadedImage} analysisResult={analysisResult} />

        {/* Support Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-700">
                {t('support.text')}
              </p>
              <div className="flex justify-center">
                <a href="https://paypal.me/vaskenzy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  {t('support.button')}
                </a>
              </div>
              <p className="text-xs text-gray-600">
                {t('support.thanks')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>;
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <HeroSection />

      {/* Complete Wellness Platform - moved up after hero section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HowItWorksSection />
      </div>

      {/* Data Privacy Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[18px]">
        <DataPrivacyNotice />
      </div>

      {/* Health Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[18px]">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">{t('health.disclaimer')}</h4>
                <p className="text-sm text-amber-700">
                  {t('health.disclaimer.text')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Selection and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeatureNavigation activeFeature={activeFeature} onFeatureChange={setActiveFeature} />

        {/* Content based on active feature */}
        {activeFeature === 'screenshot' && renderScreenshotContent()}
        {activeFeature === 'breathing' && <BreathingExercises />}
        {activeFeature === 'journal' && <WellnessJournal />}
      </div>

      {/* Copyright Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Vassiliy Lakhonin. {t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
