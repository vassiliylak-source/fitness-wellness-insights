import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, Heart, Brain, Waves } from "lucide-react";
import ExternalLink from "@/components/common/ExternalLink";

interface MeditationTechnique {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  benefits: string[];
  color: string;
  icon: any;
}

const MEDITATION_TECHNIQUES: MeditationTechnique[] = [
  {
    id: 'mindfulness',
    name: 'Mindfulness Meditation',
    description: 'Focus on the present moment and observe your thoughts without judgment.',
    duration: 300, // 5 minutes
    benefits: ['Reduces stress', 'Improves focus', 'Enhances self-awareness'],
    color: 'emerald',
    icon: Brain
  },
  {
    id: 'loving-kindness',
    name: 'Loving-Kindness Meditation',
    description: 'Cultivate compassion and love towards yourself and others.',
    duration: 480, // 8 minutes
    benefits: ['Increases empathy', 'Reduces negative emotions', 'Builds emotional resilience'],
    color: 'rose',
    icon: Heart
  },
  {
    id: 'body-scan',
    name: 'Body Scan Meditation',
    description: 'Systematically focus on different parts of your body to release tension.',
    duration: 600, // 10 minutes
    benefits: ['Releases physical tension', 'Improves body awareness', 'Promotes relaxation'],
    color: 'blue',
    icon: Waves
  }
];

const MeditationExercises = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<MeditationTechnique>(MEDITATION_TECHNIQUES[0]);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(selectedTechnique.duration);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          setProgress(((selectedTechnique.duration - newTime) / selectedTechnique.duration) * 100);
          
          if (newTime <= 0) {
            setIsActive(false);
            return selectedTechnique.duration;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, selectedTechnique.duration]);

  const toggleMeditation = () => {
    setIsActive(!isActive);
  };

  const resetMeditation = () => {
    setIsActive(false);
    setTimeRemaining(selectedTechnique.duration);
    setProgress(0);
  };

  const changeTechnique = (techniqueId: string) => {
    const technique = MEDITATION_TECHNIQUES.find(t => t.id === techniqueId);
    if (technique) {
      setSelectedTechnique(technique);
      setTimeRemaining(technique.duration);
      setProgress(0);
      setIsActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnimationScale = () => {
    if (!isActive) return 1;
    // Gentle breathing-like animation
    const breathingCycle = (Date.now() / 1000) % 8; // 8-second cycle
    if (breathingCycle < 4) {
      return 1 + (breathingCycle / 4) * 0.2; // Expand over 4 seconds
    } else {
      return 1.2 - ((breathingCycle - 4) / 4) * 0.2; // Contract over 4 seconds
    }
  };

  const Icon = selectedTechnique.icon;

  return (
    <Card className="card-modern">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl md:text-3xl font-bold gradient-text">
            Meditation Exercises
          </CardTitle>
          
          <Select value={selectedTechnique.id} onValueChange={changeTechnique}>
            <SelectTrigger className="w-48 glass-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card">
              {MEDITATION_TECHNIQUES.map((technique) => (
                <SelectItem key={technique.id} value={technique.id}>
                  {technique.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {selectedTechnique.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Meditation Animation Circle */}
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            {/* Progress ring */}
            <svg className="w-80 h-80 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="4"
                className="opacity-20"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={`hsl(var(--${selectedTechnique.color}-500))`}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={339.292}
                strokeDashoffset={339.292 - (339.292 * progress) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            {/* Central meditation circle */}
            <div 
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                w-64 h-64 rounded-full flex items-center justify-center
                transition-all duration-1000 ease-in-out`}
              style={{
                transform: `translate(-50%, -50%) scale(${getAnimationScale()})`,
                background: `linear-gradient(135deg, hsl(var(--${selectedTechnique.color}-400)), hsl(var(--${selectedTechnique.color}-600)))`,
                boxShadow: isActive 
                  ? `0 0 60px hsl(var(--${selectedTechnique.color}-500) / 0.6)` 
                  : `0 0 30px hsl(var(--${selectedTechnique.color}-500) / 0.3)`
              }}
            >
              <Icon className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </div>

          {/* Timer and Status */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold gradient-text">
              {formatTime(timeRemaining)}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {isActive ? '🧘‍♀️ Meditating' : '🕯️ Ready to Begin'}
              </Badge>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={toggleMeditation}
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-2xl hover-lift"
              style={{
                background: isActive 
                  ? 'hsl(var(--destructive))' 
                  : `linear-gradient(135deg, hsl(var(--${selectedTechnique.color}-500)), hsl(var(--${selectedTechnique.color}-600)))`
              }}
            >
              {isActive ? <Pause className="w-6 h-6 mr-2" /> : <Play className="w-6 h-6 mr-2" />}
              {isActive ? 'Pause' : 'Start Meditation'}
            </Button>
            
            <Button
              onClick={resetMeditation}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-2xl hover-lift"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Technique Benefits */}
        <div className="card-elegant">
          <h3 className="text-xl font-semibold mb-4 gradient-text">
            Benefits of {selectedTechnique.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedTechnique.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"></span>
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meditation Instructions */}
        <div className="card-elegant">
          <h3 className="text-xl font-semibold mb-4 gradient-text">
            How to Practice
          </h3>
          <div className="space-y-3 text-muted-foreground">
            {selectedTechnique.id === 'mindfulness' && (
              <>
                <p>• Find a comfortable seated position and close your eyes</p>
                <p>• Focus on your natural breath without trying to change it</p>
                <p>• When thoughts arise, acknowledge them without judgment and return to your breath</p>
                <p>• Start with short sessions and gradually increase the duration</p>
              </>
            )}
            {selectedTechnique.id === 'loving-kindness' && (
              <>
                <p>• Begin by sending loving thoughts to yourself: "May I be happy, may I be healthy"</p>
                <p>• Extend these wishes to loved ones, neutral people, and even difficult people</p>
                <p>• Visualize each person and genuinely wish them well</p>
                <p>• End by sending loving-kindness to all beings everywhere</p>
              </>
            )}
            {selectedTechnique.id === 'body-scan' && (
              <>
                <p>• Lie down comfortably and close your eyes</p>
                <p>• Start from the top of your head and slowly move your attention down</p>
                <p>• Notice sensations in each body part without trying to change anything</p>
                <p>• Breathe into areas of tension and allow them to soften</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationExercises;