import React, { createContext, useContext, useState, useEffect } from 'react';
import { JournalEntry } from '@/types/wellness';
import { WELLNESS_DEFAULTS, STORAGE_KEYS } from '@/constants';
import { useToast } from "@/hooks/use-toast";
import { useWellnessPDF } from "@/features/wellness/hooks/useWellnessPDF";

interface WellnessContextType {
  currentEntry: JournalEntry;
  savedEntries: JournalEntry[];
  updateEntry: (field: keyof JournalEntry, value: string | number) => void;
  saveEntry: () => void;
  resetEntry: () => void;
}

const WellnessContext = createContext<WellnessContextType | null>(null);

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within WellnessProvider');
  }
  return context;
};

const createDefaultEntry = (): JournalEntry => ({
  date: new Date().toISOString().split('T')[0],
  mood: WELLNESS_DEFAULTS.mood,
  energy: WELLNESS_DEFAULTS.energy,
  stress: WELLNESS_DEFAULTS.stress,
  sleep: WELLNESS_DEFAULTS.sleep,
  recovery: WELLNESS_DEFAULTS.recovery,
  notes: '',
  goals: '',
  gratitude: ''
});

export const WellnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>(createDefaultEntry);
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>([]);
  const { toast } = useToast();
  const { downloadPDF } = useWellnessPDF();

  // Load saved entries on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.wellnessEntries);
    if (saved) {
      setSavedEntries(JSON.parse(saved));
    }
  }, []);

  const updateEntry = (field: keyof JournalEntry, value: string | number) => {
    setCurrentEntry(prev => ({ ...prev, [field]: value }));
  };

  const saveEntry = () => {
    const newEntries = [...savedEntries, currentEntry];
    setSavedEntries(newEntries);
    localStorage.setItem(STORAGE_KEYS.wellnessEntries, JSON.stringify(newEntries));
    
    // Download PDF
    downloadPDF(currentEntry);
    
    toast({
      title: "Entry saved! 🌟",
      description: "Your wellness data has been recorded and PDF downloaded.",
    });
    
    setCurrentEntry(createDefaultEntry());
  };

  const resetEntry = () => {
    setCurrentEntry(createDefaultEntry());
  };

  return (
    <WellnessContext.Provider value={{
      currentEntry,
      savedEntries,
      updateEntry,
      saveEntry,
      resetEntry
    }}>
      {children}
    </WellnessContext.Provider>
  );
};