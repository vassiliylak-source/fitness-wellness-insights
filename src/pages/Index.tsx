import { useState } from "react";
import { FeatureType } from "@/types/ui";
import MetricsOverview from "@/components/MetricsOverview";
import WellnessJournal from "@/components/WellnessJournal";
import BreathingExercises from "@/components/BreathingExercises";
import HeroSection from "@/components/Index/HeroSection";
import FeatureNavigation from "@/components/Index/FeatureNavigation";
import HowItWorksSection from "@/components/Index/HowItWorksSection";
import AiInsightsCard from "@/components/Index/AiInsightsCard";
import SupportSection from "@/components/Index/SupportSection";
import HealthDisclaimer from "@/components/Index/HealthDisclaimer";
import Footer from "@/components/layout/Footer";
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
      <HeroSection />

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HowItWorksSection />
      </div>

      {/* Health Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HealthDisclaimer />
      </div>

      {/* Feature Selection and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-black gradient-text">
              Choose Your Wellness Tool
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Select from our suite of powerful wellness tools designed to support your journey</p>
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
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default Index;