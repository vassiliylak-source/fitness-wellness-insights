import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Activity, Moon, Zap, TrendingUp, Clock, Target, BarChart3 } from "lucide-react";
const MetricsOverview = () => {
  const supportedMetrics = [{
    icon: Heart,
    title: "Heart Rate Analysis",
    description: "Comprehensive heart rate monitoring and training zone optimization",
    colors: "from-red-500 to-pink-500"
  }, {
    icon: Activity,
    title: "Performance Metrics",
    description: "Running efficiency, cadence, and biomechanics analysis",
    colors: "from-green-500 to-emerald-500"
  }, {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Long-term trends, goal setting, and fitness predictions",
    colors: "from-orange-500 to-red-500"
  }];
  return <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What It Assesses </h2>
        <p className="text-gray-600">The app understands all major fitness metrics and provides actionable insights</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supportedMetrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.colors} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="bg-gray-100">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    AI Powered
                  </Badge>
                </div>
                <CardTitle className="text-lg">{metric.title}</CardTitle>
                <CardDescription>{metric.description}</CardDescription>
              </CardHeader>
               <CardContent>
                 <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                   AI-powered analysis with personalized insights and recommendations
                 </div>
               </CardContent>
            </Card>;
      })}
      </div>

      {/* Supported Apps */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-center">Compatible with Popular Fitness Apps</CardTitle>
          <CardDescription className="text-center">
            Upload screenshots from any of these apps and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-4">
            {["Apple Health", "Strava", "Garmin Connect", "Fitbit", "MyFitnessPal", "Nike Run Club", "Polar Flow", "Suunto", "Oura Ring", "Whoop", "Coros", "Wahoo"].map((app, index) => <Badge key={index} variant="outline" className="px-3 py-1">
                {app}
              </Badge>)}
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default MetricsOverview;