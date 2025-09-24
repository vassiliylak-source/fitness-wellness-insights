import { Upload, Wind, BookOpen, Camera, Brain, Sparkles } from "lucide-react";
import { FeatureType } from "@/types/ui";

interface HowItWorksSectionProps {
  onFeatureSelect: (feature: FeatureType) => void;
}

const HowItWorksSection = ({ onFeatureSelect }: HowItWorksSectionProps) => {
  const features = [{
    icon: Wind,
    title: "Mindful Breathing",
    description: "Guided breathing exercises with visual cues to reduce stress, promote relaxation, and improve focus",
    color: "accent",
    delay: "0s",
    featureType: "breathing" as FeatureType
  }, {
    icon: BookOpen,
    title: "Wellness Journal",
    description: "Monitor your mood, energy, stress, and recovery each day. Export your entries to dive deeper into patterns",
    color: "primary-deep",
    delay: "0.2s",
    featureType: "journal" as FeatureType
  }, {
    icon: Brain,
    title: "Meditation",
    description: "Practice guided meditation with multiple techniques including mindfulness, loving-kindness, and body scan exercises",
    color: "accent",
    delay: "0.4s",
    featureType: "meditation" as FeatureType
  }, {
    icon: Upload,
    title: "Screenshot Analysis",
    description: "Upload fitness app screenshots for instant AI-powered insights on metrics, patterns, and performance",
    color: "primary",
    delay: "0.6s",
    featureType: "screenshot" as FeatureType
  }];

  const handleFeatureClick = (featureType: FeatureType) => {
    onFeatureSelect(featureType);
    // Smooth scroll to the feature section
    const featureSection = document.getElementById('feature-section');
    if (featureSection) {
      featureSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return <div className="py-0">
      <div className="text-center mb-20 space-y-6">
        <div className="inline-flex items-center gap-3 px-8 py-4 glass-card rounded-2xl mb-8">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold text-muted-foreground">Complete Wellness Platform</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6">
          <span className="gradient-text">Everything You Need</span>
          <br />
          <span className="text-foreground">For Total Wellness</span>
        </h2>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
          Four powerful tools working together to transform your health journey through technology and mindfulness.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
        {features.map((feature, index) => {
        const Icon = feature.icon;
        return <div key={feature.title} 
          className="card-feature text-center space-y-6 animate-fade-in cursor-pointer hover:scale-105 transition-all duration-300" 
          style={{
            animationDelay: feature.delay
          }}
          onClick={() => handleFeatureClick(feature.featureType)}
        >
              <div className="flex justify-center">
                <div className="feature-icon neon-glow-primary">
                  <Icon className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">
                  {feature.title}
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>;
      })}
      </div>

      {/* Bottom CTA section */}
      <div className="text-center mt-20 space-y-6">
        
        
        <h3 className="text-2xl md:text-3xl font-bold gradient-text-secondary">
          Ready to start your transformation?
        </h3>
      </div>
    </div>;
};
export default HowItWorksSection;