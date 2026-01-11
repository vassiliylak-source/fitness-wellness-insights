import { useState, useEffect } from 'react';
import { Check, Activity, MapPin, DollarSign } from 'lucide-react';
import { useChaosEngine } from '@/contexts/ChaosEngineContext';
import { audioEngine } from '@/lib/audioEngine';

interface IntegrityChecksProps {
  onAllChecked: () => void;
  disabled?: boolean;
}

const CHECKS = [
  {
    id: 'physiological',
    label: 'Physiological readiness confirmed.',
    icon: Activity,
    description: 'Body temperature optimal. Heart rate baseline established.',
  },
  {
    id: 'environmental',
    label: 'Environmental resistance cleared.',
    icon: MapPin,
    description: 'Training zone secured. Obstructions removed.',
  },
  {
    id: 'financial',
    label: 'Financial stake acknowledged.',
    icon: DollarSign,
    description: 'At-risk capital recognized. Failure penalty understood.',
  },
];

const IntegrityChecks = ({ onAllChecked, disabled }: IntegrityChecksProps) => {
  const { isStaked, vault } = useChaosEngine();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleCheck = (id: string) => {
    if (disabled) return;
    
    setChecked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        audioEngine.playProgress(); // Sound when checking an item
        newSet.add(id);
      }
      return newSet;
    });
  };

  const allChecked = checked.size === CHECKS.length;

  useEffect(() => {
    if (allChecked) {
      audioEngine.playAccept(); // Accept sound when all checks complete
      onAllChecked();
    }
  }, [allChecked, onAllChecked]);

  // Modify financial check based on stake status
  const modifiedChecks = CHECKS.map(check => {
    if (check.id === 'financial' && isStaked) {
      return {
        ...check,
        description: `$${vault.atRiskCapital.toFixed(2)} at risk. Failure results in deduction.`,
      };
    }
    return check;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          // INTEGRITY VERIFICATION
        </span>
      </div>

      {modifiedChecks.map((check) => {
        const Icon = check.icon;
        const isChecked = checked.has(check.id);

        return (
          <button
            key={check.id}
            onClick={() => toggleCheck(check.id)}
            disabled={disabled}
            className={`integrity-check w-full text-left ${isChecked ? 'checked' : ''} ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div 
              className={`w-6 h-6 border flex items-center justify-center flex-shrink-0 transition-all ${
                isChecked 
                  ? 'border-primary bg-primary' 
                  : 'border-border'
              }`}
            >
              {isChecked && <Check className="w-4 h-4 text-primary-foreground" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 flex-shrink-0 ${
                  isChecked ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <span className={`text-sm ${isChecked ? 'text-primary' : 'text-foreground'}`}>
                  {check.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-6">
                {check.description}
              </p>
            </div>
          </button>
        );
      })}

      {allChecked && (
        <div className="text-center pt-4 animate-fade-in">
          <span className="text-sm text-primary terminal-glow uppercase tracking-widest">
            ▸ ALL SYSTEMS NOMINAL ◂
          </span>
        </div>
      )}
    </div>
  );
};

export default IntegrityChecks;
