import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface SyndicateMember {
  id: string;
  status: 'ACTIVE' | 'ELIMINATED';
  depositAmount: number;
  eliminatedAt?: string;
}

export interface Syndicate {
  id: string;
  name: string;
  totalPool: number;
  members: SyndicateMember[];
  startDate: string;
  endDate: string;
  penaltyPerFailure: number;
  status: 'RECRUITING' | 'ACTIVE' | 'CLOSED';
}

export interface SyndicateResult {
  syndicateId: string;
  syndicateName: string;
  survivors: number;
  failed: number;
  payoutPerSurvivor: number;
  totalPool: number;
}

interface SyndicateContextType {
  syndicates: Syndicate[];
  mySyndicate: Syndicate | null;
  recentResults: SyndicateResult[];
  joinSyndicate: (syndicateId: string) => void;
  leaveSyndicate: () => void;
  calculateEstimatedBounty: (syndicate: Syndicate) => number;
  calculateAttritionRate: (syndicate: Syndicate) => number;
}

const SYNDICATE_STORAGE_KEY = 'chaos_syndicates';
const MY_SYNDICATE_KEY = 'chaos_my_syndicate';

// Generate simulated syndicates
const generateSimulatedSyndicates = (): Syndicate[] => {
  const syndicates: Syndicate[] = [];
  
  for (let i = 0; i < 5; i++) {
    const memberCount = Math.floor(Math.random() * 8) + 5; // 5-12 members
    const members: SyndicateMember[] = [];
    const eliminated = Math.floor(Math.random() * Math.floor(memberCount * 0.4));
    
    for (let j = 0; j < memberCount; j++) {
      members.push({
        id: `M${String(j + 1).padStart(3, '0')}`,
        status: j < eliminated ? 'ELIMINATED' : 'ACTIVE',
        depositAmount: [20, 50, 100][Math.floor(Math.random() * 3)],
        eliminatedAt: j < eliminated ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      });
    }
    
    const totalPool = members.reduce((sum, m) => sum + m.depositAmount, 0);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 15));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);
    
    syndicates.push({
      id: `SYN${String(89 + i).padStart(3, '0')}`,
      name: `SYNDICATE #${String(89 + i).padStart(3, '0')}`,
      totalPool,
      members,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      penaltyPerFailure: totalPool > 300 ? 10 : 5,
      status: 'ACTIVE',
    });
  }
  
  return syndicates;
};

// Generate simulated recent results for ticker
const generateSimulatedResults = (): SyndicateResult[] => {
  const results: SyndicateResult[] = [];
  
  for (let i = 0; i < 10; i++) {
    const total = Math.floor(Math.random() * 8) + 5;
    const survivors = Math.floor(Math.random() * (total - 1)) + 1;
    const failed = total - survivors;
    const poolPerPerson = [20, 50, 100][Math.floor(Math.random() * 3)];
    const totalPool = total * poolPerPerson;
    
    results.push({
      syndicateId: `SYN${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      syndicateName: `Syndicate #${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      survivors,
      failed,
      payoutPerSurvivor: Math.floor(totalPool / survivors),
      totalPool,
    });
  }
  
  return results;
};

const SyndicateContext = createContext<SyndicateContextType | null>(null);

export const useSyndicate = () => {
  const context = useContext(SyndicateContext);
  if (!context) {
    throw new Error('useSyndicate must be used within SyndicateProvider');
  }
  return context;
};

export const SyndicateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syndicates, setSyndicates] = useState<Syndicate[]>(() => {
    const stored = localStorage.getItem(SYNDICATE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : generateSimulatedSyndicates();
  });

  const [mySyndicate, setMySyndicate] = useState<Syndicate | null>(() => {
    const stored = localStorage.getItem(MY_SYNDICATE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [recentResults] = useState<SyndicateResult[]>(generateSimulatedResults);

  // Persist changes
  useEffect(() => {
    localStorage.setItem(SYNDICATE_STORAGE_KEY, JSON.stringify(syndicates));
  }, [syndicates]);

  useEffect(() => {
    if (mySyndicate) {
      localStorage.setItem(MY_SYNDICATE_KEY, JSON.stringify(mySyndicate));
    } else {
      localStorage.removeItem(MY_SYNDICATE_KEY);
    }
  }, [mySyndicate]);

  // Simulate member eliminations periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSyndicates(prev => prev.map(syn => {
        if (syn.status !== 'ACTIVE') return syn;
        
        // 10% chance a random active member gets eliminated
        if (Math.random() < 0.1) {
          const activeMembers = syn.members.filter(m => m.status === 'ACTIVE');
          if (activeMembers.length > 1) {
            const targetIdx = Math.floor(Math.random() * activeMembers.length);
            const targetId = activeMembers[targetIdx].id;
            
            return {
              ...syn,
              members: syn.members.map(m => 
                m.id === targetId 
                  ? { ...m, status: 'ELIMINATED' as const, eliminatedAt: new Date().toISOString() }
                  : m
              ),
            };
          }
        }
        return syn;
      }));
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const joinSyndicate = useCallback((syndicateId: string) => {
    const syndicate = syndicates.find(s => s.id === syndicateId);
    if (!syndicate) return;

    // Add user as a member
    const userMember: SyndicateMember = {
      id: 'YOU',
      status: 'ACTIVE',
      depositAmount: 50, // Default deposit
    };

    const updatedSyndicate: Syndicate = {
      ...syndicate,
      members: [...syndicate.members, userMember],
      totalPool: syndicate.totalPool + userMember.depositAmount,
    };

    setSyndicates(prev => prev.map(s => s.id === syndicateId ? updatedSyndicate : s));
    setMySyndicate(updatedSyndicate);
  }, [syndicates]);

  const leaveSyndicate = useCallback(() => {
    setMySyndicate(null);
  }, []);

  const calculateEstimatedBounty = useCallback((syndicate: Syndicate): number => {
    const activeCount = syndicate.members.filter(m => m.status === 'ACTIVE').length;
    if (activeCount === 0) return 0;
    
    // Estimate based on current attrition trend
    const eliminatedCount = syndicate.members.filter(m => m.status === 'ELIMINATED').length;
    const attritionRate = eliminatedCount / syndicate.members.length;
    
    // Project final survivors (at least 1)
    const projectedSurvivors = Math.max(1, Math.floor(activeCount * (1 - attritionRate * 0.5)));
    
    return Math.floor(syndicate.totalPool / projectedSurvivors);
  }, []);

  const calculateAttritionRate = useCallback((syndicate: Syndicate): number => {
    const eliminated = syndicate.members.filter(m => m.status === 'ELIMINATED').length;
    return (eliminated / syndicate.members.length) * 100;
  }, []);

  return (
    <SyndicateContext.Provider value={{
      syndicates,
      mySyndicate,
      recentResults,
      joinSyndicate,
      leaveSyndicate,
      calculateEstimatedBounty,
      calculateAttritionRate,
    }}>
      {children}
    </SyndicateContext.Provider>
  );
};
