import { Home, Dumbbell, Utensils, BarChart2, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen } from '../types';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'workout', label: 'Workout', icon: Dumbbell },
  { id: 'nutrition', label: 'Nutrition', icon: Utensils },
  { id: 'progress', label: 'Progress', icon: BarChart2 },
  { id: 'community', label: 'Community', icon: Users },
];

export default function BottomNav({ activeScreen, onNavigate }: { 
  activeScreen: Screen, 
  onNavigate: (screen: Screen) => void 
}) {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-[#12121d]/60 backdrop-blur-xl z-50 rounded-t-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.3)]">
      {NAV_ITEMS.map((item) => {
        const isActive = activeScreen === item.id;
        return (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id as Screen)}
            className={cn(
              "flex flex-col items-center justify-center transition-all duration-300",
              isActive ? "text-primary-container font-black scale-110" : "text-slate-500 hover:text-primary-container/80"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
            <span className="text-[10px] font-bold uppercase tracking-wider font-label mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
