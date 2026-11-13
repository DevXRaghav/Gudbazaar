import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../../data/products';

import bannerRawGudImg from '../../assets/images/branded_banner_raw_gud_1794557469591.jpg';
import bannerDryfruitsCubesImg from '../../assets/images/branded_banner_dryfruits_cubes_1794557472805.jpg';
import bannerPeanutAllInOneImg from '../../assets/images/branded_banner_peanut_allinone_1794557471715.jpg';
import bannerDesiKhandImg from '../../assets/images/branded_banner_desi_khand_1794557533955.jpg';
import bannerOrganicShakkarImg from '../../assets/images/branded_banner_organic_shakkar_1794557534100.jpg';

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
    secondaryLabel: 'Shop Glass Jars',
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
    secondaryLabel: 'Shop Glass Jars',
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
    secondaryLabel: 'Shop Glass Jars',
    secondaryLink: '/product/pure-organic-shakkar-jar',
  },
];

export const ProductBannerSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || ALL_PRODUCT_BANNERS.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ALL_PRODUCT_BANNERS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

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
      className="relative w-full overflow-hidden bg-[#1A0D07] border-b border-[#E9DDC9]/70 dark:border-[#3B2519]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full">
        <div className="relative w-full">
          <div className="relative w-full min-h-[420px] sm:min-h-[450px] lg:min-h-[520px] xl:min-h-[560px] flex items-end md:items-center overflow-hidden">
            {/* Full-Size Background Hero Photograph */}
            <img
              key={currentBanner.id}
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-[78%_center] md:object-center transition-opacity duration-500"
              onError={(e) => {
                e.currentTarget.src = HERO_IMAGE;
              }}
            />

            {/* Editorial Contrast Scrim — clear readability left/bottom while leaving right product frame bright & uncropped */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#1A0D07]/95 via-[#1A0D07]/75 to-[#1A0D07]/25 md:bg-gradient-to-r md:from-[#1A0D07] md:via-[#1A0D07]/85 md:via-[46%] md:to-transparent"
              aria-hidden="true"
            />

            {/* Clean Offer Content Layer */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-14 lg:px-16 pt-28 pb-14 md:py-16">
              <div className="max-w-xl">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#F5AA28]">
                  {currentBanner.offerKicker}
                </p>

                <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.08] text-balance drop-shadow-sm">
                  {currentBanner.title}
                </h2>

                <p className="mt-3.5 text-sm sm:text-base text-[#FFF9EF]/90 font-normal leading-relaxed tabular-nums">
                  {currentBanner.offerSummary}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-6">
                  <Link
                    to={currentBanner.ctaLink}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#E99A19] hover:bg-[#F5AA28] text-[#1A0D07] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg transition-colors touch-manipulation"
                  >
                    <span>{currentBanner.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to={currentBanner.secondaryLink}
                    className="text-xs sm:text-sm font-semibold text-[#FFF9EF]/85 hover:text-[#F5AA28] underline underline-offset-4 decoration-white/30 hover:decoration-[#F5AA28] transition-colors touch-manipulation"
                  >
                    {currentBanner.secondaryLabel}
                  </Link>
                </div>
              </div>
            </div>

            {/* Subtle Edge Carousel Controls */}
            <button
              type="button"
              onClick={handlePrev}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/35 hover:bg-black/60 text-white border border-white/15 items-center justify-center transition-colors z-20 focus:outline-none touch-manipulation cursor-pointer"
              aria-label="Previous offer banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/35 hover:bg-black/60 text-white border border-white/15 items-center justify-center transition-colors z-20 focus:outline-none touch-manipulation cursor-pointer"
              aria-label="Next offer banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Minimal Slide Bars */}
            <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-2 z-20">
              {ALL_PRODUCT_BANNERS.map((b, idx) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all touch-manipulation cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 bg-[#F5AA28]'
                      : 'w-4 bg-white/35 hover:bg-white/65'
                  }`}
                  aria-label={`Go to banner ${idx + 1}: ${b.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

