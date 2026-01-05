import { Users, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useSyndicate } from '@/contexts/SyndicateContext';

interface SectionTogglesProps {
  showSyndicates: boolean;
  showStore: boolean;
  onToggleSyndicates: () => void;
  onToggleStore: () => void;
}

const SectionToggles = ({
  showSyndicates,
  showStore,
  onToggleSyndicates,
  onToggleStore,
}: SectionTogglesProps) => {
  const { mySyndicate } = useSyndicate();

  return (
    <>
      {/* Syndicate Section Toggle */}
      <button
        onClick={onToggleSyndicates}
        className="w-full flex items-center justify-between p-4 border border-secondary/30 hover:border-secondary/60 bg-secondary/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-secondary" />
          <div className="text-left">
            <span className="text-sm font-bold text-secondary uppercase">
              SYNDICATE EXPLORER
            </span>
            <p className="text-xs text-muted-foreground">
              {mySyndicate ? `Active in ${mySyndicate.name}` : 'Join a pact • Profit from the weak'}
            </p>
          </div>
        </div>
        {showSyndicates ? (
          <ChevronUp className="w-5 h-5 text-secondary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-secondary" />
        )}
      </button>

      {/* SP Store Toggle */}
      <button
        onClick={onToggleStore}
        className="w-full flex items-center justify-between p-3 border border-border hover:border-energy/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            SURVIVAL STORE
          </span>
        </div>
        {showStore ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </>
  );
};

export default SectionToggles;
