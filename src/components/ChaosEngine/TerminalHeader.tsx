import { Terminal } from 'lucide-react';

const TerminalHeader = () => {
  return (
    <header className="text-center space-y-4">
      <div className="flex items-center justify-center gap-2">
        <Terminal className="w-5 h-5 text-primary" />
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          THE SYNDICATE ERA
        </span>
      </div>
      
      <h1 className="terminal-header text-primary terminal-glow terminal-cursor">
        CHAOS ENGINE
      </h1>
      
      <p className="text-xs text-muted-foreground max-w-md mx-auto">
        v5.0 — Collective Discipline Protocol
        <br />
        <span className="text-secondary">Your weakness enriches the strong.</span>
      </p>
    </header>
  );
};

export default TerminalHeader;
