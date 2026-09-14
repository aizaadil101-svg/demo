import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  Tag,
  ArrowRight
} from 'lucide-react';
import { PublicPage } from '../../types';

interface NavbarProps {
  currentPage: PublicPage;
  onNavigate: (page: PublicPage) => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  saleCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  saleCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks: { id: PublicPage; label: string; highlight?: boolean }[] = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop All' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'sale', label: 'Sale', highlight: true },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleLinkClick = (page: PublicPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* Top Customer Announcement Bar */}
      <div className="bg-[#2D3B36] text-[#FAF8F5] text-[11px] sm:text-xs py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-3">
        <span>✨ Free Nationwide Shipping on Orders Above Rs. 5,000</span>
        <span className="hidden sm:inline text-white/40">|</span>
        <span className="hidden sm:inline">Cash on Delivery (COD) Available All Over Pakistan</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Mobile menu trigger */}
          <button
            id="public-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-stone-700 hover:text-stone-900"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo - Clean, Modern Pakistani Fashion Brand */}
          <div 
            onClick={() => onNavigate('home')}
            className="cursor-pointer flex flex-col items-center md:items-start"
          >
            <span className="text-2xl sm:text-3xl font-serif font-extrabold tracking-[0.22em] text-stone-900 uppercase">
              RAWAN
            </span>
            <span className="text-[9px] tracking-[0.35em] text-stone-500 uppercase -mt-0.5 font-medium">
              Contemporary Pakistani Pret
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative text-xs uppercase tracking-wider font-semibold py-1 transition-colors ${
                    link.highlight
                      ? 'text-red-700 hover:text-red-800'
                      : isActive
                      ? 'text-stone-900'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {link.label}
                  {link.highlight && saleCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] font-bold bg-red-600 text-white rounded-full">
                      Sale
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Search & Cart (Strictly Customer-Facing, NO Admin buttons!) */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Input on Desktop */}
            <div className="relative hidden lg:block w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="public-search-desktop"
                type="text"
                placeholder="Search kurtis, 2-piece..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentPage !== 'shop') onNavigate('shop');
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-100/80 border border-stone-200 rounded-full focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400 text-stone-800 placeholder:text-stone-400"
              />
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Shopping Cart Button */}
            <button
              id="public-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full bg-stone-900 text-white hover:bg-stone-800 active:scale-95 transition-all text-xs font-medium"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-[#D4AF37] text-stone-950 font-bold text-[11px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {searchOpen && (
          <div className="py-2 pb-3 lg:hidden border-t border-stone-100 animate-fadeIn">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="public-search-mobile"
                type="text"
                placeholder="Search embroidered kurtis, lawn suits, pret..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentPage !== 'shop') onNavigate('shop');
                }}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-lg text-stone-800"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                currentPage === link.id
                  ? 'bg-stone-100 text-stone-950 font-bold'
                  : link.highlight
                  ? 'text-red-700 hover:bg-red-50'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>{link.label}</span>
              {link.highlight && (
                <span className="text-[10px] px-2 py-0.5 bg-red-600 text-white rounded-full font-bold">
                  SALE
                </span>
              )}
            </button>
          ))}

          <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 px-3 space-y-1">
            <div>Call/WhatsApp Support: <strong>+92 300 1234567</strong></div>
            <div>Nationwide Cash on Delivery Available</div>
          </div>
        </div>
      )}
    </header>
  );
};
