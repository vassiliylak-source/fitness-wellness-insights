import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";
const BreathingExercises = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setCount(prevCount => {
          if (phase === 'inhale' && prevCount <= 1) {
            setPhase('exhale');
            return 6;
          } else if (phase === 'exhale' && prevCount <= 1) {
            setPhase('inhale');
            setCycle(prev => prev + 1);
            return 4;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);
  const toggleBreathing = () => {
    setIsActive(!isActive);
  };
  const resetBreathing = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(4);
    setCycle(0);
  };
  const getCircleScale = () => {
    if (phase === 'inhale') {
      return 1.5 - count / 4 * 0.5; // Grows from 1 to 1.5
    } else {
      return 1 + count / 6 * 0.5; // Shrinks from 1.5 to 1
    }
  };
  return <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800">
            <Wind className="h-6 w-6 text-blue-600" />
            4-6 Breathing Exercise
          </CardTitle>
          <CardDescription className="text-lg">
            🌬️ Inhale for 4 counts, exhale for 6 counts to promote relaxation and reduce stress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Breathing Animation Circle */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Outer glow ring */}
              <div className={`absolute w-48 h-48 rounded-full transition-all duration-1000 ease-in-out ${
                phase === 'inhale' 
                  ? 'bg-blue-200/30 animate-pulse' 
                  : 'bg-cyan-200/30'
              }`} 
              style={{
                transform: `scale(${getCircleScale() * 1.2})`
              }}>
              </div>
              
              {/* Main breathing circle */}
              <div className={`w-32 h-32 rounded-full border-8 transition-all duration-1000 ease-in-out shadow-2xl ${
                phase === 'inhale' 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-100 to-blue-200 shadow-blue-500/50' 
                  : 'border-cyan-500 bg-gradient-to-br from-cyan-100 to-cyan-200 shadow-cyan-500/50'
              }`} 
              style={{
                transform: `scale(${getCircleScale()})`,
                boxShadow: `0 0 30px ${phase === 'inhale' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(6, 182, 212, 0.5)'}`
              }}>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-black transition-colors duration-500 ${
                      phase === 'inhale' ? 'text-blue-700' : 'text-cyan-700'
                    }`}>
                      {count}
                    </div>
                    <div className={`text-base font-bold uppercase tracking-wider transition-colors duration-500 ${
                      phase === 'inhale' ? 'text-blue-600' : 'text-cyan-600'
                    }`}>
                      {phase === 'inhale' ? 'Inhale' : 'Exhale'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating particles */}
              <div className={`absolute inset-0 pointer-events-none ${isActive ? 'block' : 'hidden'}`}>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full transition-all duration-1000 ${
                      phase === 'inhale' ? 'bg-blue-400' : 'bg-cyan-400'
                    }`}
                    style={{
                      top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                      left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                      transform: `scale(${phase === 'inhale' ? 0.5 + count * 0.125 : 1.5 - count * 0.125})`,
                      opacity: phase === 'inhale' ? 0.3 + count * 0.175 : 1 - count * 0.125
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Status Display */}
          <div className="text-center space-y-2">
            <div className="text-lg font-medium text-gray-700">
              {isActive ? <>
                  <span className={phase === 'inhale' ? 'text-blue-600' : 'text-cyan-600'}>
                    {phase === 'inhale' ? 'Breathe In' : 'Breathe Out'}
                  </span>
                  <span className="text-gray-500 ml-2">• Cycle {cycle + 1}</span>
                </> : 'Ready to begin'}
            </div>
            {!isActive && cycle > 0 && <div className="text-sm text-gray-600">
                Completed {cycle} breathing cycles
              </div>}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button onClick={toggleBreathing} className={`flex items-center gap-2 ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
              {isActive ? <>
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
          <div className="bg-white rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-3">How to Practice 4-6 Breathing:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
              <li><strong>Find a comfortable position:</strong> Sit on a chair or lie down comfortably</li>
              <li><strong>Inhale deeply:</strong> Breathe in slowly through your nose for 4 counts, feeling your stomach expand</li>
              <li><strong>Exhale slowly:</strong> Breathe out slowly through your nose or mouth for 6 counts</li>
              <li><strong>Repeat:</strong> Continue this pattern, focusing on the breath and counting</li>
            </ol>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-3">Benefits:</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>🧘 <strong>Reduces stress and anxiety:</strong> Slows breathing to lower heart rate and activate relaxation response</li>
              <li>💆 <strong>Promotes relaxation:</strong> Extended exhale helps calm the nervous system</li>
              <li>🎯 <strong>Improves focus:</strong> Regular practice can enhance attention and concentration</li>
              <li>😴 <strong>May aid sleep:</strong> Helps relax the body and mind for better rest</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-700">💜Enjoying this app? If you'd like to support the creator, consider treating him to a coffee with a small donation:</p>
            <div className="flex justify-center">
              <a href="https://paypal.me/vaskenzy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                ☕ Buy me a coffee
              </a>
            </div>
            <p className="text-xs text-gray-600">
              Thank you for your support!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default BreathingExercises;