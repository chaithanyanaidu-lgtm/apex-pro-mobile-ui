import { motion } from 'motion/react';
import { Bell, TrendingDown, TrendingUp, ArrowRight, Dumbbell, Utensils, Flame, Gauge, Footprints } from 'lucide-react';
import { cn } from '../../lib/utils';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const DATA = [
  { name: 'WEEK 1', weight: 86 },
  { name: 'WEEK 2', weight: 84.5 },
  { name: 'WEEK 3', weight: 85.2 },
  { name: 'WEEK 4', weight: 82 },
];

const MILESTONES = [
  { id: '1', title: '100 WORKOUTS', icon: Dumbbell, progress: 100, color: 'text-secondary', achieved: true },
  { id: '2', title: 'MACRO KING', icon: Utensils, progress: 85, color: 'text-primary-container', achieved: false },
  { id: '3', title: 'STREAK MASTER', icon: Flame, progress: 40, color: 'text-slate-400', achieved: false, locked: true },
  { id: '4', title: 'SPEED DEMON', icon: Gauge, progress: 10, color: 'text-slate-400', achieved: false, locked: true },
];

const RECORDS = [
  { id: '1', title: 'BENCH PRESS MAX', value: '125 KG', improvement: '+5 KG IMPROVEMENT', icon: Dumbbell },
  { id: '2', title: 'SQUAT MAX', value: '160 KG', improvement: 'UNSTABLE', icon: Dumbbell },
  { id: '3', title: '5K RUN TIME', value: '19:42 MIN', improvement: 'NEW PB', icon: Footprints },
];

export default function ProgressScreen() {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-32 px-4 max-w-4xl mx-auto space-y-10"
    >
      {/* Top Navigation Anchor */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#12121d]/60 backdrop-blur-xl shadow-[0_0_20px_rgba(255,107,53,0.05)] flex justify-between items-center px-4 h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/30">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=100" 
              alt="User"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-xl font-black text-primary-container tracking-tighter italic uppercase font-headline">APEX PRO</span>
        </div>
        <button className="text-slate-400 hover:text-primary-container transition-colors">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      {/* Header Section */}
      <section>
        <h1 className="text-4xl font-black tracking-tighter uppercase font-headline text-on-surface">YOUR ASCENT</h1>
        <p className="text-on-surface-variant font-label text-sm tracking-widest mt-1 opacity-70 uppercase">METRICS & MILESTONES</p>
      </section>

      {/* Bento Grid for Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Chart Card */}
        <div className="md:col-span-2 bg-surface-container-low rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-secondary font-label mb-1">Body Composition</h3>
              <p className="text-2xl font-bold font-headline uppercase">WEIGHT TREND</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-secondary chart-glow">-4.2kg</span>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">This Month</p>
            </div>
          </div>
          
          {/* Chart */}
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DATA}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d2bbff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d2bbff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#d2bbff" 
                  strokeWidth={3} 
                  dot={{ fill: '#d2bbff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <XAxis dataKey="name" hide />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f1e2a', border: 'none', borderRadius: '8px', color: '#e3e0f1' }}
                  itemStyle={{ color: '#d2bbff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant tracking-widest uppercase font-label">
            <span>WEEK 1</span>
            <span>WEEK 2</span>
            <span>WEEK 3</span>
            <span>WEEK 4</span>
          </div>
        </div>

        {/* Side Metrics */}
        <div className="space-y-6">
          <div className="bg-surface-container-low rounded-2xl p-5 border-l-4 border-secondary">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Current Body Fat</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black font-headline">14.2%</span>
              <TrendingDown className="text-secondary w-6 h-6 mb-1" />
            </div>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-5 border-l-4 border-primary-container">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Muscle Mass</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black font-headline">72.5<span className="text-xl">kg</span></span>
              <TrendingUp className="text-primary-container w-6 h-6 mb-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Photos */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold uppercase tracking-tighter font-headline">PHYSIQUE ARCHIVE</h2>
          <button className="text-[10px] font-bold text-primary-container uppercase tracking-widest flex items-center gap-1">
            View Full Gallery <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-[3/4]">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800" 
              alt="Starting point"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest">JAN 01</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-sm font-bold uppercase tracking-widest">STARTING POINT</p>
            </div>
          </div>
          <div className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-[3/4]">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800" 
              alt="Current form"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-primary-container px-3 py-1 rounded-full">
              <span className="text-[10px] font-black uppercase tracking-widest">TODAY</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container/30 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-sm font-bold uppercase tracking-widest">CURRENT FORM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestone Badges */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold uppercase tracking-tighter font-headline">MILESTONES</h2>
        <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2">
          {MILESTONES.map((m) => (
            <div key={m.id} className={cn(
              "flex-shrink-0 w-36 h-48 rounded-2xl flex flex-col items-center justify-center p-4 text-center space-y-3 transition-all",
              m.locked ? "bg-surface-container-low opacity-50 grayscale" : "bg-white/5 backdrop-blur-md border border-white/5"
            )}>
              <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", m.locked ? "bg-slate-500/20" : `${m.color.replace('text-', 'bg-')}/20`)}>
                <m.icon className={cn("w-8 h-8", m.color)} />
              </div>
              <p className="text-[11px] font-black uppercase tracking-tighter font-headline leading-tight">{m.title}</p>
              <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                <div className={cn("h-full transition-all duration-1000", m.color.replace('text-', 'bg-'))} style={{ width: `${m.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personal Records */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold uppercase tracking-tighter font-headline">PERSONAL RECORDS</h2>
        <div className="grid grid-cols-1 gap-3">
          {RECORDS.map((r) => (
            <div key={r.id} className="bg-surface-container-low p-5 rounded-2xl flex justify-between items-center hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container">
                  <r.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{r.title}</p>
                  <p className="text-xl font-black font-headline">{r.value}</p>
                </div>
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider",
                r.improvement.includes('+') ? "text-primary-container bg-primary-container/10" : "text-slate-500 bg-slate-500/10"
              )}>{r.improvement}</span>
            </div>
          ))}
        </div>
      </section>
    </motion.main>
  );
}
