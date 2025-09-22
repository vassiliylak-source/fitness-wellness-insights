import React from 'react';
import { BreathingState } from '@/types/ui';
import { BREATHING_CONFIG } from '@/constants';
import { getPhaseColor, getPhaseDisplay } from '../utils/breathingUtils';

interface BreathingCircleProps {
  breathingState: BreathingState;
  currentTechnique: any;
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({ breathingState, currentTechnique }) => {
  const getCircleScale = () => {
    if (breathingState.phase === 'inhale') {
      return BREATHING_CONFIG.maxScale - breathingState.count / currentTechnique.inhaleCount * (BREATHING_CONFIG.maxScale - BREATHING_CONFIG.baseScale);
    } else if (breathingState.phase === 'hold' || breathingState.phase === 'pause') {
      return BREATHING_CONFIG.maxScale;
    } else {
      return BREATHING_CONFIG.baseScale + breathingState.count / currentTechnique.exhaleCount * (BREATHING_CONFIG.maxScale - BREATHING_CONFIG.baseScale);
    }
  };

  const phaseColor = getPhaseColor(breathingState.phase, currentTechnique.color);
  const phaseDisplay = getPhaseDisplay(breathingState.phase);

  return (
    <div className="flex justify-center">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
        <div 
          className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 transition-all duration-1000 ease-in-out ${phaseColor.border} ${phaseColor.bg}`}
          style={{ transform: `scale(${getCircleScale()})` }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold ${phaseColor.text}`}>
                {breathingState.count}
              </div>
              <div className={`text-sm font-medium ${phaseColor.textLight}`}>
                {phaseDisplay}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingCircle;