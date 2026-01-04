import { useSyndicate } from '@/contexts/SyndicateContext';

const SyndicateTicker = () => {
  const { recentResults } = useSyndicate();

  if (recentResults.length === 0) return null;

  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-secondary/30 bg-secondary/5 py-2">
      <div className="feed-scroll flex gap-16 text-xs">
        {recentResults.map((result, idx) => (
          <span key={idx} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-secondary">▸</span>
            <span className="text-primary font-bold">{result.syndicateName}</span>
            <span className="text-muted-foreground">just closed.</span>
            <span className="text-primary">{result.survivors} Survivors</span>
            <span className="text-muted-foreground">split</span>
            <span className="text-energy font-bold">${result.payoutPerSurvivor * result.survivors}</span>
            <span className="text-muted-foreground">from</span>
            <span className="text-destructive font-bold">{result.failed} Failed</span>
            <span className="text-muted-foreground">members.</span>
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {recentResults.map((result, idx) => (
          <span key={`dup-${idx}`} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-secondary">▸</span>
            <span className="text-primary font-bold">{result.syndicateName}</span>
            <span className="text-muted-foreground">just closed.</span>
            <span className="text-primary">{result.survivors} Survivors</span>
            <span className="text-muted-foreground">split</span>
            <span className="text-energy font-bold">${result.payoutPerSurvivor * result.survivors}</span>
            <span className="text-muted-foreground">from</span>
            <span className="text-destructive font-bold">{result.failed} Failed</span>
            <span className="text-muted-foreground">members.</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SyndicateTicker;
