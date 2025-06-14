
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, Wind, BookOpen, Clock, TrendingUp } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Activity className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Complete Fitness & Wellness Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Decode your fitness screenshots, practice guided breathing, AND track holistic wellness. Get 
            <span className="text-yellow-300 font-semibold"> pro-level insights </span>
            from data analysis plus mindfulness tools for complete well-being
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Heart className="h-4 w-4 mr-2" />
              Heart Rate Analysis
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Wind className="h-4 w-4 mr-2" />
              Guided Breathing
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <BookOpen className="h-4 w-4 mr-2" />
              Wellness Journaling
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Clock className="h-4 w-4 mr-2" />
              Sleep & Recovery
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <TrendingUp className="h-4 w-4 mr-2" />
              Pattern Recognition
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
