import { Badge } from "@/components/ui/badge";
import { Smartphone } from "lucide-react";
const MetricsOverview = () => {
  const apps = ["Apple Health", "Strava", "Garmin Connect", "Fitbit", "MyFitnessPal", "Oura Ring", "Whoop", "Coros", "Wahoo"];
  return <div className="space-y-8 animate-fade-in">
      {/* Supported Apps Section */}
      <div className="card-elegant space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-xl">
            <Smartphone className="h-5 w-5 text-primary" />
            <span className="font-semibold text-muted-foreground">Universal Compatibility</span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-black gradient-text">
            Works with All Your Favorite Apps
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload screenshots from any fitness app and get instant AI-powered insights
          </p>
        </div>

        {/* App badges with enhanced styling */}
        <div className="flex flex-wrap justify-center gap-3">
          {apps.map((app, index) => <Badge key={index} variant="outline" className="px-4 py-2 text-sm font-semibold glass-card hover-lift border-primary/20 hover:border-primary/40 transition-all duration-300" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              {app}
            </Badge>)}
        </div>

      </div>
    </div>;
};
export default MetricsOverview;