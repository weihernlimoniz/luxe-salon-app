
import React, { useState, useEffect } from 'react';
import { User, Appointment, Notification, Page } from './types';
import Login from './pages/Login';
import Home from './pages/Home';
import AppointmentPage from './pages/Appointment';
import AboutUs from './pages/AboutUs';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import Header from './components/Header';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialize persistence and mock data
  useEffect(() => {
    const savedUser = localStorage.getItem('salon_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }

    const savedAppointments = localStorage.getItem('salon_appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('salon_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('salon_user');
    setCurrentPage('home');
  };

  const addAppointment = (appt: Appointment) => {
    const updated = [appt, ...appointments];
    setAppointments(updated);
    localStorage.setItem('salon_appointments', JSON.stringify(updated));
    
    // Add notification
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Booking Confirmed!',
      message: `Your appointment on ${appt.date} at ${appt.time} is confirmed.`,
      type: 'booking',
      timestamp: new Date()
    };
    setNotifications([newNotif, ...notifications]);
  };

  const updateAppointment = (updatedAppt: Appointment) => {
    const updated = appointments.map(a => a.id === updatedAppt.id ? updatedAppt : a);
    setAppointments(updated);
    localStorage.setItem('salon_appointments', JSON.stringify(updated));
    
    setNotifications([{
      id: Math.random().toString(36).substr(2, 9),
      title: 'Booking Rescheduled',
      message: `Your appointment has been moved to ${updatedAppt.date} at ${updatedAppt.time}.`,
      type: 'booking',
      timestamp: new Date()
    }, ...notifications]);
  };

  const cancelAppointment = (id: string) => {
    const updated = appointments.filter(a => a.id !== id);
    setAppointments(updated);
    localStorage.setItem('salon_appointments', JSON.stringify(updated));
    
    setNotifications([{
      id: Math.random().toString(36).substr(2, 9),
      title: 'Booking Cancelled',
      message: 'Your appointment has been successfully cancelled.',
      type: 'booking',
      timestamp: new Date()
    }, ...notifications]);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home />;
      case 'appointment': return (
        <AppointmentPage 
          appointments={appointments} 
          onAdd={addAppointment} 
          onUpdate={updateAppointment}
          onCancel={cancelAppointment}
        />
      );
      case 'about': return <AboutUs />;
      case 'notifications': return <Notifications notifications={notifications} />;
      case 'profile': return (
        <Profile 
          user={user!} 
          appointments={appointments}
          onUpdate={setUser} 
          onLogout={handleLogout} 
        />
      );
      default: return <Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white shadow-xl relative w-full max-w-md mx-auto overflow-x-hidden">
      <Header 
        notificationCount={notifications.length} 
        onNotificationClick={() => setCurrentPage('notifications')}
      />
      <main className="flex-1 w-full pb-24 overflow-y-auto">
        {renderPage()}
      </main>
      <BottomNav current={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;
