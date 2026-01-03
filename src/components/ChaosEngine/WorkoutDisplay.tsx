import { GeneratedExercise } from '@/constants/wod';
import { getStruggleWeight } from '@/lib/struggleEngine';
import { Skull } from 'lucide-react';

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
              </div>
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
        </div>
      )}
    </div>
  );
};

export default WorkoutDisplay;
