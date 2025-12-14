import { Helmet } from 'react-helmet-async';
import WODGenerator from '@/components/WOD/WODGenerator';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>CHAOS PROTOCOL | Free AI Workout Generator - CrossFit WOD Randomizer</title>
        <meta name="description" content="Free procedurally generated CrossFit-style workouts. Get random WODs with bodyweight, kettlebell, and HIIT exercises. Track your progress and beat the algorithm." />
        <link rel="canonical" href="https://d0681d5b-3f72-491b-8913-db1bce36ee21.lovableproject.com/" />
      </Helmet>
      
      <div className="min-h-screen bg-background relative">
        {/* Fire particles background effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Main content */}
        <main className="relative z-10" role="main">
          <WODGenerator />
        </main>
      </div>
    </>
  );
};

export default Index;
