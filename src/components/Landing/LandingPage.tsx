import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Terminal, Skull, Shield, Users, Zap, ChevronRight, Lock, Linkedin, Target, Flame, TrendingUp, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExternalLink from '@/components/common/ExternalLink';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [activeUsers, setActiveUsers] = useState(847);
  const [completedToday, setCompletedToday] = useState(2341);

  // Simulate live counter updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3));
      setCompletedToday(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEnterArena = () => {
    if (user) {
      window.location.hash = 'terminal';
      window.dispatchEvent(new CustomEvent('enter-arena'));
    } else {
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: Lock,
      title: 'STAKE YOUR DEPOSIT',
      description: 'Lock capital to initiate 30-day discipline contract. Failure means automatic deduction.',
      stat: '30 DAYS',
      statLabel: 'COMMITMENT',
    },
    {
      icon: Users,
      title: 'SYNDICATE EXPLORER',
      description: 'Join a pact. Survive together or profit from the weak.',
      stat: '156',
      statLabel: 'ACTIVE PACTS',
    },
    {
      icon: Zap,
      title: 'NO-MERCY AI WORKOUTS',
      description: 'Integrity checks. Locked timers. No shortcuts, no mercy.',
      stat: '100%',
      statLabel: 'ACCOUNTABILITY',
    },
  ];

  const testimonials = [
    { name: 'OPERATIVE_X7', result: '+23 lbs muscle', days: 47 },
    { name: 'GHOST_RUNNER', result: '-31 lbs fat', days: 89 },
    { name: 'IRON_WILL', result: '156 streak', days: 156 },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-destructive/5 rounded-full blur-[150px]" />
      </div>

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines opacity-50" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-primary/20 backdrop-blur-sm bg-background/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Terminal className="w-6 h-6 text-primary" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
          <div>
            <span className="font-mono text-sm text-foreground font-bold">CHAOS ENGINE</span>
            <span className="text-xs text-primary ml-2 font-mono">v5.0</span>
          </div>
        </div>
        
        {/* Live stats in header */}
        <div className="hidden md:flex items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-muted-foreground">ACTIVE:</span>
            <span className="text-primary font-bold">{activeUsers.toLocaleString()}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Flame className="w-3 h-3 text-destructive" />
            <span className="text-muted-foreground">TODAY:</span>
            <span className="text-foreground font-bold">{completedToday.toLocaleString()}</span>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-mono hidden sm:block">{user.email}</span>
            <Button onClick={handleEnterArena} size="sm" className="btn-terminal">
              ENTER TERMINAL
            </Button>
          </div>
        ) : (
          <Button onClick={() => navigate('/auth')} size="sm" className="btn-terminal font-mono">
            <Shield className="w-4 h-4 mr-2" />
            AUTHENTICATE
          </Button>
        )}
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center space-y-8">
          {/* Animated Icon */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-destructive/20 to-primary/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
              <div className="relative w-28 h-28 border-2 border-primary/50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <Skull className="w-14 h-14 text-primary animate-pulse" />
                <div className="absolute inset-0 border border-primary/30" style={{ transform: 'rotate(45deg)' }} />
              </div>
              <div className="absolute -inset-3 border border-primary/20" />
              <div className="absolute -inset-6 border border-primary/10" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-mono uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              THE SYNDICATE ERA
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-primary tracking-tight leading-none">
              <span className="inline-block animate-[glow-pulse_2s_ease-in-out_infinite]">CHAOS</span>
              <br />
              <span className="inline-block text-foreground">ENGINE</span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary font-mono tracking-wider">
              No-Mercy AI Workouts
            </p>
          </div>

          {/* Value proposition */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-lg text-foreground/80 leading-relaxed">
              The only fitness protocol where 
              <span className="text-destructive font-bold"> your weakness enriches the strong.</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                AI-Generated Protocols
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                Locked Timers
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-destructive" />
                Integrity Verified
              </span>
            </div>
          </div>

          {/* CTA Section */}
          <div className="pt-6 space-y-4">
            <Button 
              onClick={handleEnterArena} 
              size="lg" 
              className="btn-terminal text-lg px-10 py-7 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Shield className="w-6 h-6 mr-3 group-hover:animate-pulse" />
              {user ? 'ENTER THE ARENA' : 'INITIATE PROTOCOL'}
              <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
            {!user && (
              <p className="text-sm text-muted-foreground font-mono flex items-center justify-center gap-2">
                <Lock className="w-3 h-3" />
                Free to start • No credit card required
              </p>
            )}
          </div>
        </div>

        {/* Social proof ticker */}
        <div className="mt-16 overflow-hidden border-y border-primary/20 py-4 bg-primary/5">
          <div className="flex items-center gap-12 animate-[feed-scroll_20s_linear_infinite]">
            {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
              <div key={idx} className="flex items-center gap-4 whitespace-nowrap px-4">
                <div className="w-8 h-8 bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-mono">{t.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">{t.result}</span>
                    <span className="text-xs text-muted-foreground">in {t.days} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`group relative p-6 border border-primary/20 bg-background/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:bg-primary/5 cursor-pointer ${
                hoveredFeature === idx ? 'border-primary/50 bg-primary/5 scale-[1.02]' : ''
              }`}
              onMouseEnter={() => setHoveredFeature(idx)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/50" />
              
              {/* Stat badge */}
              <div className="absolute -top-3 right-4 px-3 py-1 bg-background border border-primary/30 text-xs font-mono">
                <span className="text-primary font-bold">{feature.stat}</span>
                <span className="text-muted-foreground ml-1">{feature.statLabel}</span>
              </div>

              <feature.icon className={`w-10 h-10 mb-4 transition-all duration-300 ${
                hoveredFeature === idx ? 'text-primary scale-110' : 'text-muted-foreground'
              }`} />
              <h3 className="font-bold text-lg text-foreground mb-3 tracking-wide group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              {/* Hover indicator */}
              <div className={`mt-4 flex items-center gap-2 text-xs font-mono transition-all duration-300 ${
                hoveredFeature === idx ? 'text-primary opacity-100' : 'opacity-0'
              }`}>
                <span>LEARN MORE</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="relative border border-primary/20 p-8 md:p-12 bg-background/50 backdrop-blur-sm">
            <h2 className="text-center text-sm uppercase tracking-[0.3em] text-primary mb-12 font-mono">
              ▸ THE PROTOCOL ◂
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'AUTHENTICATE', desc: 'Create your operator profile', icon: Shield },
                { step: '02', title: 'STAKE', desc: 'Lock your discipline deposit', icon: Lock },
                { step: '03', title: 'EXECUTE', desc: 'Complete daily protocols', icon: Target },
                { step: '04', title: 'EVOLVE', desc: 'Survive or lose your stake', icon: TrendingUp },
              ].map((item, idx) => (
                <div key={idx} className="text-center group">
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <div className="w-16 h-16 border border-primary/30 flex items-center justify-center bg-background group-hover:border-primary/60 transition-colors">
                      <item.icon className="w-7 h-7 text-primary/70 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="absolute -top-2 -right-2 text-2xl font-black text-primary/20 font-mono group-hover:text-primary/40 transition-colors">
                      {item.step}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-foreground mb-1 tracking-wider">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <ChevronRight className="w-4 h-4 text-primary/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <Button onClick={handleEnterArena} variant="outline" className="font-mono border-primary/30 hover:border-primary hover:bg-primary/10">
                START YOUR PROTOCOL
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Disclaimer & Contact */}
        <div className="mt-20 text-center space-y-6 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/30 border border-border/50 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            This is a discipline simulation. Train hard, stay safe.
          </div>
          
          <ExternalLink href="https://www.linkedin.com/in/vassiliy-lakhonin/">
            <Button variant="ghost" size="sm" className="font-mono text-xs text-muted-foreground hover:text-primary">
              <Linkedin className="w-4 h-4 mr-2" />
              CONTACT COMMAND
            </Button>
          </ExternalLink>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
