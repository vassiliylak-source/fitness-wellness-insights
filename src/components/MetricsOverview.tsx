import { Badge } from "@/components/ui/badge";
import { Smartphone } from "lucide-react";
import PhotoUpload from "@/components/PhotoUpload";
import InsightsDashboard from "@/components/InsightsDashboard";
import { analyzeImage } from "@/services/imageAnalysis";
import { useScreenshotAnalysis } from "@/contexts/ScreenshotAnalysisContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MetricsOverview = () => {
  const { uploadedImage, analysisResult, setUploadedImage, setAnalysisResult } = useScreenshotAnalysis();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  
  const apps = ["Apple Health", "Strava", "Garmin Connect", "Fitbit", "MyFitnessPal", "Oura Ring", "Whoop", "Coros", "Wahoo"];

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);

    toast({
      title: "Analyzing image...",
      description: "Extracting fitness data from your screenshot.",
    });

    try {
      const result = await analyzeImage(file);
      setAnalysisResult(result);

      if (result.isFitnessData) {
        toast({
          title: "Analysis complete!",
          description: `Detected: ${result.fitnessData?.detectedMetrics.join(", ") || "fitness data"}`,
        });
      } else {
        toast({
          title: "No fitness data detected",
          description: "Please upload a screenshot from your fitness app.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Please try again with a different image.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Supported Apps Section */}
      <div className="card-elegant space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-xl">
            <Smartphone className="h-5 w-5 text-primary" />
            <span className="font-semibold text-muted-foreground">Universal Compatibility</span>
          </div>
          
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black gradient-text">
            Works with All Your Favorite Apps
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Upload screenshots from any fitness app and get instant AI-powered insights
          </p>
        </div>

        {/* App badges with enhanced styling */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {apps.map((app, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold glass-card hover-lift border-primary/20 hover:border-primary/40 transition-all duration-300" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {app}
            </Badge>
          ))}
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="card-elegant">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black gradient-text text-center mb-8">
          Upload Your Fitness Screenshot
        </h3>
        <PhotoUpload onImageUpload={handleImageUpload} />
      </div>

      {/* Show results if available */}
      {uploadedImage && analysisResult && (
        <InsightsDashboard 
          uploadedImage={uploadedImage} 
          analysisResult={analysisResult} 
        />
      )}
    </div>
  );
};

export default MetricsOverview;
