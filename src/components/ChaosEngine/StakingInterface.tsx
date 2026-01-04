import { useState } from 'react';
import { useChaosEngine } from '@/contexts/ChaosEngineContext';
import { Shield, AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STAKE_OPTIONS = [
  { amount: 10, label: '$10', description: '$2 per failure' },
  { amount: 20, label: '$20', description: '$2 per failure' },
  { amount: 50, label: '$50', description: '$5 per failure' },
];

const StakingInterface = () => {
  const { stakeDeposit, isStaked, vault } = useChaosEngine();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [agreed, setAgreed] = useState(false);

  const handleStake = () => {
    if (selectedAmount && agreed) {
      stakeDeposit(selectedAmount);
    }
  };

  if (isStaked) {
    return null; // Vault display handles staked state
  }

  return (
    <div className="card-terminal p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-6 h-6 text-secondary" />
          <h2 className="text-xl font-bold text-secondary uppercase tracking-wider">
            STAKE YOUR DEPOSIT
          </h2>
        </div>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Lock capital to initiate 30-day discipline contract. Failure to complete daily protocol results in automatic deduction.
        </p>
      </div>

      {/* Stake Options */}
      <div className="grid grid-cols-3 gap-3">
        {STAKE_OPTIONS.map((option) => (
          <button
            key={option.amount}
            onClick={() => setSelectedAmount(option.amount)}
            className={`p-4 border transition-all ${
              selectedAmount === option.amount
                ? 'border-secondary bg-secondary/10'
                : 'border-border hover:border-secondary/50'
            }`}
          >
            <div className="text-2xl font-bold text-foreground">{option.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
          </button>
        ))}
      </div>

      {/* Contract Terms */}
      {selectedAmount && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 bg-muted/30 border border-border">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              CONTRACT TERMS
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">▸</span>
                <span>30-day commitment cycle</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">▸</span>
                <span>Daily protocol completion required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">▸</span>
                <span className="text-destructive">
                  ${selectedAmount <= 20 ? '2.00' : '5.00'} Weakness Tax per missed day
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">▸</span>
                <span>Remaining capital unlocked after 30 days</span>
              </li>
            </ul>
          </div>

          {/* Agreement Checkbox */}
          <label className="integrity-check cursor-pointer">
            <div 
              className={`w-5 h-5 border flex items-center justify-center transition-all ${
                agreed ? 'border-primary bg-primary' : 'border-border'
              }`}
              onClick={() => setAgreed(!agreed)}
            >
              {agreed && <Lock className="w-3 h-3 text-primary-foreground" />}
            </div>
            <span className="text-sm text-foreground flex-1">
              I accept the discipline contract. Weakness will be taxed.
            </span>
          </label>

          {/* Stake Button */}
          <Button
            onClick={handleStake}
            disabled={!agreed}
            className="w-full btn-terminal"
          >
            <Lock className="w-4 h-4 mr-2" />
            LOCK ${selectedAmount}.00 — INITIATE CONTRACT
          </Button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <AlertTriangle className="w-3 h-3" />
            <span>Simulated payment — no real money involved</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StakingInterface;
