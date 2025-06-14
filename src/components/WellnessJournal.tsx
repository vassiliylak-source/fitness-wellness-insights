
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
  Loader2
} from "lucide-react";

interface JournalEntry {
  date: string;
  mood: number;
  energy: number;
  stress: number;
  sleep: number;
  recovery: number;
  notes: string;
  goals: string;
  gratitude: string;
}

const WellnessJournal = () => {
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    date: new Date().toISOString().split('T')[0],
    mood: 5,
    energy: 5,
    stress: 5,
    sleep: 5,
    recovery: 5,
    notes: '',
    goals: '',
    gratitude: ''
  });
  
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<string | null>(null);
  const { toast } = useToast();

  const handleScaleChange = (field: keyof JournalEntry, value: number) => {
    setCurrentEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field: keyof JournalEntry, value: string) => {
    setCurrentEntry(prev => ({ ...prev, [field]: value }));
  };

  const saveEntry = () => {
    const newEntries = [...savedEntries, currentEntry];
    setSavedEntries(newEntries);
    localStorage.setItem('wellness-entries', JSON.stringify(newEntries));
    
    toast({
      title: "Entry saved! 🌟",
      description: "Your wellness data has been recorded for today.",
    });

    // Reset for next entry
    setCurrentEntry({
      date: new Date().toISOString().split('T')[0],
      mood: 5,
      energy: 5,
      stress: 5,
      sleep: 5,
      recovery: 5,
      notes: '',
      goals: '',
      gratitude: ''
    });
  };

  const performAIAnalysis = async () => {
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
      
      const mockAnalysis = `
**🌟 Wellness Insights Analysis**

**Overall Patterns:**
• Your average mood score is ${Math.round(savedEntries.reduce((sum, entry) => sum + entry.mood, 0) / savedEntries.length)}/10 - showing ${savedEntries.reduce((sum, entry) => sum + entry.mood, 0) / savedEntries.length > 6 ? 'positive' : 'room for improvement'} emotional well-being
• Energy levels tend to ${savedEntries.some(entry => entry.energy > 6) ? 'fluctuate with good peaks' : 'stay moderate - consider sleep and nutrition optimization'}
• Stress management appears ${savedEntries.reduce((sum, entry) => sum + entry.stress, 0) / savedEntries.length < 6 ? 'well-controlled' : 'to need attention'}

**Key Recommendations:**
• Focus on consistency in sleep quality (current average: ${Math.round(savedEntries.reduce((sum, entry) => sum + entry.sleep, 0) / savedEntries.length)}/10)
• Consider mindfulness practices to maintain emotional balance
• Track patterns between energy levels and daily activities

**Recovery Focus:**
Your recovery scores suggest ${savedEntries.reduce((sum, entry) => sum + entry.recovery, 0) / savedEntries.length > 6 ? 'good body awareness and rest practices' : 'need for more intentional recovery time'}

Keep tracking consistently to build deeper insights! 🙏
      `;
      
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

  const ScaleInput = ({ 
    label, 
    value, 
    onChange, 
    icon: Icon,
    lowLabel = "Low",
    highLabel = "High"
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    icon: any;
    lowLabel?: string;
    highLabel?: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-600" />
        <span className="font-medium">{label}</span>
        <Badge variant="outline" className="ml-auto">
          {value}/10
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">{lowLabel}</span>
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-xs text-gray-500">{highLabel}</span>
      </div>
    </div>
  );

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
                onClick={performAIAnalysis} 
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
    </div>
  );
};

export default WellnessJournal;
