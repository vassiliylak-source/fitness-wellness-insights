import { Brain, Sparkles, Zap } from "lucide-react";
import ExternalLink from "@/components/common/ExternalLink";
import { EXTERNAL_URLS } from "@/constants";

const AiInsightsCard = () => {
  return (
    <div className="card-feature relative overflow-hidden animate-fade-in">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary-deep/10 rounded-3xl"></div>
      
      <div className="relative text-center space-y-8">
        {/* Enhanced icon with animations */}
        <div className="flex justify-center">
          <div className="relative feature-icon p-6 pulse-glow">
            <Brain className="h-16 w-16 text-primary-foreground" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-accent animate-pulse" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-black gradient-text">
            AI Fitness Insights
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get personalized AI analysis of your fitness data, sleep patterns, and health metrics with{' '}
            <span className="gradient-text-secondary font-semibold">advanced recommendations</span>
          </p>
        </div>
        
        {/* Enhanced CTA button */}
        <div className="flex justify-center pt-4">
          <ExternalLink 
            href={EXTERNAL_URLS.aiInsights}
            className="btn-primary text-xl px-12 py-5 hover-lift inline-flex items-center gap-4"
          >
            <Brain className="h-6 w-6" />
            Get AI Insights
            <Zap className="h-5 w-5 animate-pulse" />
          </ExternalLink>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          {[
            { icon: '🔍', label: 'Deep Analysis' },
            { icon: '📊', label: 'Pattern Recognition' },
            { icon: '💡', label: 'Smart Recommendations' }
          ].map((feature, index) => (
            <div key={feature.label} className="glass-card p-4 rounded-2xl hover-lift">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <div className="text-sm font-semibold text-muted-foreground">{feature.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiInsightsCard;