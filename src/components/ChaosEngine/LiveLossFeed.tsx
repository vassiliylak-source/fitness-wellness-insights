import { useChaosEngine } from '@/contexts/ChaosEngineContext';

const REASON_TRANSLATIONS: Record<string, string> = {
  'Protocol Abort': 'Отмена протокола',
  'Missed Daily Check-in': 'Пропуск ежедневной проверки',
  'Timer Abandonment': 'Отмена таймера',
  'Integrity Failure': 'Провал целостности',
};

const LiveLossFeed = () => {
  const { liveFeed } = useChaosEngine();

  if (liveFeed.length === 0) return null;

  return (
    <div className="live-feed">
      <div className="feed-scroll flex gap-12 text-xs">
        {liveFeed.slice(0, 10).map((item) => (
          <span key={item.id} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-destructive">▼</span>
            <span className="text-muted-foreground">{item.userId === 'You' ? 'Ты' : item.userId}</span>
            <span className="text-destructive font-bold">потерял ${item.amount.toFixed(2)}</span>
            <span className="text-muted-foreground">— {REASON_TRANSLATIONS[item.reason] || item.reason}</span>
          </span>
        ))}
        {liveFeed.slice(0, 10).map((item) => (
          <span key={`${item.id}-dup`} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-destructive">▼</span>
            <span className="text-muted-foreground">{item.userId === 'You' ? 'Ты' : item.userId}</span>
            <span className="text-destructive font-bold">потерял ${item.amount.toFixed(2)}</span>
            <span className="text-muted-foreground">— {REASON_TRANSLATIONS[item.reason] || item.reason}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default LiveLossFeed;
