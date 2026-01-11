import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { audioEngine } from '@/lib/audioEngine';

interface VerificationCheckProps {
  onVerified: () => void;
  onFailed: () => void;
  checkNumber: number;
}

const VERIFICATION_PROMPTS = [
  { question: "Still working? Tap to confirm you're not cheating!", button: "I'M STILL HERE" },
  { question: "Mid-protocol check: Are you actually doing this?", button: "CONFIRM ACTIVE" },
  { question: "Presence verification required. Prove you're not faking.", button: "VERIFIED PRESENT" },
  { question: "Random integrity check. Confirm you're working out.", button: "STILL GRINDING" },
  { question: "System check: Is this workout actually happening?", button: "CONFIRM WORKOUT" },
];

const VerificationCheck = ({ onVerified, onFailed, checkNumber }: VerificationCheckProps) => {
  const [timeRemaining, setTimeRemaining] = useState(15); // 15 seconds to respond
  const [isVerified, setIsVerified] = useState(false);
  
  const prompt = VERIFICATION_PROMPTS[checkNumber % VERIFICATION_PROMPTS.length];

  // Play siren when check appears
  useEffect(() => {
    audioEngine.playSiren();
  }, []);

  useEffect(() => {
    if (isVerified) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onFailed();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVerified, onFailed]);

  const handleVerify = useCallback(() => {
    audioEngine.playAccept();
    setIsVerified(true);
    onVerified();
  }, [onVerified]);

  if (isVerified) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center animate-fade-in">
        <div className="text-center space-y-4 p-8">
          <Check className="w-16 h-16 text-primary mx-auto animate-scale-in" />
          <p className="text-xl font-mono text-primary uppercase">VERIFIED. CONTINUE.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center animate-fade-in">
      <div className="text-center space-y-6 p-8 max-w-md">
        <AlertTriangle className="w-16 h-16 text-energy mx-auto animate-warning-pulse" />
        
        <h2 className="text-2xl font-bold text-energy uppercase">
          INTEGRITY CHECK #{checkNumber}
        </h2>
        
        <p className="text-lg text-foreground font-mono">
          {prompt.question}
        </p>
        
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="w-5 h-5" />
          <span className={`text-2xl font-mono font-bold ${timeRemaining <= 5 ? 'text-destructive animate-warning-pulse' : ''}`}>
            {timeRemaining}s
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Failure to respond will mark this workout as unverified
        </p>
        
        <Button
          onClick={handleVerify}
          className="btn-terminal w-full py-6 text-lg"
        >
          {prompt.button}
        </Button>
      </div>
    </div>
  );
};

export default VerificationCheck;