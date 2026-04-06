import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-container-lowest overflow-hidden"
    >
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(at_0%_0%,rgba(255,107,53,0.08)_0px,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(at_100%_100%,rgba(210,187,255,0.05)_0px,transparent_50%)]" />
      </div>

      {/* Logo Content Area */}
      <div className="flex flex-col items-center justify-center space-y-6 z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-primary-container blur-2xl opacity-20" />
          <div className="relative z-10 flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface">
              <path d="M12 3L2 21h20L12 3z" />
            </svg>
            <div className="absolute -top-4 -right-4 w-2 h-2 rounded-full bg-secondary shadow-[0_0_12px_rgba(210,187,255,0.8)]" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-headline font-bold tracking-[0.15em] text-white italic">
            APEX PRO
          </h1>
          <div className="mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </motion.div>
      </div>

      {/* Footer / Progress */}
      <div className="absolute bottom-0 w-full flex flex-col items-center pb-12 px-8 space-y-10">
        <div className="w-full max-w-md h-1 bg-surface-container-highest rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
            onAnimationComplete={onComplete}
            className="absolute top-0 left-0 h-full bg-primary-container shadow-[0_0_15px_rgba(255,107,53,0.5)]"
          />
        </div>

        <div className="flex flex-col items-center space-y-2">
          <p className="font-headline text-[10px] md:text-xs tracking-[0.4em] text-on-surface-variant font-bold">
            TRAIN SMARTER. RISE HIGHER.
          </p>
          <div className="flex items-center space-x-3 opacity-40">
            <span className="w-1 h-1 rounded-full bg-primary-container animate-pulse" />
            <span className="text-[8px] font-label uppercase tracking-widest">System Synchronizing</span>
          </div>
        </div>
      </div>

      {/* Background Decorative Imagery */}
      <div className="fixed inset-0 z-[-1] opacity-30 mix-blend-luminosity grayscale">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1920" 
          alt="Athletic background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    </motion.div>
  );
}
