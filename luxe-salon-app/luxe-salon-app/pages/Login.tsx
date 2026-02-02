
import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Phone, ArrowRight, ShieldCheck, User as UserIcon, Check } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState<'input' | 'tac' | 'register'>('input');
  const [tac, setTac] = useState('');
  
  // Registration State
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male' as User['gender']
  });

  const handleRequestTac = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.length > 5) {
      setStep('tac');
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (tac.length === 6) {
      // Transition to registration step
      setRegData({
        ...regData,
        email: method === 'email' ? identifier : '',
        phone: method === 'phone' ? identifier : ''
      });
      setStep('register');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: 'u1',
      name: regData.name,
      phone: regData.phone || '+60 12-345 6789',
      email: regData.email || 'user@example.com',
      gender: regData.gender,
      creditBalance: 150.00
    };
    onLogin(mockUser);
  };

  if (step === 'register') {
    return (
      <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col px-8 py-12 animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Join LuxeSalon for a premium experience.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <UserIcon size={18} />
              </div>
              <input
                type="text"
                required
                value={regData.name}
                onChange={e => setRegData({...regData, name: e.target.value})}
                placeholder="Enter your name"
                className="w-full bg-gray-50 border-none rounded-xl py-3.5 pl-11 pr-4 text-gray-900 focus:ring-2 focus:ring-black transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={regData.email}
                onChange={e => setRegData({...regData, email: e.target.value})}
                placeholder="name@example.com"
                className="w-full bg-gray-50 border-none rounded-xl py-3.5 pl-11 pr-4 text-gray-900 focus:ring-2 focus:ring-black transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                required
                value={regData.phone}
                onChange={e => setRegData({...regData, phone: e.target.value})}
                placeholder="+60 12 345 6789"
                className="w-full bg-gray-50 border-none rounded-xl py-3.5 pl-11 pr-4 text-gray-900 focus:ring-2 focus:ring-black transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Gender</label>
            <div className="flex gap-2">
              {(['Male', 'Female', 'Other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setRegData({...regData, gender: g})}
                  className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                    regData.gender === g ? 'bg-black text-white border-black' : 'bg-gray-50 border-gray-100 text-gray-500'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors shadow-lg shadow-black/10"
            >
              Register Now <Check size={20} />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col px-8 py-12">
      <div className="mb-12 text-center">
        <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
          <span className="text-white font-serif font-bold text-3xl">L</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500">Premium grooming is just a tap away.</p>
      </div>

      {step === 'input' ? (
        <form onSubmit={handleRequestTac} className="space-y-6">
          <div className="flex bg-gray-50 p-1 rounded-xl mb-4">
            <button
              type="button"
              onClick={() => setMethod('phone')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                method === 'phone' ? 'bg-white shadow-sm text-black' : 'text-gray-500'
              }`}
            >
              Phone
            </button>
            <button
              type="button"
              onClick={() => setMethod('email')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                method === 'email' ? 'bg-white shadow-sm text-black' : 'text-gray-500'
              }`}
            >
              Email
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
              {method === 'phone' ? <Phone size={20} /> : <Mail size={20} />}
            </div>
            <input
              type={method === 'phone' ? 'tel' : 'email'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={method === 'phone' ? '+60 12 345 6789' : 'name@example.com'}
              className="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors shadow-lg shadow-black/10"
          >
            Get TAC <ArrowRight size={20} />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <ShieldCheck size={48} className="text-green-500" />
            </div>
            <p className="text-gray-600">
              Enter the 6-digit code sent to <br />
              <span className="font-bold text-black">{identifier}</span>
            </p>
          </div>

          <input
            type="text"
            maxLength={6}
            value={tac}
            onChange={(e) => setTac(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full bg-gray-50 border-none rounded-xl py-4 text-center text-3xl font-bold tracking-[1em] text-gray-900 focus:ring-2 focus:ring-black transition-all"
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-colors shadow-lg shadow-black/10"
          >
            Verify & Login
          </button>
          
          <button
            type="button"
            onClick={() => setStep('input')}
            className="w-full text-gray-400 text-sm font-medium"
          >
            Didn't receive code? Resend
          </button>
        </form>
      )}

      <p className="mt-auto text-center text-xs text-gray-400">
        By continuing, you agree to our Terms of Service <br /> and Privacy Policy.
      </p>
    </div>
  );
};

export default Login;
