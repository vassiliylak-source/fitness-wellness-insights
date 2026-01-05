import { useChaosEngine } from '@/contexts/ChaosEngineContext';

const TerminalFooter = () => {
  const { vault } = useChaosEngine();

  return (
    <footer className="text-center text-xs text-muted-foreground space-y-2 pt-8 border-t border-border">
      <p>Evolution is not optional. Your weakness enriches the strong.</p>
      <p className="text-primary/40">
        SP: {vault.sweatPoints} | Streak: {vault.streakDays} days | Tier: {vault.tier.toUpperCase()}
      </p>
    </footer>
  );
};

export default TerminalFooter;
