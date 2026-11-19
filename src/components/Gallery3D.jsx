import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';

const GALLERY_ITEMS = [
  { id: 1, img: '/images/3d/gallery_3d_1.webp', title: 'Royal Floral Urli Diya', desc: 'Handcrafted with golden metallic wicks & dried red rose petals' },
  { id: 2, img: '/images/3d/gallery_3d_2.webp', title: 'Aurelia Bloom Soy Candle', desc: 'Scented organic French vanilla with amber flakes' },
  { id: 3, img: '/images/3d/gallery_3d_3.webp', title: 'Mayura Twin Peacock Candle', desc: 'Traditional royal festive centerpiece with 5-wick panchdeep' },
  { id: 4, img: '/images/3d/gallery_3d_4.webp', title: 'Ocean Shell Pearl Candle', desc: 'Natural sea shell infused with refreshing ocean breeze aroma' },
  { id: 5, img: '/images/3d/gallery_3d_5.webp', title: 'Shree Ganesha Resin Urli', desc: 'Auspicious pooja centerpiece with clear crystal resin base' },
  { id: 6, img: '/images/3d/gallery_3d_6.webp', title: 'Velvet Heart Luxe Candle', desc: 'Romantic floral bouquet wax melt with jasmine essential oils' },
  { id: 7, img: '/images/3d/gallery_3d_7.webp', title: 'Sunshine Bloom Floral Diya', desc: 'Golden marigold botanicals embedded in pure soy wax' },
  { id: 8, img: '/images/3d/gallery_3d_8.webp', title: 'Gulnaar Floral Urli Candle', desc: 'Hand-poured luxury festive brass finish urli candle' }
];

export default function Gallery3D() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? GALLERY_ITEMS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === GALLERY_ITEMS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="py-16 bg-amoura-bg border-t border-amoura-line relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-amoura-gold font-bold inline-flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Virtual 3D Showcase
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-amoura-cream">
            Artisan Studio Creations
          </h2>
          <p className="text-xs sm:text-sm text-amoura-subtext mt-2">
            Explore 360-degree intricate details of our royal urns, festive panchdeep candles, and crystalline resin art.
          </p>
        </div>

        {/* Carousel Presentation */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border border-amoura-line bg-amoura-card shadow-2xl group">
            <img
              src={GALLERY_ITEMS[currentIndex].img}
              alt={GALLERY_ITEMS[currentIndex].title}
              className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-amoura-dark/90 via-transparent to-transparent pointer-events-none" />

            {/* Slide Info */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-amoura-gold font-bold block mb-1">
                  Exquisite Craftsmanship • {currentIndex + 1} / {GALLERY_ITEMS.length}
                </span>
                <h3 className="font-display text-lg sm:text-2xl font-bold text-amoura-cream">
                  {GALLERY_ITEMS[currentIndex].title}
                </h3>
                <p className="text-xs text-amoura-subtext max-w-md mt-1 hidden sm:block">
                  {GALLERY_ITEMS[currentIndex].desc}
                </p>
              </div>

              <button
                onClick={() => setFullscreenImage(GALLERY_ITEMS[currentIndex])}
                className="p-3 rounded-xl bg-amoura-card/80 border border-amoura-line hover:border-amoura-gold text-amoura-cream hover:text-amoura-gold transition-colors backdrop-blur-md"
                title="View Fullscreen"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amoura-card/90 border border-amoura-line hover:border-amoura-gold text-amoura-cream hover:text-amoura-gold flex items-center justify-center transition-all shadow-lg backdrop-blur-md z-10"
            aria-label="Previous Creation"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amoura-card/90 border border-amoura-line hover:border-amoura-gold text-amoura-cream hover:text-amoura-gold flex items-center justify-center transition-all shadow-lg backdrop-blur-md z-10"
            aria-label="Next Creation"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Thumbnail Selector Strip */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 overflow-x-auto pb-2">
          {GALLERY_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                currentIndex === idx
                  ? 'border-amoura-gold shadow-gold-glow scale-105'
                  : 'border-amoura-line opacity-60 hover:opacity-100'
              }`}
            >
              <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

      </div>

      {/* Fullscreen Modal View */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-amoura-card border border-amoura-line text-amoura-cream hover:text-amoura-gold"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden border border-amoura-line shadow-2xl">
            <img
              src={fullscreenImage.img}
              alt={fullscreenImage.title}
              className="w-full h-auto max-h-[80vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </section>
  );
}
