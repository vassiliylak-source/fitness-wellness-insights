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
    return (
      <div className="space-y-8">
        <AiInsightsCard />
        <MetricsOverview />
        <SupportSection />
      </div>
    );
  };
  return <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <HeroSection />

      {/* Complete Wellness Platform - moved up after hero section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[45px]">
        <HowItWorksSection />
      </div>


      {/* Health Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <HealthDisclaimer />
      </div>

      {/* Feature Selection and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FeatureNavigation activeFeature={activeFeature} onFeatureChange={setActiveFeature} />

        {/* Content based on active feature */}
        {activeFeature === 'screenshot' && renderScreenshotContent()}
        {activeFeature === 'breathing' && <BreathingExercises />}
        {activeFeature === 'journal' && <WellnessJournal />}
      </div>

      <Footer />
    </div>;
};
export default Index;