import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageAnalysisResult } from "@/services/imageAnalysis";

export const useFitnessAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeWithAI = async (analysisResult: ImageAnalysisResult | null) => {
    if (!analysisResult?.fitnessData) {
      toast({
        title: "No fitness data",
        description: "Please upload a fitness screenshot first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAiInsights(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-fitness', {
        body: {
          fitnessData: analysisResult.fitnessData,
          extractedText: analysisResult.extractedText
        }
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes("Rate limit")) {
          toast({
            title: "Too many requests",
            description: "Please wait a moment before trying again.",
            variant: "destructive"
          });
        } else if (data.error.includes("credits")) {
          toast({
            title: "Credits exhausted",
            description: "Please add credits to continue using AI insights.",
            variant: "destructive"
          });
        } else {
          throw new Error(data.error);
        }
        return;
      }

      setAiInsights(data.insights);
      toast({
        title: "AI Analysis Complete! 🤖",
        description: "Your personalized insights are ready.",
      });
    } catch (error) {
      console.error("AI analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    aiInsights,
    analyzeWithAI,
    setAiInsights
  };
};
