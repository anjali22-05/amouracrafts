import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, ShieldCheck, Sparkles, Truck, Leaf } from 'lucide-react';
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
    <footer className="bg-amoura-cream border-t border-amoura-border text-amoura-charcoal">
      
      {/* Trust Badges Bar */}
      <div className="border-b border-amoura-border/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-amoura-border flex items-center justify-center text-amoura-forest shadow-sm">
              <Leaf className="w-5 h-5 text-amoura-sage-dark" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-amoura-charcoal">100% Pure Soy Wax</h4>
              <p className="text-xs text-amoura-muted">Clean burning, toxin-free &amp; smokeless</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-amoura-border flex items-center justify-center text-amoura-forest shadow-sm">
              <Truck className="w-5 h-5 text-amoura-forest" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-amoura-charcoal">Free Shipping Above ₹1,000</h4>
              <p className="text-xs text-amoura-muted">Safe, double-cushioned delivery across India</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-amoura-border flex items-center justify-center text-amoura-forest shadow-sm">
              <ShieldCheck className="w-5 h-5 text-amoura-forest" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-amoura-charcoal">Secure UPI &amp; Instant Verification</h4>
              <p className="text-xs text-amoura-muted">Fast dispatch with automated PDF invoices</p>
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
                className="w-10 h-10 rounded-full border border-amoura-border object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg';
                }}
              />
              <span className="font-serif text-2xl font-bold tracking-wider text-amoura-charcoal">
                AMOURA CRAFTS
              </span>
            </div>
            <p className="text-xs leading-relaxed text-amoura-muted">
              An artisan luxury studio crafting exquisite organic soy candles, festive urli centerpieces, bespoke resin keepsakes, and botanical decor to infuse your home with warmth and aroma.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/craftsamoura"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-amoura-border flex items-center justify-center text-amoura-charcoal hover:text-amoura-forest hover:border-amoura-forest transition-colors shadow-sm"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@craftsamoura"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-amoura-border flex items-center justify-center text-amoura-charcoal hover:text-amoura-forest hover:border-amoura-forest transition-colors shadow-sm"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1CJcVrPDrr/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-amoura-border flex items-center justify-center text-amoura-charcoal hover:text-amoura-forest hover:border-amoura-forest transition-colors shadow-sm"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amoura-forest mb-4">
              Our Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-amoura-charcoal/85">
              <li>
                <Link to="/candles" className="hover:text-amoura-forest transition-colors">
                  Artisan Soy Candles
                </Link>
              </li>
              <li>
                <Link to="/resin-art" className="hover:text-amoura-forest transition-colors">
                  Bespoke Resin Art &amp; Trays
                </Link>
              </li>
              <li>
                <Link to="/plants" className="hover:text-amoura-forest transition-colors">
                  Botanical Plants &amp; Accessories
                </Link>
              </li>
              <li>
                <a href="/#gallery" className="hover:text-amoura-forest transition-colors">
                  3D Virtual Showcase
                </a>
              </li>
              <li>
                <button
                  onClick={() => openWhatsApp('Hi Amoura Crafts! We are interested in your candles for wedding favors & corporate gifting. Please share your catalog!')}
                  className="hover:text-amoura-forest transition-colors text-left cursor-pointer"
                >
                  Bulk &amp; Corporate Gifting
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amoura-forest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-amoura-charcoal/85">
              <li>
                <Link to="/about" className="hover:text-amoura-forest transition-colors">
                  Our Story &amp; Craftsmanship
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-amoura-forest transition-colors">
                  Customer Reviews &amp; Ratings
                </Link>
              </li>
              <li>
                <button
                  onClick={() => openWhatsApp('Hi Amoura Crafts! I would like to track my recent order.')}
                  className="hover:text-amoura-forest transition-colors text-left cursor-pointer"
                >
                  Track an Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => openWhatsApp('Hi Amoura Crafts! Could you please share details about your return & replacement policy?')}
                  className="hover:text-amoura-forest transition-colors text-left cursor-pointer"
                >
                  Shipping &amp; Return Policy
                </button>
              </li>
              <li>
                <Link to="/admin" className="text-amoura-forest hover:underline font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amoura-forest mb-4">
              Studio &amp; Inquiries
            </h4>
            <div className="space-y-3 text-xs text-amoura-charcoal/85">
              <a
                href="https://wa.me/918700689036"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-amoura-forest transition-colors"
              >
                <Phone className="w-4 h-4 text-amoura-sage-dark mt-0.5 flex-shrink-0" />
                <span>+91 87006 89036 (WhatsApp &amp; Support)</span>
              </a>
              <a
                href="mailto:craftsamoura@gmail.com"
                className="flex items-start gap-2.5 hover:text-amoura-forest transition-colors"
              >
                <Mail className="w-4 h-4 text-amoura-sage-dark mt-0.5 flex-shrink-0" />
                <span>craftsamoura@gmail.com</span>
              </a>
              <p className="text-amoura-muted text-[11px] pt-1">
                Mon – Sat: 10:00 AM – 8:00 PM IST.<br />
                Pan-India delivery across all postal codes.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-amoura-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amoura-muted">
          <p>© {new Date().getFullYear()} Amoura Crafts. All rights reserved.</p>
          <p className="flex items-center gap-1 text-amoura-charcoal">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-amoura-terracotta fill-amoura-terracotta" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
