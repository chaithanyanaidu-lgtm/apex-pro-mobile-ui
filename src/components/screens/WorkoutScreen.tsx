import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Timer, Zap, Bell, X, ChevronDown, ArrowLeft, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

const CATEGORIES = ['STRENGTH', 'HIIT', 'YOGA', 'RECOVERY', 'ENDURANCE'];
const GOALS = ['muscle_gain', 'fat_loss', 'maintenance', 'endurance'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];

const EXERCISE_IMAGES: Record<string, string> = {
  'bench press': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  'squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80',
  'deadlift': 'https://images.unsplash.com/photo-1517963628607-235ccdd5476c?w=400&q=80',
  'pull up': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&q=80',
  'default': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
};

function getExerciseImage(name: string) {
  const lower = name.toLowerCase();
  for (const key of Object.keys(EXERCISE_IMAGES)) {
    if (lower.includes(key)) return EXERCISE_IMAGES[key];
  }
  return EXERCISE_IMAGES['default'];
}

export default function WorkoutScreen() {
  const [showAI, setShowAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [error, setError] = useState('');
  const [goal, setGoal] = useState('muscle_gain');
  const [weight, setWeight] = useState('75');
  const [level, setLevel] = useState('intermediate');
  const [selectedDay, setSelectedDay] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setPlan(null);
    try {
      const data: any = await api.generateWorkout({
        fitness_goal: goal,
        weight_kg: parseFloat(weight),
        experience_level: level,
      });
      setPlan(data.plan);
      setSelectedDay(0);
      setCompletedExercises(new Set());
      setShowAI(false);
    } catch (err: any) {
      setError(err.message || 'Failed to generate workout');
    } finally {
      setLoading(false);
    }
  };

  const toggleExercise = (key: string) => {
    setCompletedExercises(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  if (plan) {
    const currentDay = plan.days?.[selectedDay];
    const totalExercises = currentDay?.exercises?.length || 0;
    const completedCount = currentDay?.exercises?.filter((_: any, i: number) =>
      completedExercises.has(`${selectedDay}-${i}`)
    ).length || 0;

    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-20 pb-32 px-4 max-w-[390px] mx-auto space-y-6"
      >
        {/* Header */}
        <header className="fixed top-0 left-0 w-full z-50 bg-[#12121d]/80 backdrop-blur-xl flex justify-between items-center px-4 h-16">
          <button onClick={() => setPlan(null)} className="flex items-center gap-2 text-slate-400 hover:text-primary-container transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Programs</span>
          </button>
          <button onClick={() => setShowAI(true)} className="flex items-center gap-2 bg-primary-container/20 text-primary-container px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" /> Regenerate
          </button>
        </header>

        {/* Plan Title */}
        <section className="space-y-2 pt-2">
          <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-black tracking-widest uppercase rounded-full">
            {goal.replace('_', ' ').toUpperCase()}
          </span>
          <h1 className="text-2xl font-black font-headline uppercase tracking-tighter text-on-surface leading-tight">
            {plan.plan_name}
          </h1>
          <p className="text-slate-400 text-sm">{plan.duration_weeks} Week Program • {level.toUpperCase()}</p>
        </section>

        {/* Progress Bar */}
        <section className="bg-surface-container-high rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Today's Progress</span>
            <span className="text-xs font-black text-primary-container">{completedCount}/{totalExercises}</span>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-container rounded-full"
              initial={{ width: 0 }}
              animate={{ width: totalExercises > 0 ? `${(completedCount / totalExercises) * 100}%` : '0%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </section>

        {/* Day Tabs */}
        <section>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {plan.days?.map((day: any, i: number) => (
              <button
                key={i}
                onClick={() => { setSelectedDay(i); setCompletedExercises(new Set()); }}
                className={cn(
                  "flex-none flex flex-col items-center px-4 py-3 rounded-2xl transition-all min-w-[64px]",
                  selectedDay === i
                    ? "bg-primary-container text-on-primary-container shadow-[0_4px_20px_rgba(255,107,53,0.4)]"
                    : "bg-surface-container-high text-slate-400 hover:bg-surface-bright"
                )}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Day</span>
                <span className="text-xl font-black font-headline">{day.day}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">{day.focus?.split('/')[0]}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Current Day Focus */}
        {currentDay && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-black text-xl uppercase tracking-tight">
                {currentDay.focus}
              </h2>
              <span className="text-xs text-slate-400 font-bold">{currentDay.exercises?.length} exercises</span>
            </div>

            {/* Exercise Cards */}
            {currentDay.exercises?.map((ex: any, i: number) => {
              const key = `${selectedDay}-${i}`;
              const done = completedExercises.has(key);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => toggleExercise(key)}
                  className={cn(
                    "relative rounded-2xl overflow-hidden cursor-pointer transition-all border",
                    done
                      ? "border-primary-container/50 opacity-60"
                      : "border-outline-variant/10"
                  )}
                >
                  {/* Exercise Image */}
                  <div className="h-36 relative overflow-hidden">
                    <img
                      src={getExerciseImage(ex.name)}
                      alt={ex.name}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-500",
                        done ? "grayscale" : "grayscale-0"
                      )}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />

                    {/* Done Badge */}
                    {done && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle className="w-6 h-6 text-primary-container fill-primary-container/20" />
                      </div>
                    )}

                    {/* Exercise Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-headline font-black text-lg uppercase tracking-tight text-white">{ex.name}</h3>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[10px] font-black bg-primary-container/80 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {ex.sets} SETS
                        </span>
                        <span className="text-[10px] font-black bg-white/10 backdrop-blur-md text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {ex.reps} REPS
                        </span>
                        <span className="text-[10px] font-black bg-white/10 backdrop-blur-md text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {ex.rest_seconds}s REST
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {ex.notes && (
                    <div className="bg-surface-container-high px-4 py-2">
                      <p className="text-xs text-slate-400 font-medium">💡 {ex.notes}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </section>
        )}

        {/* Tips */}
        {plan.general_tips?.length > 0 && (
          <section className="bg-surface-container-high rounded-2xl p-4 space-y-2">
            <h4 className="font-headline font-black text-xs uppercase tracking-widest text-primary-container">Coach Tips</h4>
            {plan.general_tips.map((tip: string, i: number) => (
              <p key={i} className="text-xs text-slate-400 py-1 border-t border-outline-variant/10">• {tip}</p>
            ))}
          </section>
        )}
      </motion.main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20 pb-32 px-4 max-w-5xl mx-auto space-y-10"
    >
      {/* Top Bar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#12121d]/60 backdrop-blur-xl flex justify-between items-center px-4 h-16">
        <span className="text-xl font-black text-primary-container tracking-tighter italic uppercase font-headline">APEX PRO</span>
        <button className="text-slate-400 hover:text-primary-container transition-colors">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <section className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tighter uppercase font-headline text-on-surface">TRAINING PROGRAMS</h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-primary-container" />
          </div>
          <input className="w-full bg-surface-container-highest/40 border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-slate-500 focus:ring-1 focus:ring-primary-container/50 backdrop-blur-md transition-all" placeholder="Find your next challenge..." type="text" />
        </div>
      </section>

      <section>
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer" onClick={() => setShowAI(true)}>
          <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200" alt="Featured workout" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 space-y-2">
            <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-black tracking-widest uppercase rounded-full">TAP TO GENERATE</span>
            <h2 className="text-3xl font-black font-headline tracking-tighter text-white uppercase italic leading-none">YOUR AI WORKOUT PLAN</h2>
          </div>
        </div>
      </section>

      <section>
        <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2">
          {CATEGORIES.map((cat, i) => (
            <button key={cat} className={cn("flex-none px-6 py-2 rounded-full font-bold text-xs tracking-widest uppercase transition-all", i === 0 ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-bright")}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* APEX AI FAB */}
      <div className="fixed bottom-24 right-6 z-50">
        <button onClick={() => setShowAI(true)} className="flex items-center gap-3 bg-primary-container text-on-primary-container px-6 py-4 rounded-2xl shadow-[0_8px_32px_rgba(255,107,53,0.4)] hover:scale-105 active:scale-95 transition-all">
          <Zap className="w-5 h-5 fill-current" />
          <span className="font-black tracking-widest uppercase text-xs">APEX AI</span>
        </button>
      </div>

      {/* AI Modal */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowAI(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-[390px] bg-surface-container rounded-t-3xl p-6 space-y-6 pb-10"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-headline font-black text-xl uppercase text-primary-container">AI Workout Coach</h2>
                  <p className="text-xs text-slate-400">Generate your personalized 6-day plan</p>
                </div>
                <button onClick={() => setShowAI(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Fitness Goal</label>
                  <div className="relative">
                    <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface font-body outline-none appearance-none">
                      {GOALS.map(g => <option key={g} value={g}>{g.replace('_', ' ').toUpperCase()}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Weight (kg)</label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface font-body outline-none" placeholder="75" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Experience Level</label>
                  <div className="relative">
                    <select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface font-body outline-none appearance-none">
                      {LEVELS.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button onClick={handleGenerate} disabled={loading} className="w-full bg-primary-container text-on-primary-container font-headline font-black py-4 rounded-2xl uppercase tracking-widest disabled:opacity-50 shadow-[0_4px_20px_rgba(255,107,53,0.4)]">
                {loading ? '⚡ GENERATING YOUR PLAN...' : '⚡ GENERATE MY PLAN'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}