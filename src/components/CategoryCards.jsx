import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Flame, Sparkles, Box, Leaf, Gift } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

const CATEGORIES = [
  {
    id: 'candles',
    title: 'Handmade Candles',
    desc: 'Pure soy wax jars, royal floral urlis & aromatherapy pillars',
    count: '33+ Creations',
    image: '/images/thumbs/img_19.webp',
    icon: Flame,
    link: '/candles',
    accent: 'bg-amoura-cream text-amoura-forest'
  },
  {
    id: 'resin',
    title: 'Resin Art',
    desc: 'Auspicious pooja trays, crystal-clear plates & wall art',
    count: '5+ Artworks',
    image: '/images/thumbs/img_20.webp',
    icon: Sparkles,
    link: '/resin-art',
    accent: 'bg-amoura-cream text-amoura-forest'
  },
  {
    id: '3d',
    title: '3D Creations',
    desc: 'Interactive 360-degree virtual craftsmanship showcase',
    count: '8 Virtual Models',
    image: '/images/3d/gallery_3d_1.webp',
    icon: Box,
    link: '/#gallery',
    accent: 'bg-amoura-cream text-amoura-forest'
  },
  {
    id: 'plants',
    title: 'Tree & Plants',
    desc: 'Preserved botanical earrings, coasters & nature decor',
    count: '4+ Botanical Items',
    image: '/images/thumbs/img_21.webp',
    icon: Leaf,
    link: '/plants',
    accent: 'bg-amoura-cream text-amoura-forest'
  },
  {
    id: 'gifts',
    title: 'Customized Gifts',
    desc: 'Personalized shades, wedding favors & corporate gifting',
    count: 'Bespoke Orders',
    image: '/images/thumbs/img_22.webp',
    icon: Gift,
    isWhatsApp: true,
    accent: 'bg-amoura-cream text-amoura-terracotta'
  }
];

export default function CategoryCards() {
  return (
    <section id="categories" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
        <div>
          <span className="text-xs uppercase tracking-widest text-amoura-sage-dark font-bold block mb-1">
            Curated Artisanal Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-amoura-charcoal">
            Explore by Category
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-amoura-muted max-w-md">
          Each piece is individually hand-poured and crafted with botanical ingredients in our dedicated artisan studio.
        </p>
      </div>

      {/* Categories Grid (2 col mobile, 3 col tablet, 5 col desktop or responsive layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;

          const content = (
            <div className="group relative bg-white border border-amoura-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated hover:border-amoura-sage transition-all duration-300 flex flex-col h-full cursor-pointer">
              
              {/* Media Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-amoura-cream">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-106 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg';
                  }}
                />
                
                {/* Floating Category Pill */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-amoura-forest border border-amoura-border shadow-sm flex items-center gap-1">
                  <Icon className="w-3 h-3 text-amoura-sage-dark" />
                  {cat.count}
                </span>

                <span className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/95 border border-amoura-border flex items-center justify-center text-amoura-charcoal group-hover:bg-amoura-forest group-hover:text-amoura-ivory transition-colors shadow-sm">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              {/* Text Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-amoura-charcoal group-hover:text-amoura-forest transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-amoura-muted mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

            </div>
          );

          if (cat.isWhatsApp) {
            return (
              <div
                key={cat.id}
                onClick={() => openWhatsApp('Hi Amoura Crafts! I am interested in custom gifting & wedding favors. Please share your options! ✨')}
              >
                {content}
              </div>
            );
          }

          if (cat.link.includes('#')) {
            return (
              <a
                key={cat.id}
                href={cat.link}
                onClick={(e) => {
                  e.preventDefault();
                  const hash = cat.link.split('#')[1];
                  const el = document.getElementById(hash);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={cat.id} to={cat.link}>
              {content}
            </Link>
          );
        })}
      </div>

    </section>
  );
}
