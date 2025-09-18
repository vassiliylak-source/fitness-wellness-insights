import { Activity, Wind, BookOpen, TrendingUp, Sparkles, Heart, Zap } from "lucide-react";
const HeroSection = () => {
  return <div className="relative overflow-hidden min-h-screen flex items-center">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-500/15 to-teal-600/25"></div>
      
      {/* Floating animated elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl float animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl float animate-pulse" style={{
        animationDelay: '2s'
      }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-glow/30 rounded-full blur-3xl float animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center space-y-8">
          {/* Hero icon with enhanced styling */}
          <div className="flex justify-center mb-12">
            <div className="relative feature-icon p-8 animate-scale-in pulse-glow">
              <Activity className="h-20 w-20 text-primary-foreground" />
              <Sparkles className="absolute -top-3 -right-3 h-8 w-8 text-accent animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-accent rounded-full animate-pulse" style={{
              animationDelay: '0.5s'
            }}></div>
            </div>
          </div>
          
          {/* Enhanced hero title */}
          <h1 className="text-5xl md:text-8xl font-black leading-tight animate-fade-in">
            <span className="gradient-text block mb-4">Transform Your</span>
            <span className="gradient-text-secondary">Wellness Journey</span>
          </h1>
          
          {/* Enhanced subtitle */}
          <p className="text-xl md:text-3xl mb-16 text-muted-foreground max-w-5xl mx-auto leading-relaxed animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>
            Unlock the power of AI to decode your fitness data, practice mindful breathing, 
            and track holistic wellness. Get{' '}
            <span className="gradient-text font-bold">professional insights</span>{' '}
            combined with mindfulness tools for complete well-being.
          </p>
          
          {/* Feature badges with enhanced styling */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in" style={{
          animationDelay: '0.4s'
        }}>
            <div className="glass-card flex items-center gap-3 px-6 py-3 rounded-2xl hover-lift">
              <div className="p-2 bg-accent/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <span className="font-semibold text-foreground">Smart Analytics</span>
            </div>
            <div className="glass-card flex items-center gap-3 px-6 py-3 rounded-2xl hover-lift">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Wind className="h-6 w-6 text-primary" />
              </div>
              <span className="font-semibold text-foreground">Breathing Exercises</span>
            </div>
            <div className="glass-card flex items-center gap-3 px-6 py-3 rounded-2xl hover-lift">
              <div className="p-2 bg-primary-glow/30 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-deep" />
              </div>
              <span className="font-semibold text-foreground">Wellness Journal</span>
            </div>
          </div>

        </div>
      </div>
    </div>;
};
export default HeroSection;