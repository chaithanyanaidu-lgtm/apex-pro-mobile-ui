import { motion } from 'motion/react';
import { Bell, TrendingUp, CheckCircle, Timer, Droplets, MoreHorizontal, Flame, Brain } from 'lucide-react';
import { cn } from '../../lib/utils';

const LEADERBOARD = [
  { id: '1', name: 'Marcus Vane', points: '12,450 APX', growth: '+15% Growth', rank: '01', color: 'text-primary', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200' },
  { id: '2', name: 'Elena K.', points: '11,920 APX', growth: 'Consistent', rank: '02', color: 'text-secondary', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200' },
  { id: '3', name: 'Jordan Rex', points: '10,110 APX', growth: 'Peak Performer', rank: '03', color: 'text-slate-400', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=200' },
];

const FEED = [
  {
    id: '1',
    author: 'Sarah J.',
    time: '24 mins ago',
    role: 'Pro Member',
    avatar: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
    likes: 42,
    content: 'Morning mobility flow in the new studio. The energy is unmatched today! Ready for the squad challenge. #ApexFlow'
  },
  {
    id: '2',
    author: 'David Chen',
    time: '1 hour ago',
    role: 'Coach',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    likes: 128,
    content: 'Fueling for the night session. High protein, clean macros. Consistency happens in the kitchen first. ⚡️ #ApexFuel'
  }
];

export default function CommunityScreen() {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20 pb-32 px-4 max-w-7xl mx-auto space-y-10"
    >
      {/* Top Bar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#12121d]/60 backdrop-blur-xl flex justify-between items-center px-4 h-16 shadow-[0_0_20px_rgba(255,107,53,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 overflow-hidden">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=100" 
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

      {/* Hero Section */}
      <section className="mt-6">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase font-headline text-on-surface">
          THE APEX SQUAD
        </h2>
        <div className="w-24 h-1 bg-primary-container mt-2" />
      </section>

      {/* Global Leaderboard */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h3 className="text-xs font-bold uppercase tracking-widest font-label text-slate-400">Elite Athletes • Weekly</h3>
          <span className="text-xs font-bold text-primary-container uppercase tracking-widest cursor-pointer">Full Rankings</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LEADERBOARD.map((item) => (
            <div key={item.id} className="relative group bg-surface-container-high rounded-2xl p-6 overflow-hidden border border-outline-variant/10 shadow-2xl">
              <div className="absolute -right-4 -top-4 opacity-10">
                <span className={cn("text-8xl font-black italic", item.color)}>{item.rank}</span>
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className={cn("w-16 h-16 rounded-2xl border-2 p-1", item.rank === '01' ? 'border-primary-container' : item.rank === '02' ? 'border-secondary' : 'border-outline-variant/40')}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-xl font-bold font-headline uppercase">{item.name}</p>
                  <p className={cn("text-sm font-bold", item.rank === '01' ? 'text-primary-container' : item.rank === '02' ? 'text-secondary' : 'text-slate-400')}>{item.points}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  {item.rank === '01' ? <TrendingUp className="w-3 h-3" /> : item.rank === '02' ? <CheckCircle className="w-3 h-3" /> : <Timer className="w-3 h-3" />}
                  <span>{item.growth}</span>
                </div>
              </div>
              {item.rank === '01' && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container to-secondary" />}
            </div>
          ))}
        </div>
      </section>

      {/* Squad Challenge Banner */}
      <section>
        <div className="relative overflow-hidden rounded-3xl bg-primary-container p-8 flex flex-col md:flex-row items-center justify-between gap-6 group">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="relative z-10 space-y-2">
            <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">Active Challenge</span>
            <h3 className="text-3xl font-black font-headline italic tracking-tighter text-on-primary-container uppercase">7-DAY HYDRATION CHALLENGE</h3>
            <p className="text-on-primary-container/80 text-sm font-medium">Join 4,209 other athletes in the squad.</p>
          </div>
          <button className="relative z-10 bg-on-primary-container text-primary-container px-8 py-3 rounded-xl font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 transition-transform">
            JOIN SQUAD
          </button>
          <div className="absolute -right-12 -bottom-12 opacity-20 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
            <Droplets className="w-40 h-40" />
          </div>
        </div>
      </section>

      {/* Community Feed */}
      <section className="space-y-8">
        <h3 className="text-xs font-bold uppercase tracking-widest font-label text-slate-400">The Live Feed</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEED.map((post) => (
            <div key={post.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-outline-variant/30">
                    <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-sm font-bold font-headline uppercase">{post.author}</p>
                    <p className="text-[10px] text-slate-500 font-label">{post.time} • {post.role}</p>
                  </div>
                </div>
                <MoreHorizontal className="text-slate-600 w-5 h-5 cursor-pointer" />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container shadow-2xl relative group">
                <img src={post.image} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-2 border border-white/10">
                    <Flame className="w-4 h-4 text-primary-container fill-current" />
                    <span className="text-[10px] font-black font-label text-white">{post.likes} FIRE</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">{post.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 bg-secondary-container text-on-secondary-container h-14 px-6 rounded-2xl flex items-center gap-3 shadow-[0_0_32px_rgba(210,187,255,0.2)] hover:scale-105 transition-all active:scale-95 group z-[60]">
        <Brain className="w-6 h-6" />
        <span className="text-xs font-black uppercase tracking-widest font-label">APEX AI</span>
      </button>
    </motion.main>
  );
}
