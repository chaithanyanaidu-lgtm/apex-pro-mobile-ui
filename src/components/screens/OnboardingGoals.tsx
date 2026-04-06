import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const GOALS = [
  {
    id: 'build-muscle',
    title: 'Build Muscle',
    description: 'Hypertrophy and strength focused cycles.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'lose-fat',
    title: 'Lose Fat',
    description: 'High intensity metabolic conditioning.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'endurance',
    title: 'Improve Endurance',
    description: 'Lactate threshold and VO2 max training.',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'stay-active',
    title: 'Stay Active',
    description: 'General wellness and mobility work.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800'
  }
];

export default function OnboardingGoals({ selectedGoals, onToggle, onNext }: { 
  selectedGoals: string[], 
  onToggle: (id: string) => void,
  onNext: () => void 
}) {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-32 px-6 flex flex-col items-center max-w-5xl mx-auto"
    >
      {/* Header Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl shadow-[0_0_20px_rgba(255,107,53,0.05)]">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
          <span className="text-xl font-black text-primary-container tracking-tighter italic uppercase font-headline">APEX PRO</span>
          <div className="flex items-center gap-4">
            <div className="h-1 w-24 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full w-2/4 bg-primary-container" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest font-label text-slate-400">Step 2 of 4</span>
          </div>
        </div>
      </header>

      {/* Heading Section */}
      <div className="w-full mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase font-headline mb-4">What's your goal?</h1>
        <p className="text-slate-400 text-lg max-w-lg">Select all that apply to tailor your training and nutrition protocol.</p>
      </div>

      {/* Goal Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {GOALS.map((goal) => {
          const isActive = selectedGoals.includes(goal.id);
          return (
            <motion.div 
              key={goal.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggle(goal.id)}
              className={cn(
                "group relative h-80 rounded-2xl overflow-hidden cursor-pointer bg-surface-container-low transition-all duration-500",
                isActive && "ring-2 ring-primary-container shadow-[0_0_25px_rgba(255,107,53,0.2)]"
              )}
            >
              <img 
                src={goal.image} 
                alt={goal.title} 
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                  isActive ? "opacity-80" : "opacity-40 group-hover:opacity-60"
                )}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight font-headline text-white mb-2">{goal.title}</h3>
                    <p className="text-sm text-slate-300 font-medium">{goal.description}</p>
                  </div>
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                    isActive ? "bg-primary-container border-primary-container shadow-[0_0_15px_rgba(255,107,53,0.4)]" : "border-slate-500/50 bg-transparent"
                  )}>
                    {isActive && <Check className="text-on-primary-container w-5 h-5" />}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="hidden md:flex items-center gap-3">
            <p className="text-xs text-slate-500 font-label uppercase tracking-widest">You can update these goals at any time in settings.</p>
          </div>
          <button 
            onClick={onNext}
            disabled={selectedGoals.length === 0}
            className="w-full md:w-auto px-12 py-4 bg-primary-container text-on-primary-container font-headline font-bold text-lg uppercase tracking-tighter rounded-xl transition-all duration-200 active:scale-95 shadow-[0_8px_32px_rgba(255,107,53,0.2)] hover:bg-[#ff8559] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </footer>
    </motion.main>
  );
}
