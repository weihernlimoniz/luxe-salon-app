
import React from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
  notificationCount: number;
  onNotificationClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ notificationCount, onNotificationClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
          <span className="text-white font-serif font-bold text-lg">O</span>
        </div>
        <h1 className="text-xl font-serif font-bold tracking-tight text-gray-900">
          Oviss Salon
        </h1>
      </div>
      
      <button 
        onClick={onNotificationClick}
        className="relative p-2 text-gray-600 hover:text-black transition-colors"
      >
        <Bell size={24} />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>
    </header>
  );
};

export default Header;
