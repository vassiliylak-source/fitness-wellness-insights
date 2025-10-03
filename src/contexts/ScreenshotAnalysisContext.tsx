import React, { createContext, useContext, useState } from 'react';
import { ImageAnalysisResult } from '@/services/imageAnalysis';

interface ScreenshotAnalysisContextType {
  uploadedImage: string | null;
  analysisResult: ImageAnalysisResult | null;
  setUploadedImage: (image: string | null) => void;
  setAnalysisResult: (result: ImageAnalysisResult | null) => void;
}

const ScreenshotAnalysisContext = createContext<ScreenshotAnalysisContextType | null>(null);

export const useScreenshotAnalysis = () => {
  const context = useContext(ScreenshotAnalysisContext);
  if (!context) {
    throw new Error('useScreenshotAnalysis must be used within ScreenshotAnalysisProvider');
  }
  return context;
};

export const ScreenshotAnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);

  return (
    <ScreenshotAnalysisContext.Provider value={{
      uploadedImage,
      analysisResult,
      setUploadedImage,
      setAnalysisResult
    }}>
      {children}
    </ScreenshotAnalysisContext.Provider>
  );
};
