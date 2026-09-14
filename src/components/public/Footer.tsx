import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Phone, MapPin, Mail } from 'lucide-react';
import { PublicPage } from '../../types';

interface FooterProps {
  onNavigate: (page: PublicPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Prop Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-stone-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">Nationwide Shipping</div>
              <div className="text-stone-400">Free delivery on orders above Rs. 5,000</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-[#D4AF37] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">100% Original Fabric</div>
              <div className="text-stone-400">Pure combed lawn, cambric & raw silk</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-[#D4AF37] flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">7-Day Easy Exchanges</div>
              <div className="text-stone-400">Hassle-free size & style replacements</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">Boutique WhatsApp Care</div>
              <div className="text-stone-400">+92 300 1234567 (10 AM - 9 PM)</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10">
          <div className="md:col-span-4 space-y-3">
            <span className="text-2xl font-serif font-extrabold tracking-[0.22em] text-white">
              RAWAN
            </span>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Modern Pakistani fashion brand crafting relaxed stitched kurtis, printed 2-piece coordinates, and breathable seasonal lawn tailored for everyday grace.
            </p>
            <div className="text-xs text-stone-400 pt-1 space-y-1">
              <div>WhatsApp Support: <strong className="text-white">+92 300 1234567</strong></div>
              <div>Customer Care: <strong className="text-white">care@rawan.pk</strong></div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Retail Outlets
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>Gulberg Galleria, Main Boulevard, Lahore</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>Dolmen Mall Clifton, Karachi</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>Beverly Centre, Blue Area, Islamabad</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Collections
            </h4>
            <ul className="space-y-1 text-xs text-stone-400">
              <li><button onClick={() => onNavigate('shop')} className="hover:text-white">All Dresses</button></li>
              <li><button onClick={() => onNavigate('new-arrivals')} className="hover:text-white">New Arrivals</button></li>
              <li><button onClick={() => onNavigate('sale')} className="hover:text-white text-red-400">Seasonal Sale</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-white">Stitched Kurtis</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-white">2-Piece Coordinates</button></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Customer Service
            </h4>
            <ul className="space-y-1 text-xs text-stone-400">
              <li><button onClick={() => onNavigate('about')} className="hover:text-white">Our Brand Story</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-white">Contact Us</button></li>
              <li>Size Guide & Fit Information</li>
              <li>Delivery & Cash on Delivery FAQs</li>
              <li>Exchange & Return Policy</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 RAWAN Contemporary Pakistani Pret. All rights reserved.
          </span>
          <span className="text-stone-400 text-[11px]">
            Curated in Lahore & Karachi • Prices in Pakistani Rupee (Rs.)
          </span>
        </div>

      </div>
    </footer>
  );
};
