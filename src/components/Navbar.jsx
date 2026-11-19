import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Shield, Phone, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalCount, openCart } = useCart();
  const location = useLocation();

  // Glassmorphism scroll elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route / hash change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  // Handle ESC key and lock body scroll on mobile drawer open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Candles', path: '/candles' },
    { name: 'Resin Art', path: '/resin-art' },
    { name: '3D Gallery', path: '/#gallery' },
    { name: 'Bulk Orders', path: '/#bulk-orders' },
    { name: 'Tree & Plants', path: '/plants' },
    { name: 'About Us', path: '/about' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/#contact' },
    { name: 'Admin', path: '/admin', isPill: true }
  ];

  const handleLinkClick = (path) => {
    setIsOpen(false);
    if (path.includes('#')) {
      const hash = path.split('#')[1];
      if (location.pathname === '/') {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = '/' + '#' + hash;
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 w-full ${
        scrolled
          ? 'bg-amoura-ivory/95 backdrop-blur-md shadow-soft border-b border-amoura-border'
          : 'bg-amoura-ivory border-b border-amoura-border/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">

          {/* 1. Brand Logo & Name (Always single-line, zero awkward wrapping) */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group select-none"
            aria-label="Amoura Crafts Home"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full overflow-hidden border border-amoura-sage/40 group-hover:border-amoura-forest transition-colors shadow-sm bg-amoura-cream flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="Amoura Crafts Logo"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg';
                }}
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-serif text-base sm:text-xl lg:text-2xl font-bold tracking-wider text-amoura-charcoal group-hover:text-amoura-forest transition-colors whitespace-nowrap leading-none">
                AMOURA CRAFTS
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-amoura-muted font-medium whitespace-nowrap leading-none mt-1 hidden md:block">
                Artisanal Studio • India
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation Menu (Horizontal flex, responsive gap, no multi-line wrapping) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden xl:flex items-center flex-nowrap gap-1.5 xl:gap-2 2xl:gap-3.5 flex-shrink-1 min-w-0"
          >
            {navLinks.map((link) => {
              const isHash = link.path.includes('#');
              const isActive = !isHash && location.pathname === link.path;

              if (isHash) {
                return (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.path)}
                    className="whitespace-nowrap text-[11px] xl:text-[11.5px] 2xl:text-xs uppercase tracking-wider font-medium text-amoura-charcoal/80 hover:text-amoura-forest hover:bg-amoura-cream/60 px-2 py-1.5 rounded transition-all cursor-pointer flex-shrink-0"
                  >
                    {link.name}
                  </button>
                );
              }

              if (link.isPill) {
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] xl:text-xs font-semibold bg-amoura-cream border border-amoura-border text-amoura-forest hover:bg-amoura-forest hover:text-amoura-ivory transition-all shadow-sm whitespace-nowrap flex-shrink-0 ml-1"
                    title="Artisan Admin Dashboard"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`whitespace-nowrap text-[11px] xl:text-[11.5px] 2xl:text-xs uppercase tracking-wider font-medium px-2 py-1.5 rounded transition-all flex-shrink-0 ${
                    isActive
                      ? 'text-amoura-forest font-bold border-b-2 border-amoura-forest bg-amoura-cream/40'
                      : 'text-amoura-charcoal/80 hover:text-amoura-forest hover:bg-amoura-cream/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* 3. Action Area: Shopping Bag & Mobile Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="relative p-2 sm:p-2.5 rounded-full bg-amoura-cream border border-amoura-border hover:border-amoura-forest text-amoura-charcoal hover:text-amoura-forest transition-all group shadow-sm cursor-pointer flex-shrink-0"
              aria-label={`Shopping Bag with ${totalCount} items`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-5 px-1 bg-amoura-forest text-amoura-ivory text-[10px] sm:text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile / Tablet Menu Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2 sm:p-2.5 rounded-xl bg-amoura-cream border border-amoura-border text-amoura-charcoal hover:text-amoura-forest transition-colors flex-shrink-0 cursor-pointer"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close Menu' : 'Open Navigation Menu'}
            >
              {isOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* 4. Backdrop Overlay for Mobile Drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 top-[calc(4rem+1.5rem)] sm:top-[calc(4.5rem+2rem)] bg-amoura-charcoal/30 backdrop-blur-xs z-30 xl:hidden animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* 5. Mobile & Tablet Slide-Down Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="xl:hidden bg-amoura-ivory/98 border-b border-amoura-border shadow-elevated backdrop-blur-xl relative z-40 animate-fadeIn"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-4">
            
            {/* Quick Badge */}
            <div className="flex items-center justify-between pb-2 border-b border-amoura-border/60 text-xs text-amoura-muted">
              <span className="flex items-center gap-1.5 font-serif italic text-amoura-forest">
                <Sparkles className="w-3.5 h-3.5 text-amoura-terracotta" />
                Handcrafted Luxury Studio
              </span>
              <span>Navigation Menu</span>
            </div>

            {/* Navigation List with Accessible Tap Targets (>= 44px) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {navLinks.map((link) => {
                const isHash = link.path.includes('#');
                const isActive = !isHash && location.pathname === link.path;

                if (isHash) {
                  return (
                    <button
                      key={link.name}
                      onClick={() => handleLinkClick(link.path)}
                      className="w-full text-left px-3.5 py-3 rounded-lg text-sm font-medium text-amoura-charcoal hover:bg-amoura-cream hover:text-amoura-forest transition-colors flex items-center justify-between min-h-[44px]"
                    >
                      <span>{link.name}</span>
                      <span className="text-amoura-sage text-xs">→</span>
                    </button>
                  );
                }

                if (link.isPill) {
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="col-span-1 sm:col-span-2 flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-bold text-amoura-forest bg-amoura-cream border border-amoura-border mt-1 shadow-sm min-h-[44px]"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amoura-forest" />
                        {link.name} Portal (Admin Login)
                      </span>
                      <span className="text-[11px] bg-amoura-forest text-amoura-ivory px-2.5 py-0.5 rounded-full font-semibold">
                        Enter
                      </span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-3.5 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between min-h-[44px] ${
                      isActive
                        ? 'bg-amoura-cream text-amoura-forest font-bold border-l-4 border-amoura-forest shadow-xs'
                        : 'text-amoura-charcoal hover:bg-amoura-cream hover:text-amoura-forest'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span className="text-amoura-sage text-xs">→</span>
                  </Link>
                );
              })}
            </div>

            {/* Direct WhatsApp Concierge in Menu */}
            <div className="pt-3 border-t border-amoura-border/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <span className="text-amoura-muted">Need custom sizes or bulk favors?</span>
              <a
                href="https://wa.me/918700689036"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-amoura-forest hover:text-amoura-terracotta bg-amoura-cream/60 px-3 py-1.5 rounded-lg border border-amoura-border min-h-[40px]"
              >
                <Phone className="w-3.5 h-3.5" />
                WhatsApp: +91 87006 89036
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
