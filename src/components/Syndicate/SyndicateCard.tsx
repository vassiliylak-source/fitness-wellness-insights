import { Syndicate } from '@/contexts/SyndicateContext';
import { useSyndicate } from '@/contexts/SyndicateContext';
import { Users, TrendingDown, DollarSign, Skull } from 'lucide-react';

interface SyndicateCardProps {
  syndicate: Syndicate;
  onJoin: (syndicateId: string) => void;
}

const SyndicateCard = ({ syndicate, onJoin }: SyndicateCardProps) => {
  const { calculateEstimatedBounty, calculateAttritionRate } = useSyndicate();
  
  const activeMembers = syndicate.members.filter(m => m.status === 'ACTIVE');
  const eliminatedMembers = syndicate.members.filter(m => m.status === 'ELIMINATED');
  const attritionRate = calculateAttritionRate(syndicate);
  const estimatedBounty = calculateEstimatedBounty(syndicate);
  
  const daysRemaining = Math.max(0, Math.ceil(
    (new Date(syndicate.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  ));

  return (
    <div className="card-terminal p-4 space-y-4 hover:border-primary/50 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-primary">{syndicate.name}</h3>
          <p className="text-xs text-muted-foreground">{daysRemaining} days remaining</p>
        </div>
        <div className={`px-2 py-1 text-xs uppercase ${
          syndicate.status === 'ACTIVE' 
            ? 'bg-primary/10 text-primary border border-primary/30' 
            : 'bg-muted text-muted-foreground border border-border'
        }`}>
          {syndicate.status}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Pool Status */}
        <div className="text-center p-2 bg-muted/30 border border-border">
          <DollarSign className="w-4 h-4 text-secondary mx-auto mb-1" />
          <div className="text-lg font-bold text-secondary">${syndicate.totalPool}</div>
          <div className="text-xs text-muted-foreground uppercase">Pool</div>
        </div>

        {/* Attrition Rate */}
        <div className="text-center p-2 bg-muted/30 border border-border">
          <TrendingDown className="w-4 h-4 text-destructive mx-auto mb-1" />
          <div className="text-lg font-bold text-destructive">{attritionRate.toFixed(0)}%</div>
          <div className="text-xs text-muted-foreground uppercase">Attrition</div>
        </div>

        {/* Estimated Bounty */}
        <div className="text-center p-2 bg-muted/30 border border-border">
          <Skull className="w-4 h-4 text-energy mx-auto mb-1" />
          <div className="text-lg font-bold text-energy">${estimatedBounty}</div>
          <div className="text-xs text-muted-foreground uppercase">Est. Bounty</div>
        </div>
      </div>

      {/* Member List */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>MEMBERS ({activeMembers.length}/{syndicate.members.length})</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {syndicate.members.map((member) => (
            <span 
              key={member.id}
              className={`px-2 py-0.5 text-xs font-mono ${
                member.status === 'ACTIVE'
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'bg-destructive/10 text-destructive border border-destructive/30 line-through'
              }`}
            >
              {member.id}
            </span>
          ))}
        </div>
      </div>

      {/* Potential Earnings */}
      <div className="p-3 bg-energy/5 border border-energy/30">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">Potential Earnings</span>
          <span className="text-lg font-bold text-energy">
            +${estimatedBounty - 50}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Based on {attritionRate.toFixed(0)}% failure rate projection
        </p>
      </div>

      {/* Join Button */}
      <button
        onClick={() => onJoin(syndicate.id)}
        className="w-full btn-terminal text-sm py-3"
      >
        JOIN A PACT
      </button>
    </div>
  );
};

export default SyndicateCard;
