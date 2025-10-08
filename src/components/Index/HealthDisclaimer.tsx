import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HealthDisclaimer = () => {
  const { t } = useLanguage();
  return <div className="card-elegant border-accent/20">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-gradient-to-br from-primary to-accent rounded-xl flex-shrink-0 shadow-lg">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold gradient-text text-lg">{t('disclaimer.title')}</h4>
          <p className="text-muted-foreground leading-relaxed">{t('disclaimer.text')}</p>
        </div>
      </div>
    </div>;
};
export default HealthDisclaimer;