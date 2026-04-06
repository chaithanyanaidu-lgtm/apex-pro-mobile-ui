import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export default function OnboardingCalibration({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyzing your goals...",
    "Building your split...",
    "Your plan is ready."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % steps.length);
    }, 3000);

    const timer = setTimeout(() => {
      onComplete();
    }, 9000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete, steps.length]);

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-surface-container-lowest text-on-surface font-body overflow-hidden h-screen w-screen flex flex-col items-center justify-center relative"
    >
      {/* Cinematic Background Light Leak */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-container/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-secondary-container/10 blur-[120px]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-xl px-8 text-center">
        {/* The Central Orb */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-16">
          {/* Glow layers */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-primary-container rounded-full blur-[40px]" 
          />
          <motion.div 
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: -2 }}
            className="absolute inset-4 bg-secondary rounded-full blur-[60px]" 
          />
          
          {/* Core */}
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-primary-container to-secondary shadow-[0_0_80px_rgba(255,107,53,0.4)] flex items-center justify-center">
            <Zap className="text-surface w-12 h-12 fill-current" />
          </div>

          {/* Orbiting Particles */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-outline-variant/20 rounded-full"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#ffb59d]" />
          </motion.div>
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 border border-outline-variant/10 rounded-full"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_10px_#d2bbff]" />
          </motion.div>
        </div>

        {/* Typography: Status Updates */}
        <div className="h-16 relative w-full flex items-center justify-center overflow-hidden">
          {steps.map((text, i) => (
            <motion.h2 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={step === i ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className={cn(
                "absolute font-headline text-2xl md:text-3xl font-bold tracking-tighter uppercase",
                i === 2 ? "text-primary-container" : "text-on-surface"
              )}
            >
              {text}
            </motion.h2>
          ))}
        </div>
        <p className="mt-4 text-on-surface-variant font-medium tracking-wide max-w-xs mx-auto">
          Our AI is calibrating your training intensity based on your performance profile.
        </p>
      </div>

      {/* Footer Metadata */}
      <div className="absolute bottom-12 left-0 w-full px-8 flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">Encryption</span>
          <span className="font-label text-xs font-bold text-on-surface/60">SECURE_LINK_ACTIVE</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">Step</span>
          <span className="font-label text-xs font-bold text-on-surface/60">05 / 05</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-surface-container-highest/20 overflow-hidden">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 9, ease: "linear" }}
          className="h-full bg-primary-container shadow-[0_0_15px_rgba(255,107,53,0.8)]" 
        />
      </div>
    </motion.main>
  );
}
