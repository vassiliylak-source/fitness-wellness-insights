import { Helmet } from 'react-helmet-async';
import LiveLossFeed from '@/components/ChaosEngine/LiveLossFeed';
import VaultDisplay from '@/components/ChaosEngine/VaultDisplay';
import StakingInterface from '@/components/ChaosEngine/StakingInterface';
import IntegrityChecks from '@/components/ChaosEngine/IntegrityChecks';
import LockedTimer from '@/components/ChaosEngine/LockedTimer';
import ProtocolSelector from '@/components/ChaosEngine/ProtocolSelector';
import WorkoutDisplay from '@/components/ChaosEngine/WorkoutDisplay';
import SPStore from '@/components/ChaosEngine/SPStore';
import SyndicateExplorer from '@/components/Syndicate/SyndicateExplorer';
import SyndicateTicker from '@/components/Syndicate/SyndicateTicker';
import { useChaosEngine } from '@/contexts/ChaosEngineContext';
import { useSyndicate } from '@/contexts/SyndicateContext';
import { useState, useCallback } from 'react';
import { Skull, Terminal, Settings, ChevronDown, ChevronUp, Users, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateStruggleWorkout, ProtocolType, calculateSPEarned } from '@/lib/struggleEngine';
import { GeneratedExercise } from '@/constants/wod';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { isStaked, canGenerate, recordGeneration, completeProtocol, vault } = useChaosEngine();
  const { mySyndicate } = useSyndicate();
  const [integrityPassed, setIntegrityPassed] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [workoutGenerated, setWorkoutGenerated] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolType>('GRAVITY');
  const [showStore, setShowStore] = useState(false);
  const [showSyndicates, setShowSyndicates] = useState(false);
  
  // Workout state
  const [exercises, setExercises] = useState<GeneratedExercise[]>([]);
  const [criticalOverload, setCriticalOverload] = useState<GeneratedExercise | null>(null);
  const [targetTime, setTargetTime] = useState(180);
  const [protocolName, setProtocolName] = useState('');

  const handleGenerate = useCallback(() => {
    const { canGen } = canGenerate();
    if (!canGen) {
      toast({
        title: 'ЛИМИТ ГЕНЕРАЦИИ',
        description: 'Дневной лимит исчерпан. Обнови до PRO для безлимита.',
        variant: 'destructive',
      });
      return;
    }
    
    recordGeneration();
    
    // Generate workout using struggle engine
    const workout = generateStruggleWorkout(selectedProtocol);
    setExercises(workout.exercises);
    setCriticalOverload(workout.criticalOverload);
    setTargetTime(workout.targetTime);
    setProtocolName(workout.protocol.name);
    
    setWorkoutGenerated(true);
    setIntegrityPassed(false);
    setShowTimer(false);
    
    toast({
      title: 'ПРОТОКОЛ СКОМПИЛИРОВАН',
      description: `${workout.protocol.name} — Цель: ${Math.floor(workout.targetTime / 60)}:${(workout.targetTime % 60).toString().padStart(2, '0')}`,
    });
  }, [canGenerate, recordGeneration, selectedProtocol]);

  const handleIntegrityComplete = useCallback(() => {
    setIntegrityPassed(true);
  }, []);

  const handleStartTimer = useCallback(() => {
    setShowTimer(true);
  }, []);

  const handleTimerComplete = useCallback((actualTime: number, beatTarget: boolean) => {
    const spEarned = calculateSPEarned(actualTime, targetTime, selectedProtocol);
    completeProtocol(spEarned);
    
    toast({
      title: beatTarget ? 'ПРОТОКОЛ ВЫПОЛНЕН' : 'ПРОТОКОЛ ПЕРЕЖИТ',
      description: `+${spEarned} SP заработано. ${beatTarget ? 'Цель побита.' : 'Продолжай давить.'}`,
    });
    
    setShowTimer(false);
    setWorkoutGenerated(false);
    setIntegrityPassed(false);
  }, [completeProtocol, targetTime, selectedProtocol]);

  const handleTimerAbort = useCallback(() => {
    setShowTimer(false);
    setWorkoutGenerated(false);
    setIntegrityPassed(false);
  }, []);

  const { remaining } = canGenerate();

  return (
    <>
      <Helmet>
        <title>CHAOS ENGINE | Твоя дисциплина теперь имеет рыночную стоимость</title>
        <meta name="description" content="Ты перестал прогрессировать, потому что цена твоего отказа равна нулю. Депозит сгорит при слабости. Синдикат из 10 гладиаторов. Чужие деньги станут твоими." />
      </Helmet>
      
      <div className="min-h-screen bg-background scanlines">
        {/* Live Loss Feed */}
        <LiveLossFeed />
        
        {/* Syndicate Ticker */}
        <SyndicateTicker />

        {/* Main Terminal */}
        <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <header className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                ЭРА СИНДИКАТОВ
              </span>
            </div>
            
            <h1 className="terminal-header text-primary terminal-glow terminal-cursor">
              CHAOS ENGINE
            </h1>
            
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              v5.0 — Твоя дисциплина теперь имеет рыночную стоимость
              <br />
              <span className="text-secondary">Твоя слабость обогащает сильных.</span>
            </p>
            
            <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto">
              Мы не обещаем, что будет легко. Мы гарантируем, что у тебя не будет выбора.
            </p>
          </header>

          {/* Vault Display (if staked) */}
          <VaultDisplay />

          {/* Staking Interface (if not staked) */}
          {!isStaked && (
            <div className="space-y-4">
              <StakingInterface />
              
              {/* Enter Arena CTA */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">или</p>
                <Button
                  onClick={() => setShowSyndicates(true)}
                  className="btn-terminal"
                >
                  <Swords className="w-4 h-4 mr-2" />
                  ВОЙТИ В АРЕНУ
                </Button>
              </div>
            </div>
          )}

          {/* Main Terminal Content - Protocol Selection & Generation */}
          {isStaked && !workoutGenerated && !showSyndicates && (
            <div className="space-y-4">
              {/* Protocol Selector */}
              <div className="card-terminal p-6">
                <ProtocolSelector
                  selected={selectedProtocol}
                  onSelect={setSelectedProtocol}
                />
              </div>

              {/* Generate Button */}
              <div className="card-terminal p-6">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
                    // ГЕНЕРАТОР ПРОТОКОЛОВ
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={remaining <= 0}
                    className="btn-terminal text-lg px-12 py-6"
                  >
                    <Skull className="w-5 h-5 mr-3" />
                    INITIATE PROTOCOL
                  </Button>
                  <div className="text-xs text-muted-foreground mt-4">
                    {remaining > 0 ? `${remaining} генераций осталось сегодня` : 'Дневной лимит исчерпан'}
                  </div>
                </div>
              </div>

              {/* Syndicate Section Toggle */}
              <button
                onClick={() => setShowSyndicates(!showSyndicates)}
                className="w-full flex items-center justify-between p-4 border border-secondary/30 hover:border-secondary/60 bg-secondary/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-secondary" />
                  <div className="text-left">
                    <span className="text-sm font-bold text-secondary uppercase">
                      ПРИСОЕДИНИТЬСЯ К ПАКТУ
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {mySyndicate ? `Активен в ${mySyndicate.name}` : '10 гладиаторов • Деньги слабых — твои'}
                    </p>
                  </div>
                </div>
                {showSyndicates ? (
                  <ChevronUp className="w-5 h-5 text-secondary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-secondary" />
                )}
              </button>

              {/* SP Store Toggle */}
              <button
                onClick={() => setShowStore(!showStore)}
                className="w-full flex items-center justify-between p-3 border border-border hover:border-energy/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    МАГАЗИН ВЫЖИВАНИЯ
                  </span>
                </div>
                {showStore ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              
              {showStore && <SPStore />}
            </div>
          )}

          {/* Syndicate Explorer Panel */}
          {showSyndicates && !workoutGenerated && (
            <div className="space-y-4">
              <button
                onClick={() => setShowSyndicates(false)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                ← Назад к генератору протоколов
              </button>
              <SyndicateExplorer />
            </div>
          )}

          {/* Workout Generated - Show Workout + Integrity Checks */}
          {workoutGenerated && !showTimer && (
            <div className="space-y-4 animate-fade-in">
              {/* Workout Display */}
              <div className="card-terminal p-6">
                <WorkoutDisplay
                  exercises={exercises}
                  criticalOverload={criticalOverload}
                  protocolName={protocolName}
                  targetTime={targetTime}
                />
              </div>

              {/* Integrity Checks */}
              <div className="card-terminal p-6">
                <IntegrityChecks 
                  onAllChecked={handleIntegrityComplete}
                  disabled={showTimer}
                />

                {integrityPassed && (
                  <Button
                    onClick={handleStartTimer}
                    className="btn-terminal w-full mt-6 animate-fade-in"
                  >
                    <Skull className="w-4 h-4 mr-2" />
                    ЗАПУСТИТЬ ТЕРМИНАЛ ИСПОЛНЕНИЯ
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Locked Timer */}
          {showTimer && (
            <div className="card-terminal p-6 animate-fade-in">
              <LockedTimer
                targetTime={targetTime}
                onComplete={handleTimerComplete}
                onAbort={handleTimerAbort}
              />
            </div>
          )}

          {/* Footer */}
          <footer className="text-center text-xs text-muted-foreground space-y-2 pt-8 border-t border-border">
            <p>Ты получаешь либо тело, о котором мечтал, либо деньги тех, кто оказался слабее.</p>
            <p className="text-primary/40">
              SP: {vault.sweatPoints} | Серия: {vault.streakDays} дней | Уровень: {vault.tier.toUpperCase()}
            </p>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Index;
