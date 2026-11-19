import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Shield, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalCount, openCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/' + '#' + hash;
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-amoura-ivory/95 backdrop-blur-md shadow-soft border-b border-amoura-border'
          : 'bg-amoura-ivory border-b border-amoura-border/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amoura-sage/40 group-hover:border-amoura-forest transition-colors shadow-sm bg-amoura-cream flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="Amoura Crafts"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-amoura-charcoal group-hover:text-amoura-forest transition-colors">
                AMOURA CRAFTS
              </span>
              <span className="text-[10px] uppercase tracking-widest text-amoura-muted font-medium">
                Artisanal Studio • India
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => {
              const isHash = link.path.includes('#');
              const isActive = !isHash && location.pathname === link.path;

              if (isHash) {
                return (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.path)}
                    className="text-xs uppercase tracking-wider font-medium text-amoura-charcoal/80 hover:text-amoura-forest transition-colors cursor-pointer py-1"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amoura-cream border border-amoura-border text-amoura-forest hover:bg-amoura-forest hover:text-amoura-ivory transition-all shadow-sm"
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
                  className={`text-xs uppercase tracking-wider font-medium transition-all py-1 ${
                    isActive
                      ? 'text-amoura-forest font-bold border-b-2 border-amoura-forest'
                      : 'text-amoura-charcoal/80 hover:text-amoura-forest'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Cart & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full bg-amoura-cream border border-amoura-border hover:border-amoura-forest text-amoura-charcoal hover:text-amoura-forest transition-all group shadow-sm cursor-pointer"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-amoura-forest text-amoura-ivory text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2.5 rounded-xl bg-amoura-cream border border-amoura-border text-amoura-charcoal hover:text-amoura-forest transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-amoura-ivory/98 border-b border-amoura-border px-5 pt-3 pb-6 space-y-2 shadow-elevated backdrop-blur-xl animate-fadeIn">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const isHash = link.path.includes('#');
              const isActive = !isHash && location.pathname === link.path;

              if (isHash) {
                return (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.path)}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-amoura-charcoal hover:bg-amoura-cream hover:text-amoura-forest transition-colors"
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
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-amoura-forest bg-amoura-cream border border-amoura-border mt-2"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amoura-forest" />
                      {link.name} Portal
                    </span>
                    <span className="text-[11px] bg-amoura-forest text-amoura-ivory px-2 py-0.5 rounded font-semibold">
                      Login
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amoura-cream text-amoura-forest font-bold border-l-4 border-amoura-forest'
                      : 'text-amoura-charcoal hover:bg-amoura-cream hover:text-amoura-forest'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-amoura-border flex items-center justify-between text-xs text-amoura-muted">
            <span className="font-serif italic text-amoura-forest">Handcrafted in India</span>
            <a
              href="https://wa.me/918700689036"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold text-amoura-forest hover:text-amoura-terracotta"
            >
              <MessageCircle className="w-3.5 h-3.5 text-amoura-forest" />
              WhatsApp Support
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
