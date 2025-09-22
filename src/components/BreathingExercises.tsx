import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, ChevronDown } from "lucide-react";
import { BREATHING_TECHNIQUES } from "@/constants";
import { BreathingTechnique } from "@/types/ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useBreathing } from "@/features/breathing/hooks/useBreathing";
import BreathingCircle from "@/features/breathing/components/BreathingCircle";
import BreathingControls from "@/features/breathing/components/BreathingControls";
import { getBreathingInstruction } from "@/features/breathing/utils/breathingUtils";

const BreathingExercises = () => {
  const { 
    breathingState, 
    currentTechnique, 
    toggleBreathing, 
    resetBreathing, 
    changeTechnique 
  } = useBreathing();
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
          <BreathingCircle 
            breathingState={breathingState} 
            currentTechnique={currentTechnique} 
          />

          {/* Status Display */}
          <div className="text-center space-y-2">
            <div className="text-lg font-medium text-gray-700">
              {breathingState.isActive ? (
                <>
                  <span className="text-primary">
                    {getBreathingInstruction(breathingState.phase)}
                  </span>
                  <span className="text-muted-foreground ml-2">• Cycle {breathingState.cycle + 1}</span>
                </>
              ) : (
                'Ready to begin'
              )}
            </div>
            {!breathingState.isActive && breathingState.cycle > 0 && (
              <div className="text-sm text-muted-foreground">
                Completed {breathingState.cycle} breathing cycles
              </div>
            )}
          </div>

          <BreathingControls
            breathingState={breathingState}
            currentTechnique={currentTechnique}
            onToggle={toggleBreathing}
            onReset={resetBreathing}
          />

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