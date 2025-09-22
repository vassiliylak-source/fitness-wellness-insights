
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles, Loader2 } from "lucide-react";
import { useWellness } from "@/contexts/WellnessContext";
import { useWellnessAnalysis } from "@/hooks/useWellnessAnalysis";
import WellnessHeader from "./WellnessJournal/WellnessHeader";
import WellnessScales from "./WellnessJournal/WellnessScales";
import WellnessReflections from "./WellnessJournal/WellnessReflections";
import WellnessInfoCards from "./WellnessJournal/WellnessInfoCards";

const WellnessJournal = () => {
  const {
    currentEntry,
    savedEntries,
    updateEntry,
    saveEntry
  } = useWellness();

  const {
    isAnalyzing,
    analysisResults,
    performAIAnalysis
  } = useWellnessAnalysis(savedEntries);

  return (
    <div className="space-y-6">
      <WellnessHeader />

      {/* Journal Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Entry - {new Date().toLocaleDateString()}
          </CardTitle>
          <CardDescription>
            Rate your wellness on a scale of 1-10 and add your reflections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <WellnessScales 
            currentEntry={currentEntry} 
            onScaleChange={(field, value) => updateEntry(field, value)} 
          />
          
          <WellnessReflections 
            currentEntry={currentEntry} 
            onTextChange={(field, value) => updateEntry(field, value)} 
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={saveEntry} className="flex-1 order-1">
              Save Today's Entry
            </Button>
            {savedEntries.length > 0 && (
              <Button 
                onClick={performAIAnalysis} 
                variant="outline"
                disabled={isAnalyzing}
                className="sm:flex-initial order-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Analysis
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {analysisResults && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Your Wellness Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                {analysisResults}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      <WellnessInfoCards savedEntries={savedEntries} />
    </div>
  );
};

export default WellnessJournal;
