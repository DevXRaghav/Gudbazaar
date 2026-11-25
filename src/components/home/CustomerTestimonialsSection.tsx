import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  ArrowUpRight,
  Info,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';
import { CUSTOMER_TESTIMONIALS, TESTIMONIALS_CONFIG } from '../../data/testimonials';
import { Testimonial } from '../../types';

interface CustomerTestimonialsSectionProps {
  testimonials?: Testimonial[];
  isSampleCollection?: boolean;
}

export const CustomerTestimonialsSection: React.FC<CustomerTestimonialsSectionProps> = ({
  testimonials = CUSTOMER_TESTIMONIALS,
  isSampleCollection = TESTIMONIALS_CONFIG.isSampleData,
}) => {
  const [filter, setFilter] = useState<'all' | 'indian' | 'expat'>('all');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const scrollPosRef = useRef<number>(0);

  const filteredTestimonials = useMemo(() => {
    if (filter === 'all') return testimonials;
    return testimonials.filter((item) => item.residentCategory === filter);
  }, [testimonials, filter]);

  // Duplicate filtered list for seamless continuous running loop
  const loopedTestimonials = useMemo(
    () => [...filteredTestimonials, ...filteredTestimonials],
    [filteredTestimonials]
  );

  const averageRating = useMemo(() => {
    if (testimonials.length === 0) return '0.0';
    const sum = testimonials.reduce((acc, item) => acc + item.rating, 0);
    return (sum / testimonials.length).toFixed(1);
  }, [testimonials]);

  useEffect(() => {
    const el = trackRef.current;
    if (el) {
      el.scrollLeft = 0;
      scrollPosRef.current = 0;
    }
  }, [filter]);

  // Gentle auto-running horizontal slider
  useEffect(() => {
    if (!isPlaying || isHovered || isTouching) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let rafId = 0;
    let lastTime = performance.now();
    const speedPxPerSec = 32;

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
  }, [isPlaying, isHovered, isTouching, filter]);

  const handleStep = (direction: 'prev' | 'next') => {
    const container = trackRef.current;
    if (!container) return;
    const stepSize = Math.min(360, container.clientWidth * 0.85);
    const halfWidth = container.scrollWidth / 2;

    let nextLeft = container.scrollLeft + (direction === 'next' ? stepSize : -stepSize);
    if (nextLeft < 0 && halfWidth > 0) {
      container.scrollLeft = halfWidth + container.scrollLeft;
      nextLeft = container.scrollLeft - stepSize;
    } else if (halfWidth > 0 && nextLeft >= halfWidth) {
      nextLeft -= halfWidth;
    }

    scrollPosRef.current = Math.max(0, nextLeft);
    container.scrollTo({ left: scrollPosRef.current, behavior: 'smooth' });
  };

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="py-16 sm:py-22 bg-white border-t border-[#E9DDC9]/75 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#47752F] tracking-wide">
              <span>Customer Reviews &amp; Testimonials</span>
              {isSampleCollection && (
                <>
                  <span aria-hidden="true" className="text-[#D8C7AF]">·</span>
                  <span className="text-[#8D5B18] font-semibold">Sample Preview</span>
                </>
              )}
            </div>

            <h2
              id="testimonials-heading"
              className="font-display text-3xl sm:text-4xl font-bold text-[#4A2415] tracking-tight mt-1.5 text-balance"
            >
              Loved Across Kitchens in India
            </h2>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#4A2415]/80">
              <span className="inline-flex items-center gap-1 font-bold text-[#4A2415] tabular-nums">
                <Star className="w-4 h-4 text-[#E99A19] fill-current" />
                {averageRating} / 5.0
              </span>
              <span aria-hidden="true" className="text-[#D8C7AF]">·</span>
              <span className="tabular-nums">
                {testimonials.length} {isSampleCollection ? 'sample testimonials' : 'customer reviews'}
              </span>
              <span aria-hidden="true" className="text-[#D8C7AF]">·</span>
              <span>Indian households &amp; expats living in India</span>
            </div>
          </div>

          {/* Interactive Audience Filter + Slider Controls */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            <div
              role="tablist"
              aria-label="Filter testimonials by resident group"
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#FFF9EF] border border-[#E9DDC9] rounded-xl"
            >
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'all'}
                onClick={() => setFilter('all')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors touch-manipulation cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[#4A2415] text-[#FFF9EF] shadow-xs'
                    : 'text-[#4A2415]/80 hover:text-[#4A2415]'
                }`}
              >
                All ({testimonials.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'indian'}
                onClick={() => setFilter('indian')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors touch-manipulation cursor-pointer ${
                  filter === 'indian'
                    ? 'bg-[#4A2415] text-[#FFF9EF] shadow-xs'
                    : 'text-[#4A2415]/80 hover:text-[#4A2415]'
                }`}
              >
                Indian ({testimonials.filter((t) => t.residentCategory === 'indian').length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'expat'}
                onClick={() => setFilter('expat')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors touch-manipulation cursor-pointer ${
                  filter === 'expat'
                    ? 'bg-[#4A2415] text-[#FFF9EF] shadow-xs'
                    : 'text-[#4A2415]/80 hover:text-[#4A2415]'
                }`}
              >
                Expats in India ({testimonials.filter((t) => t.residentCategory === 'expat').length})
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Pause testimonials slider' : 'Play testimonials slider'}
                title={isPlaying ? 'Pause slider' : 'Play slider'}
                className="w-9 h-9 rounded-xl border border-[#E9DDC9] bg-[#FFF9EF] hover:border-[#47752F] text-[#4A2415] hover:text-[#47752F] flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => handleStep('prev')}
                aria-label="Previous testimonials"
                className="w-9 h-9 rounded-xl border border-[#E9DDC9] bg-[#FFF9EF] hover:border-[#47752F] text-[#4A2415] hover:text-[#47752F] flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleStep('next')}
                aria-label="Next testimonials"
                className="w-9 h-9 rounded-xl border border-[#E9DDC9] bg-[#FFF9EF] hover:border-[#47752F] text-[#4A2415] hover:text-[#47752F] flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Transparent Sample / Demo Labelling Notice */}
        {isSampleCollection && (
          <div className="mb-8 px-4 py-3 rounded-xl bg-[#FFF9EF] border border-[#E9DDC9] flex items-start gap-2.5 text-xs text-[#4A2415]/85">
            <Info className="w-4 h-4 text-[#47752F] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#4A2415]">{TESTIMONIALS_CONFIG.disclaimerTitle}:</strong>{' '}
              {TESTIMONIALS_CONFIG.disclaimerText}
            </p>
          </div>
        )}
      </div>

      {/* Smooth Running Horizontal Testimonials Slider */}
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
          {loopedTestimonials.map((item, idx) => (
            <article
              key={`${item.id}-${idx}`}
              className="w-[300px] sm:w-[340px] shrink-0 flex flex-col justify-between bg-[#FFF9EF] rounded-2xl border border-[#E9DDC9] p-6 transition-all duration-300 hover:border-[#47752F]/50 hover:shadow-md hover:shadow-[#4A2415]/5"
            >
              <div>
                {/* Rating & Sample Marker Row */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div
                    className="flex items-center gap-0.5 text-[#E99A19]"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <Star
                        key={starIndex}
                        className={`w-3.5 h-3.5 ${
                          starIndex <= item.rating
                            ? 'fill-current text-[#E99A19]'
                            : 'text-[#E9DDC9]'
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 text-xs font-bold text-[#4A2415] tabular-nums">
                      {item.rating}.0
                    </span>
                  </div>

                  {item.isSample && (
                    <span className="text-[11px] font-medium text-[#4A2415]/55">
                      Sample Review
                    </span>
                  )}
                </div>

                {/* Review Body */}
                <blockquote className="text-[13px] sm:text-sm text-[#4A2415]/90 leading-relaxed">
                  &ldquo;{item.review}&rdquo;
                </blockquote>
              </div>

              {/* Reviewer Identity & Product Link */}
              <div className="mt-5 pt-4 border-t border-[#E9DDC9]/80 space-y-2">
                <div>
                  <h3 className="text-sm font-bold text-[#4A2415] leading-snug">
                    {item.customerName}
                  </h3>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[#4A2415]/70">
                    <span className="inline-flex items-center gap-1 font-medium text-[#47752F]">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {item.city}, {item.state}
                    </span>
                    <span aria-hidden="true" className="text-[#D8C7AF]">·</span>
                    <span>{item.residentLabel}</span>
                  </div>
                </div>

                <Link
                  to={`/product/${item.productSlug}`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A2415]/80 hover:text-[#47752F] transition-colors"
                >
                  <span className="truncate">{item.productName}</span>
                  <ArrowUpRight className="w-3 h-3 shrink-0" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
