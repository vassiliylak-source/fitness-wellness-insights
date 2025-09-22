import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { BreathingState } from '@/types/ui';

interface BreathingControlsProps {
  breathingState: BreathingState;
  currentTechnique: any;
  onToggle: () => void;
  onReset: () => void;
}

const BreathingControls: React.FC<BreathingControlsProps> = ({
  breathingState,
  currentTechnique,
  onToggle,
  onReset
}) => {
  const getButtonColor = () => {
    if (breathingState.isActive) {
      return 'bg-red-500 hover:bg-red-600';
    }
    
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500 hover:bg-blue-600',
      green: 'bg-green-500 hover:bg-green-600',
      purple: 'bg-purple-500 hover:bg-purple-600'
    };
    
    return colorMap[currentTechnique.color] || 'bg-indigo-500 hover:bg-indigo-600';
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
      <Button 
        onClick={onToggle} 
        className={`flex items-center gap-2 ${getButtonColor()}`}
      >
        {breathingState.isActive ? (
          <>
            <Pause className="h-4 w-4" />
            Pause
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Start
          </>
        )}
      </Button>
      <Button onClick={onReset} variant="outline" className="flex items-center gap-2">
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
};

export default BreathingControls;