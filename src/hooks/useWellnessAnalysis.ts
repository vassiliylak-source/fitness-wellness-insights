
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { JournalEntry } from "@/types/wellness";
import { generateWellnessAnalysis } from "@/utils/wellness";

export const useWellnessAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<string | null>(null);
  const { toast } = useToast();

  const performAIAnalysis = async (savedEntries: JournalEntry[]) => {
    if (savedEntries.length === 0) {
      toast({
        title: "No data to analyze",
        description: "Please save at least one journal entry before analyzing.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis with mock insights
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockAnalysis = generateWellnessAnalysis(savedEntries);
      
      setAnalysisResults(mockAnalysis);
      
      toast({
        title: "AI Analysis Complete! 🤖",
        description: "Your wellness insights are ready below.",
      });
    } catch (error) {
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
    analysisResults,
    performAIAnalysis
  };
};
