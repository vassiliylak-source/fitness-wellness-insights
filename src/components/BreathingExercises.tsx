import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Play, Pause, RotateCcw, ChevronDown } from "lucide-react";
import { BREATHING_TECHNIQUES, BREATHING_CONFIG, ANIMATION_DURATIONS } from "@/constants";
import { BreathingState, BreathingTechnique } from "@/types/ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const BreathingExercises = () => {
  const [breathingState, setBreathingState] = useState<BreathingState>({
    isActive: false,
    phase: 'inhale',
    count: BREATHING_TECHNIQUES.relaxation.inhaleCount,
    cycle: 0,
    technique: 'relaxation'
  });
  const currentTechnique = BREATHING_TECHNIQUES[breathingState.technique];
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breathingState.isActive) {
      interval = setInterval(() => {
        setBreathingState(prev => {
          const technique = BREATHING_TECHNIQUES[prev.technique];
          if (prev.phase === 'inhale' && prev.count <= 1) {
            // Move to hold phase if technique has hold, otherwise exhale
            if (technique.holdCount > 0) {
              return {
                ...prev,
                phase: 'hold',
                count: technique.holdCount
              };
            } else {
              return {
                ...prev,
                phase: 'exhale',
                count: technique.exhaleCount
              };
            }
          } else if (prev.phase === 'hold' && prev.count <= 1) {
            return {
              ...prev,
              phase: 'exhale',
              count: technique.exhaleCount
            };
          } else if (prev.phase === 'exhale' && prev.count <= 1) {
            // For box breathing, add pause phase
            if (prev.technique === 'box') {
              return {
                ...prev,
                phase: 'pause',
                count: technique.holdCount
              };
            } else {
              return {
                ...prev,
                phase: 'inhale',
                count: technique.inhaleCount,
                cycle: prev.cycle + 1
              };
            }
          } else if (prev.phase === 'pause' && prev.count <= 1) {
            return {
              ...prev,
              phase: 'inhale',
              count: technique.inhaleCount,
              cycle: prev.cycle + 1
            };
          }
          return {
            ...prev,
            count: prev.count - 1
          };
        });
      }, ANIMATION_DURATIONS.breathingCycle);
    }
    return () => clearInterval(interval);
  }, [breathingState.isActive, breathingState.phase, breathingState.technique]);
  const toggleBreathing = () => {
    setBreathingState(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  };
  const resetBreathing = () => {
    const technique = BREATHING_TECHNIQUES[breathingState.technique];
    setBreathingState({
      isActive: false,
      phase: 'inhale',
      count: technique.inhaleCount,
      cycle: 0,
      technique: breathingState.technique
    });
  };
  const changeTechnique = (newTechnique: BreathingTechnique) => {
    const technique = BREATHING_TECHNIQUES[newTechnique];
    setBreathingState({
      isActive: false,
      phase: 'inhale',
      count: technique.inhaleCount,
      cycle: 0,
      technique: newTechnique
    });
  };
  const getCircleScale = () => {
    const technique = BREATHING_TECHNIQUES[breathingState.technique];
    if (breathingState.phase === 'inhale') {
      return BREATHING_CONFIG.maxScale - breathingState.count / technique.inhaleCount * (BREATHING_CONFIG.maxScale - BREATHING_CONFIG.baseScale);
    } else if (breathingState.phase === 'hold' || breathingState.phase === 'pause') {
      return BREATHING_CONFIG.maxScale;
    } else {
      return BREATHING_CONFIG.baseScale + breathingState.count / technique.exhaleCount * (BREATHING_CONFIG.maxScale - BREATHING_CONFIG.baseScale);
    }
  };
  const getPhaseDisplay = () => {
    switch (breathingState.phase) {
      case 'inhale':
        return 'Inhale';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
      case 'pause':
        return 'Pause';
      default:
        return 'Inhale';
    }
  };
  const getPhaseColor = () => {
    const baseColor = currentTechnique.color;
    switch (breathingState.phase) {
      case 'inhale':
        return baseColor === 'blue' ? 'blue' : baseColor === 'green' ? 'green' : baseColor === 'purple' ? 'purple' : 'indigo';
      case 'hold':
        return 'yellow';
      case 'exhale':
        return baseColor === 'blue' ? 'cyan' : baseColor === 'green' ? 'emerald' : baseColor === 'purple' ? 'violet' : 'blue';
      case 'pause':
        return 'gray';
      default:
        return baseColor;
    }
  };
  return <div className="space-y-6">
      <Card className={`bg-gradient-to-r ${currentTechnique.color === 'blue' ? 'from-blue-50 to-cyan-50 border-blue-200' : currentTechnique.color === 'green' ? 'from-green-50 to-emerald-50 border-green-200' : currentTechnique.color === 'purple' ? 'from-purple-50 to-violet-50 border-purple-200' : 'from-indigo-50 to-blue-50 border-indigo-200'}`}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800">
              <Wind className={`h-6 w-6 ${currentTechnique.color === 'blue' ? 'text-blue-600' : currentTechnique.color === 'green' ? 'text-green-600' : currentTechnique.color === 'purple' ? 'text-purple-600' : 'text-indigo-600'}`} />
              {currentTechnique.name}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  Change <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(BREATHING_TECHNIQUES).map(([key, technique]) => <DropdownMenuItem key={key} onClick={() => changeTechnique(key as BreathingTechnique)}>
                    {technique.icon} {technique.name}
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="text-lg">
            {currentTechnique.icon} {currentTechnique.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Breathing Animation Circle */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
              <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 transition-all duration-1000 ease-in-out ${getPhaseColor() === 'blue' ? 'border-blue-500 bg-blue-100' : getPhaseColor() === 'cyan' ? 'border-cyan-500 bg-cyan-100' : getPhaseColor() === 'green' ? 'border-green-500 bg-green-100' : getPhaseColor() === 'emerald' ? 'border-emerald-500 bg-emerald-100' : getPhaseColor() === 'purple' ? 'border-purple-500 bg-purple-100' : getPhaseColor() === 'violet' ? 'border-violet-500 bg-violet-100' : getPhaseColor() === 'indigo' ? 'border-indigo-500 bg-indigo-100' : getPhaseColor() === 'yellow' ? 'border-yellow-500 bg-yellow-100' : 'border-gray-500 bg-gray-100'}`} style={{
              transform: `scale(${getCircleScale()})`
            }}>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getPhaseColor() === 'blue' ? 'text-blue-700' : getPhaseColor() === 'cyan' ? 'text-cyan-700' : getPhaseColor() === 'green' ? 'text-green-700' : getPhaseColor() === 'emerald' ? 'text-emerald-700' : getPhaseColor() === 'purple' ? 'text-purple-700' : getPhaseColor() === 'violet' ? 'text-violet-700' : getPhaseColor() === 'indigo' ? 'text-indigo-700' : getPhaseColor() === 'yellow' ? 'text-yellow-700' : 'text-gray-700'}`}>
                      {breathingState.count}
                    </div>
                    <div className={`text-sm font-medium ${getPhaseColor() === 'blue' ? 'text-blue-600' : getPhaseColor() === 'cyan' ? 'text-cyan-600' : getPhaseColor() === 'green' ? 'text-green-600' : getPhaseColor() === 'emerald' ? 'text-emerald-600' : getPhaseColor() === 'purple' ? 'text-purple-600' : getPhaseColor() === 'violet' ? 'text-violet-600' : getPhaseColor() === 'indigo' ? 'text-indigo-600' : getPhaseColor() === 'yellow' ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {getPhaseDisplay()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Display */}
          <div className="text-center space-y-2">
            <div className="text-lg font-medium text-gray-700">
              {breathingState.isActive ? <>
                  <span className={`${getPhaseColor() === 'blue' ? 'text-blue-600' : getPhaseColor() === 'cyan' ? 'text-cyan-600' : getPhaseColor() === 'green' ? 'text-green-600' : getPhaseColor() === 'emerald' ? 'text-emerald-600' : getPhaseColor() === 'purple' ? 'text-purple-600' : getPhaseColor() === 'violet' ? 'text-violet-600' : getPhaseColor() === 'indigo' ? 'text-indigo-600' : getPhaseColor() === 'yellow' ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {breathingState.phase === 'inhale' ? 'Breathe In' : breathingState.phase === 'hold' ? 'Hold Your Breath' : breathingState.phase === 'exhale' ? 'Breathe Out' : 'Pause'}
                  </span>
                  <span className="text-gray-500 ml-2">• Cycle {breathingState.cycle + 1}</span>
                </> : 'Ready to begin'}
            </div>
            {!breathingState.isActive && breathingState.cycle > 0 && <div className="text-sm text-gray-600">
                Completed {breathingState.cycle} breathing cycles
              </div>}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button onClick={toggleBreathing} className={`flex items-center gap-2 ${breathingState.isActive ? 'bg-red-500 hover:bg-red-600' : currentTechnique.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' : currentTechnique.color === 'green' ? 'bg-green-500 hover:bg-green-600' : currentTechnique.color === 'purple' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}>
              {breathingState.isActive ? <>
                  <Pause className="h-4 w-4" />
                  Pause
                </> : <>
                  <Play className="h-4 w-4" />
                  Start
                </>}
            </Button>
            <Button onClick={resetBreathing} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Instructions */}
          <div className={`bg-white rounded-lg p-6 border ${currentTechnique.color === 'blue' ? 'border-blue-200' : currentTechnique.color === 'green' ? 'border-green-200' : currentTechnique.color === 'purple' ? 'border-purple-200' : 'border-indigo-200'}`}>
            <h3 className="font-semibold text-gray-800 mb-3">How to Practice {currentTechnique.name}:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
              <li><strong>Find a comfortable position:</strong> Sit on a chair or lie down comfortably</li>
              <li><strong>Inhale deeply:</strong> Breathe in slowly through your nose for {currentTechnique.inhaleCount} counts</li>
              {currentTechnique.holdCount > 0 && <li><strong>Hold your breath:</strong> Hold gently for {currentTechnique.holdCount} counts</li>}
              <li><strong>Exhale slowly:</strong> Breathe out slowly through your nose or mouth for {currentTechnique.exhaleCount} counts</li>
              {breathingState.technique === 'box' && <li><strong>Pause:</strong> Rest for {currentTechnique.holdCount} counts before the next inhale</li>}
              <li><strong>Repeat:</strong> Continue this pattern, focusing on the breath and counting</li>
            </ol>
          </div>

          {/* Benefits */}
          <div className={`bg-gradient-to-r ${currentTechnique.color === 'blue' ? 'from-blue-50 to-white border-blue-200' : currentTechnique.color === 'green' ? 'from-green-50 to-white border-green-200' : currentTechnique.color === 'purple' ? 'from-purple-50 to-white border-purple-200' : 'from-indigo-50 to-white border-indigo-200'} rounded-lg p-6 border`}>
            <h3 className="font-semibold text-gray-800 mb-3">Benefits:</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              {currentTechnique.benefits.map((benefit, index) => <li key={index} dangerouslySetInnerHTML={{
              __html: benefit
            }} />)}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      
    </div>;
};
export default BreathingExercises;