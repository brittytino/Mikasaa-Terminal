import Terminal from '@/components/Terminal';
import InteractiveBackground from '@/components/Background3D';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-red-950">
      {/* Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent_50%)] pointer-events-none" />

      {/* Text Section */}
      <div className="z-10 text-center mb-12 floating">
        <h1 className="text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rose-700 to-rose-300 drop-shadow-[0_0_15px_rgba(225,29,72,0.3)]">
          MikasaAI
        </h1>
        <p className="text-xl text-rose-200 opacity-80 font-semibold tracking-wider">
          Your AI-powered ally in the battle against complexity
        </p>
      </div>

      {/* Terminal Component */}
      <div className="z-20 relative">
        <Terminal />
      </div>

      {/* Interactive Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <InteractiveBackground />
      </div>
    </div>
  );
};

export default Index;
