import { Card, CardContent } from "@/components/ui/card";
import ExternalLink from "@/components/common/ExternalLink";
import { EXTERNAL_URLS } from "@/constants";

const SupportSection = () => {
  return (
    <Card className="card-modern bg-gradient-to-br from-purple-50/90 to-blue-50/90 border-purple-200 py-4 sm:py-6">
      <CardContent className="pt-6 sm:pt-8 py-1 sm:py-[3px]">
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base font-medium text-gray-700 px-4">
            💜 Enjoying this app? If you'd like to support the creator, consider treating him to a coffee with a small donation:
          </p>
          <div className="flex justify-center">
            <ExternalLink href={EXTERNAL_URLS.paypal} className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
              ☕ Buy me a coffee
            </ExternalLink>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportSection;