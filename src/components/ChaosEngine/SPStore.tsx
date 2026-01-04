import { useState } from 'react';
import { useChaosEngine } from '@/contexts/ChaosEngineContext';
import { Zap, Calendar, Archive, ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const STORE_ITEMS = [
  {
    id: 'rest_day_pass',
    name: 'ПРОПУСК ДНЯ ОТДЫХА',
    description: 'Пауза серии на 24ч без штрафа',
    cost: 100,
    icon: Calendar,
  },
  {
    id: 'protocol_archive',
    name: 'АРХИВ ПРОТОКОЛОВ',
    description: 'Доступ к истории тренировок',
    cost: 50,
    icon: Archive,
  },
  {
    id: 'reroll_token',
    name: 'ТОКЕН ПЕРЕГЕНЕРАЦИИ',
    description: 'Одна бесплатная замена упражнения',
    cost: 10,
    icon: Zap,
  },
];

const SPStore = () => {
  const { vault, purchaseWithSP } = useChaosEngine();
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());

  const handlePurchase = (itemId: string, cost: number, itemName: string) => {
    if (purchaseWithSP(cost)) {
      setPurchasedItems(prev => new Set([...prev, itemId]));
      toast({
        title: 'ПОКУПКА ЗАВЕРШЕНА',
        description: `${itemName} добавлен в инвентарь`,
      });
    } else {
      toast({
        title: 'НЕДОСТАТОЧНО SP',
        description: 'Выполняй протоколы, чтобы заработать Sweat Points',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="card-terminal p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-energy" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            МАГАЗИН ВЫЖИВАНИЯ
          </span>
        </div>
        <div className="flex items-center gap-1 text-energy">
          <Zap className="w-4 h-4" />
          <span className="font-bold">{vault.sweatPoints} SP</span>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {STORE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isPurchased = purchasedItems.has(item.id);
          const canAfford = vault.sweatPoints >= item.cost;

          return (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-3 border transition-all ${
                isPurchased
                  ? 'border-primary/50 bg-primary/5'
                  : canAfford
                  ? 'border-border hover:border-energy/50'
                  : 'border-border opacity-50'
              }`}
            >
              <div className={`p-2 border ${isPurchased ? 'border-primary' : 'border-border'}`}>
                <Icon className={`w-5 h-5 ${isPurchased ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold uppercase">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>

              {isPurchased ? (
                <div className="flex items-center gap-1 text-primary text-xs">
                  <Check className="w-4 h-4" />
                  ЕСТЬ
                </div>
              ) : (
                <Button
                  onClick={() => handlePurchase(item.id, item.cost, item.name)}
                  disabled={!canAfford}
                  variant="outline"
                  size="sm"
                  className="border-energy text-energy hover:bg-energy hover:text-energy-foreground uppercase text-xs"
                >
                  {item.cost} SP
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {vault.sweatPoints === 0 && (
        <p className="text-xs text-muted-foreground text-center pt-2">
          Выполняй протоколы, чтобы заработать Sweat Points
        </p>
      )}
    </div>
  );
};

export default SPStore;
