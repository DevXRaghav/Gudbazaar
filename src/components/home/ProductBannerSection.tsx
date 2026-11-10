import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HERO_IMAGE, JAGGERY_BLOCKS_IMG, JAGGERY_POWDER_IMG, LIQUID_JAGGERY_IMG } from '../../data/products';

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  badge?: string;
  priceTag?: string;
  imageUrl: string;
  productSlug: string;
  productName: string;
}

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 'banner-1',
    title: 'Authentic Desi Jaggery Block',
    subtitle: '100% Chemical-free, single-origin sugarcane boiled in traditional iron pans.',
    tagline: 'Harvested fresh from Kolhapur farms',
    badge: 'Single Origin Harvest',
    priceTag: 'Starting at ₹95',
    imageUrl: HERO_IMAGE,
    productSlug: 'natural-desi-jaggery-block',
    productName: 'Natural Desi Jaggery Block',
  },
  {
    id: 'banner-2',
    title: 'Pure Golden Jaggery Powder',
    subtitle: 'Free-flowing natural sweetness that dissolves smoothly in daily tea & coffee.',
    tagline: 'Zero refined sugar · High in bioavailable iron',
    badge: 'Bestseller',
    priceTag: 'Special Price ₹145',
    imageUrl: JAGGERY_POWDER_IMG,
    productSlug: 'pure-golden-jaggery-powder',
    productName: 'Pure Golden Jaggery Powder',
  },
  {
    id: 'banner-3',
    title: 'Artisanal Liquid Kakvi Drizzle',
    subtitle: 'First-press golden sugarcane honey rich in organic minerals & potassium.',
    tagline: 'The healthy Indian alternative to maple syrup & honey',
    badge: 'Fresh Batch',
    priceTag: '₹210 / 450g Jar',
    imageUrl: LIQUID_JAGGERY_IMG,
    productSlug: 'liquid-jaggery-syrup-kakvi',
    productName: 'Liquid Jaggery Syrup (Kakvi)',
  },
  {
    id: 'banner-4',
    title: 'Heritage Jaggery Gift Flight',
    subtitle: 'Auspicious tasting box featuring traditional blocks, powder, and sesame bites.',
    tagline: 'Debossed keepsake box with gold accents',
    badge: 'Festive Special',
    priceTag: 'Save 21% · ₹549',
    imageUrl: JAGGERY_BLOCKS_IMG,
    productSlug: 'gudbazaar-pure-jaggery-gift-box',
    productName: 'Gudbazaar Pure Jaggery Gift Box',
  },
];

const STORAGE_KEY = 'gudbazaar_custom_banners';

export const ProductBannerSection: React.FC = () => {
  const [banners] = useState<BannerItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_BANNERS;
  });

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

  const currentBanner = banners[currentIndex] || DEFAULT_BANNERS[0];

  return (
    <section
      className="relative overflow-hidden bg-[#FFF9EF] py-4 sm:py-6 border-b border-[#E9DDC9]/70"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CLICKABLE PRODUCT BANNER ONLY */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E9DDC9] bg-[#4A2415] group">
          
          <Link
            to={`/product/${currentBanner.productSlug}`}
            className="block relative w-full aspect-16/9 sm:aspect-21/9 lg:aspect-24/9 min-h-[340px] sm:min-h-[420px] cursor-pointer"
            aria-label={`View ${currentBanner.productName}`}
          >
            {/* Background Image */}
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title || currentBanner.productName}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />

            {/* Gradient Scrim for Content Readability */}
            {currentBanner.title ? (
              <div className="absolute inset-0 bg-gradient-to-r from-[#4A2415]/95 via-[#4A2415]/75 to-transparent sm:w-3/4 lg:w-3/5 flex flex-col justify-center p-6 sm:p-10 lg:p-14 text-white">
                
                {/* Badge & Price Tag */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {currentBanner.badge && (
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-[#E99A19] text-[#4A2415] px-2.5 py-0.5 rounded-sm">
                      {currentBanner.badge}
                    </span>
                  )}
                  {currentBanner.priceTag && (
                    <span className="text-xs font-bold text-[#8CD36C] bg-black/30 px-2 py-0.5 rounded backdrop-blur-xs">
                      {currentBanner.priceTag}
                    </span>
                  )}
                </div>

                {/* Banner Headline */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
                  {currentBanner.title}
                </h2>

                {/* Subtitle description */}
                <p className="mt-3 text-xs sm:text-sm text-[#FFF9EF]/90 max-w-lg leading-relaxed drop-shadow-xs line-clamp-2 sm:line-clamp-3">
                  {currentBanner.subtitle}
                </p>

                {/* Direct Click-to-Product CTA */}
                <div className="mt-6 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFF9EF] text-[#4A2415] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md group-hover:bg-[#E99A19] group-hover:text-[#4A2415] transition-all">
                    <span>View Product & Buy Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

              </div>
            ) : (
              /* Image-Only Banner Mode */
              <div className="absolute bottom-4 right-4 bg-[#4A2415]/85 hover:bg-[#4A2415] backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg border border-white/20 transition-all">
                <span>Shop This Product</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
          </Link>

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#4A2415] flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100 z-20 focus:outline-none"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#4A2415] flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100 z-20 focus:outline-none"
                aria-label="Next banner"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Slide Indicator Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-20 pointer-events-auto">
              {banners.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 transition-all rounded-full ${
                    currentIndex === idx
                      ? 'w-7 bg-[#E99A19]'
                      : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
