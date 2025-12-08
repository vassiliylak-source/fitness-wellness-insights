import { PACKAGES, WorkoutPackage } from '@/constants/wod';
import { Lock } from 'lucide-react';

interface PackageSelectorProps {
  selectedPackage: string;
  onSelect: (packageId: string) => void;
}

const PackageSelector = ({ selectedPackage, onSelect }: PackageSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {PACKAGES.map((pkg) => (
        <PackageCard
          key={pkg.id}
          package={pkg}
          isSelected={selectedPackage === pkg.id}
          onSelect={() => !pkg.isPremium && onSelect(pkg.id)}
        />
      ))}
    </div>
  );
};

interface PackageCardProps {
  package: WorkoutPackage;
  isSelected: boolean;
  onSelect: () => void;
}

const PackageCard = ({ package: pkg, isSelected, onSelect }: PackageCardProps) => {
  return (
    <button
      onClick={onSelect}
      disabled={pkg.isPremium}
      className={`
        relative p-4 md:p-6 rounded-lg text-left transition-all duration-300
        ${pkg.isPremium ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        ${isSelected ? 'ring-2 ring-primary fire-glow' : 'border border-border hover:border-primary/50'}
      `}
      style={{
        background: isSelected ? 'var(--gradient-card)' : 'hsl(var(--card))'
      }}
    >
      {/* Premium lock */}
      {pkg.isPremium && (
        <div className="absolute top-3 right-3">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
      
      {/* Icon */}
      <div className="text-3xl md:text-4xl mb-3">
        {pkg.icon}
      </div>
      
      {/* Name */}
      <h3 className={`
        font-black uppercase tracking-tight text-sm md:text-base
        ${isSelected ? 'fire-text' : 'text-foreground'}
      `}>
        {pkg.name}
      </h3>
      
      {/* Description */}
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
        {pkg.description}
      </p>
      
      {/* Premium badge */}
      {pkg.isPremium && (
        <div className="mt-3">
          <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-accent/20 text-accent rounded">
            Premium
          </span>
        </div>
      )}
    </button>
  );
};

export default PackageSelector;
