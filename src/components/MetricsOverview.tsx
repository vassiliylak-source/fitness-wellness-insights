import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Activity, Moon, Zap, TrendingUp, Clock, Target, BarChart3 } from "lucide-react";
const MetricsOverview = () => {
  const supportedMetrics = [{
    icon: Heart,
    title: "Heart Rate Analysis",
    description: "Resting, max, and zone analysis with personalized recommendations",
    features: ["Zone training", "Recovery insights", "Trend analysis"],
    colors: "from-red-500 to-pink-500"
  }, {
    icon: Zap,
    title: "VO2 Max Insights",
    description: "Cardiovascular fitness assessment and improvement strategies",
    features: ["Fitness level", "Age comparison", "Training plans"],
    colors: "from-blue-500 to-cyan-500"
  }, {
    icon: Moon,
    title: "Sleep Pattern Analysis",
    description: "Deep sleep, REM cycles, and recovery optimization",
    features: ["Sleep stages", "Quality score", "Recovery tips"],
    colors: "from-purple-500 to-indigo-500"
  }, {
    icon: Activity,
    title: "Cadence & Form",
    description: "Running efficiency and biomechanics analysis",
    features: ["Step rate", "Form tips", "Injury prevention"],
    colors: "from-green-500 to-emerald-500"
  }, {
    icon: TrendingUp,
    title: "Performance Trends",
    description: "Long-term progress tracking and goal setting",
    features: ["Progress charts", "Goal tracking", "Predictions"],
    colors: "from-orange-500 to-red-500"
  }, {
    icon: Target,
    title: "Training Zones",
    description: "Personalized training recommendations and zone optimization",
    features: ["Zone calculator", "Workout plans", "Intensity guide"],
    colors: "from-teal-500 to-blue-500"
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
                <div className="space-y-2">
                  {metric.features.map((feature, idx) => <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>)}
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