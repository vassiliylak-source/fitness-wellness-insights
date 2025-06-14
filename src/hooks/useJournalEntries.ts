
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { JournalEntry } from "@/types/wellness";

export const useJournalEntries = () => {
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    date: new Date().toISOString().split('T')[0],
    mood: 5,
    energy: 5,
    stress: 5,
    sleep: 5,
    recovery: 5,
    notes: '',
    goals: '',
    gratitude: ''
  });
  
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>([]);
  const { toast } = useToast();

  const handleScaleChange = (field: keyof JournalEntry, value: number) => {
    setCurrentEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field: keyof JournalEntry, value: string) => {
    setCurrentEntry(prev => ({ ...prev, [field]: value }));
  };

  const saveEntry = () => {
    const newEntries = [...savedEntries, currentEntry];
    setSavedEntries(newEntries);
    localStorage.setItem('wellness-entries', JSON.stringify(newEntries));
    
    toast({
      title: "Entry saved! 🌟",
      description: "Your wellness data has been recorded for today.",
    });

    // Reset for next entry
    setCurrentEntry({
      date: new Date().toISOString().split('T')[0],
      mood: 5,
      energy: 5,
      stress: 5,
      sleep: 5,
      recovery: 5,
      notes: '',
      goals: '',
      gratitude: ''
    });
  };

  return {
    currentEntry,
    savedEntries,
    handleScaleChange,
    handleTextChange,
    saveEntry
  };
};
