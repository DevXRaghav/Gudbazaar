import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../../data/products';

import bannerRawGudImg from '../../assets/images/banner_dual_raw_gud_v2_1795590301212.jpg';
import bannerDryfruitsCubesImg from '../../assets/images/banner_dual_dryfruits_v2_1795590309635.jpg';
import bannerPeanutAllInOneImg from '../../assets/images/banner_dual_peanut_allinone_v2_1795590305625.jpg';
import bannerDesiKhandImg from '../../assets/images/banner_dual_desi_khand_1795590214522.jpg';
import bannerOrganicShakkarImg from '../../assets/images/banner_dual_organic_shakkar_1795590214966.jpg';

export interface BannerItem {
  id: string;
  offerKicker: string;
  title: string;
  offerSummary: string;
  imageUrl: string;
  ctaLabel: string;
  ctaLink: string;
  secondaryLabel: string;
  secondaryLink: string;
}

export const ALL_PRODUCT_BANNERS: BannerItem[] = [
  {
    id: 'banner-raw-gud',
    offerKicker: 'UP TO 25% OFF · PACKETS FROM ₹79',
    title: 'Pure Organic Raw Gud',
    offerSummary: 'Fresh UP farm jaggery in 500g & 1kg · Packets ₹79 · Jars ₹129',
    imageUrl: bannerRawGudImg,
    ctaLabel: 'Shop Raw Gud',
    ctaLink: '/shop?category=Raw+Gud',
    secondaryLabel: 'View All Offers',
    secondaryLink: '/shop',
  },
  {
    id: 'banner-dryfruits-cubes',
    offerKicker: 'EXTRA 15% OFF FIRST ORDER · CODE FIRSTGUD',
    title: 'Artisanal Dryfruits Gud Cubes',
    offerSummary: 'Roasted almonds, cashews & pistachios · Packets from ₹179 · Jars from ₹219',
    imageUrl: bannerDryfruitsCubesImg,
    ctaLabel: 'Shop Dryfruits Cubes',
    ctaLink: '/product/dryfruits-gud-cubes-packets',
    secondaryLabel: 'Shop Airtight Jars',
    secondaryLink: '/product/dryfruits-gud-cubes-jar',
  },
  {
    id: 'banner-peanut-allinone',
    offerKicker: 'FREE DELIVERY ABOVE ₹499 · SAVE UP TO 25%',
    title: 'Peanut & All-in-One Gud Cubes',
    offerSummary: 'Crunchy protein chikki & spiced nut blends · Packets from ₹119 · Jars from ₹159',
    imageUrl: bannerPeanutAllInOneImg,
    ctaLabel: 'Explore Gud Cubes',
    ctaLink: '/shop?category=Gud+Cubes',
    secondaryLabel: 'Shop All Products',
    secondaryLink: '/shop',
  },
  {
    id: 'banner-desi-khand',
    offerKicker: 'EXTRA 10% OFF ABOVE ₹299 · CODE SWEET10',
    title: 'Pure Sulphurless Desi Khand',
    offerSummary: 'Unbleached raw cane sugar crystals · Packets ₹79 · Jars ₹129',
    imageUrl: bannerDesiKhandImg,
    ctaLabel: 'Shop Desi Khand',
    ctaLink: '/shop?category=Pure+Desi+Khand',
    secondaryLabel: 'Shop Airtight Jars',
    secondaryLink: '/product/pure-desi-khand-jar',
  },
  {
    id: 'banner-organic-shakkar',
    offerKicker: 'SAVE 20% ABOVE ₹799 · CODE PUREJAGGERY',
    title: 'Pure Organic Chai Shakkar',
    offerSummary: 'Micro-sieved golden jaggery powder · Packets ₹79 · Jars ₹129',
    imageUrl: bannerOrganicShakkarImg,
    ctaLabel: 'Shop Organic Shakkar',
    ctaLink: '/shop?category=Pure+Organic+Shakkar',
    secondaryLabel: 'Shop Airtight Jars',
    secondaryLink: '/product/pure-organic-shakkar-jar',
  },
];

export const ProductBannerSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);

  const isRunning = !isHovered && !isUserPaused;

  useEffect(() => {
    if (!isRunning || ALL_PRODUCT_BANNERS.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ALL_PRODUCT_BANNERS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isRunning, currentIndex]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % ALL_PRODUCT_BANNERS.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + ALL_PRODUCT_BANNERS.length) % ALL_PRODUCT_BANNERS.length);
  };

  const currentBanner = ALL_PRODUCT_BANNERS[currentIndex] || ALL_PRODUCT_BANNERS[0];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#1A0D07]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Featured seasonal offers"
    >
      <div className="relative w-full min-h-[440px] sm:min-h-[480px] lg:min-h-[540px] xl:min-h-[590px] flex items-end md:items-center overflow-hidden">
        {/* Stacked Full-Bleed Slides for Smooth Crossfade + Subtle Ken-Burns */}
        {ALL_PRODUCT_BANNERS.map((banner, idx) => {
          const isActive = idx === currentIndex;
          return (
            <img
              key={banner.id}
              src={banner.imageUrl}
              alt={banner.title}
              referrerPolicy="no-referrer"
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full object-cover object-[78%_center] md:object-center transition-opacity duration-700 ease-out ${
                isActive ? 'opacity-100 animate-gb-kenburns' : 'opacity-0 pointer-events-none'
              }`}
              onError={(e) => {
                e.currentTarget.src = HERO_IMAGE;
              }}
            />
          );
        })}

        {/* Measured Editorial Contrast Scrim */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#180C06]/95 via-[#180C06]/70 to-[#180C06]/20 md:bg-gradient-to-r md:from-[#180C06]/95 md:via-[#180C06]/80 md:via-[46%] md:to-transparent"
          aria-hidden="true"
        />

        {/* Editorial Offer Content Layer */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-14 lg:px-16 pt-28 pb-18 md:py-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-[#F5AA28]">
              <span>{currentBanner.offerKicker}</span>
            </div>

            <h1 className="font-display mt-3.5 text-3xl sm:text-4xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.06] text-balance drop-shadow-sm">
              {currentBanner.title}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#FFF9EF]/90 font-normal leading-relaxed tabular-nums max-w-lg">
              {currentBanner.offerSummary}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                to={currentBanner.ctaLink}
                className="inline-flex items-center gap-2.5 px-6.5 py-3.5 bg-[#E99A19] hover:bg-[#F5AA28] text-[#1A0D07] text-xs sm:text-sm font-bold tracking-wide rounded-xl shadow-lg shadow-black/25 hover:-translate-y-0.5 transition-all touch-manipulation"
              >
                <span>{currentBanner.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={currentBanner.secondaryLink}
                className="text-xs sm:text-sm font-semibold text-[#FFF9EF]/90 hover:text-[#F5AA28] underline underline-offset-4 decoration-white/35 hover:decoration-[#F5AA28] transition-colors touch-manipulation"
              >
                {currentBanner.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>

        {/* Modern Glassmorphic Edge Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="hidden sm:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 items-center justify-center transition-all z-20 focus:outline-none touch-manipulation cursor-pointer"
          aria-label="Previous offer banner"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="hidden sm:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 items-center justify-center transition-all z-20 focus:outline-none touch-manipulation cursor-pointer"
          aria-label="Next offer banner"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Running Progress Bars + Slide Index */}
        <div className="absolute bottom-5 inset-x-0 z-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-14 lg:px-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              {ALL_PRODUCT_BANNERS.map((b, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className="relative h-1.5 flex-1 rounded-full bg-white/25 overflow-hidden cursor-pointer touch-manipulation focus:outline-none"
                    aria-label={`Go to banner ${idx + 1}: ${b.title}`}
                  >
                    {isActive && (
                      <span
                        key={`${b.id}-${currentIndex}`}
                        className={`block h-full w-full bg-[#F5AA28] rounded-full animate-gb-banner-progress ${
                          !isRunning ? 'gb-marquee-paused' : ''
                        }`}
                      />
                    )}
                    {idx < currentIndex && (
                      <span className="block h-full w-full bg-[#F5AA28]/80 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-white/85 tabular-nums">
              <span>
                0{currentIndex + 1} <span className="text-white/40">/ 0{ALL_PRODUCT_BANNERS.length}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsUserPaused((p) => !p)}
                className="text-[11px] font-semibold text-white/80 hover:text-[#F5AA28] underline underline-offset-4 decoration-white/30 transition-colors cursor-pointer touch-manipulation"
                aria-label={isUserPaused ? 'Resume offer slider' : 'Pause offer slider'}
              >
                {isUserPaused ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

