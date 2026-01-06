import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import LiveLossFeed from '@/components/ChaosEngine/LiveLossFeed';
import VaultDisplay from '@/components/ChaosEngine/VaultDisplay';
import StakingInterface from '@/components/ChaosEngine/StakingInterface';
import SPStore from '@/components/ChaosEngine/SPStore';
import TerminalHeader from '@/components/ChaosEngine/TerminalHeader';
import TerminalFooter from '@/components/ChaosEngine/TerminalFooter';
import ProtocolGeneratorSection from '@/components/ChaosEngine/ProtocolGeneratorSection';
import SectionToggles from '@/components/ChaosEngine/SectionToggles';
import WorkoutExecutionSection from '@/components/ChaosEngine/WorkoutExecutionSection';
import SyndicateExplorer from '@/components/Syndicate/SyndicateExplorer';
import SyndicateTicker from '@/components/Syndicate/SyndicateTicker';
import AuthNavBar from '@/components/ChaosEngine/AuthNavBar';
import LandingPage from '@/components/Landing/LandingPage';
import { useChaosEngine } from '@/contexts/ChaosEngineContext';
import { useWorkoutState } from '@/hooks/useWorkoutState';
import { useAuth } from '@/contexts/AuthContext';
import { useState as useLocalState } from 'react';
import { Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { isStaked, canGenerate } = useChaosEngine();
  const [showStore, setShowStore] = useState(false);
  const [showSyndicates, setShowSyndicates] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  const {
    exercises,
    criticalOverload,
    targetTime,
    protocolName,
    workoutGenerated,
    integrityPassed,
    showTimer,
    selectedProtocol,
    setSelectedProtocol,
    handleGenerate,
    handleIntegrityComplete,
    handleStartTimer,
    handleTimerComplete,
    handleTimerAbort,
  } = useWorkoutState();

  const { remaining } = canGenerate();

  // Listen for enter-arena event from landing page
  useEffect(() => {
    const handleEnterArena = () => {
      setShowTerminal(true);
    };
    window.addEventListener('enter-arena', handleEnterArena);
    return () => window.removeEventListener('enter-arena', handleEnterArena);
  }, []);

  // If user is staked, show terminal directly
  useEffect(() => {
    if (isStaked) {
      setShowTerminal(true);
    }
  }, [isStaked]);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono animate-pulse">INITIALIZING...</div>
      </div>
    );
  }

  // Show landing page if not authenticated or not entered terminal
  if (!user || !showTerminal) {
    return <LandingPage />;
  }

  return (
    <>
      <Helmet>
        <title>CHAOS ENGINE v5.0 | The Syndicate Era</title>
        <meta name="description" content="Discipline contract system. Stake capital, join syndicates, execute protocols. Your failure enriches your peers. Evolution is not optional." />
      </Helmet>
      
      <div className="min-h-screen bg-background scanlines">
        {/* Live Loss Feed */}
        <LiveLossFeed />
        
        {/* Syndicate Ticker */}
        <SyndicateTicker />

        {/* Main Terminal */}
        <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          {/* Auth Navigation */}
          <AuthNavBar />

          {/* Header */}
          <TerminalHeader />

          {/* Vault Display (if staked) */}
          <VaultDisplay />

          {/* Staking Interface (if not staked) */}
          {!isStaked && (
            <div className="space-y-4">
              <StakingInterface />
              
              {/* Enter Arena CTA */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">or</p>
                <Button
                  onClick={() => setShowSyndicates(true)}
                  className="btn-terminal"
                >
                  <Swords className="w-4 h-4 mr-2" />
                  ENTER THE ARENA
                </Button>
              </div>
            </div>
          )}

          {/* Main Terminal Content - Protocol Selection & Generation */}
          {isStaked && !workoutGenerated && !showSyndicates && (
            <div className="space-y-4">
              <ProtocolGeneratorSection
                selectedProtocol={selectedProtocol}
                onProtocolSelect={setSelectedProtocol}
                onGenerate={handleGenerate}
                remaining={remaining}
              />

              <SectionToggles
                showSyndicates={showSyndicates}
                showStore={showStore}
                onToggleSyndicates={() => setShowSyndicates(!showSyndicates)}
                onToggleStore={() => setShowStore(!showStore)}
              />
              
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
                ← Back to Protocol Generator
              </button>
              <SyndicateExplorer />
            </div>
          )}

          {/* Workout Generated - Show Workout + Integrity Checks + Timer */}
          {workoutGenerated && (
            <WorkoutExecutionSection
              exercises={exercises}
              criticalOverload={criticalOverload}
              protocolName={protocolName}
              targetTime={targetTime}
              integrityPassed={integrityPassed}
              showTimer={showTimer}
              onIntegrityComplete={handleIntegrityComplete}
              onStartTimer={handleStartTimer}
              onTimerComplete={handleTimerComplete}
              onTimerAbort={handleTimerAbort}
            />
          )}

          {/* Footer */}
          <TerminalFooter />
        </main>
      </div>
    </>
  );
};

export default Index;
