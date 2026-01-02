import { useChaosEngine } from '@/contexts/ChaosEngineContext';
import { AlertTriangle, Shield, Zap } from 'lucide-react';

const VaultDisplay = () => {
  const { vault, isStaked, isInCycle, daysRemaining } = useChaosEngine();

  if (!isStaked) return null;

  const percentRemaining = vault.depositAmount > 0 
    ? (vault.atRiskCapital / vault.depositAmount) * 100 
    : 0;

  return (
    <div className="vault-display space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-secondary" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            VAULT STATUS
          </span>
        </div>
        {isInCycle && (
          <span className="text-xs text-primary">
            {daysRemaining} DAYS REMAINING
          </span>
        )}
      </div>

      {/* At-Risk Capital */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground uppercase">At-Risk Capital</span>
          <span className={`text-2xl font-bold ${
            percentRemaining < 30 ? 'text-destructive danger-glow' : 'text-secondary warning-glow'
          }`}>
            ${vault.atRiskCapital.toFixed(2)}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-muted overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              percentRemaining < 30 ? 'bg-destructive' : 'bg-secondary'
            }`}
            style={{ width: `${percentRemaining}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Deposited: ${vault.depositAmount.toFixed(2)}</span>
          <span className="text-destructive">Taxed: ${vault.weaknessTaxes.toFixed(2)}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{vault.streakDays}</div>
          <div className="text-xs text-muted-foreground uppercase">Streak</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 text-energy" />
            <span className="text-lg font-bold text-energy">{vault.sweatPoints}</span>
          </div>
          <div className="text-xs text-muted-foreground uppercase">SP</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-muted-foreground">{vault.tier.toUpperCase()}</div>
          <div className="text-xs text-muted-foreground uppercase">Tier</div>
        </div>
      </div>

      {/* Warning if low */}
      {percentRemaining < 30 && (
        <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/30">
          <AlertTriangle className="w-4 h-4 text-destructive animate-warning-pulse" />
          <span className="text-xs text-destructive uppercase">
            Critical: Capital depletion imminent
          </span>
        </div>
      )}
    </div>
  );
};

export default VaultDisplay;
