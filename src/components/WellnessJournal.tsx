
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Heart, 
  Moon, 
  Zap, 
  Brain, 
  Smile, 
  Calendar,
  TrendingUp,
  BookOpen,
  Sparkles,
  Loader2,
  AlertTriangle
} from "lucide-react";
import ScaleInput from "./ScaleInput";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { useWellnessAnalysis } from "@/hooks/useWellnessAnalysis";

const WellnessJournal = () => {
  const {
    currentEntry,
    savedEntries,
    handleScaleChange,
    handleTextChange,
    saveEntry
  } = useJournalEntries();

  const {
    isAnalyzing,
    analysisResults,
    performAIAnalysis
  } = useWellnessAnalysis();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800">
            <BookOpen className="h-6 w-6 text-green-600" />
            Daily Recovery & Wellness Journal
          </CardTitle>
          <CardDescription className="text-lg">
            🧘 Track wellness inside and out. Go beyond metrics to reflect on how you feel, 
            spot patterns, and support recovery from burnout, training fatigue, or daily stress.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Important Health Disclaimer */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Health Disclaimer:</strong> This wellness journal is for self-reflection purposes only. 
          AI analysis can make mistakes and should not replace professional medical or mental health advice. 
          If you're experiencing persistent health concerns, please consult with a qualified healthcare provider or therapist.
        </AlertDescription>
      </Alert>

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
          {/* Wellness Scales */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ScaleInput
                label="Mood"
                value={currentEntry.mood}
                onChange={(value) => handleScaleChange('mood', value)}
                icon={Smile}
                lowLabel="😔 Low"
                highLabel="😊 Great"
              />
              
              <ScaleInput
                label="Energy Level"
                value={currentEntry.energy}
                onChange={(value) => handleScaleChange('energy', value)}
                icon={Zap}
                lowLabel="⚡ Drained"
                highLabel="🔋 Energized"
              />

              <ScaleInput
                label="Stress Level"
                value={currentEntry.stress}
                onChange={(value) => handleScaleChange('stress', value)}
                icon={Brain}
                lowLabel="😌 Calm"
                highLabel="😰 Stressed"
              />
            </div>

            <div className="space-y-4">
              <ScaleInput
                label="Sleep Quality"
                value={currentEntry.sleep}
                onChange={(value) => handleScaleChange('sleep', value)}
                icon={Moon}
                lowLabel="😴 Poor"
                highLabel="🌙 Excellent"
              />

              <ScaleInput
                label="Recovery"
                value={currentEntry.recovery}
                onChange={(value) => handleScaleChange('recovery', value)}
                icon={Heart}
                lowLabel="🔴 Fatigued"
                highLabel="🟢 Recovered"
              />
            </div>
          </div>

          {/* Text Reflections */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Daily Notes & Reflections
              </label>
              <Textarea
                placeholder="How are you feeling today? What's on your mind? Any physical sensations or emotional insights..."
                value={currentEntry.notes}
                onChange={(e) => handleTextChange('notes', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Goals & Intentions
              </label>
              <Textarea
                placeholder="What do you want to focus on today? Any recovery or wellness goals..."
                value={currentEntry.goals}
                onChange={(e) => handleTextChange('goals', e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Gratitude & Wins
              </label>
              <Textarea
                placeholder="What are you grateful for? Any small wins or positive moments..."
                value={currentEntry.gratitude}
                onChange={(e) => handleTextChange('gratitude', e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={saveEntry} className="flex-1">
              Save Today's Entry
            </Button>
            {savedEntries.length > 0 && (
              <Button 
                onClick={() => performAIAnalysis(savedEntries)} 
                variant="outline"
                disabled={isAnalyzing}
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

      {/* AI Integration Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Maximize Your Journaling with AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-gray-700">
              🤖 <strong>Get instant AI insights</strong> from your wellness entries:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
              <li>Discover mood and energy patterns over time</li>
              <li>Get personalized recovery recommendations</li>
              <li>Identify triggers for stress or low energy</li>
              <li>Receive gentle suggestions to enhance well-being</li>
              <li>Track progress toward your wellness goals</li>
            </ul>
            <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
              <p className="text-sm text-purple-700 font-medium">
                💡 Tip: Keep journaling consistently to get more accurate and valuable insights!
              </p>
            </div>
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Remember:</strong> AI can make mistakes. These insights are for general wellness reflection only. 
                For health concerns, always consult with a qualified healthcare provider or therapist.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries Summary */}
      {savedEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Wellness Journey ({savedEntries.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-600">
              <p>Keep tracking consistently to build insights! 🌱</p>
              <p className="text-sm mt-2">
                Your data is stored locally and privately. Use AI Analysis for instant insights.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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

export default WellnessJournal;
