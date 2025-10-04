import { Button } from "@/components/ui/button";
import { Upload, Wind, BookOpen, Brain } from "lucide-react";

interface FeatureNavigationProps {
  activeFeature: 'screenshot' | 'breathing' | 'journal' | 'meditation';
  onFeatureChange: (feature: 'screenshot' | 'breathing' | 'journal' | 'meditation') => void;
}

const FeatureNavigation = ({
  activeFeature,
  onFeatureChange
}: FeatureNavigationProps) => {
  const features = [
    { id: 'breathing' as const, icon: Wind, label: 'Mindful Breathing' },
    { id: 'journal' as const, icon: BookOpen, label: 'Wellness Journal' },
    { id: 'meditation' as const, icon: Brain, label: 'Meditation' },
    { id: 'screenshot' as const, icon: Upload, label: 'Screenshot Analysis' }
  ];

  return (
    <nav className="flex justify-center mb-16" aria-label="Wellness tools navigation">
      <div className="nav-modern p-2 animate-fade-in">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3" role="tablist">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeFeature === feature.id;
            
            return (
              <Button
                key={feature.id}
                onClick={() => onFeatureChange(feature.id)}
                variant={isActive ? 'default' : 'ghost'}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${feature.id}-panel`}
                aria-label={`Switch to ${feature.label} tool`}
                className={`
                  flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 
                  text-sm sm:text-base md:text-lg font-semibold rounded-xl sm:rounded-2xl 
                  transition-all duration-500 hover-lift relative overflow-hidden
                  ${isActive 
                    ? 'neon-glow-primary scale-105 shadow-2xl' 
                    : 'hover:bg-muted/50 hover:scale-[1.02]'
                  }
                `}
                style={{
                  background: isActive ? 'var(--gradient-primary)' : undefined,
                  color: isActive ? 'hsl(var(--primary-foreground))' : undefined
                }}
              >
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                <span className="hidden sm:inline">{feature.label}</span>
                <span className="sm:hidden">{feature.label.split(' ')[0]}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl animate-pulse"></div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
export default FeatureNavigation;