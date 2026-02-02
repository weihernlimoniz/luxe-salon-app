
import React from 'react';
import { Notification } from '../types';
import { Bell, Calendar, Info, Megaphone } from 'lucide-react';

interface NotificationsProps {
  notifications: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking': return <Calendar size={20} className="text-blue-500" />;
      case 'reminder': return <Bell size={20} className="text-orange-500" />;
      case 'marketing': return <Megaphone size={20} className="text-purple-500" />;
      default: return <Info size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">Notifications</h2>
        <p className="text-gray-500 text-sm">Stay updated with your bookings</p>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <Bell size={40} />
          </div>
          <p className="text-gray-400 font-medium">All caught up!</p>
          <p className="text-xs text-gray-300 mt-1">No new notifications at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(n => (
            <div key={n.id} className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-black/10 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex-shrink-0 flex items-center justify-center">
                {getIcon(n.type)}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-900">{n.title}</span>
                  <span className="text-[10px] text-gray-400 uppercase">
                    {n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
