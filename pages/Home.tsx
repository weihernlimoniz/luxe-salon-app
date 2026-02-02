
import React from 'react';
import { BANNER_IMAGE, MOCK_SERVICES } from '../constants';
import { Scissors } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="pb-8">
      {/* Hero Banner */}
      <div className="px-6 py-4">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-48 group">
          <img 
            src={BANNER_IMAGE} 
            alt="Promotion Banner" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
            <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Seasonal Special</span>
            <h2 className="text-white text-2xl font-serif font-bold leading-tight">Elevate Your Style <br /> at Oviss Salon</h2>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="mt-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-gray-900">Services & Pricing</h3>
            <p className="text-gray-500 text-sm">Experience our curated offerings</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-full">
            <Scissors size={20} className="text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {MOCK_SERVICES.map((service) => (
            <div 
              key={service.id}
              className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-black/10 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 group-hover:text-black transition-colors">
                  {service.name}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-tighter">
                  {service.duration} Minutes
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-900 font-bold bg-gray-50 px-3 py-1 rounded-full group-hover:bg-black group-hover:text-white transition-all">
                <span className="text-[10px] opacity-60 mr-0.5">From RM</span>
                <span>{service.price.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Quote */}
      <div className="mt-12 px-6">
        <div className="bg-stone-50 rounded-3xl p-8 text-center border border-stone-100">
          <p className="font-serif italic text-gray-600 mb-4 leading-relaxed">
            "Your hair is the crown you never take off."
          </p>
          <div className="w-12 h-0.5 bg-gray-200 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
