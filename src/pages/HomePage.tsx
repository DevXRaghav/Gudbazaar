import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sparkles, Truck, CheckCircle2, Check, ArrowUpRight } from 'lucide-react';
import { PRODUCTS, CATEGORIES, STORY_FARM_IMG, HERO_IMAGE } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { SEOHead } from '../components/seo/SEOHead';
import { ProductBannerSection } from '../components/home/ProductBannerSection';
import { CustomerTestimonialsSection } from '../components/home/CustomerTestimonialsSection';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const bestsellers = PRODUCTS.filter((p) => p.isBestseller).slice(0, 4);

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

      {/* SECTION C — CLICKABLE PRODUCT BANNER SECTION */}
      <ProductBannerSection />

      {/* SECTION D — SHOP BY CATEGORY */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold text-[#47752F] uppercase tracking-wider">Collections</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A2415] tracking-tight mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#47752F] hover:text-[#4A2415] group"
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
              className="group relative flex flex-col bg-white rounded-xl border border-[#E9DDC9] p-3 overflow-hidden hover:border-[#47752F] hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-4/3 w-full rounded-lg overflow-hidden bg-[#FFF9EF] mb-3 relative">
                <img
                  src={category.image}
                  alt={category.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = HERO_IMAGE;
                  }}
                />
              </div>
              <h3 className="text-sm font-bold text-[#4A2415] group-hover:text-[#47752F] transition-colors leading-snug">
                {category.name}
              </h3>
              <p className="text-[11px] text-[#4A2415]/60 mt-0.5 line-clamp-1">
                {category.itemCount} Items Available
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION E — BESTSELLERS */}
      <section className="py-16 sm:py-20 bg-white border-y border-[#E9DDC9]/70 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold text-[#47752F] uppercase tracking-wider">Customer Favourites</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A2415] tracking-tight mt-1">
                Bestsellers
              </h2>
            </div>
            <p className="text-xs text-[#4A2415]/70 max-w-xs">
              Everyday pantry essentials loved by thousands of households across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFF9EF] hover:bg-[#E9DDC9]/50 border border-[#4A2415] text-[#4A2415] text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              <span>Explore Complete Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION F — WHY GUDBAZAAR? */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold text-[#47752F] uppercase tracking-wider">Our Standards</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A2415] tracking-tight mt-1">
            Why Gudbazaar?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#4A2415]/75">
            We are dedicated to revitalizing pure Indian sugarcane culture with transparent sourcing and zero industrial compromises.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-xl border border-[#E9DDC9] flex flex-col items-start hover:border-[#47752F]/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#FFF9EF] border border-[#E9DDC9] text-[#47752F] flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#4A2415]">Natural Sweetness</h3>
            <p className="mt-2 text-xs text-[#4A2415]/75 leading-relaxed">
              Made purely from whole sugarcane juice with natural vegetable clarifiers like okra extract. Never stripped of trace iron, potassium, or minerals.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-xl border border-[#E9DDC9] flex flex-col items-start hover:border-[#47752F]/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#FFF9EF] border border-[#E9DDC9] text-[#47752F] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-[#E99A19]" />
            </div>
            <h3 className="text-base font-bold text-[#4A2415]">100% Organic & Freshly Prepared</h3>
            <p className="mt-2 text-xs text-[#4A2415]/75 leading-relaxed">
              Every batch of our Raw Gud, Cubes, Desi Khand, and Shakkar is prepared fresh from pure organic cane juice without chemical preservatives.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-xl border border-[#E9DDC9] flex flex-col items-start hover:border-[#47752F]/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#FFF9EF] border border-[#E9DDC9] text-[#47752F] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#4A2415]">Roots of Uttar Pradesh</h3>
            <p className="mt-2 text-xs text-[#4A2415]/75 leading-relaxed">
              Sourced all the way from the roots of Uttar Pradesh — recognized by the Government of India for the finest sugarcane production.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-white rounded-xl border border-[#E9DDC9] flex flex-col items-start hover:border-[#47752F]/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#FFF9EF] border border-[#E9DDC9] text-[#47752F] flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#4A2415]">1kg Sealed Packets & Airtight Jars</h3>
            <p className="mt-2 text-xs text-[#4A2415]/75 leading-relaxed">
              Sold in 1kg pack sizes. Specially packaged to keep away from moisture in sealed pack containers, jars, or resealable packets.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION G — BRAND STORY */}
      <section className="py-16 sm:py-20 bg-[#4A2415] text-[#FFF9EF] relative overflow-hidden border-t border-[#3B2519]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
           
            {/* Story Visual Left */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden border border-[#FFF9EF]/20 shadow-2xl">
                <img
                  src={STORY_FARM_IMG}
                  alt="Rural sugarcane plantation in India during golden hour"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-16/10 object-cover object-center"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Story Content Right */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <span className="text-xs font-semibold text-[#8CD36C] uppercase tracking-wider">Our Heritage</span>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FFF9EF] tracking-tight leading-tight">
                Rooted in Tradition. Made for Today.
              </h2>
              <p className="mt-5 text-sm sm:text-base text-[#E9DDC9]/90 leading-relaxed">
                Gudbazaar celebrates India's traditional sweetness through thoughtfully selected jaggery products. We bring together the familiar goodness of gud and the convenience of modern online shopping.
              </p>
              <p className="mt-3 text-xs sm:text-sm text-[#E9DDC9]/75 leading-relaxed">
                For centuries, Indian households knew that pure gud provided sustained energy, digestive warmth, and natural vitality. By bypassing synthetic bleaching agents and industrial intermediaries, we deliver pristine farm-fresh sweetness directly into your hands.
              </p>

              <div className="mt-8">
                <Link
                  to="/about"
                  className="px-6 py-3 bg-[#E99A19] hover:bg-[#E99A19]/90 text-[#4A2415] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-2"
                >
                  <span>Discover Our Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION H — PRODUCT HIGHLIGHTS & TRADITIONAL APPLICATIONS */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-[#47752F] uppercase tracking-wider">Culinary Versatility</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A2415] tracking-tight mt-1">
            Pure Gud in Everyday Life
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#4A2415]/75">
            How authentic jaggery elevates your daily table without refined white sugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
          <div className="bg-white rounded-xl border border-[#E9DDC9] p-5 flex flex-col justify-between transition-colors">
            <div>
              <span className="text-xs font-bold text-[#E99A19]">01. Morning Chai & Coffee</span>
              <h3 className="text-base font-bold text-[#4A2415] mt-1">Free-Flowing Gud Powder</h3>
              <p className="text-xs text-[#4A2415]/75 mt-2 leading-relaxed">
                Dissolves instantly in steaming ginger cardamom chai without curdling milk. Imparts a gentle warm caramel tone and natural antioxidants.
              </p>
            </div>
            <Link
              to="/shop?category=Pure+Organic+Shakkar"
              className="mt-4 pt-3 border-t border-[#E9DDC9]/60 text-xs font-semibold text-[#47752F] hover:text-[#4A2415] flex items-center justify-between"
            >
              <span>Explore Organic Shakkar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-[#E9DDC9] p-5 flex flex-col justify-between transition-colors">
            <div>
              <span className="text-xs font-bold text-[#E99A19]">02. Festive Halwa & Traditional Sweets</span>
              <h3 className="text-base font-bold text-[#4A2415] mt-1">Raw Gud (Packets & Jar)</h3>
              <p className="text-xs text-[#4A2415]/75 mt-2 leading-relaxed">
                The soul of authentic Indian kitchens. Handcrafted fresh in open pans from single-origin sugarcane in Uttar Pradesh.
              </p>
            </div>
            <Link
              to="/shop?category=Raw+Gud"
              className="mt-4 pt-3 border-t border-[#E9DDC9]/60 text-xs font-semibold text-[#47752F] hover:text-[#4A2415] flex items-center justify-between"
            >
              <span>Explore Raw Gud</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-[#E9DDC9] p-5 flex flex-col justify-between transition-colors">
            <div>
              <span className="text-xs font-bold text-[#E99A19]">03. Healthy Snacking & Tea Rituals</span>
              <h3 className="text-base font-bold text-[#4A2415] mt-1">Artisanal Gud Cubes</h3>
              <p className="text-xs text-[#4A2415]/75 mt-2 leading-relaxed">
                Bite-sized portioned cubes in Raw, Dryfruits, Crunchy Peanut, and All-in-One blends in 500g and 1000g sizes.
              </p>
            </div>
            <Link
              to="/shop?category=Gud+Cubes"
              className="mt-4 pt-3 border-t border-[#E9DDC9]/60 text-xs font-semibold text-[#47752F] hover:text-[#4A2415] flex items-center justify-between"
            >
              <span>Explore Gud Cubes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION I — CUSTOMER REVIEWS & TESTIMONIALS */}
      <CustomerTestimonialsSection />

      {/* SECTION J — NEWSLETTER */}
      <section className="py-16 sm:py-20 bg-[#FFF9EF] border-t border-[#E9DDC9] transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-[#47752F] uppercase tracking-wider">Stay Connected</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A2415] tracking-tight mt-1">
            A Little Sweetness in Your Inbox.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#4A2415]/75 max-w-lg mx-auto">
            Get updates on new seasonal harvests, traditional festive recipes, and exclusive members-only offers at Gudbazaar.
          </p>

          {newsletterSubscribed ? (
            <div className="mt-8 p-4 bg-white rounded-xl border border-[#47752F]/40 text-[#47752F] flex items-center justify-center gap-2 max-w-md mx-auto text-sm font-semibold">
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
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3 bg-white border border-[#E9DDC9] rounded-xl text-xs sm:text-sm text-[#4A2415] focus:outline-none focus:border-[#47752F] placeholder:text-[#4A2415]/40"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm touch-manipulation"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="mt-3 text-[11px] text-[#4A2415]/60">
            Zero spam. Unsubscribe at any time with a single click.
          </p>
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
