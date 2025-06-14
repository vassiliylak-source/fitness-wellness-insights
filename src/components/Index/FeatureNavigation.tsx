
import { Button } from "@/components/ui/button";
import { Upload, Wind, BookOpen } from "lucide-react";

interface FeatureNavigationProps {
  activeFeature: 'screenshot' | 'breathing' | 'journal';
  onFeatureChange: (feature: 'screenshot' | 'breathing' | 'journal') => void;
}

const FeatureNavigation = ({ activeFeature, onFeatureChange }: FeatureNavigationProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex bg-white rounded-lg shadow-md p-1 border">
        <Button
          onClick={() => onFeatureChange('screenshot')}
          variant={activeFeature === 'screenshot' ? 'default' : 'ghost'}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Screenshot Analysis
        </Button>
        <Button
          onClick={() => onFeatureChange('breathing')}
          variant={activeFeature === 'breathing' ? 'default' : 'ghost'}
          className="flex items-center gap-2"
        >
          <Wind className="h-4 w-4" />
          4-6 Breathing
        </Button>
        <Button
          onClick={() => onFeatureChange('journal')}
          variant={activeFeature === 'journal' ? 'default' : 'ghost'}
          className="flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Wellness Journal
        </Button>
      </div>
    </div>
  );
};

export default FeatureNavigation;
