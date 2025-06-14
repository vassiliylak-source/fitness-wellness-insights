
import ScaleInput from "@/components/ScaleInput";
import { Smile, Zap, Brain, Moon, Heart } from "lucide-react";
import { JournalEntry } from "@/types/wellness";

interface WellnessScalesProps {
  currentEntry: JournalEntry;
  onScaleChange: (field: keyof JournalEntry, value: number) => void;
}

const WellnessScales = ({ currentEntry, onScaleChange }: WellnessScalesProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <ScaleInput
          label="Mood"
          value={currentEntry.mood}
          onChange={(value) => onScaleChange('mood', value)}
          icon={Smile}
          lowLabel="😔 Low"
          highLabel="😊 Great"
        />
        
        <ScaleInput
          label="Energy Level"
          value={currentEntry.energy}
          onChange={(value) => onScaleChange('energy', value)}
          icon={Zap}
          lowLabel="⚡ Drained"
          highLabel="🔋 Energized"
        />

        <ScaleInput
          label="Stress Level"
          value={currentEntry.stress}
          onChange={(value) => onScaleChange('stress', value)}
          icon={Brain}
          lowLabel="😌 Calm"
          highLabel="😰 Stressed"
        />
      </div>

      <div className="space-y-4">
        <ScaleInput
          label="Sleep Quality"
          value={currentEntry.sleep}
          onChange={(value) => onScaleChange('sleep', value)}
          icon={Moon}
          lowLabel="😴 Poor"
          highLabel="🌙 Excellent"
        />

        <ScaleInput
          label="Recovery"
          value={currentEntry.recovery}
          onChange={(value) => onScaleChange('recovery', value)}
          icon={Heart}
          lowLabel="🔴 Fatigued"
          highLabel="🟢 Recovered"
        />
      </div>
    </div>
  );
};

export default WellnessScales;
