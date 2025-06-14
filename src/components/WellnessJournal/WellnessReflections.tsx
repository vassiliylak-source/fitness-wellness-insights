
import { Textarea } from "@/components/ui/textarea";
import { JournalEntry } from "@/types/wellness";

interface WellnessReflectionsProps {
  currentEntry: JournalEntry;
  onTextChange: (field: keyof JournalEntry, value: string) => void;
}

const WellnessReflections = ({ currentEntry, onTextChange }: WellnessReflectionsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Daily Notes & Reflections
        </label>
        <Textarea
          placeholder="How are you feeling today? What's on your mind? Any physical sensations or emotional insights..."
          value={currentEntry.notes}
          onChange={(e) => onTextChange('notes', e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Goals & Intentions
        </label>
        <Textarea
          placeholder="What do you want to focus on today? Any recovery or wellness goals..."
          value={currentEntry.goals}
          onChange={(e) => onTextChange('goals', e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Gratitude & Wins
        </label>
        <Textarea
          placeholder="What are you grateful for? Any small wins or positive moments..."
          value={currentEntry.gratitude}
          onChange={(e) => onTextChange('gratitude', e.target.value)}
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
};

export default WellnessReflections;
