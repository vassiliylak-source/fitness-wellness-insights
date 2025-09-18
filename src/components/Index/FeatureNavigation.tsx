import { Button } from "@/components/ui/button";
import { Upload, Wind, BookOpen } from "lucide-react";

interface FeatureNavigationProps {
  activeFeature: 'screenshot' | 'breathing' | 'journal';
  onFeatureChange: (feature: 'screenshot' | 'breathing' | 'journal') => void;
}

const FeatureNavigation = ({
  activeFeature,
  onFeatureChange
}: FeatureNavigationProps) => {
  const features = [
    { id: 'screenshot' as const, icon: Upload, label: 'Screenshot Analysis' },
    { id: 'breathing' as const, icon: Wind, label: 'Mindful Breathing' },
    { id: 'journal' as const, icon: BookOpen, label: 'Wellness Journal' }
  ];

  return (
    <div className="flex justify-center mb-16">
      <div className="nav-modern p-2 animate-fade-in">
        <div className="flex gap-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeFeature === feature.id;
            
            return (
              <Button
                key={feature.id}
                onClick={() => onFeatureChange(feature.id)}
                variant={isActive ? 'default' : 'ghost'}
                className={`
                  flex items-center gap-3 px-6 py-4 text-lg font-semibold rounded-2xl 
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
                <Icon className={`h-6 w-6 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                <span className="hidden sm:inline">{feature.label}</span>
                <span className="sm:hidden">{feature.label.split(' ')[0]}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse"></div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default FeatureNavigation;