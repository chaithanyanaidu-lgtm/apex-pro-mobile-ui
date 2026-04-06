import { motion } from 'motion/react';
import { CheckCircle, Dumbbell, Home, Zap, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { UserProfile } from '../../types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DURATIONS = [30, 45, 60, 90];

export default function OnboardingSchedule({ profile, onUpdate, onNext }: { 
  profile: UserProfile, 
  onUpdate: (updates: Partial<UserProfile>) => void,
  onNext: () => void 
}) {
  const toggleDay = (day: string) => {
    const current = profile.trainingDays;
    const next = current.includes(day) 
      ? current.filter(d => d !== day) 
      : [...current, day];
    onUpdate({ trainingDays: next });
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-32 px-6 max-w-2xl mx-auto"
    >
      {/* Top Navigation Anchor */}
      <nav className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl flex justify-between items-center px-4 h-16 w-full shadow-[0_0_20px_rgba(255,107,53,0.05)]">
        <div className="text-xl font-black text-primary-container tracking-tighter italic">APEX PRO</div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-label font-bold tracking-widest text-slate-400 uppercase">Step 04 / 05</div>
          <button className="h-8 w-8 rounded-full bg-surface-container-highest flex items-center justify-center">
            <X className="w-4 h-4 text-on-surface-variant" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter uppercase mb-4 text-on-surface leading-none">
          When can <br /><span className="text-primary-container">you train?</span>
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
          Customize your performance schedule. We'll optimize the volume based on your availability.
        </p>
      </header>

      {/* 7-Day Availability Grid */}
      <section className="mb-12">
        <label className="text-[10px] font-label font-bold uppercase tracking-widest text-primary-container mb-4 block">Select Training Days</label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {DAYS.map((day) => {
            const isActive = profile.trainingDays.includes(day);
            return (
              <button 
                key={day}
                onClick={() => toggleDay(day)}
                className={cn(
                  "aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2",
                  isActive 
                    ? "bg-primary-container text-on-primary-container border-primary-container shadow-[0_0_24px_rgba(255,107,53,0.2)]" 
                    : "bg-surface-container-high border-transparent hover:border-primary-container/30 text-slate-500"
                )}
              >
                <span className={cn("text-[10px] font-label font-black uppercase", isActive ? "text-on-primary-container" : "text-slate-500")}>
                  {day}
                </span>
                {isActive && <CheckCircle className="mt-1 w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Session Length */}
      <section className="mb-12">
        <label className="text-[10px] font-label font-bold uppercase tracking-widest text-primary-container mb-4 block">Daily Duration Preference</label>
        <div className="flex flex-wrap gap-3">
          {DURATIONS.map((duration) => {
            const isActive = profile.sessionDuration === duration;
            return (
              <button 
                key={duration}
                onClick={() => onUpdate({ sessionDuration: duration })}
                className={cn(
                  "px-6 py-4 rounded-xl flex-1 min-w-[80px] transition-all",
                  isActive 
                    ? "bg-primary-container text-on-primary-container ring-4 ring-primary-container/10" 
                    : "bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container-high text-on-surface"
                )}
              >
                <span className="block text-xl font-headline font-bold">{duration}</span>
                <span className="text-[10px] font-label uppercase tracking-tighter opacity-80">Minutes</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Equipment Cards */}
      <section className="mb-16">
        <label className="text-[10px] font-label font-bold uppercase tracking-widest text-primary-container mb-4 block">Available Equipment</label>
        <div className="space-y-4">
          {[
            { id: 'full', title: 'Full Gym', sub: 'Barbells, machines, and racks', icon: Dumbbell },
            { id: 'home', title: 'Home Gym', sub: 'Dumbbells, bench, and bands', icon: Home },
            { id: 'minimal', title: 'Minimal Equipment', sub: 'Bodyweight and resistance bands only', icon: Zap }
          ].map((item) => {
            const isActive = profile.equipment === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => onUpdate({ equipment: item.id as any })}
                className={cn(
                  "w-full group relative overflow-hidden rounded-2xl p-6 flex items-center justify-between transition-all border-2",
                  isActive 
                    ? "bg-primary-container/5 border-primary-container" 
                    : "bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-high"
                )}
              >
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-all",
                    isActive ? "bg-primary-container text-on-primary-container" : "bg-surface-container-highest text-primary-container"
                  )}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-headline font-bold uppercase tracking-tight text-on-surface">{item.title}</h3>
                    <p className="text-sm text-on-surface-variant">{item.sub}</p>
                  </div>
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                  isActive ? "bg-primary-container" : "border-2 border-outline-variant group-hover:border-primary-container"
                )}>
                  {isActive && <CheckCircle className="w-4 h-4 text-on-primary" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Fixed Bottom Action Area */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background/90 to-transparent">
        <button 
          onClick={onNext}
          disabled={profile.trainingDays.length === 0 || !profile.equipment}
          className="w-full bg-primary-container text-on-primary-container font-headline font-black text-lg py-5 rounded-2xl uppercase tracking-widest shadow-[0_12px_48px_rgba(255,107,53,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50"
        >
          Build My Plan
        </button>
      </div>
    </motion.main>
  );
}
