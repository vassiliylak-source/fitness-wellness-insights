
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
  'steps', 'calories', 'cal', 'kcal', 'distance', 'miles', 'mi', 'km', 'kilometers',
  'heart rate', 'hr', 'bpm', 'pace', 'speed', 'mph', 'kph', 'min/mile', 'min/km',
  'workout', 'exercise', 'run', 'walk', 'cycle', 'bike', 'swim', 'duration',
  'time', 'minutes', 'hours', 'elevation', 'floors', 'zone', 'active',
  'strava', 'garmin', 'fitbit', 'apple health', 'samsung health', 'google fit',
  'activity', 'training', 'sport', 'health', 'fitness', 'move', 'stand',
  'breathe', 'rings', 'goal', 'target', 'avg', 'max', 'total', 'current'
];

// Common number patterns that might represent fitness data
const FITNESS_NUMBER_PATTERNS = [
  /\b\d{1,3}(?:,\d{3})*\b/g, // Numbers with commas (like step counts)
  /\b\d+\.\d+\b/g, // Decimal numbers (like distance)
  /\b\d+:\d{2}(?::\d{2})?\b/g, // Time formats
  /\b\d+\s*(?:bpm|beats)\b/gi, // Heart rate patterns
];

export const analyzeImage = async (imageFile: File): Promise<ImageAnalysisResult> => {
  try {
    console.log('Starting OCR analysis...');
    
    // Create Tesseract worker with enhanced configuration
    const worker = await createWorker();
    
    // Configure Tesseract for better fitness app text recognition
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,:/%-',
      tessedit_pageseg_mode: 6, // Use number instead of string
      preserve_interword_spaces: '1',
    });
    
    // Perform OCR on the image
    const { data: { text } } = await worker.recognize(imageFile);
    
    await worker.terminate();
    
    console.log('OCR completed. Raw extracted text:', text);
    
    // Clean and normalize the extracted text
    const normalizedText = text.toLowerCase().trim();
    
    // More lenient fitness data detection
    const detectedKeywords = FITNESS_KEYWORDS.filter(keyword => 
      normalizedText.includes(keyword.toLowerCase())
    );
    
    // Check for fitness-related numbers even if keywords are missing
    const hasNumbers = FITNESS_NUMBER_PATTERNS.some(pattern => 
      pattern.test(text)
    );
    
    // More lenient detection - either keywords OR numbers that look like fitness data
    const isFitnessData = detectedKeywords.length >= 1 || (hasNumbers && text.length > 10);
    
    console.log('Detected keywords:', detectedKeywords);
    console.log('Has fitness-like numbers:', hasNumbers);
    console.log('Is fitness data:', isFitnessData);
    
    if (!isFitnessData) {
      return {
        isFitnessData: false,
        extractedText: text,
        error: "This doesn't appear to be a fitness app screenshot. Please upload a screenshot from your fitness app showing workout data, steps, calories, or other fitness metrics."
      };
    }
    
    // Extract fitness metrics from the text
    const fitnessData = extractFitnessMetrics(text);
    
    // If we detected it as fitness data but couldn't extract any metrics, still show it
    if (fitnessData.detectedMetrics.length === 0 && isFitnessData) {
      fitnessData.detectedMetrics.push('fitness data detected');
    }
    
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
  
  console.log('Extracting metrics from text:', text);
  
  // Enhanced steps extraction with more patterns
  const stepsPatterns = [
    /(\d{1,3}(?:,\d{3})*|\d+)\s*(?:steps?|step)/i,
    /steps?\s*[:\-]?\s*(\d{1,3}(?:,\d{3})*|\d+)/i,
    /(\d{1,3}(?:,\d{3})*|\d+)(?=.*steps?)/i
  ];
  
  for (const pattern of stepsPatterns) {
    const match = text.match(pattern);
    if (match) {
      const stepValue = parseInt(match[1].replace(/,/g, ''));
      if (stepValue > 0 && stepValue < 100000) { // Reasonable step range
        metrics.steps = stepValue;
        metrics.detectedMetrics.push('steps');
        console.log('Found steps:', stepValue);
        break;
      }
    }
  }
  
  // Enhanced calories extraction
  const caloriesPatterns = [
    /(\d+)\s*(?:cal|kcal|calories?)/i,
    /(?:cal|kcal|calories?)\s*[:\-]?\s*(\d+)/i,
    /(\d+)(?=.*(?:cal|kcal|calories?))/i
  ];
  
  for (const pattern of caloriesPatterns) {
    const match = text.match(pattern);
    if (match) {
      const calValue = parseInt(match[1]);
      if (calValue > 0 && calValue < 10000) { // Reasonable calorie range
        metrics.calories = calValue;
        metrics.detectedMetrics.push('calories');
        console.log('Found calories:', calValue);
        break;
      }
    }
  }
  
  // Enhanced distance extraction
  const distancePatterns = [
    /(\d+\.?\d*)\s*(?:miles?|mi|km|kilometers?)/i,
    /(?:distance|dist)\s*[:\-]?\s*(\d+\.?\d*)/i,
    /(\d+\.?\d*)\s*(?=.*(?:miles?|mi|km|kilometers?))/i
  ];
  
  for (const pattern of distancePatterns) {
    const match = text.match(pattern);
    if (match) {
      const distValue = parseFloat(match[1]);
      if (distValue > 0 && distValue < 1000) { // Reasonable distance range
        metrics.distance = distValue;
        metrics.detectedMetrics.push('distance');
        console.log('Found distance:', distValue);
        break;
      }
    }
  }
  
  // Enhanced heart rate extraction
  const heartRatePatterns = [
    /(\d+)\s*(?:bpm|beats?|heart rate|hr)/i,
    /(?:heart rate|hr|bpm)\s*[:\-]?\s*(\d+)/i,
    /(\d+)(?=.*(?:bpm|beats?|heart rate|hr))/i
  ];
  
  for (const pattern of heartRatePatterns) {
    const match = text.match(pattern);
    if (match) {
      const hrValue = parseInt(match[1]);
      if (hrValue >= 30 && hrValue <= 250) { // Reasonable heart rate range
        metrics.heartRate = hrValue;
        metrics.detectedMetrics.push('heart rate');
        console.log('Found heart rate:', hrValue);
        break;
      }
    }
  }
  
  // Enhanced pace extraction
  const pacePatterns = [
    /(\d{1,2}:\d{2})\s*(?:\/mile|\/km|min\/mile|min\/km|pace)/i,
    /(?:pace|avg pace)\s*[:\-]?\s*(\d{1,2}:\d{2})/i,
    /(\d{1,2}:\d{2})(?=.*(?:pace|\/mile|\/km))/i
  ];
  
  for (const pattern of pacePatterns) {
    const match = text.match(pattern);
    if (match) {
      metrics.pace = match[1];
      metrics.detectedMetrics.push('pace');
      console.log('Found pace:', match[1]);
      break;
    }
  }
  
  // Enhanced duration extraction
  const durationPatterns = [
    /(\d{1,2}:\d{2}(?::\d{2})?)\s*(?:duration|time|total time|workout time)/i,
    /(?:duration|time|total time|workout time)\s*[:\-]?\s*(\d{1,2}:\d{2}(?::\d{2})?)/i,
    /(\d{1,2}:\d{2}:\d{2})(?!.*(?:pace|\/mile|\/km))/i // Time format but not pace
  ];
  
  for (const pattern of durationPatterns) {
    const match = text.match(pattern);
    if (match) {
      metrics.duration = match[1];
      metrics.detectedMetrics.push('duration');
      console.log('Found duration:', match[1]);
      break;
    }
  }
  
  // Look for any large numbers that might be steps if we haven't found steps yet
  if (!metrics.steps) {
    const largeNumbers = text.match(/\b(\d{4,})\b/g);
    if (largeNumbers) {
      for (const numStr of largeNumbers) {
        const num = parseInt(numStr.replace(/,/g, ''));
        if (num >= 1000 && num <= 50000) { // Likely step count range
          metrics.steps = num;
          metrics.detectedMetrics.push('steps (estimated)');
          console.log('Found estimated steps:', num);
          break;
        }
      }
    }
  }
  
  console.log('Final extracted metrics:', metrics);
  
  return metrics;
};
