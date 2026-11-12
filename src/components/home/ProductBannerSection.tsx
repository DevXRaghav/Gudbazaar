import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, PackageCheck } from 'lucide-react';
import { HERO_IMAGE, JAGGERY_BLOCKS_IMG, JAGGERY_POWDER_IMG, STORY_FARM_IMG } from '../../data/products';

export interface BannerItem {
  id: string;
  shortTabTitle: string;
  title: string;
  subtitle: string;
  tagline: string;
  badge?: string;
  priceTag?: string;
  imageUrl: string;
  packetSlug: string;
  jarSlug: string;
  productName: string;
  category: string;
  weights: string;
}

export const ALL_PRODUCT_BANNERS: BannerItem[] = [
  // 1. Raw Gud (Packets & Jar)
  {
    id: 'banner-raw-gud',
    shortTabTitle: 'Raw Gud',
    title: '100% Organic Raw Gud',
    subtitle: 'Fresh authentic unrefined farm jaggery prepared fresh from single-origin sugarcane. Sourced all the way from the roots of Uttar Pradesh, recognized by the Govt. of India.',
    tagline: 'Freshly prepared · Pack size: 500g & 1000g · Keep away from moisture in airtight jar or sealed packet',
    badge: 'Govt. Recognized UP Origin · 100% Fresh Organic',
    priceTag: 'Packets from ₹79 · Jars from ₹129',
    imageUrl: JAGGERY_BLOCKS_IMG,
    packetSlug: 'raw-gud-packets',
    jarSlug: 'raw-gud-jar',
    productName: 'Raw Gud (Packets / Jar)',
    category: 'Raw Gud',
    weights: '500g & 1000g',
  },

  // 2. Raw Gud Cubes (Packets & Jar)
  {
    id: 'banner-raw-gud-cubes',
    shortTabTitle: 'Raw Gud Cubes',
    title: 'Pure Raw Gud Cubes',
    subtitle: 'Portioned 10g precision cubes of freshly prepared organic raw jaggery. Clean, mess-free, and dissolves evenly in morning tea and warm milk.',
    tagline: 'Pre-cut portions · Pack size: 500g & 1000g · Store in moisture-proof seal container or jar',
    badge: 'Fresh Batch · Portioned Purity',
    priceTag: 'Packets from ₹89 · Jars from ₹139',
    imageUrl: HERO_IMAGE,
    packetSlug: 'raw-gud-cubes-packets',
    jarSlug: 'raw-gud-cubes-jar',
    productName: 'Raw Gud Cubes (Packets / Jar)',
    category: 'Gud Cubes',
    weights: '500g & 1000g',
  },

  // 3. Dryfruits Gud Cubes (Packets & Jar)
  {
    id: 'banner-dryfruits-cubes',
    shortTabTitle: 'Dryfruits Cubes',
    title: 'Artisanal Dryfruits Gud Cubes',
    subtitle: 'Golden organic UP gud loaded with roasted California almonds, whole cashews, crunchy pistachios & aromatic green cardamom.',
    tagline: 'Rich vitality, natural iron & proteins · Pack size: 500g & 1000g · Airtight packaging',
    badge: 'Royal Bestseller · 100% Fresh',
    priceTag: 'Packets from ₹179 · Jars from ₹219',
    imageUrl: HERO_IMAGE,
    packetSlug: 'dryfruits-gud-cubes-packets',
    jarSlug: 'dryfruits-gud-cubes-jar',
    productName: 'Dryfruits Gud Cubes (Packets / Jar)',
    category: 'Gud Cubes',
    weights: '500g & 1000g',
  },

  // 4. Peanut Gud Cubes (Packets & Jar)
  {
    id: 'banner-peanut-cubes',
    shortTabTitle: 'Peanut Cubes',
    title: 'Crunchy Peanut Gud Cubes',
    subtitle: 'High-protein winter power snack. Golden roasted groundnuts enrobed in freshly prepared organic jaggery from Western Uttar Pradesh.',
    tagline: 'Authentic chikki brittle crunch · Pack size: 500g & 1000g · Moisture-barrier sealed',
    badge: 'High Protein · Certified Organic',
    priceTag: 'Packets from ₹119 · Jars from ₹159',
    imageUrl: STORY_FARM_IMG,
    packetSlug: 'peanut-gud-cubes-packets',
    jarSlug: 'peanut-gud-cubes-jar',
    productName: 'Peanut Gud Cubes (Packets / Jar)',
    category: 'Gud Cubes',
    weights: '500g & 1000g',
  },

  // 5. All in One Gud Cubes (Packets & Jar)
  {
    id: 'banner-all-in-one-cubes',
    shortTabTitle: 'All in One Cubes',
    title: 'All in One Gud Cubes',
    subtitle: 'The grand Ayurvedic vitality blend: Roasted almonds, cashews, peanuts, golden sesame seeds (til), and warming dry ginger (sonth).',
    tagline: 'Ancestral wellness formulation · Pack size: 500g & 1000g · Keep sealed away from humidity',
    badge: 'Ayurvedic Immunity Blend',
    priceTag: 'Packets from ₹169 · Jars from ₹199',
    imageUrl: HERO_IMAGE,
    packetSlug: 'all-in-one-gud-cubes-packets',
    jarSlug: 'all-in-one-gud-cubes-jar',
    productName: 'All in One Gud Cubes (Packets / Jar)',
    category: 'Gud Cubes',
    weights: '500g & 1000g',
  },

  // 6. Pure Desi Khand (Packets & Jar)
  {
    id: 'banner-desi-khand',
    shortTabTitle: 'Pure Desi Khand',
    title: 'Pure Desi Khand (Raw Cane Sugar)',
    subtitle: 'Zero-sulphur unbleached sparkling raw sugar crystals naturally clarified with organic wild okra plant extract. Never chemically stripped.',
    tagline: 'The unrefined Ayurvedic alternative to white table sugar · Pack size: 500g & 1000g · Moisture-free seal',
    badge: 'Zero Sulphur · Non-Bleached',
    priceTag: 'Packets from ₹79 · Jars from ₹129',
    imageUrl: JAGGERY_POWDER_IMG,
    packetSlug: 'pure-desi-khand-packets',
    jarSlug: 'pure-desi-khand-jar',
    productName: 'Pure Desi Khand (Packets / Jar)',
    category: 'Pure Desi Khand',
    weights: '500g & 1000g',
  },

  // 7. Pure Organic Shakkar (Packets & Jar)
  {
    id: 'banner-organic-shakkar',
    shortTabTitle: 'Pure Shakkar',
    title: 'Pure Organic Shakkar',
    subtitle: 'Micro-sieved free-flowing golden desi jaggery powder for daily chai, coffee & recipes. Dissolves effortlessly and never curdles hot milk.',
    tagline: 'Daily pantry essential · Pack size: 500g & 1000g · Keep away from moisture in airtight jar or packet',
    badge: 'Daily Tea Essential · 100% Organic',
    priceTag: 'Packets from ₹79 · Jars from ₹129',
    imageUrl: JAGGERY_POWDER_IMG,
    packetSlug: 'pure-organic-shakkar-packets',
    jarSlug: 'pure-organic-shakkar-jar',
    productName: 'Pure Organic Shakkar (Packets / Jar)',
    category: 'Pure Organic Shakkar',
    weights: '500g & 1000g',
  },
];

export const ProductBannerSection: React.FC = () => {
  const [banners] = useState<BannerItem[]>(ALL_PRODUCT_BANNERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Autoplay ticker with pause on hover
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, banners.length]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const currentBanner = banners[currentIndex] || ALL_PRODUCT_BANNERS[0];

  return (
    <section
      className="relative overflow-hidden bg-[#FFF9EF] dark:bg-[#120A06] pt-4 pb-6 sm:py-6 border-b border-[#E9DDC9]/70 dark:border-[#3B2519] transition-colors"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CLICKABLE PRODUCT HERO BANNER */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E9DDC9] dark:border-[#3B2519] bg-[#4A2415] dark:bg-[#1C110B] group">
          
          <div className="relative w-full aspect-16/10 sm:aspect-16/9 md:aspect-16/9 lg:aspect-24/9 min-h-[360px] sm:min-h-[390px] md:min-h-[380px] lg:min-h-[420px]">
            {/* Background Image */}
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title || currentBanner.productName}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = HERO_IMAGE;
              }}
            />

            {/* Gradient Scrim for Contrast & Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2A140B]/95 via-[#2A140B]/85 sm:via-[#2A140B]/75 to-transparent dark:from-[#0D0704]/98 dark:via-[#0D0704]/85 w-full sm:w-5/6 md:w-3/4 lg:w-3/5 flex flex-col justify-center p-6 sm:p-8 md:p-9 lg:p-12 text-white">
              
              {/* Badges & Price Tag */}
              <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                {currentBanner.badge && (
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#E99A19] dark:bg-[#F5AA28] text-[#4A2415] dark:text-[#120A06] px-2.5 py-0.5 rounded-sm shadow-xs">
                    {currentBanner.badge}
                  </span>
                )}
                {currentBanner.priceTag && (
                  <span className="text-[11px] sm:text-xs font-bold text-[#8CD36C] dark:text-[#6BB545] bg-black/45 px-2.5 py-0.5 rounded backdrop-blur-xs border border-white/10">
                    {currentBanner.priceTag}
                  </span>
                )}
              </div>

              {/* Banner Headline */}
              <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
                {currentBanner.title}
              </h2>

              {/* Subtitle description */}
              <p className="mt-2.5 text-xs sm:text-sm text-[#FFF9EF]/90 dark:text-[#F5EBE1]/90 max-w-lg leading-relaxed drop-shadow-xs line-clamp-2 sm:line-clamp-3">
                {currentBanner.subtitle}
              </p>

              {/* Tagline & Freshness/Moisture Note */}
              <p className="mt-2 text-[11px] text-[#E99A19] dark:text-[#F5AA28] font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{currentBanner.tagline}</span>
              </p>

              {/* Direct Subcategory Actions: Packet vs Jar (500g & 1000g) */}
              <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2 sm:gap-2.5 md:gap-3">
                <Link
                  to={`/product/${currentBanner.packetSlug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#FFF9EF] dark:bg-[#6BB545] text-[#4A2415] dark:text-[#120A06] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:bg-[#E99A19] dark:group-hover:bg-[#F5AA28] hover:text-[#4A2415] transition-all touch-manipulation"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Airtight Packet (500g / 1kg)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/product/${currentBanner.jarSlug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white border border-white/30 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all touch-manipulation"
                >
                  <span>Reusable Jar (500g / 1kg)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-[#1C110B]/80 hover:bg-white dark:hover:bg-[#261810] text-[#4A2415] dark:text-[#F5EBE1] flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100 z-20 focus:outline-none touch-manipulation cursor-pointer"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-[#1C110B]/80 hover:bg-white dark:hover:bg-[#261810] text-[#4A2415] dark:text-[#F5EBE1] flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100 z-20 focus:outline-none touch-manipulation cursor-pointer"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 z-20 pointer-events-auto">
            {banners.map((b, idx) => (
              <button
                key={b.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-2 transition-all rounded-full touch-manipulation cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 bg-[#E99A19] dark:bg-[#F5AA28]'
                    : 'w-2 bg-white/60 dark:bg-white/40 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
