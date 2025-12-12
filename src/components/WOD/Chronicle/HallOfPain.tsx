import { Trophy, Clock, Skull } from 'lucide-react';
import { formatTime } from '@/constants/wod';
import { GeneratedExercise } from '@/constants/wod';

interface WorkoutLog {
  id: string;
  workout_hash: string;
  package_type: string;
  exercises: GeneratedExercise[];
  target_time: number;
  actual_time: number | null;
  difficulty_rating: number | null;
  feeling: 'dead' | 'ok' | 'more' | null;
  completed_at: string;
}

interface HallOfPainProps {
  workouts: WorkoutLog[];
}

const HallOfPain = ({ workouts }: HallOfPainProps) => {
  if (workouts.length === 0) {
    return (
      <div className="card-brutal p-6 text-center">
        <Skull className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
        <p className="font-mono text-sm text-muted-foreground">
          No recorded protocols.
          <br />
          <span className="text-primary">Execute your first sequence.</span>
        </p>
      </div>
    );
  }

  // Find fastest times per workout hash
  const fastestTimes: Record<string, number> = {};
  workouts.forEach(w => {
    if (w.actual_time) {
      if (!fastestTimes[w.workout_hash] || w.actual_time < fastestTimes[w.workout_hash]) {
        fastestTimes[w.workout_hash] = w.actual_time;
      }
    }
  });

  return (
    <div className="card-brutal p-4 md:p-6">
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-mono flex items-center gap-2">
        <span className="text-primary">//</span> HALL OF PAIN
        <span className="text-muted-foreground/40 ml-auto">{workouts.length} ENTRIES</span>
      </h3>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
        {workouts.map((workout, index) => {
          const isFastest = workout.actual_time === fastestTimes[workout.workout_hash];
          const beatTarget = workout.actual_time && workout.actual_time < workout.target_time;
          
          return (
            <div 
              key={workout.id}
              className={`p-4 border transition-all ${
                isFastest ? 'border-energy bg-energy/5' : 'border-border bg-card/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Date and Package */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      {new Date(workout.completed_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-[10px] font-mono text-primary uppercase">
                      {workout.package_type}
                    </span>
                    {isFastest && (
                      <Trophy className="w-3 h-3 text-energy" />
                    )}
                  </div>
                  
                  {/* Exercises summary */}
                  <div className="text-xs font-mono text-foreground truncate">
                    {workout.exercises.map(e => e.exercise.name).join(' • ')}
                  </div>
                </div>

                {/* Time */}
                <div className="text-right">
                  {workout.actual_time ? (
                    <>
                      <div className={`text-lg font-mono font-black ${
                        beatTarget ? 'text-accent' : 'text-destructive'
                      }`}>
                        {formatTime(workout.actual_time)}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        vs {formatTime(workout.target_time)}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm font-mono text-muted-foreground">
                      <Clock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Feeling indicator */}
              {workout.feeling && (
                <div className="mt-2 text-right">
                  <span className="text-lg">
                    {workout.feeling === 'dead' && '😫'}
                    {workout.feeling === 'ok' && '😐'}
                    {workout.feeling === 'more' && '💪'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HallOfPain;
