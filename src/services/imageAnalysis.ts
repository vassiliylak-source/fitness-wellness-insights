
import { createWorker } from 'tesseract.js';

export interface FitnessData {
  steps?: number;
  calories?: number;
  distance?: number;
  heartRate?: number;
  pace?: string;
  duration?: string;
  detectedMetrics: string[];
}

export interface ImageAnalysisResult {
  isFitnessData: boolean;
  extractedText: string;
  fitnessData?: FitnessData;
  error?: string;
}

const FITNESS_KEYWORDS = [
  'steps', 'calories', 'cal', 'kcal', 'distance', 'miles', 'km', 'kilometers',
  'heart rate', 'hr', 'bpm', 'pace', 'speed', 'mph', 'kph', 'min/mile', 'min/km',
  'workout', 'exercise', 'run', 'walk', 'cycle', 'bike', 'swim', 'duration',
  'time', 'minutes', 'hours', 'elevation', 'floors', 'zone', 'active',
  'strava', 'garmin', 'fitbit', 'apple health', 'samsung health', 'google fit'
];

export const analyzeImage = async (imageFile: File): Promise<ImageAnalysisResult> => {
  try {
    console.log('Starting OCR analysis...');
    
    // Create Tesseract worker
    const worker = await createWorker();
    
    // Perform OCR on the image
    const { data: { text } } = await worker.recognize(imageFile);
    
    await worker.terminate();
    
    console.log('OCR completed. Extracted text:', text);
    
    // Clean and normalize the extracted text
    const normalizedText = text.toLowerCase().trim();
    
    // Check if the text contains fitness-related keywords
    const detectedKeywords = FITNESS_KEYWORDS.filter(keyword => 
      normalizedText.includes(keyword.toLowerCase())
    );
    
    const isFitnessData = detectedKeywords.length >= 2; // Require at least 2 fitness keywords
    
    if (!isFitnessData) {
      return {
        isFitnessData: false,
        extractedText: text,
        error: "This doesn't appear to be a fitness app screenshot. Please upload a screenshot from your fitness app showing workout data, steps, calories, or other fitness metrics."
      };
    }
    
    // Extract fitness metrics from the text
    const fitnessData = extractFitnessMetrics(text);
    
    return {
      isFitnessData: true,
      extractedText: text,
      fitnessData,
    };
    
  } catch (error) {
    console.error('OCR analysis failed:', error);
    return {
      isFitnessData: false,
      extractedText: '',
      error: 'Failed to analyze the image. Please make sure the image is clear and contains readable text.'
    };
  }
};

const extractFitnessMetrics = (text: string): FitnessData => {
  const metrics: FitnessData = { detectedMetrics: [] };
  const lowerText = text.toLowerCase();
  
  // Extract steps
  const stepsMatch = text.match(/(\d{1,3}(?:,\d{3})*|\d+)\s*(?:steps?)/i);
  if (stepsMatch) {
    metrics.steps = parseInt(stepsMatch[1].replace(/,/g, ''));
    metrics.detectedMetrics.push('steps');
  }
  
  // Extract calories
  const caloriesMatch = text.match(/(\d+)\s*(?:cal|kcal|calories?)/i);
  if (caloriesMatch) {
    metrics.calories = parseInt(caloriesMatch[1]);
    metrics.detectedMetrics.push('calories');
  }
  
  // Extract distance
  const distanceMatch = text.match(/(\d+\.?\d*)\s*(?:miles?|mi|km|kilometers?)/i);
  if (distanceMatch) {
    metrics.distance = parseFloat(distanceMatch[1]);
    metrics.detectedMetrics.push('distance');
  }
  
  // Extract heart rate
  const heartRateMatch = text.match(/(\d+)\s*(?:bpm|beats?|heart rate|hr)/i);
  if (heartRateMatch) {
    metrics.heartRate = parseInt(heartRateMatch[1]);
    metrics.detectedMetrics.push('heart rate');
  }
  
  // Extract pace
  const paceMatch = text.match(/(\d{1,2}:\d{2})\s*(?:\/mile|\/km|min\/mile|min\/km|pace)/i);
  if (paceMatch) {
    metrics.pace = paceMatch[1];
    metrics.detectedMetrics.push('pace');
  }
  
  // Extract duration
  const durationMatch = text.match(/(\d{1,2}:\d{2}(?::\d{2})?)\s*(?:duration|time|total)/i);
  if (durationMatch) {
    metrics.duration = durationMatch[1];
    metrics.detectedMetrics.push('duration');
  }
  
  return metrics;
};
