import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, Check } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setMessage('');
      setSubmitted(false);
    }, 3500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-[#8C6D3B] uppercase">
          Customer Care
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 tracking-tight">
          We'd Love to Hear From You
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
          Questions about sizing, custom alterations, tracking an order, or retail store visits? Reach out to our boutique support team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Contact Cards */}
        <div className="md:col-span-5 space-y-4">
          
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-stone-900">WhatsApp & Phone Care</h4>
                <p className="text-xs text-stone-500">Mon - Sat: 10:00 AM - 9:00 PM PKT</p>
              </div>
            </div>
            <div className="text-xs font-semibold text-stone-900 pt-1">
              +92 300 1234567 / +92 42 35789012
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-stone-900">Email Inquiries</h4>
                <p className="text-xs text-stone-500">Order tracking & assistance</p>
              </div>
            </div>
            <div className="text-xs font-semibold text-stone-900 pt-1">
              care@rawan.pk
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800">
                <MapPin className="w-5 h-5 text-[#8C6D3B]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-stone-900">Flagship Outlets</h4>
                <p className="text-xs text-stone-500">Visit us in person</p>
              </div>
            </div>
            <ul className="text-xs text-stone-600 space-y-1.5 pt-1">
              <li><strong>Lahore:</strong> Gulberg Galleria, Main Boulevard</li>
              <li><strong>Karachi:</strong> Dolmen Mall Clifton, 2nd Floor</li>
              <li><strong>Islamabad:</strong> Beverly Centre, Blue Area</li>
            </ul>
          </div>

        </div>

        {/* Right Contact Form */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
          <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">
            Send Us a Message
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Fill in your details below and our customer representative will respond within 24 hours.
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-emerald-900 text-lg">Message Sent!</h4>
              <p className="text-xs text-emerald-800">
                Shukriya for contacting us. Our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zainab Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Mobile Number / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Your Message or Order Question *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you with our dresses, sizes, or deliveries?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-stone-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-98"
              >
                <Send className="w-4 h-4 text-[#D4AF37]" />
                Send Inquiry
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
