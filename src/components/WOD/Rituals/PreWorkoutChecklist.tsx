import { useState } from 'react';
import { Check, Droplets, Timer, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreWorkoutChecklistProps {
  onComplete: () => void;
  onSkip: () => void;
}

const CHECKLIST_ITEMS = [
  { id: 'water', icon: Droplets, label: 'WATER READY' },
  { id: 'timer', icon: Timer, label: 'TIMER VISIBLE' },
  { id: 'time', icon: Clock, label: '15 MIN AVAILABLE' },
  { id: 'focus', icon: ShieldCheck, label: 'NO INTERRUPTIONS' }
];

const PreWorkoutChecklist = ({ onComplete, onSkip }: PreWorkoutChecklistProps) => {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newChecked = new Set(checked);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setChecked(newChecked);
  };

  const allChecked = checked.size === CHECKLIST_ITEMS.length;

  return (
    <div className="card-brutal p-6 md:p-8 animate-fade-in">
      <h3 className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6 font-mono">
        <span className="text-primary">//</span> PRE-EXECUTION PROTOCOL
      </h3>
      
      <p className="text-center text-sm font-mono text-foreground mb-8">
        Confirm readiness before protocol initiation.
      </p>

      <div className="space-y-3 max-w-md mx-auto mb-8">
        {CHECKLIST_ITEMS.map(item => {
          const Icon = item.icon;
          const isChecked = checked.has(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full flex items-center gap-4 p-4 border-2 transition-all ${
                isChecked 
                  ? 'border-accent bg-accent/10' 
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${
                isChecked 
                  ? 'border-accent bg-accent text-accent-foreground' 
                  : 'border-muted-foreground'
              }`}>
                {isChecked && <Check className="w-4 h-4" />}
              </div>
              
              <Icon className={`w-5 h-5 ${isChecked ? 'text-accent' : 'text-muted-foreground'}`} />
              
              <span className={`font-mono text-sm uppercase tracking-wider ${
                isChecked ? 'text-accent' : 'text-foreground'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={onComplete}
          disabled={!allChecked}
          className={`btn-brutal w-full max-w-md ${!allChecked ? 'opacity-50' : ''}`}
        >
          {allChecked ? 'INITIATE SEQUENCE' : 'COMPLETE CHECKLIST'}
        </Button>
        
        <button
          onClick={onSkip}
          className="text-xs font-mono text-muted-foreground/40 uppercase hover:text-muted-foreground transition-colors"
        >
          [BYPASS PROTOCOL]
        </button>
      </div>
    </div>
  );
};

export default PreWorkoutChecklist;
