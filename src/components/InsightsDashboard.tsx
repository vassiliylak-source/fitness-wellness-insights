import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap, 
  Target,
  AlertTriangle,
  CheckCircle,
  Moon,
  Upload
} from "lucide-react";

import { ImageAnalysisResult } from "@/services/imageAnalysis";

interface InsightsDashboardProps {
  uploadedImage: string | null;
  analysisResult?: ImageAnalysisResult | null;
}

const InsightsDashboard = ({ uploadedImage, analysisResult }: InsightsDashboardProps) => {
  // Use real data from OCR analysis when available, fallback to mock data
  const fitnessData = analysisResult?.fitnessData;
  
  // Enhanced mock data with real OCR data integration
  const insights = {
    heartRate: {
      current: fitnessData?.heartRate || 68,
      zone: fitnessData?.heartRate ? (fitnessData.heartRate > 100 ? "Active" : "Resting") : "Resting",
      trend: "stable",
      recommendation: fitnessData?.heartRate 
        ? `Your heart rate of ${fitnessData.heartRate} BPM indicates ${fitnessData.heartRate > 100 ? 'active exercise' : 'good resting state'}.`
        : "Your resting heart rate is excellent for your age group."
    },
    vo2Max: {
      current: 45,
      percentile: 85,
      trend: "improving",
      recommendation: "VO2 Max is in the 85th percentile - keep up the endurance training!"
    },
    sleep: {
      quality: 82,
      deepSleep: 18,
      remSleep: 22,
      recommendation: "Great sleep quality! Consider maintaining your current sleep schedule."
    },
    steps: {
      current: fitnessData?.steps || 0,
      goal: 10000,
      hasRealData: !!fitnessData?.steps,
      recommendation: fitnessData?.steps 
        ? `You've taken ${fitnessData.steps.toLocaleString()} steps. ${fitnessData.steps >= 10000 ? 'Great job reaching your goal!' : 'Keep moving to reach your daily goal!'}`
        : "Step data not detected in the uploaded image."
    },
    calories: {
      current: fitnessData?.calories || 0,
      hasRealData: !!fitnessData?.calories,
      recommendation: fitnessData?.calories 
        ? `You've burned ${fitnessData.calories} calories during this activity.`
        : "Calorie data not detected in the uploaded image."
    },
    distance: {
      current: fitnessData?.distance || 0,
      hasRealData: !!fitnessData?.distance,
      recommendation: fitnessData?.distance 
        ? `You covered ${fitnessData.distance} ${fitnessData.distance > 5 ? 'km' : 'miles'} in this workout.`
        : "Distance data not detected in the uploaded image."
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          AI Analysis Complete ✨
        </h2>
        <p className="text-gray-600">
          Here are your personalized fitness insights based on your data
        </p>
        {analysisResult?.fitnessData?.detectedMetrics && (
          <div className="mt-2">
            <p className="text-sm text-green-600">
              Detected metrics: {analysisResult.fitnessData.detectedMetrics.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Original Image */}
      {uploadedImage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Uploaded Data</CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={uploadedImage} 
              alt="Original fitness data" 
              className="w-full max-h-64 object-contain rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Real Data Metrics (when available) */}
      {fitnessData && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fitnessData.steps && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Activity className="h-6 w-6 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100">
                    Real Data
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{fitnessData.steps.toLocaleString()}</CardTitle>
                <CardDescription>Steps</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={(fitnessData.steps / 10000) * 100} className="mb-2" />
                <p className="text-sm text-gray-600">{insights.steps.recommendation}</p>
              </CardContent>
            </Card>
          )}

          {fitnessData.calories && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Zap className="h-6 w-6 text-orange-600" />
                  <Badge variant="secondary" className="bg-orange-100">
                    Real Data
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{fitnessData.calories}</CardTitle>
                <CardDescription>Calories Burned</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{insights.calories.recommendation}</p>
              </CardContent>
            </Card>
          )}

          {fitnessData.distance && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Target className="h-6 w-6 text-blue-600" />
                  <Badge variant="secondary" className="bg-blue-100">
                    Real Data
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{fitnessData.distance}</CardTitle>
                <CardDescription>Distance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{insights.distance.recommendation}</p>
              </CardContent>
            </Card>
          )}

          {fitnessData.heartRate && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Heart className="h-6 w-6 text-red-600" />
                  <Badge variant="secondary" className="bg-red-100">
                    {insights.heartRate.zone}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{fitnessData.heartRate} BPM</CardTitle>
                <CardDescription>Heart Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{insights.heartRate.recommendation}</p>
              </CardContent>
            </Card>
          )}

          {fitnessData.pace && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Clock className="h-6 w-6 text-purple-600" />
                  <Badge variant="secondary" className="bg-purple-100">
                    Real Data
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{fitnessData.pace}</CardTitle>
                <CardDescription>Pace</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Great pacing for your workout!</p>
              </CardContent>
            </Card>
          )}

          {fitnessData.duration && (
            <Card className="border-indigo-200 bg-indigo-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Clock className="h-6 w-6 text-indigo-600" />
                  <Badge variant="secondary" className="bg-indigo-100">
                    Real Data
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{fitnessData.duration}</CardTitle>
                <CardDescription>Duration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Excellent workout duration!</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Detailed Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            {fitnessData ? 'Personalized Recommendations' : 'Sample Recommendations'}
          </CardTitle>
          <CardDescription>
            {fitnessData 
              ? 'Based on your actual fitness data' 
              : 'Upload a fitness screenshot to get personalized insights'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fitnessData ? (
              // Real recommendations based on detected data
              <>
                {fitnessData.steps && (
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">Step Progress</h4>
                      <p className="text-sm text-gray-700">
                        {fitnessData.steps >= 10000 
                          ? 'Excellent! You\'ve exceeded your daily step goal. Maintain this level of activity for optimal health.'
                          : `You're ${(10000 - fitnessData.steps).toLocaleString()} steps away from your daily goal. Try taking a walk or using stairs.`
                        }
                      </p>
                    </div>
                  </div>
                )}
                
                {fitnessData.heartRate && (
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800">Heart Rate Analysis</h4>
                      <p className="text-sm text-gray-700">
                        {fitnessData.heartRate > 100 
                          ? 'Your elevated heart rate indicates active exercise. Great work on maintaining intensity!'
                          : 'Your heart rate shows you were in a comfortable zone. Consider adding some high-intensity intervals.'
                        }
                      </p>
                    </div>
                  </div>
                )}
                
                {fitnessData.calories && (
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800">Calorie Burn</h4>
                      <p className="text-sm text-gray-700">
                        You burned {fitnessData.calories} calories. {fitnessData.calories > 300 
                          ? 'Excellent calorie burn for this session!'
                          : 'Consider extending your workout or increasing intensity for higher calorie burn.'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Default recommendations when no real data available
              <>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Upload Your Data</h4>
                    <p className="text-sm text-gray-700">
                      To get personalized insights, upload a clear screenshot from your fitness app showing your workout data, steps, calories, or other metrics.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">Supported Apps</h4>
                    <p className="text-sm text-gray-700">
                      Works with Apple Health, Strava, Garmin Connect, Fitbit, Samsung Health, Google Fit, and most other fitness apps.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* More AI Insights Link */}
          <div className="flex justify-center mt-6 pt-4 border-t border-gray-200">
            <a 
              href="https://chatgpt.com/g/g-67c6e2ead288819186d3be7d91466783-fitness-sleep-metrics-insights" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🧠 Get More AI Insights
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsDashboard;
