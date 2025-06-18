
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, Wind, BookOpen, Clock, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[60px]">
        {/* Language Selector in top right */}
        <div className="absolute top-6 right-6">
          <LanguageSelector />
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Activity className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
