import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface WellnessScaleInputProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const WellnessScaleInput: React.FC<WellnessScaleInputProps> = ({
  label,
  icon,
  value,
  onChange,
  className = ''
}) => {
  const getValueColor = (val: number) => {
    if (val >= 8) return 'text-green-600';
    if (val >= 6) return 'text-yellow-600';
    if (val >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getValueLabel = (val: number) => {
    if (label.toLowerCase().includes('stress')) {
      // Reverse scale for stress (lower is better)
      if (val <= 3) return 'Low';
      if (val <= 5) return 'Moderate';
      if (val <= 7) return 'High';
      return 'Very High';
    }
    
    if (val >= 8) return 'Excellent';
    if (val >= 6) return 'Good';
    if (val >= 4) return 'Fair';
    return 'Poor';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {label}
        </Label>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${getValueColor(value)}`}>
            {value}
          </span>
          <span className="text-xs text-muted-foreground">
            {getValueLabel(value)}
          </span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        max={10}
        min={1}
        step={1}
        className="w-full"
      />
    </div>
  );
};

export default WellnessScaleInput;