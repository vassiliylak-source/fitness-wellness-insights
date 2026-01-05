import { Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkoutDisplay from './WorkoutDisplay';
import IntegrityChecks from './IntegrityChecks';
import LockedTimer from './LockedTimer';
import { GeneratedExercise } from '@/constants/wod';

interface WorkoutExecutionSectionProps {
  exercises: GeneratedExercise[];
  criticalOverload: GeneratedExercise | null;
  protocolName: string;
  targetTime: number;
  integrityPassed: boolean;
  showTimer: boolean;
  onIntegrityComplete: () => void;
  onStartTimer: () => void;
  onTimerComplete: (time: number, beatTarget: boolean) => void;
  onTimerAbort: () => void;
}

const WorkoutExecutionSection = ({
  exercises,
  criticalOverload,
  protocolName,
  targetTime,
  integrityPassed,
  showTimer,
  onIntegrityComplete,
  onStartTimer,
  onTimerComplete,
  onTimerAbort,
}: WorkoutExecutionSectionProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Workout Display - Always visible so user knows what's next */}
      <div className="card-terminal p-6">
        <WorkoutDisplay
          exercises={exercises}
          criticalOverload={criticalOverload}
          protocolName={protocolName}
          targetTime={targetTime}
        />
      </div>

      {/* Integrity Checks - Hidden but mounted to preserve state */}
      <div className={`card-terminal p-6 ${showTimer ? 'hidden' : ''}`}>
        <IntegrityChecks 
          onAllChecked={onIntegrityComplete}
          disabled={showTimer}
        />

        {integrityPassed && !showTimer && (
          <Button
            onClick={onStartTimer}
            className="btn-terminal w-full mt-6 animate-fade-in"
          >
            <Skull className="w-4 h-4 mr-2" />
            ENGAGE EXECUTION TERMINAL
          </Button>
        )}
      </div>

      {/* Timer Section */}
      {showTimer && (
        <div className="card-terminal p-6 animate-fade-in">
          <LockedTimer
            targetTime={targetTime}
            onComplete={onTimerComplete}
            onAbort={onTimerAbort}
          />
        </div>
      )}
    </div>
  );
};

export default WorkoutExecutionSection;
