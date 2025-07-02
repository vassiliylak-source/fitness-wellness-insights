import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Activity, Moon, Zap, TrendingUp, Clock, Target, BarChart3 } from "lucide-react";

const MetricsOverview = () => {
  return <div className="space-y-6">
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