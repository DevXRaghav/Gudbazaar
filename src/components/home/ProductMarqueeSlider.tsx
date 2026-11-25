import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';

interface ProductMarqueeSliderProps {
  onQuickView: (product: Product) => void;
}

export const ProductMarqueeSlider: React.FC<ProductMarqueeSliderProps> = ({ onQuickView }) => {
  const [packFilter, setPackFilter] = useState<'All' | 'Packet' | 'Jar'>('All');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const scrollPosRef = useRef<number>(0);

  const filteredProducts = useMemo(() => {
    if (packFilter === 'All') return PRODUCTS;
    return PRODUCTS.filter((p) => p.packagingType === packFilter);
  }, [packFilter]);

  // Duplicate list once for seamless infinite running loop
  const loopedProducts = useMemo(
    () => [...filteredProducts, ...filteredProducts],
    [filteredProducts]
  );

  // Reset horizontal offset cleanly when switching filter tab
  useEffect(() => {
    const el = trackRef.current;
    if (el) {
      el.scrollLeft = 0;
      scrollPosRef.current = 0;
    }
  }, [packFilter]);

  // Smooth requestAnimationFrame auto-running slider (pauses on hover, touch, or manual pause)
  useEffect(() => {
    if (!isPlaying || isHovered || isTouching) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let rafId = 0;
    let lastTime = performance.now();
    const speedPxPerSec = 42;

    const el = trackRef.current;
    if (el) {
      scrollPosRef.current = el.scrollLeft;
    }

    const step = (now: number) => {
      const container = trackRef.current;
      if (container) {
        const dt = Math.min(now - lastTime, 50);
        lastTime = now;

        const halfWidth = container.scrollWidth / 2;
        if (halfWidth > 0) {
          scrollPosRef.current += (speedPxPerSec * dt) / 1000;
          if (scrollPosRef.current >= halfWidth) {
            scrollPosRef.current -= halfWidth;
          }
          container.scrollLeft = scrollPosRef.current;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isHovered, isTouching, packFilter]);

  const handleStep = (direction: 'prev' | 'next') => {
    const container = trackRef.current;
    if (!container) return;
    const cardStep = Math.min(340, container.clientWidth * 0.82);
    const halfWidth = container.scrollWidth / 2;

    let nextLeft = container.scrollLeft + (direction === 'next' ? cardStep : -cardStep);
    if (nextLeft < 0 && halfWidth > 0) {
      container.scrollLeft = halfWidth + container.scrollLeft;
      nextLeft = container.scrollLeft - cardStep;
    } else if (halfWidth > 0 && nextLeft >= halfWidth) {
      nextLeft -= halfWidth;
    }

    scrollPosRef.current = Math.max(0, nextLeft);
    container.scrollTo({ left: scrollPosRef.current, behavior: 'smooth' });
  };

  return (
    <section
      aria-labelledby="running-catalogue-heading"
      className="py-16 sm:py-22 bg-white border-y border-[#E9DDC9]/75 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Interactive Filter & Slider Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-9">
          <div className="max-w-xl">
            <p className="text-xs font-semibold text-[#47752F] tracking-wide">
              Signature Collection · Fresh Small-Batch
            </p>
            <h2
              id="running-catalogue-heading"
              className="font-display text-3xl sm:text-4xl font-bold text-[#4A2415] tracking-tight mt-1.5 text-balance"
            >
              Crafted in Airtight Pouches &amp; Jars
            </h2>
            <p className="mt-2 text-sm text-[#4A2415]/70 leading-relaxed">
              Every single-origin variety — browse our live showcase or pause anytime to inspect pack details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Segmented Packaging Filter */}
            <div
              role="tablist"
              aria-label="Filter showcased products by packaging"
              className="inline-flex items-center gap-1 p-1 bg-[#FFF9EF] border border-[#E9DDC9] rounded-xl"
            >
              {[
                { id: 'All' as const, label: `All (${PRODUCTS.length})` },
                {
                  id: 'Packet' as const,
                  label: `Pouches (${PRODUCTS.filter((p) => p.packagingType === 'Packet').length})`,
                },
                {
                  id: 'Jar' as const,
                  label: `Jars (${PRODUCTS.filter((p) => p.packagingType === 'Jar').length})`,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={packFilter === tab.id}
                  onClick={() => setPackFilter(tab.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer touch-manipulation ${
                    packFilter === tab.id
                      ? 'bg-[#4A2415] text-[#FFF9EF] shadow-xs'
                      : 'text-[#4A2415]/75 hover:text-[#4A2415]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Playback & Step Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Pause product slider' : 'Play product slider'}
                title={isPlaying ? 'Pause slider' : 'Play slider'}
                className="w-9 h-9 rounded-xl border border-[#E9DDC9] bg-[#FFF9EF] hover:border-[#47752F] text-[#4A2415] hover:text-[#47752F] flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => handleStep('prev')}
                aria-label="Scroll previous products"
                className="w-9 h-9 rounded-xl border border-[#E9DDC9] bg-[#FFF9EF] hover:border-[#47752F] text-[#4A2415] hover:text-[#47752F] flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleStep('next')}
                aria-label="Scroll next products"
                className="w-9 h-9 rounded-xl border border-[#E9DDC9] bg-[#FFF9EF] hover:border-[#47752F] text-[#4A2415] hover:text-[#47752F] flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-bleed Smooth Running Product Track */}
      <div
        className="relative max-w-[1440px] mx-auto gb-edge-fade"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsTouching(true)}
        onTouchEnd={() => setIsTouching(false)}
      >
        <div
          ref={trackRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-8 py-2"
        >
          {loopedProducts.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              className="w-[265px] sm:w-[295px] lg:w-[310px] shrink-0"
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex items-center justify-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-bold tracking-wide rounded-xl shadow-sm hover:shadow-md transition-all touch-manipulation"
        >
          <span>Explore Complete Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
