import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Shield, Sparkles, MessageCircle } from 'lucide-react';
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Candles', path: '/candles' },
    { name: 'Resin Art', path: '/resin-art' },
    { name: 'Plants & Decor', path: '/plants' },
    { name: '3D Gallery', path: '/#gallery' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/#contact' },
    { name: 'Admin', path: '/admin', highlight: true }
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
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-amoura-bg/95 backdrop-blur-md shadow-lg shadow-black/40 border-b border-amoura-line' 
        : 'bg-amoura-bg border-b border-amoura-line/60'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amoura-gold/50 group-hover:border-amoura-gold transition-all duration-300 shadow-gold-glow">
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
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-amoura-cream group-hover:text-amoura-gold-light transition-colors">
                AMOURA CRAFTS
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amoura-gold font-medium">
                Handcrafted Luxury Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const isHash = link.path.includes('#');
              const isActive = !isHash && location.pathname === link.path;

              if (isHash) {
                return (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.path)}
                    className="text-sm font-medium text-amoura-cream-dim hover:text-amoura-gold transition-colors tracking-wide cursor-pointer"
                  >
                    {link.name}
                  </button>
                );
              }

              if (link.highlight) {
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amoura-gold/10 text-amoura-gold border border-amoura-gold/30 hover:bg-amoura-gold hover:text-amoura-bg transition-all duration-200 shadow-sm"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    {link.name}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors tracking-wide ${
                    isActive
                      ? 'text-amoura-gold font-semibold border-b-2 border-amoura-gold pb-1'
                      : 'text-amoura-cream-dim hover:text-amoura-gold'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Cart & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full bg-amoura-card border border-amoura-line hover:border-amoura-gold text-amoura-cream hover:text-amoura-gold transition-all duration-200 group shadow-md"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-amoura-gold-light group-hover:scale-110 transition-transform" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-gradient-to-r from-amoura-gold to-amoura-gold-dark text-amoura-bg text-[11px] font-bold rounded-full flex items-center justify-center shadow-gold-glow animate-bounce">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg bg-amoura-card border border-amoura-line text-amoura-cream hover:text-amoura-gold transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-amoura-bg/98 border-b border-amoura-line px-4 pt-4 pb-6 space-y-3 shadow-2xl backdrop-blur-xl animate-fadeIn">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const isHash = link.path.includes('#');
              const isActive = !isHash && location.pathname === link.path;

              if (isHash) {
                return (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.path)}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-amoura-cream-dim hover:bg-amoura-card hover:text-amoura-gold transition-all"
                  >
                    {link.name}
                  </button>
                );
              }

              if (link.highlight) {
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-amoura-gold bg-amoura-gold/10 border border-amoura-gold/30 mt-2"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      {link.name} Panel
                    </span>
                    <span className="text-xs bg-amoura-gold text-amoura-bg px-2 py-0.5 rounded font-bold">Portal</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amoura-card text-amoura-gold font-bold border-l-4 border-amoura-gold'
                      : 'text-amoura-cream-dim hover:bg-amoura-card hover:text-amoura-gold'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-amoura-line/60 flex items-center justify-between text-xs text-amoura-muted">
            <span className="flex items-center gap-1.5 text-amoura-gold">
              <Sparkles className="w-3.5 h-3.5" /> Handcrafted with Love
            </span>
            <a
              href="https://wa.me/918700689036"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-amoura-cream-dim hover:text-amoura-gold"
            >
              <MessageCircle className="w-3.5 h-3.5 text-green-500" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
