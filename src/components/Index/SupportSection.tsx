import { Card, CardContent } from "@/components/ui/card";
import ExternalLink from "@/components/common/ExternalLink";
import { EXTERNAL_URLS } from "@/constants";
const SupportSection = () => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="card-modern">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 gradient-text">Need Support?</h2>
            <p className="text-muted-foreground mb-6">
              Get help and connect with our community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ExternalLink href={EXTERNAL_URLS.aiInsights} className="btn-primary">
                AI Insights
              </ExternalLink>
              <ExternalLink href={EXTERNAL_URLS.paypal} className="btn-secondary">
                Support Us
              </ExternalLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
export default SupportSection;