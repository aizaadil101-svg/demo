import React from 'react';
import { ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { PublicPage } from '../../types';

interface HeroProps {
  onNavigate: (page: PublicPage) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative bg-[#F4F1EA] border-b border-stone-200 overflow-hidden">
      {/* Decorative subtle background shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EAE4D7]/50 -skew-x-12 transform origin-top-right pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-stone-300 text-stone-700 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Summer Daily Pret & Festive Lawn '26
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-stone-900 leading-[1.15] tracking-tight">
              Modern Pakistani Fashion for Everyday Elegance.
            </h1>

            <p className="text-stone-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Breathable pure cotton lawns, relaxed stitched kurtis, and timeless 2-piece coordinates designed for comfort, craft, and effortless daily style.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                id="hero-shop-now-btn"
                onClick={() => onNavigate('shop')}
                className="px-7 py-3.5 rounded-full bg-stone-900 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-stone-800 active:scale-95 transition-all shadow-md flex items-center gap-2"
              >
                Shop All Dresses
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-new-arrivals-btn"
                onClick={() => onNavigate('new-arrivals')}
                className="px-6 py-3.5 rounded-full bg-white text-stone-800 border border-stone-300 font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-stone-50 active:scale-95 transition-all"
              >
                Explore New Arrivals
              </button>

              <button
                id="hero-sale-btn"
                onClick={() => onNavigate('sale')}
                className="px-5 py-3.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-red-100 active:scale-95 transition-all"
              >
                Seasonal Sale
              </button>
            </div>

            {/* Mini Trust Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-300/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <span className="block font-bold text-stone-900 text-base sm:text-lg">100%</span>
                <span className="text-[11px] sm:text-xs text-stone-500">Pure Local Cotton</span>
              </div>
              <div>
                <span className="block font-bold text-stone-900 text-base sm:text-lg">Nationwide</span>
                <span className="text-[11px] sm:text-xs text-stone-500">Cash on Delivery</span>
              </div>
              <div>
                <span className="block font-bold text-stone-900 text-base sm:text-lg">7-Day</span>
                <span className="text-[11px] sm:text-xs text-stone-500">Easy Exchange</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              
              {/* Main Dress Image */}
              <div className="aspect-3/4 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80"
                  alt="Pakistani Stitched Dress"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Floating Badge Card 1 */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-stone-200 max-w-[200px]">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C6D3B]">
                  Featured Collection
                </div>
                <div className="text-xs font-serif font-bold text-stone-900 mt-0.5">
                  Schiffli Pret '26
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5 font-medium">
                  Starting from Rs. 2,690
                </div>
              </div>

              {/* Floating Badge Card 2 */}
              <div className="absolute top-6 -right-4 sm:-right-6 bg-stone-900 text-white p-3 rounded-xl shadow-lg text-center">
                <div className="text-lg font-bold text-[#D4AF37]">
                  FREE
                </div>
                <div className="text-[10px] uppercase font-semibold text-stone-300">
                  Shipping &gt; 5K
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Promotional Value Strips */}
      <div className="bg-white border-t border-stone-200 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs text-stone-600">
          <div className="flex items-center gap-2 font-medium">
            <Truck className="w-4 h-4 text-[#8C6D3B]" />
            <span>Fast Dispatch via TCS & Leopards (2-4 Days)</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Guaranteed Color-fast & Pure Fabrics</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <RefreshCw className="w-4 h-4 text-stone-500" />
            <span>Easy Exchanges at Lahore & Karachi Outlets</span>
          </div>
        </div>
      </div>
    </div>
  );
};
