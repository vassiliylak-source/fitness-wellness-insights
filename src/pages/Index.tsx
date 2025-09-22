import { useState } from "react";
import { FeatureType } from "@/types/ui";
import MetricsOverview from "@/components/MetricsOverview";
import WellnessJournal from "@/components/WellnessJournal";
import BreathingExercises from "@/components/BreathingExercises";
import MeditationExercises from "@/components/MeditationExercises";
import HeroSection from "@/components/Index/HeroSection";
import FeatureNavigation from "@/components/Index/FeatureNavigation";
import HowItWorksSection from "@/components/Index/HowItWorksSection";
import AiInsightsCard from "@/components/Index/AiInsightsCard";
import SupportSection from "@/components/Index/SupportSection";
import HealthDisclaimer from "@/components/Index/HealthDisclaimer";
import Footer from "@/components/layout/Footer";
import { ThemeToggle } from "@/components/ui/theme-toggle";
const Index = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureType>('screenshot');
  const renderScreenshotContent = () => {
    return <div className="space-y-8">
        <AiInsightsCard />
        <MetricsOverview />
        <SupportSection />
      </div>;
  };
  return <div className="min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <HeroSection />

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HowItWorksSection />
      </div>

      {/* Health Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 rounded-none">
        <HealthDisclaimer />
      </div>

      {/* Feature Selection and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 sm:py-[20px]">
        <div className="space-y-8 sm:space-y-12">
          <div className="text-center space-y-4 mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black gradient-text px-4">
              Choose Your Wellness Tool
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">Select from our suite of powerful wellness tools designed to support your journey</p>
          </div>
          
          <FeatureNavigation activeFeature={activeFeature} onFeatureChange={setActiveFeature} />

          {/* Enhanced content containers */}
          <div className="animate-fade-in">
            {activeFeature === 'screenshot' && <div className="space-y-8">
                {renderScreenshotContent()}
              </div>}
            {activeFeature === 'breathing' && <div className="card-modern">
                <BreathingExercises />
              </div>}
            {activeFeature === 'journal' && <div className="card-modern">
                <WellnessJournal />
              </div>}
            {activeFeature === 'meditation' && <div className="card-modern">
                <MeditationExercises />
              </div>}
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default Index;