import { motion } from 'motion/react';

export default function OnboardingWelcome({ onNext }: { onNext: () => void }) {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen w-full overflow-hidden flex flex-col justify-end items-center"
    >
      {/* Full-bleed background with 55% Scrim */}
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1920" 
          alt="Athlete lifting weights"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/55 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-xl px-8 pb-16 md:pb-24 flex flex-col items-center text-center">
        {/* Branding Header */}
        <div className="absolute top-[-70vh] md:top-[-60vh] left-1/2 -translate-x-1/2 opacity-20">
          <h1 className="font-headline text-[15vw] font-black italic tracking-tighter uppercase leading-none select-none">
            APEX PRO
          </h1>
        </div>

        {/* Main Headline */}
        <div className="mb-12">
          <h2 className="font-headline text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] text-glow">
            Your AI Coach.<br />
            <span className="text-primary-container">Always On.</span>
          </h2>
          <p className="mt-6 text-on-surface-variant font-medium text-lg max-w-sm mx-auto leading-relaxed">
            Personalized programming, real-time feedback, and elite performance analytics at your fingertips.
          </p>
        </div>

        {/* Primary Action */}
        <div className="w-full space-y-6">
          <button 
            onClick={onNext}
            className="w-full bg-primary-container text-on-primary-container py-5 px-8 rounded-xl font-headline font-bold text-xl uppercase tracking-widest shadow-[0_0_32px_rgba(255,107,53,0.3)] active:scale-95 transition-all duration-200"
          >
            Get Started
          </button>
          <div className="flex items-center justify-center gap-2">
            <span className="text-on-surface-variant font-label text-sm uppercase tracking-widest">Already have an account?</span>
            <button className="text-primary-container font-headline font-bold text-sm uppercase tracking-widest hover:underline transition-all">
              Log In
            </button>
          </div>
        </div>

        {/* Progress Indicator (Soft) */}
        <div className="mt-12 flex gap-3">
          <div className="h-1 w-12 bg-primary-container rounded-full" />
          <div className="h-1 w-8 bg-surface-container-highest rounded-full" />
          <div className="h-1 w-8 bg-surface-container-highest rounded-full" />
        </div>
      </div>

      {/* Visual Accents: Atmospheric Light */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary-container/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-secondary/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
    </motion.main>
  );
}
