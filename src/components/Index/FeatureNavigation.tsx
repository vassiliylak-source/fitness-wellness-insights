
import { Button } from "@/components/ui/button";
import { Upload, Wind, BookOpen } from "lucide-react";

interface FeatureNavigationProps {
  activeFeature: 'screenshot' | 'breathing' | 'journal';
  onFeatureChange: (feature: 'screenshot' | 'breathing' | 'journal') => void;
}

const FeatureNavigation = ({ activeFeature, onFeatureChange }: FeatureNavigationProps) => {
  return (
    <div className="flex justify-center mb-12">
      <div className="flex bg-white rounded-xl shadow-lg p-2 border-2 border-gray-100">
        <Button
          onClick={() => onFeatureChange('screenshot')}
          variant={activeFeature === 'screenshot' ? 'default' : 'ghost'}
          className="flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
        >
          <Upload className="h-6 w-6" />
          Smart Analytics
        </Button>
        <Button
          onClick={() => onFeatureChange('breathing')}
          variant={activeFeature === 'breathing' ? 'default' : 'ghost'}
          className="flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
        >
          <Wind className="h-6 w-6" />
          Breathing Exercises
        </Button>
        <Button
          onClick={() => onFeatureChange('journal')}
          variant={activeFeature === 'journal' ? 'default' : 'ghost'}
          className="flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
        >
          <BookOpen className="h-6 w-6" />
          Wellness Journal
        </Button>
      </div>
    </div>
  );
};

export default FeatureNavigation;
