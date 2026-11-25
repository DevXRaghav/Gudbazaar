import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Leaf,
  Sparkles,
  Truck,
  CheckCircle2,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { CATEGORIES, STORY_FARM_IMG, HERO_IMAGE } from '../data/products';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { SEOHead } from '../components/seo/SEOHead';
import { ProductBannerSection } from '../components/home/ProductBannerSection';
import { TrustMarqueeStrip } from '../components/home/TrustMarqueeStrip';
import { ProductMarqueeSlider } from '../components/home/ProductMarqueeSlider';
import { CustomerTestimonialsSection } from '../components/home/CustomerTestimonialsSection';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="bg-[#FFF9EF] min-h-screen transition-colors duration-200">
      <SEOHead
        title="Gudbazaar — Pure Jaggery & Natural Sweetness | Buy Desi Gud Online"
        description="Discover the natural sweetness of authentic jaggery, thoughtfully sourced from sugarcane farmers and delivered straight to your doorstep."
        canonicalPath="/"
      />

      {/* HERO OFFER SLIDER */}
      <ProductBannerSection />

      {/* CONTINUOUS RUNNING PURITY & CRAFT STRIP */}
      <TrustMarqueeStrip />

      {/* SHOP BY CATEGORY */}
      <section className="py-16 sm:py-22 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-semibold text-[#47752F] tracking-wide">
              Curated Varieties · 500g &amp; 1kg Packs
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#4A2415] tracking-tight mt-1.5 text-balance">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#47752F] hover:text-[#4A2415] group whitespace-nowrap shrink-0"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative flex flex-col bg-white rounded-2xl border border-[#E9DDC9]/85 p-3 sm:p-3.5 overflow-hidden hover:border-[#47752F]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4A2415]/8 transition-all duration-300"
            >
              <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-[#FBF5EC] mb-3.5 relative">
                <img
                  src={category.image}
                  alt={category.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = HERO_IMAGE;
                  }}
                />
              </div>
              <div className="px-1 pb-1 flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-[#4A2415] group-hover:text-[#47752F] transition-colors leading-snug truncate">
                    {category.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#4A2415]/60 mt-0.5 tabular-nums">
                    {category.itemCount} Options · Pouch &amp; Jar
                  </p>
                </div>
                <span className="w-8 h-8 rounded-full bg-[#FFF9EF] border border-[#E9DDC9] text-[#4A2415] group-hover:bg-[#47752F] group-hover:border-[#47752F] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INTERACTIVE AUTO-RUNNING PRODUCT CATALOGUE SLIDER */}
      <ProductMarqueeSlider onQuickView={(p) => setQuickViewProduct(p)} />

      {/* WHY GUDBAZAAR? */}
      <section className="py-16 sm:py-22 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <p className="text-xs font-semibold text-[#47752F] tracking-wide">
              Our Standards
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#4A2415] tracking-tight mt-1.5 text-balance">
              Why Households Choose Gudbazaar
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4A2415]/75 max-w-md leading-relaxed">
            Revitalizing pure Indian sugarcane craftsmanship with transparent sourcing and zero industrial shortcuts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {[
            {
              icon: Leaf,
              accent: 'text-[#47752F]',
              title: 'Natural Sweetness',
              copy: 'Made purely from whole sugarcane juice clarified with natural okra extract — preserving iron, potassium, and minerals.',
            },
            {
              icon: Sparkles,
              accent: 'text-[#E99A19]',
              title: '100% Organic & Fresh',
              copy: 'Every batch of Raw Gud, Cubes, Desi Khand, and Shakkar is prepared fresh in small farm runs with zero chemical preservatives.',
            },
            {
              icon: CheckCircle2,
              accent: 'text-[#47752F]',
              title: 'Roots of Uttar Pradesh',
              copy: 'Sourced directly from Western Uttar Pradesh — India’s historic heartland recognized for premier sugarcane harvests.',
            },
            {
              icon: Truck,
              accent: 'text-[#47752F]',
              title: 'Moisture-Lock Packs',
              copy: 'Packed in resealable multi-layer pouches and reusable airtight PET jars to lock in fresh farm aroma all year.',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl border border-[#E9DDC9]/85 flex flex-col items-start hover:border-[#47752F]/45 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#4A2415]/5 transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl bg-[#FFF9EF] border border-[#E9DDC9] ${item.accent} flex items-center justify-center mb-5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#4A2415]">{item.title}</h3>
                <p className="mt-2 text-xs sm:text-[13px] text-[#4A2415]/75 leading-relaxed">
                  {item.copy}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-16 sm:py-22 bg-gradient-to-br from-[#35180C] via-[#4A2415] to-[#3B1C0F] text-[#FFF9EF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            {/* Story Visual Left */}
            <div className="lg:col-span-6 relative">
              <div className="h-full rounded-2xl overflow-hidden border border-[#FFF9EF]/15 shadow-2xl">
                <img
                  src={STORY_FARM_IMG}
                  alt="Rural sugarcane plantation in India during golden hour"
                  referrerPolicy="no-referrer"
                  className="w-full h-full min-h-[280px] aspect-16/10 lg:aspect-auto object-cover object-center"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Story Content Right */}
            <div className="lg:col-span-6 flex flex-col justify-center items-start py-2">
              <p className="text-xs font-semibold text-[#9CE27B] tracking-wide">
                Our Heritage · Farm to Jar
              </p>
              <h2 className="font-display mt-2.5 text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#FFF9EF] tracking-tight leading-[1.1] text-balance">
                Rooted in Tradition. Made for Today.
              </h2>
              <p className="mt-5 text-sm sm:text-base text-[#F5EAD8]/90 leading-relaxed">
                Gudbazaar celebrates India&rsquo;s traditional sweetness through thoughtfully crafted jaggery products — pairing ancestral farm purity with modern, hygienic airtight packaging.
              </p>
              <p className="mt-3 text-xs sm:text-sm text-[#E9DDC9]/75 leading-relaxed">
                For centuries, Indian households trusted pure gud for steady natural energy, digestive warmth, and everyday wellness. By skipping synthetic bleaching agents and middlemen, we deliver pristine farm-fresh sweetness straight to your kitchen.
              </p>

              {/* Clean Typographic Proof Metrics */}
              <div className="mt-7 pt-6 border-t border-[#FFF9EF]/15 w-full grid grid-cols-3 gap-4">
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-[#F5AA28] tabular-nums">
                    100%
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#E9DDC9]/80 mt-0.5">
                    Pure Cane Juice
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-[#F5AA28] tabular-nums">
                    0%
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#E9DDC9]/80 mt-0.5">
                    Sulphur &amp; Bleach
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-[#F5AA28] tabular-nums">
                    14
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#E9DDC9]/80 mt-0.5">
                    Pouch &amp; Jar Packs
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/about"
                  className="px-6.5 py-3.5 bg-[#E99A19] hover:bg-[#F5AA28] text-[#1A0D07] text-xs sm:text-sm font-bold tracking-wide rounded-xl transition-all shadow-md hover:-translate-y-0.5 inline-flex items-center gap-2 touch-manipulation"
                >
                  <span>Discover Our Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CULINARY VERSATILITY */}
      <section className="py-16 sm:py-22 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold text-[#47752F] tracking-wide">
            Everyday Kitchen Rituals
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#4A2415] tracking-tight mt-1.5 text-balance">
            Pure Gud in Everyday Life
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#4A2415]/75">
            How authentic unrefined jaggery elevates your daily table without refined white sugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              num: '01',
              subtitle: 'Morning Chai & Coffee',
              title: 'Free-Flowing Organic Shakkar',
              desc: 'Dissolves instantly in steaming ginger cardamom chai without curdling milk, lending a gentle caramel warmth and natural trace minerals.',
              cta: 'Explore Organic Shakkar',
              link: '/shop?category=Pure+Organic+Shakkar',
            },
            {
              num: '02',
              subtitle: 'Festive Halwa & Traditional Sweets',
              title: 'Raw Gud (Pouches & Jars)',
              desc: 'The soul of authentic Indian kitchens — handcrafted fresh in open iron pans from single-origin Uttar Pradesh sugarcane.',
              cta: 'Explore Raw Gud',
              link: '/shop?category=Raw+Gud',
            },
            {
              num: '03',
              subtitle: 'Mindful Snacking & Tea Rituals',
              title: 'Artisanal Gud Cubes',
              desc: 'Portioned bite-sized cubes in Raw, Dryfruits, Crunchy Peanut, and spiced All-in-One blends across 500g and 1kg packs.',
              cta: 'Explore Gud Cubes',
              link: '/shop?category=Gud+Cubes',
            },
          ].map((ritual) => (
            <div
              key={ritual.num}
              className="group bg-white rounded-2xl border border-[#E9DDC9]/85 p-6 flex flex-col justify-between hover:border-[#47752F]/45 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#4A2415]/5 transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E99A19]">
                  <span className="tabular-nums font-bold">{ritual.num}.</span>
                  <span>{ritual.subtitle}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#4A2415] mt-2">
                  {ritual.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#4A2415]/75 mt-2.5 leading-relaxed">
                  {ritual.desc}
                </p>
              </div>
              <Link
                to={ritual.link}
                className="mt-5 pt-4 border-t border-[#E9DDC9]/70 text-xs font-semibold text-[#47752F] hover:text-[#4A2415] flex items-center justify-between transition-colors"
              >
                <span>{ritual.cta}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* RUNNING CUSTOMER REVIEWS & TESTIMONIALS SLIDER */}
      <CustomerTestimonialsSection />

      {/* NEWSLETTER */}
      <section className="py-16 sm:py-22 bg-[#FFF9EF] border-t border-[#E9DDC9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#E9DDC9] px-6 py-10 sm:px-12 sm:py-14 text-center shadow-xs">
            <p className="text-xs font-semibold text-[#47752F] tracking-wide">
              Stay Connected
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4A2415] tracking-tight mt-1.5 text-balance">
              A Little Sweetness in Your Inbox.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#4A2415]/75 max-w-lg mx-auto leading-relaxed">
              Get updates on fresh seasonal harvests, traditional festive recipes, and exclusive members-only offers at Gudbazaar.
            </p>

            {newsletterSubscribed ? (
              <div className="mt-8 p-4 bg-[#FFF9EF] rounded-xl border border-[#47752F]/35 text-[#47752F] flex items-center justify-center gap-2 max-w-md mx-auto text-sm font-semibold">
                <Check className="w-5 h-5 text-[#47752F]" />
                <span>Thank you! Welcome to the Gudbazaar family.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mt-8 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-[#FFF9EF] border border-[#E9DDC9] rounded-xl text-xs sm:text-sm text-[#4A2415] focus:outline-none focus:border-[#47752F] placeholder:text-[#4A2415]/45"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-bold tracking-wide rounded-xl transition-colors shadow-sm touch-manipulation cursor-pointer whitespace-nowrap shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="mt-3.5 text-[11px] text-[#4A2415]/55">
              Zero spam. Unsubscribe at any time with a single click.
            </p>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
