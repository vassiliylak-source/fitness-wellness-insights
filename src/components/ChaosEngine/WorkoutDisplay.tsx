import { useState } from 'react';
import { GeneratedExercise } from '@/constants/wod';
import { getStruggleWeight } from '@/lib/struggleEngine';
import { Skull, ChevronUp, Info, Play } from 'lucide-react';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface WorkoutDisplayProps {
  exercises: GeneratedExercise[];
  criticalOverload: GeneratedExercise | null;
  protocolName: string;
  targetTime: number;
}

const WorkoutDisplay = ({ 
  exercises, 
  criticalOverload, 
  protocolName,
  targetTime 
}: WorkoutDisplayProps) => {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  const toggleInstructions = (exerciseId: string) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
  };

  return (
    <div className="space-y-4">
      {/* Protocol Header */}
      <div className="text-center border-b border-border pb-4">
        <div className="text-xs text-muted-foreground uppercase tracking-widest">
          COMPILED
        </div>
        <div className="text-xl font-bold text-primary terminal-glow uppercase">
          {protocolName}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          TARGET: <span className="text-foreground">{formatTime(targetTime)}</span>
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-2">
        {exercises.map((item, index) => {
          const weight = getStruggleWeight(item.exercise.name);
          const isHighIntensity = weight >= 0.5;
          const isTimeBased = item.format === 'seconds';
          const isExpanded = expandedExercise === item.exercise.id;

          return (
            <div
              key={`${item.exercise.id}-${index}`}
              className={`exercise-card animate-fade-in ${
                isHighIntensity ? 'border-l-destructive' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.exercise.icon}</span>
                  <div>
                    <div className="font-bold uppercase text-sm">
                      {item.exercise.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      W: {weight.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      isHighIntensity ? 'text-destructive' : 'text-primary'
                    }`}>
                      {isTimeBased ? formatTime(item.value) : item.value}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase">
                      {isTimeBased ? 'HOLD' : 'REPS'}
                    </div>
                  </div>
                  
                  {/* How-to button */}
                  <button
                    onClick={() => toggleInstructions(item.exercise.id)}
                    className={`p-2 border transition-all ${
                      isExpanded 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
                    }`}
                    aria-label="Show instructions"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Instructions with Video */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border/50 animate-fade-in space-y-3">
                  {/* Video Demo */}
                  {item.exercise.videoUrl && (
                    <div className="relative aspect-video w-full max-w-md mx-auto bg-black/50 rounded overflow-hidden">
                      <iframe
                        src={item.exercise.videoUrl}
                        title={`${item.exercise.name} demonstration`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  
                  {/* Text Instructions */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">
                        HOW TO:
                      </div>
                      {item.exercise.videoUrl && (
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Play className="w-3 h-3" />
                          <span>VIDEO ABOVE</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {item.exercise.instructions}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Critical Overload */}
      {criticalOverload && (
        <div className="border-2 border-destructive bg-destructive/5 p-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Skull className="w-5 h-5 text-destructive" />
            <span className="text-xs uppercase tracking-widest text-destructive font-bold">
              CRITICAL OVERLOAD (+25%)
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{criticalOverload.exercise.icon}</span>
              <span className="font-bold uppercase">
                {criticalOverload.exercise.name}
              </span>
            </div>
            <div className="text-2xl font-bold text-destructive danger-glow">
              {criticalOverload.format === 'seconds' 
                ? formatTime(criticalOverload.value) 
                : criticalOverload.value}
            </div>
          </div>

          {/* Critical Overload Instructions - Always visible */}
          <div className="mt-3 pt-3 border-t border-destructive/30">
            <p className="text-xs text-foreground/70 leading-relaxed">
              {criticalOverload.exercise.instructions}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDisplay;
