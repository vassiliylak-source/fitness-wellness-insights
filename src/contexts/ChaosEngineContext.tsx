import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface UserVault {
  depositAmount: number;
  atRiskCapital: number;
  weaknessTaxes: number;
  streakDays: number;
  cycleStartDate: string | null;
  cycleEndDate: string | null;
  lastCompletionDate: string | null;
  sweatPoints: number;
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
  isLoading: boolean;
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

const generateAnonId = () => `User_${Math.floor(Math.random() * 9000) + 100}`;

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

// Convert vault to database format
const vaultToDb = (vault: UserVault, userId: string) => ({
  user_id: userId,
  deposit_amount: vault.depositAmount,
  at_risk_capital: vault.atRiskCapital,
  weakness_taxes: vault.weaknessTaxes,
  streak_days: vault.streakDays,
  cycle_start_date: vault.cycleStartDate,
  cycle_end_date: vault.cycleEndDate,
  last_completion_date: vault.lastCompletionDate,
  sweat_points: vault.sweatPoints,
  tier: vault.tier,
  generations_today: vault.generationsToday,
  last_gen_date: vault.lastGenDate,
});

// Convert database record to vault format
const dbToVault = (record: any): UserVault => ({
  depositAmount: Number(record.deposit_amount) || 0,
  atRiskCapital: Number(record.at_risk_capital) || 0,
  weaknessTaxes: Number(record.weakness_taxes) || 0,
  streakDays: record.streak_days || 0,
  cycleStartDate: record.cycle_start_date,
  cycleEndDate: record.cycle_end_date,
  lastCompletionDate: record.last_completion_date,
  sweatPoints: record.sweat_points || 0,
  tier: record.tier || 'free',
  generationsToday: record.generations_today || 0,
  lastGenDate: record.last_gen_date,
});

export const ChaosEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [vault, setVault] = useState<UserVault>(defaultVault);
  const [isLoading, setIsLoading] = useState(true);
  const [liveFeed, setLiveFeed] = useState<LiveLossFeed[]>(() => {
    const stored = localStorage.getItem(FEED_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Load vault from database for authenticated users, localStorage for guests
  useEffect(() => {
    const loadVault = async () => {
      setIsLoading(true);
      
      if (user) {
        // Authenticated user: load from database
        const { data, error } = await supabase
          .from('user_vaults')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data) {
          setVault(dbToVault(data));
        } else {
          // No vault exists, use default
          setVault(defaultVault);
        }
      } else {
        // Guest: load from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        setVault(stored ? JSON.parse(stored) : defaultVault);
      }
      
      setIsLoading(false);
    };

    loadVault();
  }, [user]);

  // Save vault changes
  useEffect(() => {
    if (isLoading) return;

    const saveVault = async () => {
      if (user) {
        // Authenticated user: save to database
        const dbData = vaultToDb(vault, user.id);
        
        const { data: existing } = await supabase
          .from('user_vaults')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('user_vaults')
            .update(dbData)
            .eq('user_id', user.id);
        } else if (vault.depositAmount > 0) {
          // Only insert if there's actual data to save
          await supabase
            .from('user_vaults')
            .insert(dbData);
        }
      } else {
        // Guest: save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
      }
    };

    saveVault();
  }, [vault, user, isLoading]);

  // Simulate live feed updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
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

  const resetVault = useCallback(async () => {
    setVault(defaultVault);
    
    if (user) {
      await supabase
        .from('user_vaults')
        .delete()
        .eq('user_id', user.id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

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
      isLoading,
    }}>
      {children}
    </ChaosEngineContext.Provider>
  );
};
