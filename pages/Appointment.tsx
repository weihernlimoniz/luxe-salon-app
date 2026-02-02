
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Appointment, Outlet, Stylist, Service } from '../types';
import { MOCK_OUTLETS, MOCK_STYLISTS, MOCK_SERVICES } from '../constants';
import { ChevronRight, Calendar as CalendarIcon, MapPin, Scissors, User as UserIcon, X, Check, ChevronDown, AlertTriangle } from 'lucide-react';

interface AppointmentPageProps {
  appointments: Appointment[];
  onAdd: (appt: Appointment) => void;
  onUpdate: (appt: Appointment) => void;
  onCancel: (id: string) => void;
}

const AppointmentPage: React.FC<AppointmentPageProps> = ({ appointments, onAdd, onUpdate, onCancel }) => {
  const [isBooking, setIsBooking] = useState(false);
  const [step, setStep] = useState<'outlet' | 'details'>('outlet');
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const [editingApptId, setEditingApptId] = useState<string | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() + i);

  const upcomingAppts = appointments.filter(a => a.status === 'upcoming');

  const resetBooking = () => {
    setIsBooking(false);
    setStep('outlet');
    setEditingApptId(null);
    setSelectedOutlet(null);
    setSelectedStylist(null);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedServiceIds([]);
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
  };

  const handleReschedule = (appt: Appointment) => {
    const outlet = MOCK_OUTLETS.find(o => o.id === appt.outletId) || null;
    const stylist = MOCK_STYLISTS.find(s => s.id === appt.stylistId) || null;
    setEditingApptId(appt.id);
    setSelectedOutlet(outlet);
    setSelectedStylist(stylist);
    setSelectedDate(appt.date);
    setSelectedTime(appt.time);
    setSelectedServiceIds(appt.serviceIds);
    const apptDate = new Date(appt.date);
    setViewMonth(apptDate.getMonth());
    setViewYear(apptDate.getFullYear());
    setIsBooking(true);
    setStep('details');
  };

  const handleConfirm = () => {
    if (!selectedOutlet || !selectedDate || !selectedTime || selectedServiceIds.length === 0) return;
    const apptData: Appointment = {
      id: editingApptId || Math.random().toString(36).substr(2, 9),
      userId: 'u1',
      outletId: selectedOutlet.id,
      stylistId: selectedStylist ? selectedStylist.id : 'no-preference',
      serviceIds: selectedServiceIds,
      date: selectedDate,
      time: selectedTime,
      status: 'upcoming'
    };
    if (editingApptId) onUpdate(apptData); else onAdd(apptData);
    resetBooking();
  };

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
      <div className="min-h-screen bg-white pb-32 px-6 pt-6 relative w-full animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold">
            {editingApptId ? 'Edit Appointment' : 'New Appointment'}
          </h2>
          <button onClick={resetBooking} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {step === 'outlet' ? (
          <div className="space-y-4 w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Select Outlet</h3>
            {MOCK_OUTLETS.map(outlet => (
              <button
                key={outlet.id}
                onClick={() => {
                  setSelectedOutlet(outlet);
                  setStep('details');
                }}
                className="w-full p-6 rounded-2xl border border-gray-100 hover:border-black transition-all text-left bg-gray-50 flex items-center justify-between group"
              >
                <span className="font-bold text-lg text-gray-900 group-hover:text-black">{outlet.name}</span>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-black" />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-8 w-full">
            {/* Stylist - No Preference last */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Choose Stylist</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {MOCK_STYLISTS.map(stylist => (
                  <button
                    key={stylist.id}
                    onClick={() => setSelectedStylist(stylist)}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                      selectedStylist?.id === stylist.id ? 'border-black bg-black text-white shadow-lg' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <img src={stylist.photo} className="w-14 h-14 rounded-full object-cover" />
                    <span className="text-xs font-bold whitespace-nowrap">{stylist.name}</span>
                  </button>
                ))}
                <button
                  onClick={() => setSelectedStylist(null)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                    selectedStylist === null ? 'border-black bg-black text-white shadow-lg' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${selectedStylist === null ? 'bg-white/20' : 'bg-gray-200'}`}>
                    <UserIcon size={24} />
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap">No Preference</span>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Select Date</h3>
                <button 
                  onClick={() => setIsPickerOpen(true)}
                  className="flex items-center gap-1 text-sm font-bold text-black bg-gray-50 px-3 py-1.5 rounded-full"
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
                        isSelected ? 'border-black bg-black text-white shadow-lg scale-105' : isPast ? 'border-gray-50 bg-gray-50 text-gray-300 cursor-not-allowed' : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <span className="text-[10px] uppercase opacity-70">{d.toLocaleDateString('en', { weekday: 'short' })}</span>
                      <span className="text-xl font-bold">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scroll-type Month/Year Picker Modal */}
            {isPickerOpen && (
              <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center">
                <div className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold">Select Month & Year</h4>
                    <button onClick={() => setIsPickerOpen(false)} className="p-2 bg-gray-100 rounded-full">
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="flex gap-4 h-48 overflow-hidden relative border-y border-gray-100 my-4">
                    {/* Month Scroll */}
                    <div className="flex-1 overflow-y-auto scroll-smooth snap-y snap-mandatory scrollbar-hide py-20">
                      {months.map((m, idx) => (
                        <button
                          key={m}
                          onClick={() => setViewMonth(idx)}
                          className={`w-full h-12 flex items-center justify-center snap-center transition-all ${
                            viewMonth === idx ? 'text-black font-bold text-lg' : 'text-gray-300'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    {/* Year Scroll */}
                    <div className="flex-1 overflow-y-auto scroll-smooth snap-y snap-mandatory scrollbar-hide py-20">
                      {years.map(y => (
                        <button
                          key={y}
                          onClick={() => setViewYear(y)}
                          className={`w-full h-12 flex items-center justify-center snap-center transition-all ${
                            viewYear === y ? 'text-black font-bold text-lg' : 'text-gray-300'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                    {/* Center highlight bar */}
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-12 border-y-2 border-black/10 pointer-events-none"></div>
                  </div>

                  <button
                    onClick={() => setIsPickerOpen(false)}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold mt-4"
                  >
                    Set Date
                  </button>
                </div>
              </div>
            )}

            {/* Time Slots */}
            {selectedDate && (
              <div className="animate-in fade-in duration-500">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Available Time</h3>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        selectedTime === time ? 'border-black bg-black text-white shadow-md' : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {selectedTime && (
              <div className="animate-in fade-in duration-500">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Select Services</h3>
                <div className="space-y-2">
                  {MOCK_SERVICES.map(service => {
                    const isSelected = selectedServiceIds.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        onClick={() => {
                          setSelectedServiceIds(prev => 
                            prev.includes(service.id) ? prev.filter(id => id !== service.id) : [...prev, service.id]
                          );
                        }}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                          isSelected ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-100 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-black border-black' : 'bg-white border-gray-300'}`}>
                            {isSelected && <Check size={14} className="text-white" />}
                          </div>
                          <span className={`font-semibold ${isSelected ? 'text-black' : 'text-gray-700'}`}>{service.name}</span>
                        </div>
                        <span className={`text-sm font-bold ${isSelected ? 'text-black' : 'text-gray-500'}`}>RM{service.price.toFixed(0)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedServiceIds.length > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 z-[60] shadow-2xl">
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500 text-sm font-medium">{selectedServiceIds.length} items</span>
                    <span className="text-xl font-bold text-black">Total: RM{totalSelectedPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleConfirm}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    {editingApptId ? 'Update Booking' : 'Confirm Booking'} <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 w-full min-h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">Your Appointments</h2>
        <p className="text-gray-500 text-sm">Experience the art of grooming</p>
      </div>

      <section className="mb-10 w-full">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Upcoming</h3>
        {upcomingAppts.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">No appointments scheduled</p>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {upcomingAppts.map(appt => {
              const outlet = MOCK_OUTLETS.find(o => o.id === appt.outletId);
              const services = MOCK_SERVICES.filter(s => appt.serviceIds.includes(s.id));
              const stylist = MOCK_STYLISTS.find(s => s.id === appt.stylistId);
              return (
                <div key={appt.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative w-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-black">
                      <CalendarIcon size={24} />
                    </div>
                    <div className="pr-2 flex-1">
                      <div className="font-bold text-lg leading-tight text-gray-900">
                        {services.map(s => s.name).join(', ')}
                      </div>
                      <div className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                        <MapPin size={12} className="opacity-50" /> {outlet?.name}
                      </div>
                      <div className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                        <UserIcon size={12} className="opacity-50" /> {stylist ? stylist.name : 'No Stylist Preference'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t border-gray-50 pt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-gray-400 font-bold">Date</span>
                      <span className="font-bold text-sm text-gray-900">{appt.date}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-gray-400 font-bold">Time</span>
                      <span className="font-bold text-sm text-gray-900">{appt.time}</span>
                    </div>
                    <div className="ml-auto flex flex-col gap-2">
                      <button onClick={() => handleReschedule(appt)} className="text-black text-[10px] font-bold px-4 py-1.5 bg-gray-50 rounded-full border border-gray-200">Reschedule</button>
                      <button onClick={() => setCancelTarget(appt.id)} className="text-red-500 text-[10px] font-bold px-4 py-1.5 bg-red-50 rounded-full border border-red-100">Cancel</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <button 
        onClick={() => setIsBooking(true)}
        className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
      >
        <Scissors size={20} /> New Appointment
      </button>

      {cancelTarget && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm animate-in zoom-in duration-200 shadow-2xl">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold text-center mb-2">Cancel Appointment?</h3>
            <p className="text-sm text-gray-500 text-center mb-8">Are you sure you want to cancel this booking?</p>
            <div className="flex gap-3">
              <button onClick={() => setCancelTarget(null)} className="flex-1 py-4 font-bold text-gray-400 bg-gray-50 rounded-2xl">No</button>
              <button onClick={() => { onCancel(cancelTarget); setCancelTarget(null); }} className="flex-1 bg-red-500 text-white rounded-2xl py-4 font-bold">Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
