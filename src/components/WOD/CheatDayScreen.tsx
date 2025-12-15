import { useState, useEffect } from 'react';
import { Moon, Star } from 'lucide-react';

interface CheatDayScreenProps {
  onOverride: () => void;
}

const CheatDayScreen = ({ onOverride }: CheatDayScreenProps) => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random stars
    const generatedStars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(240,30%,8%)] via-[hsl(240,25%,12%)] to-[hsl(240,20%,15%)]">
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute rounded-full bg-foreground/60 animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, hsla(250, 50%, 40%, 0.15) 0%, transparent 60%)'
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Moon */}
        <div className="relative mb-8 animate-fade-in">
          <div 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, hsl(45, 30%, 90%), hsl(45, 20%, 75%))',
              boxShadow: '0 0 60px 20px hsla(45, 50%, 80%, 0.3), 0 0 120px 60px hsla(45, 50%, 80%, 0.1)'
            }}
          >
            {/* Moon craters */}
            <div className="absolute top-6 left-8 w-4 h-4 rounded-full bg-foreground/10" />
            <div className="absolute top-12 right-10 w-6 h-6 rounded-full bg-foreground/5" />
            <div className="absolute bottom-10 left-12 w-3 h-3 rounded-full bg-foreground/10" />
          </div>
          
          {/* Floating Z's */}
          <div className="absolute -right-4 top-0 text-2xl font-mono text-muted-foreground/40 animate-bounce" style={{ animationDuration: '2s' }}>
            z
          </div>
          <div className="absolute -right-8 -top-4 text-3xl font-mono text-muted-foreground/30 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}>
            Z
          </div>
          <div className="absolute -right-12 -top-10 text-4xl font-mono text-muted-foreground/20 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.6s' }}>
            Z
          </div>
        </div>

        {/* Message */}
        <div className="text-center max-w-md animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-muted/10 border border-muted/20 rounded-full">
            <Moon className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-mono">
              SYSTEM OVERRIDE ACTIVE
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-mono font-bold text-foreground uppercase mb-6 leading-tight">
            Recovery is part of the process
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground font-mono mb-4">
            The algorithm has detected it's late.
          </p>
          
          <p className="text-2xl md:text-3xl font-mono font-bold text-primary mb-8">
            Go to sleep.
          </p>

          <p className="text-xs text-muted-foreground/60 font-mono mb-8">
            Muscles are built during rest, not during destruction.
            <br />
            Return when the sun rises.
          </p>
        </div>

        {/* Override button */}
        <button 
          onClick={onOverride}
          className="group text-xs text-muted-foreground/30 font-mono uppercase hover:text-muted-foreground/60 transition-all duration-500 animate-fade-in"
          style={{ animationDelay: '1s' }}
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2">[</span>
          OVERRIDE RECOVERY PROTOCOL
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">]</span>
        </button>

        {/* Subtle stars icon */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-muted-foreground/20">
          <Star className="w-3 h-3" />
          <Star className="w-4 h-4" />
          <Star className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

export default CheatDayScreen;
