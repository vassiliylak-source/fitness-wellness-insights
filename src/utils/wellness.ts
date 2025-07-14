import { JournalEntry } from "@/types/wellness";

export const calculateAverage = (entries: JournalEntry[], field: keyof Pick<JournalEntry, 'mood' | 'energy' | 'stress' | 'sleep' | 'recovery'>): number => {
  if (entries.length === 0) return 0;
  return Math.round(entries.reduce((sum, entry) => sum + entry[field], 0) / entries.length);
};

export const getWellnessStatus = (average: number): string => {
  if (average >= 8) return 'excellent';
  if (average >= 6) return 'good';
  if (average >= 4) return 'moderate';
  return 'needs attention';
};

export const getStatusDescription = (average: number, isStress = false): string => {
  if (isStress) {
    return average < 6 ? 'well-controlled' : 'needs attention';
  }
  return average > 6 ? 'positive' : 'room for improvement';
};

export const generateWellnessAnalysis = (entries: JournalEntry[]): string => {
  const moodAvg = calculateAverage(entries, 'mood');
  const energyAvg = calculateAverage(entries, 'energy');
  const stressAvg = calculateAverage(entries, 'stress');
  const sleepAvg = calculateAverage(entries, 'sleep');
  const recoveryAvg = calculateAverage(entries, 'recovery');

  return `
**🌟 Wellness Insights Analysis**

**Overall Patterns:**
• Your average mood score is ${moodAvg}/10 - showing ${getStatusDescription(moodAvg)} emotional well-being
• Energy levels tend to ${energyAvg > 6 ? 'fluctuate with good peaks' : 'stay moderate - consider sleep and nutrition optimization'}
• Stress management appears ${getStatusDescription(stressAvg, true)}

**Key Recommendations:**
• Focus on consistency in sleep quality (current average: ${sleepAvg}/10)
• Consider mindfulness practices to maintain emotional balance
• Track patterns between energy levels and daily activities

**Recovery Focus:**
Your recovery scores suggest ${recoveryAvg > 6 ? 'good body awareness and rest practices' : 'need for more intentional recovery time'}

Keep tracking consistently to build deeper insights! 🙏

⚠️ **Important Disclaimer:** This AI analysis is for informational purposes only and should not replace professional medical or mental health advice. If you're experiencing persistent wellness concerns, please consult with a qualified healthcare provider or therapist.
  `;
};