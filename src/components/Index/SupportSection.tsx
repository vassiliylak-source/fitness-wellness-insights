import { Card, CardContent } from "@/components/ui/card";
import ExternalLink from "@/components/common/ExternalLink";
import { EXTERNAL_URLS } from "@/constants";
const SupportSection = () => {
  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Get Support</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with mental health professionals and support resources
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Crisis Hotline</h3>
              <p className="text-sm text-muted-foreground mb-4">24/7 support available</p>
              <ExternalLink href="tel:988" className="text-primary hover:underline">
                Call 988
              </ExternalLink>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Online Therapy</h3>
              <p className="text-sm text-muted-foreground mb-4">Professional counseling</p>
              <ExternalLink href="https://www.betterhelp.com" className="text-primary hover:underline">
                BetterHelp
              </ExternalLink>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Support Groups</h3>
              <p className="text-sm text-muted-foreground mb-4">Connect with others</p>
              <ExternalLink href="https://www.nami.org" className="text-primary hover:underline">
                NAMI
              </ExternalLink>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default SupportSection;