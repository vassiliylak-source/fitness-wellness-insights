import { useState, useEffect } from 'react';
import { Skull, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PactConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const PACT_TEXT = [
  '> ИНИЦИАЦИЯ ПАКТ-ПРОТОКОЛА...',
  '> ЗАГРУЗКА УСЛОВИЙ КОНТРАКТА...',
  '',
  '═══════════════════════════════════════',
  '           ПАКТ СИНДИКАТА            ',
  '═══════════════════════════════════════',
  '',
  'Я, нижеподписавшийся, настоящим признаю:',
  '',
  '  ▸ Мой депозит входит в общий пул',
  '  ▸ Невыполнение ежедневного протокола',
  '    ведёт к немедленной элиминации',
  '  ▸ Мои потери обогащают выживших',
  '  ▸ Выживание даёт мне долю',
  '    от накопленного налога на слабость',
  '',
  '═══════════════════════════════════════',
  '',
  '"Я признаю, что мой провал обогатит',
  ' моих соперников. Я принимаю условия',
  ' охоты."',
  '',
  '═══════════════════════════════════════',
  '',
  '> ОЖИДАНИЕ ПОДТВЕРЖДЕНИЯ...',
];

const PactConfirmation = ({ onConfirm, onCancel }: PactConfirmationProps) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (currentLine < PACT_TEXT.length) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, PACT_TEXT[currentLine]]);
        setCurrentLine(prev => prev + 1);
      }, 80);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentLine]);

  return (
    <div className="fixed inset-0 z-50 bg-background/98 flex items-center justify-center p-4 scanlines">
      <div className="w-full max-w-lg space-y-6">
        {/* Terminal Window */}
        <div className="card-terminal p-6 font-mono">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <div className="w-3 h-3 bg-destructive rounded-full" />
            <div className="w-3 h-3 bg-energy rounded-full" />
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="ml-2 text-xs text-muted-foreground">PACT_TERMINAL.exe</span>
          </div>

          {/* Terminal Content */}
          <div className="h-80 overflow-y-auto space-y-1">
            {displayedLines.map((line, idx) => (
              <div 
                key={idx} 
                className={`text-xs leading-relaxed ${
                  line.includes('═') 
                    ? 'text-secondary' 
                    : line.includes('▸')
                      ? 'text-primary'
                      : line.includes('"')
                        ? 'text-destructive font-bold'
                        : line.includes('>')
                          ? 'text-muted-foreground'
                          : 'text-foreground'
                }`}
              >
                {line || '\u00A0'}
              </div>
            ))}
            {!isComplete && (
              <span className="inline-block w-2 h-4 bg-primary animate-warning-pulse" />
            )}
          </div>
        </div>

        {/* Confirmation */}
        {isComplete && (
          <div className="space-y-4 animate-fade-in">
            {/* Agreement Checkbox */}
            <button
              onClick={() => setAgreed(!agreed)}
              className={`integrity-check w-full text-left ${agreed ? 'checked' : ''}`}
            >
              <div 
                className={`w-6 h-6 border flex items-center justify-center flex-shrink-0 transition-all ${
                  agreed ? 'border-primary bg-primary' : 'border-border'
                }`}
              >
                {agreed && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
              <span className="text-sm text-foreground">
                Я принимаю условия охоты. Моя слабость обогащает сильных.
              </span>
            </button>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1 border-border hover:border-destructive hover:text-destructive"
              >
                ОТСТУПИТЬ
              </Button>
              <Button
                onClick={onConfirm}
                disabled={!agreed}
                className="flex-1 btn-terminal"
              >
                <Skull className="w-4 h-4 mr-2" />
                ВОЙТИ В АРЕНУ
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PactConfirmation;
