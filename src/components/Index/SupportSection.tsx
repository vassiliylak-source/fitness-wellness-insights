import { Card, CardContent } from "@/components/ui/card";
import ExternalLink from "@/components/common/ExternalLink";
import { EXTERNAL_URLS } from "@/constants";
const SupportSection = () => {
  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-xl font-bold gradient-text mb-4">Need Support?</h3>
      <p className="text-muted-foreground">Connect with our wellness community for guidance and support on your journey.</p>
    </div>
  );
};
export default SupportSection;