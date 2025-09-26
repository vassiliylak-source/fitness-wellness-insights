import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Heart, Brain, Waves, Volume2, VolumeX } from "lucide-react";

interface MeditationTechnique {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  benefits: string[];
  color: string;
  icon: any;
  soundType: string;
}

interface SoundOption {
  id: string;
  name: string;
  description: string;
}

const SOUND_OPTIONS: SoundOption[] = [
  { id: 'none', name: 'None', description: 'Silent meditation' },
  { id: 'rain', name: 'Rain', description: 'Gentle rainfall sounds' },
  { id: 'ocean', name: 'Ocean Waves', description: 'Peaceful ocean waves' },
  { id: 'forest', name: 'Forest', description: 'Birds and rustling leaves' },
  { id: 'bowl', name: 'Singing Bowl', description: 'Tibetan singing bowl tones' },
  { id: 'white-noise', name: 'White Noise', description: 'Calming white noise' },
];

const MEDITATION_TECHNIQUES: MeditationTechnique[] = [
  {
    id: 'mindfulness',
    name: 'Mindfulness Meditation',
    description: 'Focus on the present moment and observe your thoughts without judgment.',
    duration: 900, // 15 minutes
    benefits: ['Reduces stress', 'Improves focus', 'Enhances self-awareness'],
    color: 'emerald',
    icon: Brain,
    soundType: 'forest'
  },
  {
    id: 'loving-kindness',
    name: 'Loving-Kindness Meditation',
    description: 'Cultivate compassion and love towards yourself and others.',
    duration: 480, // 8 minutes
    benefits: ['Increases empathy', 'Reduces negative emotions', 'Builds emotional resilience'],
    color: 'rose',
    icon: Heart,
    soundType: 'bowl'
  },
  {
    id: 'body-scan',
    name: 'Body Scan Meditation',
    description: 'Systematically focus on different parts of your body to release tension.',
    duration: 600, // 10 minutes
    benefits: ['Releases physical tension', 'Improves body awareness', 'Promotes relaxation'],
    color: 'blue',
    icon: Waves,
    soundType: 'ocean'
  }
];

const MeditationExercises = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<MeditationTechnique>(MEDITATION_TECHNIQUES[0]);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(selectedTechnique.duration);
  const [progress, setProgress] = useState(0);
  const [selectedSound, setSelectedSound] = useState<string>(selectedTechnique.soundType);
  const [volume, setVolume] = useState([0.3]);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<(OscillatorNode | AudioBufferSourceNode)[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  // Initialize audio context with Safari compatibility
  const initializeAudio = useCallback(async () => {
    try {
      // Always create a new audio context for Safari compatibility
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        // Use webkit prefix for Safari compatibility
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        
        // Create gain node
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.value = isMuted ? 0 : volume[0];
      }
      
      // Resume audio context if suspended (critical for Safari)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        // Wait a bit for Safari to fully resume
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Verify audio context is running
      if (audioContextRef.current.state !== 'running') {
        throw new Error('Audio context failed to start');
      }
      
      return true;
    } catch (error) {
      console.error('Error initializing audio:', error);
      return false;
    }
  }, [volume, isMuted]);

  // Generate different types of meditation sounds with Safari compatibility
  const generateSound = useCallback(async (soundType: string) => {
    if (!audioContextRef.current || !gainNodeRef.current) {
      console.error('Audio context not initialized');
      return false;
    }
    
    // Ensure audio context is running (critical for Safari)
    if (audioContextRef.current.state !== 'running') {
      try {
        await audioContextRef.current.resume();
        // Give Safari time to properly resume
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Failed to resume audio context:', error);
        return false;
      }
    }

    // Stop existing sounds
    stopSound();

    if (soundType === 'none') return true;

    const context = audioContextRef.current;
    const gainNode = gainNodeRef.current;

    switch (soundType) {
      case 'white-noise':
        // Enhanced white noise with subtle filtering
        const bufferSize = context.sampleRate * 2;
        const buffer = context.createBuffer(2, bufferSize, context.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
          const output = buffer.getChannelData(channel);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.3;
          }
        }
        
        const whiteNoiseSource = context.createBufferSource();
        const filter = context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 8000;
        filter.Q.value = 1;
        
        whiteNoiseSource.buffer = buffer;
        whiteNoiseSource.loop = true;
        whiteNoiseSource.connect(filter);
        filter.connect(gainNode);
        whiteNoiseSource.start();
        sourceRef.current = whiteNoiseSource;
        return true;

      case 'ocean':
        // Realistic ocean waves with multiple layers
        const oceanOscillators = [];
        
        // Base wave sound - low frequency noise
        const waveBufferSize = context.sampleRate * 4;
        const waveBuffer = context.createBuffer(2, waveBufferSize, context.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
          const output = waveBuffer.getChannelData(channel);
          for (let i = 0; i < waveBufferSize; i++) {
            // Create wave-like pattern with noise
            const wave = Math.sin(i * 0.001) * 0.5 + (Math.random() * 2 - 1) * 0.3;
            output[i] = wave * 0.4;
          }
        }
        
        const waveSource = context.createBufferSource();
        const waveFilter = context.createBiquadFilter();
        waveFilter.type = 'lowpass';
        waveFilter.frequency.value = 200;
        
        waveSource.buffer = waveBuffer;
        waveSource.loop = true;
        waveSource.connect(waveFilter);
        waveFilter.connect(gainNode);
        waveSource.start();
        
        // Add subtle wave crashes
        const crashInterval = setInterval(() => {
          if (isActive && selectedSound === 'ocean') {
            const crashOsc = context.createOscillator();
            const crashGain = context.createGain();
            const crashFilter = context.createBiquadFilter();
            
            crashOsc.type = 'sawtooth';
            crashOsc.frequency.value = 60 + Math.random() * 40;
            crashFilter.type = 'highpass';
            crashFilter.frequency.value = 100;
            
            crashGain.gain.setValueAtTime(0, context.currentTime);
            crashGain.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.1);
            crashGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 2);
            
            crashOsc.connect(crashFilter);
            crashFilter.connect(crashGain);
            crashGain.connect(gainNode);
            crashOsc.start();
            crashOsc.stop(context.currentTime + 2);
          } else {
            clearInterval(crashInterval);
          }
        }, 8000 + Math.random() * 4000);
        
        intervalsRef.current.push(crashInterval);
        oscillatorsRef.current = [waveSource];
        return true;

      case 'rain':
        // Multi-layered realistic rain
        const rainLayers = [];
        
        // Heavy droplets
        for (let layer = 0; layer < 3; layer++) {
          const rainBufferSize = context.sampleRate * 0.5;
          const rainBuffer = context.createBuffer(2, rainBufferSize, context.sampleRate);
          
          for (let channel = 0; channel < 2; channel++) {
            const output = rainBuffer.getChannelData(channel);
            for (let i = 0; i < rainBufferSize; i++) {
              // Create rain-like crackling sound
              const intensity = Math.random() < 0.1 ? 1 : 0.1;
              output[i] = (Math.random() * 2 - 1) * 0.2 * intensity;
            }
          }
          
          const rainSource = context.createBufferSource();
          const rainFilter = context.createBiquadFilter();
          const rainGain = context.createGain();
          
          rainFilter.type = layer === 0 ? 'bandpass' : 'highpass';
          rainFilter.frequency.value = 1000 + layer * 2000;
          rainFilter.Q.value = 0.5;
          rainGain.gain.value = 0.3 / (layer + 1);
          
          rainSource.buffer = rainBuffer;
          rainSource.loop = true;
          rainSource.connect(rainFilter);
          rainFilter.connect(rainGain);
          rainGain.connect(gainNode);
          rainSource.start();
          
          rainLayers.push(rainSource);
        }
        
        oscillatorsRef.current = rainLayers;
        return true;

      case 'forest':
        // Rich forest ambience with birds, wind, and rustling
        const forestSounds = [];
        
        // Wind through trees (base ambience)
        const windBufferSize = context.sampleRate * 6;
        const windBuffer = context.createBuffer(2, windBufferSize, context.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
          const output = windBuffer.getChannelData(channel);
          for (let i = 0; i < windBufferSize; i++) {
            const wind = Math.sin(i * 0.0001) * (Math.random() * 2 - 1) * 0.1;
            output[i] = wind;
          }
        }
        
        const windSource = context.createBufferSource();
        const windFilter = context.createBiquadFilter();
        windFilter.type = 'lowpass';
        windFilter.frequency.value = 300;
        
        windSource.buffer = windBuffer;
        windSource.loop = true;
        windSource.connect(windFilter);
        windFilter.connect(gainNode);
        windSource.start();
        forestSounds.push(windSource);
        
        // Bird songs with more variety
        const birdFrequencies = [
          [220, 440, 330], [880, 1100, 990], [550, 770, 660], 
          [1320, 1100, 1210], [330, 220, 275]
        ];
        
        const createBirdSong = () => {
          if (!isActive || selectedSound !== 'forest') return;
          
          const songPattern = birdFrequencies[Math.floor(Math.random() * birdFrequencies.length)];
          
          songPattern.forEach((freq, noteIndex) => {
            setTimeout(() => {
              if (!context || !gainNode) return;
              
              const osc = context.createOscillator();
              const oscGain = context.createGain();
              const envelope = context.createGain();
              const filter = context.createBiquadFilter();
              
              osc.type = 'sine';
              osc.frequency.value = freq + Math.random() * 50 - 25;
              filter.type = 'bandpass';
              filter.frequency.value = freq;
              filter.Q.value = 10;
              
              oscGain.gain.value = 0.05 + Math.random() * 0.03;
              envelope.gain.value = 0;
              
              envelope.gain.setValueAtTime(0, context.currentTime);
              envelope.gain.linearRampToValueAtTime(1, context.currentTime + 0.05);
              envelope.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3 + Math.random() * 0.4);
              
              osc.connect(filter);
              filter.connect(oscGain);
              oscGain.connect(envelope);
              envelope.connect(gainNode);
              osc.start();
              osc.stop(context.currentTime + 0.8);
            }, noteIndex * 150 + Math.random() * 100);
          });
          
          // Schedule next bird song
          setTimeout(createBirdSong, 3000 + Math.random() * 8000);
        };
        
        // Start bird sounds after a delay
        setTimeout(createBirdSong, 1000);
        
        oscillatorsRef.current = forestSounds;
        return true;

      case 'bowl':
        // Realistic singing bowl with harmonics
        const fundamentalFreq = 200;
        const harmonics = [1, 2.1, 3.1, 4.2, 5.3]; // Realistic harmonic ratios
        
        harmonics.forEach((harmonic, index) => {
          const osc = context.createOscillator();
          const oscGain = context.createGain();
          const envelope = context.createGain();
          const filter = context.createBiquadFilter();
          
          osc.type = 'sine';
          osc.frequency.value = fundamentalFreq * harmonic;
          filter.type = 'peaking';
          filter.frequency.value = fundamentalFreq * harmonic;
          filter.Q.value = 5;
          filter.gain.value = 3;
          
          const amplitude = 1 / (index + 1); // Decreasing amplitude for higher harmonics
          oscGain.gain.value = amplitude * 0.15;
          envelope.gain.value = 0;
          
          envelope.gain.setValueAtTime(0, context.currentTime);
          envelope.gain.linearRampToValueAtTime(1, context.currentTime + 0.1);
          envelope.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 12);
          
          osc.connect(filter);
          filter.connect(oscGain);
          oscGain.connect(envelope);
          envelope.connect(gainNode);
          osc.start();
          osc.stop(context.currentTime + 12);
        });
        
        // Repeat singing bowl
        const bowlInterval = setInterval(() => {
          if (isActive && selectedSound === 'bowl') {
            generateSound('bowl');
          } else {
            clearInterval(bowlInterval);
          }
        }, 15000);
        
        intervalsRef.current.push(bowlInterval);
        return true;
        
      default:
        return false;
    }
    
    return true;
  }, [isActive, selectedSound]);

  const stopSound = useCallback(() => {
    // Clear all intervals
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
    
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      } catch (e) {
        // Source might already be stopped
      }
      sourceRef.current = null;
    }
    
    oscillatorsRef.current.forEach(node => {
      try {
        if ('stop' in node) {
          node.stop();
        }
        node.disconnect();
      } catch (e) {
        // Node might already be stopped
      }
    });
    oscillatorsRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSound();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stopSound]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume[0];
    }
  }, [volume, isMuted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          setProgress(((selectedTechnique.duration - newTime) / selectedTechnique.duration) * 100);
          
          if (newTime <= 0) {
            setIsActive(false);
            stopSound(); // Stop sound when meditation ends
            return selectedTechnique.duration;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, selectedTechnique.duration, stopSound]);

  const toggleMeditation = async () => {
    if (!isActive) {
      try {
        // Initialize audio with user gesture (required for Safari)
        const initialized = await initializeAudio();
        if (!initialized) {
          console.error('Failed to initialize audio');
          return;
        }
        
        // Generate sound after successful initialization
        const soundStarted = await generateSound(selectedSound);
        if (!soundStarted && selectedSound !== 'none') {
          console.warn('Sound failed to start, continuing with silent meditation');
        }
        
        setIsActive(true);
      } catch (error) {
        console.error('Error starting meditation audio:', error);
        // Still allow meditation to start even if audio fails
        setIsActive(true);
      }
    } else {
      stopSound();
      setIsActive(false);
    }
  };

  const resetMeditation = () => {
    setIsActive(false);
    setTimeRemaining(selectedTechnique.duration);
    setProgress(0);
    stopSound();
  };

  const changeTechnique = (techniqueId: string) => {
    const technique = MEDITATION_TECHNIQUES.find(t => t.id === techniqueId);
    if (technique) {
      setSelectedTechnique(technique);
      setTimeRemaining(technique.duration);
      setProgress(0);
      setIsActive(false);
      setSelectedSound(technique.soundType);
      stopSound();
    }
  };

  const handleSoundChange = async (soundId: string) => {
    setSelectedSound(soundId);
    if (isActive) {
      try {
        // Ensure audio context is ready
        const initialized = await initializeAudio();
        if (initialized) {
          await generateSound(soundId);
        }
      } catch (error) {
        console.error('Error changing sound:', error);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnimationScale = () => {
    if (!isActive) return 1;
    // Gentle breathing-like animation
    const breathingCycle = (Date.now() / 1000) % 8; // 8-second cycle
    if (breathingCycle < 4) {
      return 1 + (breathingCycle / 4) * 0.2; // Expand over 4 seconds
    } else {
      return 1.2 - ((breathingCycle - 4) / 4) * 0.2; // Contract over 4 seconds
    }
  };

  const Icon = selectedTechnique.icon;

  return (
    <Card className="card-modern">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl md:text-3xl font-bold gradient-text">
            Meditation Exercises
          </CardTitle>
          
          <Select value={selectedTechnique.id} onValueChange={changeTechnique}>
            <SelectTrigger className="w-48 glass-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card">
              {MEDITATION_TECHNIQUES.map((technique) => (
                <SelectItem key={technique.id} value={technique.id}>
                  {technique.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {selectedTechnique.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Meditation Animation Circle */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            {/* Progress ring */}
            <svg className="w-48 h-48 md:w-80 md:h-80 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="4"
                className="opacity-20"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={`hsl(var(--${selectedTechnique.color}-500))`}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={339.292}
                strokeDashoffset={339.292 - (339.292 * progress) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            {/* Central meditation circle */}
            <div 
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                w-32 h-32 md:w-64 md:h-64 rounded-full flex items-center justify-center
                transition-all duration-1000 ease-in-out`}
              style={{
                transform: `translate(-50%, -50%) scale(${getAnimationScale()})`,
                background: `linear-gradient(135deg, hsl(var(--${selectedTechnique.color}-400)), hsl(var(--${selectedTechnique.color}-600)))`,
                boxShadow: isActive 
                  ? `0 0 60px hsl(var(--${selectedTechnique.color}-500) / 0.6)` 
                  : `0 0 30px hsl(var(--${selectedTechnique.color}-500) / 0.3)`
              }}
            >
              <Icon className="w-8 h-8 md:w-16 md:h-16 text-white drop-shadow-lg" />
            </div>
          </div>

          {/* Timer and Status */}
          <div className="text-center space-y-3">
            <div className="text-4xl md:text-6xl font-bold gradient-text">
              {formatTime(timeRemaining)}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-sm md:text-lg px-3 py-1 md:px-4 md:py-2">
                {isActive ? '🧘‍♀️ Meditating' : '🕯️ Ready to Begin'}
              </Badge>
            </div>
          </div>

          {/* Sound Controls */}
          <div className="card-elegant space-y-4">
            <h3 className="text-lg font-semibold gradient-text text-center">
              Ambient Sounds
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Sound Type</label>
                <Select value={selectedSound} onValueChange={handleSoundChange}>
                  <SelectTrigger className="glass-card w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    {SOUND_OPTIONS.map((sound) => (
                      <SelectItem key={sound.id} value={sound.id}>
                        <div className="flex flex-col">
                          <span>{sound.name}</span>
                          <span className="text-xs text-muted-foreground">{sound.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Volume</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="p-2 shrink-0"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={1}
                    min={0}
                    step={0.1}
                    className="flex-1"
                    disabled={isMuted}
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {Math.round(volume[0] * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              onClick={toggleMeditation}
              size="lg"
              className={`flex-1 px-6 py-4 text-base md:text-lg font-semibold rounded-2xl hover-lift min-h-[56px] text-white border border-white/20 ${
                isActive 
                  ? 'bg-destructive hover:bg-destructive/90' 
                  : 'bg-gradient-to-r from-primary to-primary-deep hover:from-primary/90 hover:to-primary-deep/90'
              }`}
            >
              {isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              <span className="hidden sm:inline">{isActive ? 'Pause Meditation' : 'Start Meditation'}</span>
              <span className="sm:hidden">{isActive ? 'Pause' : 'Start'}</span>
            </Button>
            
            <Button
              onClick={resetMeditation}
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-initial px-6 py-4 text-base md:text-lg font-semibold rounded-2xl hover-lift min-h-[56px]"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Technique Benefits & Instructions */}
        <div className="space-y-4">
          <div className="card-elegant">
            <h3 className="text-lg md:text-xl font-semibold mb-4 gradient-text">
              Benefits of {selectedTechnique.name}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {selectedTechnique.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0"></span>
                  <span className="text-sm md:text-base text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-elegant">
            <h3 className="text-lg md:text-xl font-semibold mb-4 gradient-text">
              How to Practice
            </h3>
            <div className="space-y-3">
              {selectedTechnique.id === 'mindfulness' && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0"></span>
                    <span className="text-sm md:text-base text-muted-foreground">Find a comfortable seated position and close your eyes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0"></span>
                    <span className="text-sm md:text-base text-muted-foreground">Focus on your natural breath without trying to change it</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0"></span>
                    <span className="text-sm md:text-base text-muted-foreground">When thoughts arise, acknowledge them without judgment and return to your breath</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0"></span>
                    <span className="text-sm md:text-base text-muted-foreground">Start with short sessions and gradually increase the duration</span>
                  </div>
                </>
              )}
              {selectedTechnique.id === 'loving-kindness' && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0"></span>
                    <span className="text-sm md:text-base text-muted-foreground">Begin by sending loving thoughts to yourself: "May I be happy, may I be healthy"</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0"></span>
                    <span className="text-sm md:text-base text-muted-foreground">Extend these wishes to loved ones, neutral people, and even difficult people</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0"></span>
                    <span className="text-sm md:text-base text-muted-foreground">Visualize each person and genuinely wish them well</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0"></span>
                    <span className="text-sm md:text-base text-muted-foreground">End by sending loving-kindness to all beings everywhere</span>
                  </div>
                </>
              )}
              {selectedTechnique.id === 'body-scan' && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0"></span>
                    <span className="text-sm md:text-base text-muted-foreground">Lie down comfortably and close your eyes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0"></span>
                    <span className="text-sm md:text-base text-muted-foreground">Start from the top of your head and slowly move your attention down</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0"></span>
                    <span className="text-sm md:text-base text-muted-foreground">Notice sensations in each body part without trying to change anything</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shrink-0"></span>
                    <span className="text-sm md:text-base text-muted-foreground">Breathe into areas of tension and allow them to soften</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationExercises;