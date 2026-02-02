
import React from 'react';
import { MOCK_OUTLETS, MOCK_STYLISTS } from '../constants';
import { Phone, MapPin, Instagram, Facebook } from 'lucide-react';

const AboutUs: React.FC = () => {
  const primaryOutlet = MOCK_OUTLETS[0];

  return (
    <div className="pb-8">
      {/* Salon Hero */}
      <div className="relative h-64 overflow-hidden">
        <img src={primaryOutlet.photo} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-white text-3xl font-serif font-bold mb-2">LuxeSalon</h2>
          <p className="text-white/80 max-w-xs text-sm">Elevating your grooming experience through art and expertise.</p>
        </div>
      </div>

      {/* Contact Info */}
      <section className="px-6 py-8 bg-white">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Find Us</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
              <MapPin size={20} />
            </div>
            <div>
              <div className="font-bold text-gray-900">{primaryOutlet.name}</div>
              <p className="text-sm text-gray-500">{primaryOutlet.address}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
              <Phone size={20} />
            </div>
            <div>
              <div className="font-bold text-gray-900">Contact Number</div>
              <p className="text-sm text-gray-500">{primaryOutlet.contact}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="flex-1 py-3 bg-gray-50 rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
            <Instagram size={18} /> Instagram
          </button>
          <button className="flex-1 py-3 bg-gray-50 rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
            <Facebook size={18} /> Facebook
          </button>
        </div>
      </section>

      {/* Stylists */}
      <section className="px-6 py-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Our Experts</h3>
        <div className="grid grid-cols-1 gap-8">
          {MOCK_STYLISTS.map(stylist => (
            <div key={stylist.id} className="flex gap-6 group">
              <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden ring-4 ring-gray-50">
                <img src={stylist.photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-serif font-bold text-lg text-gray-900">{stylist.name}</span>
                <span className="text-sm font-bold text-black bg-gray-100 px-2 py-0.5 rounded w-fit mb-2 uppercase tracking-tight">
                  {stylist.title}
                </span>
                {stylist.bio && <p className="text-xs text-gray-500 leading-relaxed italic">{stylist.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
