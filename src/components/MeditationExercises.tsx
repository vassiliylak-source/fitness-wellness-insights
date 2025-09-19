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
    duration: 300, // 5 minutes
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
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  // Initialize audio context
  const initializeAudio = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = volume[0];
    }
  }, [volume]);

  // Generate different types of meditation sounds
  const generateSound = useCallback(async (soundType: string) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    // Stop existing sounds
    stopSound();

    if (soundType === 'none') return;

    const context = audioContextRef.current;
    const gainNode = gainNodeRef.current;

    switch (soundType) {
      case 'white-noise':
        const bufferSize = context.sampleRate * 2; // 2 seconds of audio
        const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoiseSource = context.createBufferSource();
        whiteNoiseSource.buffer = buffer;
        whiteNoiseSource.loop = true;
        whiteNoiseSource.connect(gainNode);
        whiteNoiseSource.start();
        sourceRef.current = whiteNoiseSource;
        break;

      case 'ocean':
        // Create ocean wave sounds using multiple oscillators
        const oceanOscillators = [];
        for (let i = 0; i < 3; i++) {
          const osc = context.createOscillator();
          const oscGain = context.createGain();
          
          osc.type = 'sine';
          osc.frequency.value = 40 + Math.random() * 60; // Low frequency for ocean sounds
          oscGain.gain.value = 0.1;
          
          // Add subtle frequency modulation for wave-like effect
          const lfo = context.createOscillator();
          const lfoGain = context.createGain();
          lfo.frequency.value = 0.1 + Math.random() * 0.3;
          lfoGain.gain.value = 10;
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          
          osc.connect(oscGain);
          oscGain.connect(gainNode);
          osc.start();
          lfo.start();
          
          oceanOscillators.push(osc, lfo);
        }
        oscillatorsRef.current = oceanOscillators;
        break;

      case 'rain':
        // Create rain sounds using filtered noise
        const rainBufferSize = context.sampleRate * 1;
        const rainBuffer = context.createBuffer(1, rainBufferSize, context.sampleRate);
        const rainOutput = rainBuffer.getChannelData(0);
        
        for (let i = 0; i < rainBufferSize; i++) {
          rainOutput[i] = (Math.random() * 2 - 1) * 0.3;
        }
        
        const rainSource = context.createBufferSource();
        const rainFilter = context.createBiquadFilter();
        rainFilter.type = 'highpass';
        rainFilter.frequency.value = 1000;
        
        rainSource.buffer = rainBuffer;
        rainSource.loop = true;
        rainSource.connect(rainFilter);
        rainFilter.connect(gainNode);
        rainSource.start();
        sourceRef.current = rainSource;
        break;

      case 'forest':
        // Create forest ambience with multiple tones
        const forestOscillators = [];
        const frequencies = [220, 330, 440, 550, 660]; // Bird-like frequencies
        
        frequencies.forEach((freq, index) => {
          setTimeout(() => {
            if (!context || !gainNode) return;
            
            const osc = context.createOscillator();
            const oscGain = context.createGain();
            const envelope = context.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq + Math.random() * 50;
            oscGain.gain.value = 0.05;
            envelope.gain.value = 0;
            
            // Create envelope for bird chirp effect
            envelope.gain.setValueAtTime(0, context.currentTime);
            envelope.gain.linearRampToValueAtTime(1, context.currentTime + 0.1);
            envelope.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);
            
            osc.connect(oscGain);
            oscGain.connect(envelope);
            envelope.connect(gainNode);
            osc.start();
            osc.stop(context.currentTime + 1);
            
            forestOscillators.push(osc);
          }, Math.random() * 5000 + index * 1000);
        });
        
        // Repeat forest sounds
        const forestInterval = setInterval(() => {
          if (isActive && selectedSound === 'forest') {
            generateSound('forest');
          } else {
            clearInterval(forestInterval);
          }
        }, 8000);
        
        oscillatorsRef.current = forestOscillators;
        break;

      case 'bowl':
        // Create singing bowl sounds
        const bowlOsc = context.createOscillator();
        const bowlGain = context.createGain();
        const bowlFilter = context.createBiquadFilter();
        
        bowlOsc.type = 'sine';
        bowlOsc.frequency.value = 200;
        bowlFilter.type = 'bandpass';
        bowlFilter.frequency.value = 400;
        bowlFilter.Q.value = 10;
        
        bowlGain.gain.setValueAtTime(0, context.currentTime);
        bowlGain.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.1);
        bowlGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 8);
        
        bowlOsc.connect(bowlFilter);
        bowlFilter.connect(bowlGain);
        bowlGain.connect(gainNode);
        bowlOsc.start();
        bowlOsc.stop(context.currentTime + 8);
        
        // Repeat singing bowl every 10 seconds
        const bowlInterval = setInterval(() => {
          if (isActive && selectedSound === 'bowl') {
            generateSound('bowl');
          } else {
            clearInterval(bowlInterval);
          }
        }, 10000);
        
        oscillatorsRef.current = [bowlOsc];
        break;
    }
  }, [isActive, selectedSound]);

  const stopSound = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    oscillatorsRef.current = [];
  }, []);

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
      await initializeAudio();
      await generateSound(selectedSound);
    } else {
      stopSound();
    }
    setIsActive(!isActive);
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

  const handleSoundChange = (soundId: string) => {
    setSelectedSound(soundId);
    if (isActive) {
      generateSound(soundId);
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

      <CardContent className="space-y-8">
        {/* Meditation Animation Circle */}
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            {/* Progress ring */}
            <svg className="w-80 h-80 -rotate-90" viewBox="0 0 120 120">
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
                w-64 h-64 rounded-full flex items-center justify-center
                transition-all duration-1000 ease-in-out`}
              style={{
                transform: `translate(-50%, -50%) scale(${getAnimationScale()})`,
                background: `linear-gradient(135deg, hsl(var(--${selectedTechnique.color}-400)), hsl(var(--${selectedTechnique.color}-600)))`,
                boxShadow: isActive 
                  ? `0 0 60px hsl(var(--${selectedTechnique.color}-500) / 0.6)` 
                  : `0 0 30px hsl(var(--${selectedTechnique.color}-500) / 0.3)`
              }}
            >
              <Icon className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </div>

          {/* Timer and Status */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold gradient-text">
              {formatTime(timeRemaining)}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {isActive ? '🧘‍♀️ Meditating' : '🕯️ Ready to Begin'}
              </Badge>
            </div>
          </div>

          {/* Sound Controls */}
          <div className="card-elegant space-y-6">
            <h3 className="text-lg font-semibold gradient-text text-center">
              Ambient Sounds
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Sound Type</label>
                <Select value={selectedSound} onValueChange={handleSoundChange}>
                  <SelectTrigger className="glass-card">
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
                    className="p-2"
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
                  <span className="text-xs text-muted-foreground w-8">
                    {Math.round(volume[0] * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={toggleMeditation}
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-2xl hover-lift"
              style={{
                background: isActive 
                  ? 'hsl(var(--destructive))' 
                  : `linear-gradient(135deg, hsl(var(--${selectedTechnique.color}-500)), hsl(var(--${selectedTechnique.color}-600)))`
              }}
            >
              {isActive ? <Pause className="w-6 h-6 mr-2" /> : <Play className="w-6 h-6 mr-2" />}
              {isActive ? 'Pause' : 'Start Meditation'}
            </Button>
            
            <Button
              onClick={resetMeditation}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-2xl hover-lift"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Technique Benefits */}
        <div className="card-elegant">
          <h3 className="text-xl font-semibold mb-4 gradient-text">
            Benefits of {selectedTechnique.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedTechnique.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"></span>
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meditation Instructions */}
        <div className="card-elegant">
          <h3 className="text-xl font-semibold mb-4 gradient-text">
            How to Practice
          </h3>
          <div className="space-y-3 text-muted-foreground">
            {selectedTechnique.id === 'mindfulness' && (
              <>
                <p>• Find a comfortable seated position and close your eyes</p>
                <p>• Focus on your natural breath without trying to change it</p>
                <p>• When thoughts arise, acknowledge them without judgment and return to your breath</p>
                <p>• Start with short sessions and gradually increase the duration</p>
              </>
            )}
            {selectedTechnique.id === 'loving-kindness' && (
              <>
                <p>• Begin by sending loving thoughts to yourself: "May I be happy, may I be healthy"</p>
                <p>• Extend these wishes to loved ones, neutral people, and even difficult people</p>
                <p>• Visualize each person and genuinely wish them well</p>
                <p>• End by sending loving-kindness to all beings everywhere</p>
              </>
            )}
            {selectedTechnique.id === 'body-scan' && (
              <>
                <p>• Lie down comfortably and close your eyes</p>
                <p>• Start from the top of your head and slowly move your attention down</p>
                <p>• Notice sensations in each body part without trying to change anything</p>
                <p>• Breathe into areas of tension and allow them to soften</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationExercises;