import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Note: STRUGGLE_WEIGHTS is now consolidated in @/lib/struggleEngine.ts

export interface UserVault {
  depositAmount: number;      // Total staked
  atRiskCapital: number;      // Current remaining
  weaknessTaxes: number;      // Total deducted
  streakDays: number;         // Current streak
  cycleStartDate: string | null;
  cycleEndDate: string | null;
  lastCompletionDate: string | null;
  sweatPoints: number;        // SP currency
  tier: 'free' | 'pro';
  generationsToday: number;
  lastGenDate: string | null;
}

export interface LiveLossFeed {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  timestamp: Date;
}

interface ChaosEngineContextType {
  vault: UserVault;
  liveFeed: LiveLossFeed[];
  stakeDeposit: (amount: number) => void;
  applyWeaknessTax: (amount: number, reason: string) => void;
  completeProtocol: (spEarned: number) => void;
  canGenerate: () => { canGen: boolean; remaining: number };
  recordGeneration: () => void;
  purchaseWithSP: (cost: number) => boolean;
  resetVault: () => void;
  isStaked: boolean;
  isInCycle: boolean;
  daysRemaining: number;
}

const STORAGE_KEY = 'chaos_engine_vault';
const FEED_STORAGE_KEY = 'chaos_engine_feed';

const defaultVault: UserVault = {
  depositAmount: 0,
  atRiskCapital: 0,
  weaknessTaxes: 0,
  streakDays: 0,
  cycleStartDate: null,
  cycleEndDate: null,
  lastCompletionDate: null,
  sweatPoints: 0,
  tier: 'free',
  generationsToday: 0,
  lastGenDate: null,
};

const ChaosEngineContext = createContext<ChaosEngineContextType | null>(null);

export const useChaosEngine = () => {
  const context = useContext(ChaosEngineContext);
  if (!context) {
    throw new Error('useChaosEngine must be used within ChaosEngineProvider');
  }
  return context;
};

// Generate anonymous user IDs for the feed
const generateAnonId = () => `User_${Math.floor(Math.random() * 9000) + 100}`;

// Simulated global feed data
const generateFakeFeedItem = (): LiveLossFeed => {
  const reasons = [
    'Protocol Abort',
    'Missed Daily Check-in',
    'Timer Abandonment',
    'Integrity Failure',
  ];
  return {
    id: Math.random().toString(36).substr(2, 9),
    userId: generateAnonId(),
    amount: [2, 5, 10][Math.floor(Math.random() * 3)],
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    timestamp: new Date(),
  };
};

export const ChaosEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vault, setVault] = useState<UserVault>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultVault;
  });

  const [liveFeed, setLiveFeed] = useState<LiveLossFeed[]>(() => {
    const stored = localStorage.getItem(FEED_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Persist vault changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
  }, [vault]);

  // Simulate live feed updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const newItem = generateFakeFeedItem();
        setLiveFeed(prev => {
          const updated = [newItem, ...prev].slice(0, 20);
          localStorage.setItem(FEED_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const stakeDeposit = useCallback((amount: number) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    setVault(prev => ({
      ...prev,
      depositAmount: amount,
      atRiskCapital: amount,
      cycleStartDate: startDate.toISOString(),
      cycleEndDate: endDate.toISOString(),
      streakDays: 0,
      weaknessTaxes: 0,
    }));
  }, []);

  const applyWeaknessTax = useCallback((amount: number, reason: string) => {
    setVault(prev => {
      const newAtRisk = Math.max(0, prev.atRiskCapital - amount);
      return {
        ...prev,
        atRiskCapital: newAtRisk,
        weaknessTaxes: prev.weaknessTaxes + amount,
      };
    });

    // Add to feed
    const feedItem: LiveLossFeed = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'You',
      amount,
      reason,
      timestamp: new Date(),
    };
    setLiveFeed(prev => [feedItem, ...prev].slice(0, 20));
  }, []);

  const completeProtocol = useCallback((spEarned: number) => {
    const today = new Date().toDateString();
    
    setVault(prev => {
      const lastCompletion = prev.lastCompletionDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = prev.streakDays;
      if (lastCompletion === yesterday.toDateString()) {
        newStreak += 1;
      } else if (lastCompletion !== today) {
        newStreak = 1;
      }

      return {
        ...prev,
        streakDays: newStreak,
        lastCompletionDate: today,
        sweatPoints: prev.sweatPoints + spEarned,
      };
    });
  }, []);

  const canGenerate = useCallback((): { canGen: boolean; remaining: number } => {
    const today = new Date().toDateString();
    const maxGens = vault.tier === 'pro' ? 999 : 3;
    
    if (vault.lastGenDate !== today) {
      return { canGen: true, remaining: maxGens };
    }
    
    const remaining = Math.max(0, maxGens - vault.generationsToday);
    return { canGen: remaining > 0, remaining };
  }, [vault.tier, vault.lastGenDate, vault.generationsToday]);

  const recordGeneration = useCallback(() => {
    const today = new Date().toDateString();
    
    setVault(prev => {
      if (prev.lastGenDate !== today) {
        return {
          ...prev,
          generationsToday: 1,
          lastGenDate: today,
        };
      }
      return {
        ...prev,
        generationsToday: prev.generationsToday + 1,
      };
    });
  }, []);

  const purchaseWithSP = useCallback((cost: number): boolean => {
    if (vault.sweatPoints < cost) return false;
    
    setVault(prev => ({
      ...prev,
      sweatPoints: prev.sweatPoints - cost,
    }));
    return true;
  }, [vault.sweatPoints]);

  const resetVault = useCallback(() => {
    setVault(defaultVault);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isStaked = vault.depositAmount > 0 && vault.cycleStartDate !== null;
  
  const isInCycle = isStaked && vault.cycleEndDate 
    ? new Date() < new Date(vault.cycleEndDate) 
    : false;

  const daysRemaining = vault.cycleEndDate 
    ? Math.max(0, Math.ceil((new Date(vault.cycleEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <ChaosEngineContext.Provider value={{
      vault,
      liveFeed,
      stakeDeposit,
      applyWeaknessTax,
      completeProtocol,
      canGenerate,
      recordGeneration,
      purchaseWithSP,
      resetVault,
      isStaked,
      isInCycle,
      daysRemaining,
    }}>
      {children}
    </ChaosEngineContext.Provider>
  );
};
