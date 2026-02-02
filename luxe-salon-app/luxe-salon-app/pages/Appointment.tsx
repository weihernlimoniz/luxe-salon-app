
import React, { useState, useMemo } from 'react';
import { Appointment, Outlet, Stylist, Service } from '../types';
import { MOCK_OUTLETS, MOCK_STYLISTS, MOCK_SERVICES } from '../constants';
import { ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Scissors, User as UserIcon, X, Check, ChevronDown } from 'lucide-react';

interface AppointmentPageProps {
  appointments: Appointment[];
  onAdd: (appt: Appointment) => void;
  onCancel: (id: string) => void;
}

const AppointmentPage: React.FC<AppointmentPageProps> = ({ appointments, onAdd, onCancel }) => {
  const [isBooking, setIsBooking] = useState(false);
  const [step, setStep] = useState<'outlet' | 'details'>('outlet');
  
  // Selection state
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  // Month/Year Picker State
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const upcomingAppts = appointments.filter(a => a.status === 'upcoming');

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 3 }, (_, i) => today.getFullYear() + i);

  const resetBooking = () => {
    setIsBooking(false);
    setStep('outlet');
    setSelectedOutlet(null);
    setSelectedStylist(null);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedServiceIds([]);
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
  };

  const handleConfirm = () => {
    if (!selectedOutlet || !selectedDate || !selectedTime || selectedServiceIds.length === 0) return;
    
    const newAppt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'u1',
      outletId: selectedOutlet.id,
      stylistId: selectedStylist ? selectedStylist.id : 'no-preference',
      serviceIds: selectedServiceIds,
      date: selectedDate,
      time: selectedTime,
      status: 'upcoming'
    };
    
    onAdd(newAppt);
    resetBooking();
  };

  const toggleService = (id: string) => {
    setSelectedServiceIds(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  // Generate days for the selected month and year
  const daysInMonth = useMemo(() => {
    const date = new Date(viewYear, viewMonth, 1);
    const days = [];
    while (date.getMonth() === viewMonth) {
      days.push(new Date(date).toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [viewMonth, viewYear]);

  const availableSlots = selectedStylist 
    ? selectedStylist.availableSlots 
    : Array.from(new Set(MOCK_STYLISTS.flatMap(s => s.availableSlots))).sort();

  const totalSelectedPrice = MOCK_SERVICES
    .filter(s => selectedServiceIds.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  if (isBooking) {
    return (
      <div className="min-h-screen bg-white pb-32 px-6 pt-6 relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold">New Appointment</h2>
          <button onClick={resetBooking} className="p-2 bg-gray-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        {step === 'outlet' ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-2">Select Outlet</h3>
            {MOCK_OUTLETS.map(outlet => (
              <button
                key={outlet.id}
                onClick={() => {
                  setSelectedOutlet(outlet);
                  setStep('details');
                }}
                className="w-full flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-black transition-all text-left"
              >
                <img src={outlet.photo} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <div className="font-bold">{outlet.name}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">{outlet.address}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            {/* 1. Stylist Selection */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Choose Stylist</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedStylist(null)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                    selectedStylist === null ? 'border-black bg-black text-white' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${selectedStylist === null ? 'bg-white/20' : 'bg-gray-200'}`}>
                    <UserIcon size={24} />
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap">No Preference</span>
                </button>
                {MOCK_STYLISTS.map(stylist => (
                  <button
                    key={stylist.id}
                    onClick={() => setSelectedStylist(stylist)}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                      selectedStylist?.id === stylist.id ? 'border-black bg-black text-white' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <img src={stylist.photo} className="w-14 h-14 rounded-full object-cover" />
                    <span className="text-xs font-bold whitespace-nowrap">{stylist.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Calendar Selection with Selectable Month/Year */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Select Date</h3>
                <button 
                  onClick={() => setIsPickerOpen(true)}
                  className="flex items-center gap-1 text-sm font-bold text-black bg-gray-50 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {months[viewMonth]} {viewYear}
                  <ChevronDown size={14} />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {daysInMonth.map(date => {
                  const d = new Date(date);
                  const isSelected = selectedDate === date;
                  const isPast = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  
                  return (
                    <button
                      key={date}
                      disabled={isPast}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center rounded-2xl border transition-all ${
                        isSelected 
                          ? 'border-black bg-black text-white' 
                          : isPast 
                            ? 'border-gray-50 bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <span className="text-[10px] uppercase">{d.toLocaleDateString('en', { weekday: 'short' })}</span>
                      <span className="text-xl font-bold">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Month/Year Picker Modal */}
            {isPickerOpen && (
              <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center">
                <div className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold">Select Month & Year</h4>
                    <button onClick={() => setIsPickerOpen(false)} className="p-2 bg-gray-100 rounded-full">
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {months.map((m, idx) => (
                      <button
                        key={m}
                        onClick={() => setViewMonth(idx)}
                        className={`py-2 text-sm rounded-xl border transition-all ${
                          viewMonth === idx ? 'bg-black text-white border-black font-bold' : 'bg-gray-50 border-gray-100 text-gray-600'
                        }`}
                      >
                        {m.slice(0, 3)}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-8">
                    {years.map(y => (
                      <button
                        key={y}
                        onClick={() => setViewYear(y)}
                        className={`flex-1 py-3 text-sm rounded-xl border transition-all ${
                          viewYear === y ? 'bg-black text-white border-black font-bold' : 'bg-gray-50 border-gray-100 text-gray-600'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsPickerOpen(false)}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* 3. Time Slots */}
            {selectedDate && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Available Time</h3>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        selectedTime === time ? 'border-black bg-black text-white' : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Multiple Service Selection */}
            {selectedTime && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Select Services</h3>
                <div className="space-y-2">
                  {MOCK_SERVICES.map(service => {
                    const isSelected = selectedServiceIds.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                          isSelected ? 'border-black bg-gray-50' : 'border-gray-100 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-black border-black' : 'bg-white border-gray-300'}`}>
                            {isSelected && <Check size={14} className="text-white" />}
                          </div>
                          <span className={`font-semibold ${isSelected ? 'text-black' : 'text-gray-700'}`}>{service.name}</span>
                        </div>
                        <span className={`text-sm font-bold ${isSelected ? 'text-black' : 'text-gray-500'}`}>RM{service.price.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Confirm Footer with Total */}
            {selectedServiceIds.length > 0 && (
              <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-6 z-[60] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 text-sm font-medium">{selectedServiceIds.length} service{selectedServiceIds.length > 1 ? 's' : ''} selected</span>
                  <span className="text-xl font-bold text-black">Total: RM{totalSelectedPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleConfirm}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  Confirm Booking <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">Your Appointments</h2>
        <p className="text-gray-500 text-sm">Manage your grooming schedule</p>
      </div>

      <section className="mb-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Upcoming</h3>
        {upcomingAppts.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">No appointments scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppts.map(appt => {
              const outlet = MOCK_OUTLETS.find(o => o.id === appt.outletId);
              const services = MOCK_SERVICES.filter(s => appt.serviceIds.includes(s.id));
              const stylist = MOCK_STYLISTS.find(s => s.id === appt.stylistId);
              
              return (
                <div key={appt.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                    <button 
                      onClick={() => onCancel(appt.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-black">
                      <CalendarIcon size={24} />
                    </div>
                    <div className="pr-6">
                      <div className="font-bold text-lg leading-tight">
                        {services.map(s => s.name).join(', ')}
                      </div>
                      <div className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                        <MapPin size={12} /> {outlet?.name}
                      </div>
                      <div className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                        <UserIcon size={12} /> {stylist ? stylist.name : 'No Stylist Preference'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 border-t border-gray-50 pt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-gray-400">Date</span>
                      <span className="font-bold">{appt.date}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-gray-400">Time</span>
                      <span className="font-bold">{appt.time}</span>
                    </div>
                    <div className="ml-auto">
                      <button className="text-black text-xs font-bold px-3 py-1 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-colors">Reschedule</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="space-y-3">
        <button 
          onClick={() => setIsBooking(true)}
          className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-black/10 hover:bg-gray-900 transition-colors"
        >
          <Scissors size={20} /> New Appointment
        </button>
      </div>
    </div>
  );
};

export default AppointmentPage;
