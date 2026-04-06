import { motion } from 'motion/react';
import { ArrowRight, Ruler, Weight, User, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import { UserProfile } from '../../types';

export default function OnboardingProfile({ profile, onUpdate, onNext }: { 
  profile: UserProfile, 
  onUpdate: (updates: Partial<UserProfile>) => void,
  onNext: () => void 
}) {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-container/10 via-background to-background"
    >
      {/* Progress Indicator */}
      <div className="w-full max-w-md mb-8 flex items-center justify-between gap-4">
        <div className="h-1 flex-1 rounded-full bg-primary-container" />
        <div className="h-1 flex-1 rounded-full bg-primary-container" />
        <div className="h-1 flex-1 rounded-full bg-primary-container" />
        <div className="h-1 flex-1 rounded-full bg-surface-container-high" />
      </div>

      {/* Header Section */}
      <div className="w-full max-w-md mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter uppercase mb-3">Body Profile</h1>
        <p className="text-on-surface-variant font-medium opacity-80">Precision is the foundation of peak performance.</p>
      </div>

      {/* Main Form Card */}
      <div className="w-full max-w-md bg-[#1a1a2e] rounded-3xl p-8 shadow-2xl border border-outline-variant/10">
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
          {/* Gender Toggle */}
          <div className="space-y-3">
            <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Gender Identity</span>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-surface-container-lowest rounded-xl">
              <button 
                type="button"
                onClick={() => onUpdate({ gender: 'male' })}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-lg transition-all",
                  profile.gender === 'male' ? "bg-surface-container-high text-on-surface font-bold border border-primary-container/20" : "text-on-surface-variant font-bold hover:bg-surface-container-high/50"
                )}
              >
                <User className="w-5 h-5" />
                <span className="font-label text-sm uppercase">Male</span>
              </button>
              <button 
                type="button"
                onClick={() => onUpdate({ gender: 'female' })}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-lg transition-all",
                  profile.gender === 'female' ? "bg-surface-container-high text-on-surface font-bold border border-primary-container/20" : "text-on-surface-variant font-bold hover:bg-surface-container-high/50"
                )}
              >
                <Users className="w-5 h-5" />
                <span className="font-label text-sm uppercase">Female</span>
              </button>
            </div>
          </div>

          {/* Age Scroll Picker Concept */}
          <div className="space-y-3">
            <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Age</span>
            <div className="relative flex items-center justify-center h-20 overflow-hidden bg-surface-container-lowest rounded-xl">
              <div className="absolute inset-x-0 h-px bg-primary-container/20 top-1/4" />
              <div className="absolute inset-x-0 h-px bg-primary-container/20 bottom-1/4" />
              <div className="flex gap-8 items-center no-scrollbar overflow-x-auto px-40 w-full snap-x snap-mandatory">
                {[24, 25, 26, 27, 28].map((age) => (
                  <button 
                    key={age}
                    type="button"
                    onClick={() => onUpdate({ age })}
                    className={cn(
                      "font-headline snap-center transition-all",
                      profile.age === age ? "text-primary-container text-4xl font-bold scale-110" : "text-on-surface-variant/30 text-xl"
                    )}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Height and Weight Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Height (cm)</label>
              <div className="relative group">
                <input 
                  type="number"
                  value={profile.height || ''}
                  onChange={(e) => onUpdate({ height: Number(e.target.value) })}
                  className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-4 text-on-surface font-headline text-xl focus:ring-1 focus:ring-primary-container transition-all placeholder:text-surface-container-highest" 
                  placeholder="185" 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Ruler className="text-primary-container/40 w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Weight (kg)</label>
              <div className="relative group">
                <input 
                  type="number"
                  value={profile.weight || ''}
                  onChange={(e) => onUpdate({ weight: Number(e.target.value) })}
                  className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-4 text-on-surface font-headline text-xl focus:ring-1 focus:ring-primary-container transition-all placeholder:text-surface-container-highest" 
                  placeholder="82" 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Weight className="text-primary-container/40 w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Fitness Level Pill Selector */}
          <div className="space-y-3">
            <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Fitness Experience</span>
            <div className="grid grid-cols-2 gap-2">
              {['beginner', 'intermediate', 'advanced', 'athlete'].map((level) => (
                <button 
                  key={level}
                  type="button"
                  onClick={() => onUpdate({ fitnessLevel: level as any })}
                  className={cn(
                    "py-2.5 px-4 rounded-full border transition-all uppercase tracking-tight font-label text-xs",
                    profile.fitnessLevel === level 
                      ? "border-primary-container bg-primary-container/10 text-primary-container font-bold" 
                      : "border-outline-variant/30 text-on-surface-variant hover:border-primary-container/50 hover:text-on-surface"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit"
            className="w-full py-5 rounded-xl bg-primary-container text-on-primary-container font-headline font-bold text-lg uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,107,53,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Secondary Navigation/Help */}
      <p className="mt-8 font-label text-xs text-on-surface-variant/40 uppercase tracking-[0.2em]">Step 3 of 5 • Data encrypted by Apex</p>
    </motion.main>
  );
}
