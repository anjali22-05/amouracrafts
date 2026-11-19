import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-amoura-dark border-t border-amoura-line text-amoura-subtext transition-colors">
      {/* Trust Badges Bar */}
      <div className="border-b border-amoura-line/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amoura-card border border-amoura-line flex items-center justify-center text-amoura-gold shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-amoura-cream">100% Pure Soy Wax</h4>
              <p className="text-xs text-amoura-muted">Clean burning, toxin-free & smoke-less</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amoura-card border border-amoura-line flex items-center justify-center text-amoura-gold shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-amoura-cream">Free Shipping Above ₹1,000</h4>
              <p className="text-xs text-amoura-muted">Safe, double-cushioned delivery across India</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amoura-card border border-amoura-line flex items-center justify-center text-amoura-gold shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-amoura-cream">Secure UPI & Instant Orders</h4>
              <p className="text-xs text-amoura-muted">Fast verification & automated PDF invoices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Amoura Crafts"
                className="w-10 h-10 rounded-full border border-amoura-gold/50 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg';
                }}
              />
              <span className="font-display text-xl font-bold tracking-wider text-amoura-cream">
                AMOURA CRAFTS
              </span>
            </div>
            <p className="text-xs leading-relaxed text-amoura-subtext">
              An artisan luxury studio crafting exquisite organic soy candles, festive urli centerpieces, bespoke resin keepsakes, and botanical decor to infuse your home with warmth and aroma.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/craftsamoura"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-amoura-card border border-amoura-line flex items-center justify-center text-amoura-cream hover:text-amoura-gold hover:border-amoura-gold transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@craftsamoura"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-amoura-card border border-amoura-line flex items-center justify-center text-amoura-cream hover:text-amoura-gold hover:border-amoura-gold transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1CJcVrPDrr/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-amoura-card border border-amoura-line flex items-center justify-center text-amoura-cream hover:text-amoura-gold hover:border-amoura-gold transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amoura-gold mb-4">
              Our Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/candles" className="hover:text-amoura-gold transition-colors">
                  Artisan Soy Candles
                </Link>
              </li>
              <li>
                <Link to="/resin-art" className="hover:text-amoura-gold transition-colors">
                  Bespoke Resin Art & Trays
                </Link>
              </li>
              <li>
                <Link to="/plants" className="hover:text-amoura-gold transition-colors">
                  Botanical Plants & Accessories
                </Link>
              </li>
              <li>
                <a href="/#gallery" className="hover:text-amoura-gold transition-colors">
                  3D Virtual Gallery
                </a>
              </li>
              <li>
                <button
                  onClick={() => openWhatsApp('Hi Amoura Crafts! We are interested in your candles for wedding favors & corporate gifting. Please share your catalog!')}
                  className="hover:text-amoura-gold transition-colors text-left"
                >
                  Bulk & Corporate Gifting
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amoura-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-amoura-gold transition-colors">
                  Our Story & Craftsmanship
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-amoura-gold transition-colors">
                  Customer Reviews & Ratings
                </Link>
              </li>
              <li>
                <button
                  onClick={() => openWhatsApp('Hi Amoura Crafts! I would like to track my recent order.')}
                  className="hover:text-amoura-gold transition-colors text-left"
                >
                  Track an Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => openWhatsApp('Hi Amoura Crafts! Could you please share details about your return & replacement policy?')}
                  className="hover:text-amoura-gold transition-colors text-left"
                >
                  Shipping & Return Policy
                </button>
              </li>
              <li>
                <Link to="/admin" className="text-amoura-gold hover:underline font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amoura-gold mb-4">
              Connect With Us
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href="https://wa.me/918700689036"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-amoura-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-amoura-gold mt-0.5 flex-shrink-0" />
                <span>+91 87006 89036 (WhatsApp & Call)</span>
              </a>
              <a
                href="mailto:craftsamoura@gmail.com"
                className="flex items-start gap-2.5 hover:text-amoura-gold transition-colors"
              >
                <Mail className="w-4 h-4 text-amoura-gold mt-0.5 flex-shrink-0" />
                <span>craftsamoura@gmail.com</span>
              </a>
              <p className="text-amoura-muted text-[11px] pt-2">
                Available Mon – Sat: 10:00 AM – 8:00 PM IST.<br />
                Fast delivery across all pin codes in India.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-amoura-line/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amoura-muted">
          <p>© {new Date().getFullYear()} Amoura Crafts. All rights reserved.</p>
          <p className="flex items-center gap-1 text-amoura-cream-dim">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
