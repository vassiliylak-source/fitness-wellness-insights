import { Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProtocolSelector from './ProtocolSelector';
import { ProtocolType } from '@/lib/struggleEngine';

interface ProtocolGeneratorSectionProps {
  selectedProtocol: ProtocolType;
  onProtocolSelect: (protocol: ProtocolType) => void;
  onGenerate: () => void;
  remaining: number;
}

const ProtocolGeneratorSection = ({
  selectedProtocol,
  onProtocolSelect,
  onGenerate,
  remaining,
}: ProtocolGeneratorSectionProps) => {
  return (
    <>
      {/* Protocol Selector */}
      <div className="card-terminal p-6">
        <ProtocolSelector
          selected={selectedProtocol}
          onSelect={onProtocolSelect}
        />
      </div>

      {/* Generate Button */}
      <div className="card-terminal p-6">
        <div className="text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
            // PROTOCOL GENERATOR
          </div>
          <Button
            onClick={onGenerate}
            disabled={remaining <= 0}
            className="btn-terminal text-lg px-12 py-6"
          >
            <Skull className="w-5 h-5 mr-3" />
            ENTER THE ARENA
          </Button>
          <div className="text-xs text-muted-foreground mt-4">
            {remaining > 0 ? `${remaining} generations remaining today` : 'Daily limit reached'}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProtocolGeneratorSection;
