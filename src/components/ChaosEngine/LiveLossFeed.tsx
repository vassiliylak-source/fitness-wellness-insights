import { useChaosEngine } from '@/contexts/ChaosEngineContext';

const LiveLossFeed = () => {
  const { liveFeed } = useChaosEngine();

  if (liveFeed.length === 0) return null;

  return (
    <div className="live-feed">
      <div className="feed-scroll flex gap-12 text-xs">
        {liveFeed.slice(0, 10).map((item) => (
          <span key={item.id} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-destructive">▼</span>
            <span className="text-muted-foreground">{item.userId}</span>
            <span className="text-destructive font-bold">lost ${item.amount.toFixed(2)}</span>
            <span className="text-muted-foreground">due to {item.reason}</span>
          </span>
        ))}
        {liveFeed.slice(0, 10).map((item) => (
          <span key={`${item.id}-dup`} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-destructive">▼</span>
            <span className="text-muted-foreground">{item.userId}</span>
            <span className="text-destructive font-bold">lost ${item.amount.toFixed(2)}</span>
            <span className="text-muted-foreground">due to {item.reason}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default LiveLossFeed;
