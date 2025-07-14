import { Badge } from "@/components/ui/badge";
import { Activity, Heart, Wind, BookOpen, Clock, TrendingUp, Sparkles } from "lucide-react";
const HeroSection = () => {
  return <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[3px]">
        <div className="text-center my-0 py-px">
          <div className="flex justify-center mb-8">
            <div className="relative p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 neon-glow">
              <Activity className="h-16 w-16 text-purple-300" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
          
          
          
          <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight">
            <span className="gradient-text">Transform Your</span>
            <br />
            <span className="text-white">Fitness Journey</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-purple-100 max-w-4xl mx-auto leading-relaxed">
            Unlock the power of AI to decode your fitness data, practice mindful breathing, 
            and track holistic wellness. Get
            <span className="text-yellow-300 font-bold"> professional insights </span>
            combined with mindfulness tools for complete well-being.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">Smart Analytics</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
              <Wind className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium">Breathing Exercises</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
              <BookOpen className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium">Wellness Journal</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;