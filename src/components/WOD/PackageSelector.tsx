import { PACKAGES, WorkoutPackage } from '@/constants/wod';

interface PackageSelectorProps {
  selectedPackage: string;
  onSelect: (packageId: string) => void;
}

const PackageSelector = ({ selectedPackage, onSelect }: PackageSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {PACKAGES.map((pkg) => (
        <PackageCard
          key={pkg.id}
          package={pkg}
          isSelected={selectedPackage === pkg.id}
          onSelect={() => onSelect(pkg.id)}
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
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-300
        text-left group
        ${isSelected 
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
          : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
        }
      `}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
      )}
      
      <div className="flex items-start gap-3">
        <span className="text-2xl">{pkg.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold uppercase text-sm tracking-wide truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
            {pkg.name}
          </h3>
          <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-mono block mt-0.5">
            {pkg.codename}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
            {pkg.description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default PackageSelector;