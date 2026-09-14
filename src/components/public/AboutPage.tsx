import React from 'react';
import { Sparkles, ShieldCheck, Heart, Users, MapPin, Truck } from 'lucide-react';
import { PublicPage } from '../../types';

interface AboutPageProps {
  onNavigate: (page: PublicPage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Hero Intro */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-[#8C6D3B] uppercase">
          Our Craft & Story
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 tracking-tight">
          Redefining Everyday Pakistani Pret.
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
          RAWAN was founded with a straightforward mission: to craft modern, effortless, and breathable clothing for women across Pakistan without compromising on craft, silhouette, or fabric purity.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
        <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-md bg-stone-100 border border-stone-200">
          <img
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80"
            alt="Artisan fabric work"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
            From Faisalabad Weaves to Contemporary Cuts
          </h3>
          <p>
            Every meter of our signature lawn and cambric cotton is spun and woven by historic textile mills in Faisalabad and Multan. We celebrate indigenous handcraft—schiffli eyelets, delicate marodi needlework, and block motifs—reimagined into clean, relaxed tunics that suit today's busy lifestyles.
          </p>
          <p>
            Whether you are heading to university, running morning errands, or attending a festive evening dawat, our pieces are cut for ease, breathability, and timeless longevity.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-200">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-[#8C6D3B]" />
          </div>
          <h4 className="font-serif font-bold text-base text-stone-900">100% Pure Lawn</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Zero synthetic polyester blending in our everyday lawn. Guaranteed skin-friendly and breathable for Pakistani summer heat.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5 text-red-600" />
          </div>
          <h4 className="font-serif font-bold text-base text-stone-900">Fair Artisan Wages</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Our master tailors and female hand-embroidery clusters in rural Punjab receive dignified compensation and respectful working environments.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5 text-emerald-700" />
          </div>
          <h4 className="font-serif font-bold text-base text-stone-900">Nationwide Reach</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            From Karachi to Gilgit, our courier network brings modern Pakistani fashion directly to your doorstep with Cash on Delivery.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-8">
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 rounded-full bg-stone-900 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-stone-800 transition-all shadow-md"
        >
          Explore the Latest Collection
        </button>
      </div>

    </div>
  );
};
