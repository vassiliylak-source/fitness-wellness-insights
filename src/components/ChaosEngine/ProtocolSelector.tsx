import { PROTOCOLS, ProtocolType } from '@/lib/struggleEngine';
import { useChaosEngine } from '@/contexts/ChaosEngineContext';
import { Lock, Zap, Skull, Target } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';

interface ProtocolSelectorProps {
  selected: ProtocolType;
  onSelect: (protocol: ProtocolType) => void;
}

const PROTOCOL_META = {
  GRAVITY: {
    icon: Target,
    color: 'primary',
    description: 'Standard discipline protocol',
  },
  OMEGA: {
    icon: Skull,
    color: 'destructive',
    description: 'Maximum suffering threshold',
  },
  BALLISTIC: {
    icon: Zap,
    color: 'energy',
    description: 'Explosive power sequence',
  },
} as const;

const ProtocolSelector = ({ selected, onSelect }: ProtocolSelectorProps) => {
  const { vault } = useChaosEngine();
  const isPro = vault.tier === 'pro';

  const handleSelect = (key: ProtocolType, isLocked: boolean) => {
    if (isLocked) {
      audioEngine.playGlitch(); // Locked protocol click
      return;
    }
    audioEngine.playShutter(); // Protocol switch sound
    onSelect(key);
  };

  return (
    <div className="space-y-3">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        // SELECT PROTOCOL
      </div>

      <div className="grid grid-cols-1 gap-2">
        {(Object.keys(PROTOCOLS) as ProtocolType[]).map((key) => {
          const protocol = PROTOCOLS[key];
          const meta = PROTOCOL_META[key];
          const Icon = meta.icon;
          const isLocked = protocol.tier === 'pro' && !isPro;
          const isSelected = selected === key;

          return (
            <button
              key={key}
              onClick={() => handleSelect(key, isLocked)}
              disabled={isLocked}
              className={`package-card text-left ${isLocked ? 'locked' : ''} ${
                isSelected ? 'border-primary pulse-terminal' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 border ${
                  isSelected ? 'border-primary bg-primary/10' : 'border-border'
                }`}>
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Icon className={`w-5 h-5 ${
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold uppercase text-sm ${
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}>
                      {protocol.name}
                    </span>
                    {protocol.tier === 'pro' && (
                      <span className="text-[10px] px-1 py-0.5 bg-secondary/20 text-secondary uppercase">
                        PRO
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {meta.description}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    {protocol.struggleTarget}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase">
                    Struggle
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {!isPro && (
        <p className="text-xs text-muted-foreground text-center">
          Unlock PRO protocols with consistent discipline
        </p>
      )}
    </div>
  );
};

export default ProtocolSelector;
