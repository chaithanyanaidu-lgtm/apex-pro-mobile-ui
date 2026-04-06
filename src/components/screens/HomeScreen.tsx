import { motion } from 'motion/react';
import { Bell, Flame, Play, Zap, Footprints, Droplets, ChevronRight, Brain } from 'lucide-react';
import { cn } from '../../lib/utils';

const STATS = [
  { label: 'BURNED', value: '1,240', icon: Flame, color: 'text-primary-container' },
  { label: 'STEPS', value: '8.4K', icon: Footprints, color: 'text-secondary' },
  { label: 'WATER', value: '2.1L', icon: Droplets, color: 'text-tertiary' }
];

const RECOMMENDATIONS = [
  {
    id: '1',
    title: 'Leg Day: Volume II',
    category: 'HYPER-GROWTH',
    description: 'Focused on quad isolation and explosive movements.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    color: 'text-secondary'
  },
  {
    id: '2',
    title: 'Deep Tissue Flow',
    category: 'RECOVERY',
    description: '15-minute mobility session for post-workout repair.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
    color: 'text-tertiary'
  },
  {
    id: '3',
    title: 'Core Integrity',
    category: 'POWER',
    description: 'Functional core stability for multi-joint strength.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
    color: 'text-primary-container'
  }
];

export default function HomeScreen() {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20 pb-32 px-4 max-w-2xl mx-auto space-y-8"
    >
      {/* Top Bar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#12121d]/60 backdrop-blur-xl flex justify-between items-center px-4 h-16 shadow-[0_0_20px_rgba(255,107,53,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=100" 
              alt="User profile"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-xl font-black text-primary-container tracking-tighter italic uppercase font-headline">APEX PRO</span>
        </div>
        <button className="text-slate-400 hover:text-primary-container transition-colors">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      {/* Personal Welcome & Streak */}
      <section className="flex justify-between items-end">
        <div>
          <p className="text-on-surface-variant font-label text-xs tracking-widest uppercase">GOOD MORNING, ALEX</p>
          <h1 className="font-headline text-3xl font-bold tracking-tighter uppercase mt-1">DOMINATE TODAY</h1>
        </div>
        <div className="bg-surface-container-high px-3 py-1 rounded-full flex items-center gap-2 border border-outline-variant/20">
          <Flame className="w-4 h-4 text-primary-container fill-current" />
          <span className="font-label font-bold text-xs">12 DAY STREAK</span>
        </div>
      </section>

      {/* Hero Card: Today's Apex Mission */}
      <section className="relative h-[480px] w-full rounded-2xl overflow-hidden shadow-2xl group">
        <img 
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-105" 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200" 
          alt="Athlete deadlifting"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-0 left-0 p-6 w-full space-y-4">
          <div className="inline-block bg-primary-container/20 backdrop-blur-md px-3 py-1 rounded-lg border border-primary-container/30">
            <p className="text-primary-container font-label text-[10px] font-black tracking-widest uppercase">TODAY'S APEX MISSION</p>
          </div>
          <h2 className="font-headline text-4xl font-black tracking-tighter uppercase leading-none">
            STRENGTH & POWER <br /> <span className="text-primary-container">45 MIN</span>
          </h2>
          <div className="flex items-center gap-4 pt-2">
            <button className="bg-primary-container hover:bg-primary-container/90 text-on-primary font-headline font-bold uppercase py-3 px-8 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-[0_4px_20px_rgba(255,107,53,0.3)]">
              START NOW
              <Play className="w-5 h-5 fill-current" />
            </button>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Zap className="w-4 h-4" />
              <span className="font-label text-xs font-bold">850 CAL ESTIMATE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Stats Bar */}
      <section className="grid grid-cols-3 gap-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-surface-container-high/60 backdrop-blur-md p-4 rounded-2xl border border-outline-variant/10 shadow-lg">
            <stat.icon className={cn("w-5 h-5 mb-2", stat.color)} />
            <p className="text-on-surface-variant font-label text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="font-headline text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Personalized Recommendations */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline text-xl font-black uppercase tracking-tighter">NEXT FOR YOU</h3>
          <button className="text-primary text-[10px] font-bold uppercase tracking-widest">VIEW ALL</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 scroll-smooth">
          {RECOMMENDATIONS.map((rec) => (
            <div key={rec.id} className="min-w-[280px] bg-surface-container-low rounded-2xl overflow-hidden group">
              <div className="relative h-40">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={rec.image} 
                  alt={rec.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent" />
              </div>
              <div className="p-4">
                <p className={cn("font-label text-[10px] font-bold uppercase tracking-widest", rec.color)}>{rec.category}</p>
                <h4 className="font-headline text-lg font-bold uppercase mt-1">{rec.title}</h4>
                <p className="text-on-surface-variant text-xs mt-2 font-body">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 bg-primary-container text-on-primary w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(255,107,53,0.4)] z-40 active:scale-90 transition-transform group">
        <Brain className="w-6 h-6 fill-current" />
        <span className="text-[8px] font-black uppercase tracking-tighter">AI</span>
      </button>
    </motion.main>
  );
}
