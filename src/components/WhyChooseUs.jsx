import React from 'react';
import { Leaf, Truck, Sparkles, Award } from 'lucide-react';

const REASONS = [
  {
    icon: Leaf,
    title: '100% Pure Organic Soy Wax',
    desc: 'Biodegradable, non-toxic, and smoke-free burns that purify your sanctuary without harmful paraffin fumes.'
  },
  {
    icon: Truck,
    title: 'Complimentary Delivery > ₹1,000',
    desc: 'Carefully packaged with eco-friendly double-cushioning and fast express dispatch across all Indian pin codes.'
  },
  {
    icon: Sparkles,
    title: 'Small-Batch Handcrafted Pours',
    desc: 'Every urli, jar, and crystal resin platter is individually hand-poured and inspected for artistic perfection.'
  },
  {
    icon: Award,
    title: 'Custom Artisan Gifting',
    desc: 'Personalized color matching, festive branding, and curated fragrance notes for weddings and corporate milestones.'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20 bg-amoura-cream/60 border-y border-amoura-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-widest text-amoura-sage-dark font-bold block mb-1">
            Artisanal Excellence
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-amoura-charcoal">
            The Amoura Difference
          </h2>
          <p className="text-xs sm:text-sm text-amoura-muted mt-2">
            Mindful craftsmanship rooted in natural botanicals, pure aromatherapy, and timeless aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {REASONS.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-amoura-border shadow-soft flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amoura-cream border border-amoura-border flex items-center justify-center text-amoura-forest shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-amoura-charcoal">
                    {r.title}
                  </h3>
                  <p className="text-xs text-amoura-muted leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
