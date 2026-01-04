import { useState } from 'react';
import { useSyndicate } from '@/contexts/SyndicateContext';
import SyndicateCard from './SyndicateCard';
import PactConfirmation from './PactConfirmation';
import { Users, Trophy, Skull } from 'lucide-react';

const SyndicateExplorer = () => {
  const { syndicates, mySyndicate, joinSyndicate } = useSyndicate();
  const [showPactModal, setShowPactModal] = useState(false);
  const [selectedSyndicateId, setSelectedSyndicateId] = useState<string | null>(null);

  const handleJoinClick = (syndicateId: string) => {
    setSelectedSyndicateId(syndicateId);
    setShowPactModal(true);
  };

  const handlePactConfirm = () => {
    if (selectedSyndicateId) {
      joinSyndicate(selectedSyndicateId);
    }
    setShowPactModal(false);
    setSelectedSyndicateId(null);
  };

  const handlePactCancel = () => {
    setShowPactModal(false);
    setSelectedSyndicateId(null);
  };

  // Filter out syndicates user is already in
  const availableSyndicates = syndicates.filter(s => 
    s.status === 'ACTIVE' && (!mySyndicate || s.id !== mySyndicate.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Users className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-bold text-secondary uppercase tracking-wider">
            SYNDICATE EXPLORER
          </h2>
        </div>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Join a pact. Survive together or profit from the weak.
        </p>
      </div>

      {/* My Syndicate Status */}
      {mySyndicate && (
        <div className="card-terminal p-4 border-secondary">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-secondary" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              YOUR ACTIVE PACT
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-primary">{mySyndicate.name}</div>
              <div className="text-xs text-muted-foreground">
                {mySyndicate.members.filter(m => m.status === 'ACTIVE').length} active members
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-secondary">${mySyndicate.totalPool}</div>
              <div className="text-xs text-muted-foreground">total pool</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-terminal p-3 text-center">
          <div className="text-2xl font-bold text-primary">{syndicates.length}</div>
          <div className="text-xs text-muted-foreground uppercase">Active Syndicates</div>
        </div>
        <div className="card-terminal p-3 text-center">
          <div className="text-2xl font-bold text-secondary">
            ${syndicates.reduce((sum, s) => sum + s.totalPool, 0)}
          </div>
          <div className="text-xs text-muted-foreground uppercase">Total Staked</div>
        </div>
        <div className="card-terminal p-3 text-center">
          <div className="text-2xl font-bold text-destructive">
            {syndicates.reduce((sum, s) => sum + s.members.filter(m => m.status === 'ELIMINATED').length, 0)}
          </div>
          <div className="text-xs text-muted-foreground uppercase">Eliminated</div>
        </div>
      </div>

      {/* Syndicate Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {availableSyndicates.map((syndicate) => (
          <SyndicateCard 
            key={syndicate.id} 
            syndicate={syndicate}
            onJoin={handleJoinClick}
          />
        ))}
      </div>

      {/* Empty State */}
      {availableSyndicates.length === 0 && !mySyndicate && (
        <div className="card-terminal p-8 text-center">
          <Skull className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No syndicates available.</p>
          <p className="text-xs text-muted-foreground mt-2">Check back soon.</p>
        </div>
      )}

      {/* Pact Confirmation Modal */}
      {showPactModal && (
        <PactConfirmation
          onConfirm={handlePactConfirm}
          onCancel={handlePactCancel}
        />
      )}
    </div>
  );
};

export default SyndicateExplorer;
