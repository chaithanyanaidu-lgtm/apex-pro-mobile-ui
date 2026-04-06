import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Sparkles, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../lib/api';

const GOALS = ['muscle_gain', 'fat_loss', 'maintenance'];

const MEAL_IMAGES: Record<string, string> = {
  breakfast: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=600&q=80',
  lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  dinner: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  snack: 'https://images.unsplash.com/photo-1499744937866-d7e566a20a61?w=600&q=80',
};

const INDIAN_MEAL_IMAGES: Record<string, string> = {
  breakfast: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80',
  lunch: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80',
  dinner: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80',
  snack: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&q=80',
};

export default function NutritionScreen() {
  const [showAI, setShowAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [error, setError] = useState('');
  const [goal, setGoal] = useState('muscle_gain');
  const [weight, setWeight] = useState('75');
  const [isIndian, setIsIndian] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setPlan(null);
    try {
      const data: any = await api.generateDiet({
        goal,
        weight_kg: parseFloat(weight),
        is_indian_meal_plan: isIndian,
      });
      setPlan(data.plan);
      setSelectedDay(0);
      setShowAI(false);
    } catch (err: any) {
      setError(err.message || 'Failed to generate diet plan');
    } finally {
      setLoading(false);
    }
  };

  const getMealImage = (mealType: string) => {
    const type = mealType.toLowerCase();
    const images = isIndian ? INDIAN_MEAL_IMAGES : MEAL_IMAGES;
    return images[type] || MEAL_IMAGES['lunch'];
  };

  const currentDay = plan?.days?.[selectedDay];
  const totalCalories = currentDay?.meals?.reduce((sum: number, m: any) => sum + (m.calories || 0), 0) || 0;
  const totalProtein = currentDay?.meals?.reduce((sum: number, m: any) => sum + (m.protein_g || 0), 0) || 0;

  if (plan) {
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
            <ChevronLeft className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Nutrition</span>
          </button>
          <button onClick={() => setShowAI(true)} className="flex items-center gap-2 bg-primary-container/20 text-primary-container px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Regenerate
          </button>
        </header>

        {/* Plan Header */}
        <section className="space-y-2 pt-2">
          <div className="flex gap-2 flex-wrap">
            <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-black tracking-widest uppercase rounded-full">
              {goal.replace('_', ' ').toUpperCase()}
            </span>
            {isIndian && (
              <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary text-[10px] font-black tracking-widest uppercase rounded-full">
                🇮🇳 INDIAN MEALS
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black font-headline uppercase tracking-tighter text-on-surface">
            {plan.plan_name}
          </h1>
          <p className="text-slate-400 text-sm">{plan.daily_calories} kcal/day • {plan.macros?.protein_g}g protein</p>
        </section>

        {/* Macro Summary */}
        <section className="bg-surface-container-high rounded-2xl p-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Daily Macros</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-2xl font-black font-headline text-[#ff6b35]">{plan.macros?.protein_g}g</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black font-headline text-[#d2bbff]">{plan.macros?.carbs_g}g</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black font-headline text-white">{plan.macros?.fat_g}g</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Fats</div>
            </div>
          </div>
        </section>

        {/* Day Selector */}
        <section className="flex items-center justify-between bg-surface-container-high rounded-2xl px-4 py-3">
          <button
            onClick={() => setSelectedDay(d => Math.max(0, d - 1))}
            disabled={selectedDay === 0}
            className="text-slate-400 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="font-headline font-black text-lg uppercase">Day {selectedDay + 1}</p>
            <p className="text-xs text-slate-400">{totalCalories} kcal • {totalProtein}g protein</p>
          </div>
          <button
            onClick={() => setSelectedDay(d => Math.min((plan.days?.length || 1) - 1, d + 1))}
            disabled={selectedDay === (plan.days?.length || 1) - 1}
            className="text-slate-400 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </section>

        {/* Day Tabs Strip */}
        <section>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {plan.days?.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`flex-none w-10 h-10 rounded-xl font-black text-sm transition-all ${selectedDay === i
                    ? 'bg-primary-container text-on-primary-container shadow-[0_4px_12px_rgba(255,107,53,0.4)]'
                    : 'bg-surface-container-high text-slate-400'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </section>

        {/* Meals */}
        <section className="space-y-4">
          {currentDay?.meals?.map((meal: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl overflow-hidden bg-surface-container-high border border-outline-variant/10"
            >
              {/* Meal Image */}
              <div className="h-44 relative overflow-hidden">
                <img
                  src={getMealImage(meal.meal_type)}
                  alt={meal.meal_type}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-black tracking-widest uppercase rounded-full">
                    {meal.meal_type.toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <span className="text-[10px] font-black bg-black/40 backdrop-blur-md text-white px-2 py-1 rounded-full">{meal.calories} kcal</span>
                  <span className="text-[10px] font-black bg-[#ff6b35]/80 text-white px-2 py-1 rounded-full">{meal.protein_g}g P</span>
                </div>
              </div>

              {/* Meal Items */}
              <div className="p-4 space-y-2">
                {meal.items?.map((item: string, j: number) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-container flex-none" />
                    <p className="text-sm text-on-surface font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </section>

        {/* Tips */}
        {plan.hydration_tip && (
          <section className="bg-surface-container-high rounded-2xl p-4 space-y-3">
            <h4 className="font-headline font-black text-xs uppercase tracking-widest text-primary-container">💧 Hydration</h4>
            <p className="text-sm text-slate-400">{plan.hydration_tip}</p>
            {plan.supplements?.length > 0 && (
              <>
                <h4 className="font-headline font-black text-xs uppercase tracking-widest text-secondary-container pt-2">💊 Supplements</h4>
                <div className="flex flex-wrap gap-2">
                  {plan.supplements.map((s: string, i: number) => (
                    <span key={i} className="text-[10px] font-black bg-secondary-container/20 text-secondary-container px-3 py-1 rounded-full uppercase tracking-wider">{s}</span>
                  ))}
                </div>
              </>
            )}
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
      className="pt-24 pb-32 px-6 max-w-4xl mx-auto"
    >
      {/* Top Bar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#12121d]/60 backdrop-blur-xl flex justify-between items-center px-4 h-16">
        <span className="text-xl font-black text-primary-container tracking-tighter italic uppercase font-headline">APEX PRO</span>
        <button className="text-slate-400 hover:text-primary-container transition-colors">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <section className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter uppercase font-headline text-on-surface">NUTRITION HUB</h1>
        <p className="text-on-surface-variant text-sm font-medium tracking-wide">FUEL YOUR PERFORMANCE</p>
      </section>

      {/* Tap to Generate Banner */}
      <section className="mb-8 cursor-pointer" onClick={() => setShowAI(true)}>
        <div className="relative h-48 rounded-2xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80" alt="Indian food" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5 space-y-1">
            <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-black tracking-widest uppercase rounded-full">TAP TO GENERATE</span>
            <h2 className="text-2xl font-black font-headline tracking-tighter text-white uppercase italic">YOUR AI MEAL PLAN</h2>
          </div>
        </div>
      </section>

      {/* Static Macro Rings */}
      <section className="mb-12 flex flex-col items-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeWidth="12" className="text-surface-container-highest" />
            <circle cx="128" cy="128" fill="transparent" r="90" stroke="currentColor" strokeWidth="12" className="text-surface-container-highest" />
            <circle cx="128" cy="128" fill="transparent" r="70" stroke="currentColor" strokeWidth="12" className="text-surface-container-highest" />
            <circle cx="128" cy="128" fill="transparent" r="110" stroke="#ff6b35" strokeDasharray="691" strokeDashoffset="200" strokeLinecap="round" strokeWidth="12" />
            <circle cx="128" cy="128" fill="transparent" r="90" stroke="#d2bbff" strokeDasharray="565" strokeDashoffset="150" strokeLinecap="round" strokeWidth="12" />
            <circle cx="128" cy="128" fill="transparent" r="70" stroke="#ffffff" strokeDasharray="440" strokeDashoffset="180" strokeLinecap="round" strokeWidth="12" />
          </svg>
          <div className="text-center z-10">
            <span className="block text-4xl font-black font-headline tracking-tighter">1,200</span>
            <span className="block text-xs font-bold text-on-surface-variant tracking-widest uppercase">KCAL LEFT</span>
          </div>
        </div>
        <div className="flex gap-6 mt-8">
          {[['#ff6b35', 'Protein'], ['#d2bbff', 'Carbs'], ['white', 'Fats']].map(([color, label]) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* APEX AI FAB */}
      <button
        onClick={() => setShowAI(true)}
        className="fixed bottom-24 right-6 bg-primary-container text-on-primary-container px-6 py-3 rounded-full flex items-center gap-2 font-black font-headline tracking-tighter uppercase shadow-[0_0_32px_rgba(255,107,53,0.3)] z-40 active:scale-95 transition-transform"
      >
        <Sparkles className="w-5 h-5 fill-current" />
        APEX AI
      </button>

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
                  <h2 className="font-headline font-black text-xl uppercase text-primary-container">AI Nutrition Coach</h2>
                  <p className="text-xs text-slate-400">Generate your personalized 7-day meal plan</p>
                </div>
                <button onClick={() => setShowAI(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Goal</label>
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

                <div className="flex items-center justify-between bg-surface-container-high rounded-xl px-4 py-3">
                  <div>
                    <p className="font-bold text-sm text-on-surface">🇮🇳 Indian Meal Plan</p>
                    <p className="text-xs text-slate-400">Dal, roti, rice, paneer & more</p>
                  </div>
                  <button
                    onClick={() => setIsIndian(!isIndian)}
                    className={`w-12 h-6 rounded-full transition-all ${isIndian ? 'bg-primary-container' : 'bg-surface-container-highest'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${isIndian ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button onClick={handleGenerate} disabled={loading} className="w-full bg-primary-container text-on-primary-container font-headline font-black py-4 rounded-2xl uppercase tracking-widest disabled:opacity-50 shadow-[0_4px_20px_rgba(255,107,53,0.4)]">
                {loading ? '⚡ GENERATING YOUR PLAN...' : '⚡ GENERATE MY MEAL PLAN'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}