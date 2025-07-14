import { Card, CardContent } from "@/components/ui/card";
import ExternalLink from "@/components/common/ExternalLink";
import { EXTERNAL_URLS } from "@/constants";

const SupportSection = () => {
  return (
    <Card className="card-modern bg-gradient-to-br from-purple-50/90 to-blue-50/90 border-purple-200 py-[25px]">
      <CardContent className="pt-8 py-[3px]">
        <div className="text-center space-y-4">
          <p className="text-base font-medium text-gray-700">
            💜 Enjoying this app? If you'd like to support the creator, consider treating him to a coffee with a small donation:
          </p>
          <div className="flex justify-center">
            <ExternalLink
              href={EXTERNAL_URLS.paypal}
              className="btn-primary inline-flex items-center gap-2"
            >
              ☕ Buy me a coffee
            </ExternalLink>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Thank you for your support! ✨
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportSection;