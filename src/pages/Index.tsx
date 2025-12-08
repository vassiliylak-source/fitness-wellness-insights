import WODGenerator from '@/components/WOD/WODGenerator';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Fire particles background effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Main content */}
      <main className="relative z-10">
        <WODGenerator />
      </main>
    </div>
  );
};

export default Index;
