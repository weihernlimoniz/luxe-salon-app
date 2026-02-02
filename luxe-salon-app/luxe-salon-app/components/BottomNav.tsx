
import React from 'react';
// Fix: Page is a custom type from types.ts, not exported from lucide-react
import { Home, Calendar, Info, User } from 'lucide-react';
import { Page } from '../types';

interface BottomNavProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ current, onNavigate }) => {
  const navItems: { id: Page; icon: any; label: string }[] = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'appointment', icon: Calendar, label: 'Booking' },
    { id: 'about', icon: Info, label: 'About' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex items-center justify-around py-3 px-4 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = current === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-black font-semibold' : 'text-gray-400'
            }`}
          >
            <Icon size={24} className={isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} />
            <span className="text-[10px] uppercase tracking-widest">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
