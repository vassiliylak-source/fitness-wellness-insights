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
import { ScreenshotAnalysisProvider } from "@/contexts/ScreenshotAnalysisContext";
import { WellnessProvider } from "@/contexts/WellnessContext";
const Index = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureType>('breathing');
  
  const renderScreenshotContent = () => {
    return <ScreenshotAnalysisProvider>
        <div className="space-y-8">
          <AiInsightsCard />
          <MetricsOverview />
          <SupportSection />
        </div>
      </ScreenshotAnalysisProvider>;
  };
  
  return <div className="min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main>
        <HeroSection onFeatureSelect={setActiveFeature} />

        {/* How It Works Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HowItWorksSection onFeatureSelect={setActiveFeature} />
        </div>

        {/* Health Disclaimer */}
        <aside className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 rounded-none">
          <HealthDisclaimer />
        </aside>

        {/* Feature Selection and Content */}
        <section id="feature-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 sm:py-[20px]" aria-labelledby="wellness-tools-heading">
          <div className="space-y-8 sm:space-y-12">
            <header className="text-center space-y-4 mb-12 sm:mb-16">
              <h2 id="wellness-tools-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black gradient-text px-4">
                Choose Your Wellness Tool
              </h2>
              
            </header>
            
            <FeatureNavigation activeFeature={activeFeature} onFeatureChange={setActiveFeature} />

            {/* Enhanced content containers */}
            <div className="animate-fade-in" role="tabpanel" id={`${activeFeature}-panel`} aria-labelledby={`${activeFeature}-tab`}>
              {activeFeature === 'screenshot' && <div className="space-y-8">
                  {renderScreenshotContent()}
                </div>}
              {activeFeature === 'breathing' && <div className="card-modern">
                  <BreathingExercises />
                </div>}
              {activeFeature === 'journal' && <WellnessProvider>
                  <div className="card-modern">
                    <WellnessJournal />
                  </div>
                </WellnessProvider>}
              {activeFeature === 'meditation' && <div className="card-modern">
                  <MeditationExercises />
                </div>}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Index;