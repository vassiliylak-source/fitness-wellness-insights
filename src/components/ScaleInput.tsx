
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface ScaleInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: LucideIcon;
  lowLabel?: string;
  highLabel?: string;
}

const ScaleInput = ({ 
  label, 
  value, 
  onChange, 
  icon: Icon,
  lowLabel = "Low",
  highLabel = "High"
}: ScaleInputProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-blue-600" />
      <span className="font-medium">{label}</span>
      <Badge variant="outline" className="ml-auto">
        {value}/10
      </Badge>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">{lowLabel}</span>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-xs text-gray-500">{highLabel}</span>
    </div>
  </div>
);

export default ScaleInput;
