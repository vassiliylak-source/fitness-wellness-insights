import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Terminal, Skull, Shield, Users, Zap, ChevronRight, Lock, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExternalLink from '@/components/common/ExternalLink';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const handleEnterArena = () => {
    if (user) {
      // User is logged in, proceed to terminal
      window.location.hash = 'terminal';
      window.dispatchEvent(new CustomEvent('enter-arena'));
    } else {
      // Redirect to auth
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: Lock,
      title: 'STAKE YOUR DEPOSIT',
      description: 'Lock capital to initiate 30-day discipline contract. Failure to complete daily protocol results in automatic deduction.',
    },
    {
      icon: Users,
      title: 'SYNDICATE EXPLORER',
      description: 'Join a pact. Survive together or profit from the weak. Your failure enriches survivors.',
    },
    {
      icon: Zap,
      title: 'NO-MERCY AI WORKOUTS',
      description: 'AI-generated protocols. Integrity checks. Locked timers. No shortcuts, no excuses, no mercy.',
    },
  ];

  return (
    <div className="min-h-screen bg-background scanlines relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-destructive/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <span className="font-mono text-sm text-muted-foreground">CHAOS ENGINE v5.0</span>
        </div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-mono">{user.email}</span>
            <Button onClick={handleEnterArena} size="sm" className="btn-terminal">
              ENTER TERMINAL
            </Button>
          </div>
        ) : (
          <Button onClick={() => navigate('/auth')} variant="outline" size="sm" className="font-mono">
            AUTHENTICATE
          </Button>
        )}
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 border border-primary/30 flex items-center justify-center animate-pulse">
                <Skull className="w-12 h-12 text-primary" />
              </div>
              <div className="absolute -inset-2 border border-primary/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              THE SYNDICATE ERA
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-primary terminal-glow tracking-tight">
              CHAOS ENGINE
            </h1>
            <p className="text-lg md:text-xl text-secondary font-mono">
              No-Mercy AI Workouts
            </p>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Collective Discipline Protocol.
              <span className="text-destructive font-semibold"> Your weakness enriches the strong.</span>
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Evolution is not optional.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <Button 
              onClick={handleEnterArena} 
              size="lg" 
              className="btn-terminal text-lg px-8 py-6 group"
            >
              <Shield className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              {user ? 'ENTER THE ARENA' : 'INITIATE PROTOCOL'}
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            {!user && (
              <p className="text-xs text-muted-foreground mt-4 font-mono">
                Authentication required to access the terminal
              </p>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`card-terminal p-6 transition-all duration-300 ${
                hoveredFeature === idx ? 'border-primary/50 bg-primary/5' : ''
              }`}
              onMouseEnter={() => setHoveredFeature(idx)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <feature.icon className={`w-8 h-8 mb-4 transition-colors ${
                hoveredFeature === idx ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <h3 className="font-bold text-foreground mb-2 tracking-wide">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-24 card-terminal p-8">
          <h2 className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8">
            THE PROTOCOL
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'AUTHENTICATE', desc: 'Create your operator profile' },
              { step: '02', title: 'STAKE', desc: 'Lock your discipline deposit' },
              { step: '03', title: 'EXECUTE', desc: 'Complete daily protocols' },
              { step: '04', title: 'EVOLVE', desc: 'Survive or lose your stake' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-black text-primary/30 mb-2">{item.step}</div>
                <div className="text-sm font-bold text-foreground mb-1">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer & Contact */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            This is a discipline training simulation. No real money is at stake. 
            Push your limits safely.
          </p>
          
          <ExternalLink href="https://www.linkedin.com/in/vassiliy-lakhonin/">
            <Button variant="ghost" size="sm" className="font-mono text-xs text-muted-foreground hover:text-primary">
              <Linkedin className="w-4 h-4 mr-2" />
              CONTACT US
            </Button>
          </ExternalLink>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
