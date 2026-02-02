
import React, { useState } from 'react';
import { User, Appointment } from '../types';
import { MOCK_OUTLETS, MOCK_SERVICES, MOCK_STYLISTS } from '../constants';
import { Camera, Edit2, LogOut, Wallet, Shield, Phone, Mail, User as UserIcon, Check, ArrowRight, History, ChevronLeft, Calendar as CalendarIcon, MapPin } from 'lucide-react';

interface ProfileProps {
  user: User;
  appointments: Appointment[];
  onUpdate: (user: User) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, appointments, onUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editForm, setEditForm] = useState(user);
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [tacCode, setTacCode] = useState('');

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  const handlePhoneChange = () => {
    if (tacCode === '123456') {
      onUpdate({ ...user, phone: editForm.phone });
      setIsChangingPhone(false);
      setTacCode('');
    } else {
      alert('Invalid TAC code. For testing use 123456');
    }
  };

  if (showHistory) {
    return (
      <div className="p-6 animate-in slide-in-from-right duration-300">
        <button 
          onClick={() => setShowHistory(false)}
          className="flex items-center gap-2 text-gray-500 mb-6 font-semibold"
        >
          <ChevronLeft size={20} /> Back to Profile
        </button>
        
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">Booking History</h2>
          <p className="text-gray-500 text-sm">Review your past grooming sessions</p>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">No appointment history found</p>
          </div>
        ) : (
          <div className="space-y-4 pb-12">
            {appointments.map(appt => {
              const outlet = MOCK_OUTLETS.find(o => o.id === appt.outletId);
              const services = MOCK_SERVICES.filter(s => appt.serviceIds.includes(s.id));
              const stylist = MOCK_STYLISTS.find(s => s.id === appt.stylistId);
              const isPast = appt.status !== 'upcoming';
              
              return (
                <div key={appt.id} className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden ${isPast ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                  <div className="absolute top-0 right-0 p-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${isPast ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                      <CalendarIcon size={20} />
                    </div>
                    <div className="pr-12">
                      <div className="font-bold text-base leading-tight">
                        {services.map(s => s.name).join(', ')}
                      </div>
                      <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                        <MapPin size={10} /> {outlet?.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t border-gray-50 pt-3 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-gray-400">Date</span>
                      <span className="font-bold">{appt.date}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-gray-400">Time</span>
                      <span className="font-bold">{appt.time}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-gray-400">Stylist</span>
                      <span className="font-bold">{stylist ? stylist.name.split(' ')[0] : 'Any'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header / Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4 group">
          <div className="w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-gray-50 shadow-xl">
            <img 
              src={user.profilePic || `https://picsum.photos/seed/${user.id}/200/200`} 
              className="w-full h-full object-cover" 
            />
          </div>
          <button className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform">
            <Camera size={18} />
          </button>
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-900">{user.name}</h2>
        <span className="text-gray-500 text-sm">Platinum Member</span>
      </div>

      {/* Credit Balance Card */}
      <div className="bg-black rounded-3xl p-6 text-white mb-8 shadow-2xl shadow-black/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} className="text-white/60" />
            <span className="text-xs uppercase tracking-widest text-white/60">Credit Balance</span>
          </div>
          <div className="text-4xl font-serif font-bold mb-4">
            <span className="text-2xl mr-1 text-white/40 font-sans">RM</span>
            {user.creditBalance.toFixed(2)}
          </div>
          <button className="w-full bg-white/10 backdrop-blur-md text-white py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition-all border border-white/10">
            Top Up Credits
          </button>
        </div>
      </div>

      {/* Profile Details */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Personal Info</h3>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-black text-xs font-bold flex items-center gap-1"
            >
              <Edit2 size={12} /> Edit
            </button>
          )}
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 space-y-6">
          <div className="flex items-center gap-4">
            <div className="text-gray-400"><UserIcon size={20} /></div>
            <div className="flex-grow">
              <label className="text-[10px] uppercase text-gray-400 block">Full Name</label>
              {isEditing ? (
                <input 
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="bg-transparent border-b border-gray-300 w-full focus:outline-none focus:border-black font-semibold"
                />
              ) : (
                <span className="font-semibold text-gray-900">{user.name}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-gray-400"><Phone size={20} /></div>
            <div className="flex-grow">
              <label className="text-[10px] uppercase text-gray-400 block">Phone Number</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input 
                    value={editForm.phone}
                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                    className="bg-transparent border-b border-gray-300 w-full focus:outline-none focus:border-black font-semibold"
                  />
                  <button 
                    onClick={() => setIsChangingPhone(true)}
                    className="text-[10px] bg-black text-white px-2 py-1 rounded"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <span className="font-semibold text-gray-900">{user.phone}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-gray-400"><Mail size={20} /></div>
            <div className="flex-grow">
              <label className="text-[10px] uppercase text-gray-400 block">Email Address</label>
              {isEditing ? (
                <input 
                  value={editForm.email}
                  onChange={e => setEditForm({...editForm, email: e.target.value})}
                  className="bg-transparent border-b border-gray-300 w-full focus:outline-none focus:border-black font-semibold"
                />
              ) : (
                <span className="font-semibold text-gray-900">{user.email}</span>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <button 
            onClick={handleSave}
            className="w-full bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Check size={20} /> Save Changes
          </button>
        )}
      </div>

      {/* Misc Actions */}
      <div className="space-y-2 mb-8">
        <button 
          onClick={() => setShowHistory(true)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl group transition-all hover:bg-black hover:text-white"
        >
          <div className="flex items-center gap-3">
            <History size={20} className="text-gray-400 group-hover:text-white" />
            <span className="font-semibold">Booking History</span>
          </div>
          <ArrowRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-all" />
        </button>
        
        <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl group">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-gray-400" />
            <span className="font-semibold text-gray-900">Privacy Policy</span>
          </div>
          <ChevronRightIcon />
        </button>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-4 bg-red-50 rounded-2xl text-red-600 font-bold group"
        >
          <div className="flex items-center gap-3">
            <LogOut size={20} />
            <span>Sign Out</span>
          </div>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Phone Change Modal */}
      {isChangingPhone && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm animate-in zoom-in duration-200">
            <h3 className="text-xl font-serif font-bold mb-2">Verify Phone Change</h3>
            <p className="text-sm text-gray-500 mb-6">Enter the TAC sent to your new number.</p>
            <input 
              value={tacCode}
              onChange={e => setTacCode(e.target.value)}
              placeholder="Enter 6-digit TAC"
              className="w-full bg-gray-100 border-none rounded-xl p-4 text-center font-bold tracking-widest text-lg mb-6 focus:ring-2 focus:ring-black"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setIsChangingPhone(false)}
                className="flex-1 py-3 font-bold text-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={handlePhoneChange}
                className="flex-1 bg-black text-white rounded-xl py-3 font-bold"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="m9 18 6-6-6-6"/></svg>
);

export default Profile;
