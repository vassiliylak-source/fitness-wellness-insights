import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import ExternalLink from "@/components/common/ExternalLink";
import { EXTERNAL_URLS } from "@/constants";

const AiInsightsCard = () => {
  return (
    <Card className="card-modern bg-gradient-to-br from-purple-50/90 to-pink-50/90 border-purple-200">
      <CardContent className="pt-8 py-[2px]">
        <div className="text-center space-y-6">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl inline-block">
            <Brain className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-800">
            AI Fitness Insights
          </h2>
          <p className="text-lg font-medium text-gray-700 max-w-2xl mx-auto">
            Get personalized AI analysis of your fitness data, sleep patterns, and health metrics with advanced recommendations
          </p>
          <div className="flex justify-center">
            <ExternalLink 
              href={EXTERNAL_URLS.aiInsights}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🧠 Get AI Insights
            </ExternalLink>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiInsightsCard;