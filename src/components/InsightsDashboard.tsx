
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
  Moon
} from "lucide-react";

interface InsightsDashboardProps {
  uploadedImage: string | null;
}

const InsightsDashboard = ({ uploadedImage }: InsightsDashboardProps) => {
  // Mock data - in a real app, this would come from AI analysis
  const insights = {
    heartRate: {
      current: 68,
      zone: "Resting",
      trend: "stable",
      recommendation: "Your resting heart rate is excellent for your age group."
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
    cadence: {
      current: 168,
      optimal: 180,
      trend: "improving",
      recommendation: "Increase your cadence by 5-10 steps per minute for better efficiency."
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

      {/* Key Insights Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Heart Rate */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Heart className="h-6 w-6 text-red-600" />
              <Badge variant="secondary" className="bg-red-100">
                {insights.heartRate.zone}
              </Badge>
            </div>
            <CardTitle className="text-2xl">{insights.heartRate.current} BPM</CardTitle>
            <CardDescription>Resting Heart Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">Excellent</span>
            </div>
            <Progress value={85} className="mb-2" />
            <p className="text-sm text-gray-600">{insights.heartRate.recommendation}</p>
          </CardContent>
        </Card>

        {/* VO2 Max */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Zap className="h-6 w-6 text-blue-600" />
              <Badge variant="secondary" className="bg-blue-100">
                <TrendingUp className="h-3 w-3 mr-1" />
                Improving
              </Badge>
            </div>
            <CardTitle className="text-2xl">{insights.vo2Max.current}</CardTitle>
            <CardDescription>VO2 Max (ml/kg/min)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">{insights.vo2Max.percentile}th percentile</span>
            </div>
            <Progress value={insights.vo2Max.percentile} className="mb-2" />
            <p className="text-sm text-gray-600">{insights.vo2Max.recommendation}</p>
          </CardContent>
        </Card>

        {/* Sleep Quality */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Moon className="h-6 w-6 text-purple-600" />
              <Badge variant="secondary" className="bg-purple-100">
                Quality Sleep
              </Badge>
            </div>
            <CardTitle className="text-2xl">{insights.sleep.quality}%</CardTitle>
            <CardDescription>Sleep Quality Score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 mb-2">
              <div className="flex justify-between text-sm">
                <span>Deep Sleep:</span>
                <span className="font-medium">{insights.sleep.deepSleep}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>REM Sleep:</span>
                <span className="font-medium">{insights.sleep.remSleep}%</span>
              </div>
            </div>
            <Progress value={insights.sleep.quality} className="mb-2" />
            <p className="text-sm text-gray-600">{insights.sleep.recommendation}</p>
          </CardContent>
        </Card>

        {/* Cadence */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Activity className="h-6 w-6 text-green-600" />
              <Badge variant="secondary" className="bg-yellow-100">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Room to improve
              </Badge>
            </div>
            <CardTitle className="text-2xl">{insights.cadence.current}</CardTitle>
            <CardDescription>Steps per minute</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">Target: {insights.cadence.optimal} SPM</span>
            </div>
            <Progress value={(insights.cadence.current / insights.cadence.optimal) * 100} className="mb-2" />
            <p className="text-sm text-gray-600">{insights.cadence.recommendation}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Pro-Level Recommendations
          </CardTitle>
          <CardDescription>Personalized advice based on your current fitness data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Cardiovascular Health</h4>
                <p className="text-sm text-gray-700">Your heart rate metrics indicate excellent cardiovascular fitness. Maintain your current training intensity.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-800">Endurance Training</h4>
                <p className="text-sm text-gray-700">Your VO2 Max is trending upward. Consider adding 1-2 high-intensity interval sessions weekly to maximize gains.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800">Running Efficiency</h4>
                <p className="text-sm text-gray-700">Increase your cadence gradually to 175-180 SPM. This will reduce injury risk and improve running economy.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsDashboard;
