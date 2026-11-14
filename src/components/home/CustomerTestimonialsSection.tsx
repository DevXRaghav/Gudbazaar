import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowUpRight, Info } from 'lucide-react';
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

  const filteredTestimonials = useMemo(() => {
    if (filter === 'all') return testimonials;
    return testimonials.filter((item) => item.residentCategory === filter);
  }, [testimonials, filter]);

  const averageRating = useMemo(() => {
    if (testimonials.length === 0) return '0.0';
    const sum = testimonials.reduce((acc, item) => acc + item.rating, 0);
    return (sum / testimonials.length).toFixed(1);
  }, [testimonials]);

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="py-16 sm:py-20 bg-white dark:bg-[#180E08] border-t border-[#E9DDC9]/70 dark:border-[#3B2519] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#47752F] dark:text-[#6BB545] uppercase tracking-wider">
              <span>Customer Reviews &amp; Testimonials</span>
              {isSampleCollection && (
                <>
                  <span aria-hidden="true" className="text-[#E9DDC9] dark:text-[#3B2519]">·</span>
                  <span className="text-[#8D5B18] dark:text-[#F5AA28] normal-case font-semibold">
                    Sample Preview
                  </span>
                </>
              )}
            </div>

            <h2
              id="testimonials-heading"
              className="text-2xl sm:text-3xl font-extrabold text-[#4A2415] dark:text-[#F5EBE1] tracking-tight mt-1 text-balance"
            >
              Loved Across Kitchens in India
            </h2>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#4A2415]/80 dark:text-[#D8C7B8]">
              <span className="inline-flex items-center gap-1 font-bold text-[#4A2415] dark:text-[#F5EBE1] tabular-nums">
                <Star className="w-4 h-4 text-[#E99A19] dark:text-[#F5AA28] fill-current" />
                {averageRating} / 5.0
              </span>
              <span aria-hidden="true" className="text-[#E9DDC9] dark:text-[#3B2519]">·</span>
              <span className="tabular-nums">{testimonials.length} {isSampleCollection ? 'sample testimonials' : 'customer reviews'}</span>
              <span aria-hidden="true" className="text-[#E9DDC9] dark:text-[#3B2519]">·</span>
              <span>Indian households &amp; expats living in India</span>
            </div>
          </div>

          {/* Interactive Audience Filter */}
          <div
            role="tablist"
            aria-label="Filter testimonials by resident group"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#FFF9EF] dark:bg-[#261810] border border-[#E9DDC9] dark:border-[#3B2519] rounded-xl self-start lg:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              onClick={() => setFilter('all')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors touch-manipulation cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#4A2415] dark:bg-[#6BB545] text-[#FFF9EF] dark:text-[#120A06] shadow-xs'
                  : 'text-[#4A2415]/80 dark:text-[#D8C7B8] hover:text-[#4A2415] dark:hover:text-[#F5EBE1]'
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
                  ? 'bg-[#4A2415] dark:bg-[#6BB545] text-[#FFF9EF] dark:text-[#120A06] shadow-xs'
                  : 'text-[#4A2415]/80 dark:text-[#D8C7B8] hover:text-[#4A2415] dark:hover:text-[#F5EBE1]'
              }`}
            >
              Indian Customers ({testimonials.filter((t) => t.residentCategory === 'indian').length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'expat'}
              onClick={() => setFilter('expat')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors touch-manipulation cursor-pointer ${
                filter === 'expat'
                  ? 'bg-[#4A2415] dark:bg-[#6BB545] text-[#FFF9EF] dark:text-[#120A06] shadow-xs'
                  : 'text-[#4A2415]/80 dark:text-[#D8C7B8] hover:text-[#4A2415] dark:hover:text-[#F5EBE1]'
              }`}
            >
              Expats in India ({testimonials.filter((t) => t.residentCategory === 'expat').length})
            </button>
          </div>
        </div>

        {/* Transparent Sample / Demo Labelling Notice */}
        {isSampleCollection && (
          <div className="mb-8 px-4 py-3 rounded-xl bg-[#FFF9EF] dark:bg-[#261810] border border-[#E9DDC9] dark:border-[#3B2519] flex items-start gap-2.5 text-xs text-[#4A2415]/85 dark:text-[#D8C7B8]">
            <Info className="w-4 h-4 text-[#47752F] dark:text-[#6BB545] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#4A2415] dark:text-[#F5EBE1]">{TESTIMONIALS_CONFIG.disclaimerTitle}:</strong>{' '}
              {TESTIMONIALS_CONFIG.disclaimerText}
            </p>
          </div>
        )}

        {/* Responsive Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredTestimonials.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between bg-[#FFF9EF] dark:bg-[#1C110B] rounded-xl border border-[#E9DDC9] dark:border-[#3B2519] p-5 sm:p-6 transition-colors hover:border-[#47752F]/50 dark:hover:border-[#6BB545]/50"
            >
              <div>
                {/* Rating & Sample Marker Row (clean unboxed text) */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className="flex items-center gap-0.5 text-[#E99A19] dark:text-[#F5AA28]"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <Star
                        key={starIndex}
                        className={`w-3.5 h-3.5 ${
                          starIndex <= item.rating
                            ? 'fill-current text-[#E99A19] dark:text-[#F5AA28]'
                            : 'text-[#E9DDC9] dark:text-[#3B2519]'
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 text-xs font-bold text-[#4A2415] dark:text-[#F5EBE1] tabular-nums">
                      {item.rating}.0
                    </span>
                  </div>

                  {item.isSample && (
                    <span className="text-[11px] font-medium text-[#4A2415]/60 dark:text-[#D8C7B8]/60">
                      Sample Review
                    </span>
                  )}
                </div>

                {/* Review Body */}
                <blockquote className="text-xs sm:text-[13px] text-[#4A2415]/90 dark:text-[#F5EBE1]/90 leading-relaxed">
                  &ldquo;{item.review}&rdquo;
                </blockquote>
              </div>

              {/* Reviewer Identity & Product Link */}
              <div className="mt-5 pt-4 border-t border-[#E9DDC9]/80 dark:border-[#3B2519] space-y-2">
                <div>
                  <h3 className="text-sm font-bold text-[#4A2415] dark:text-[#F5EBE1] leading-snug">
                    {item.customerName}
                  </h3>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[#4A2415]/70 dark:text-[#D8C7B8]/75">
                    <span className="inline-flex items-center gap-1 font-medium text-[#47752F] dark:text-[#6BB545]">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {item.city}, {item.state}
                    </span>
                    <span aria-hidden="true" className="text-[#E9DDC9] dark:text-[#3B2519]">·</span>
                    <span>{item.residentLabel}</span>
                  </div>
                </div>

                <Link
                  to={`/product/${item.productSlug}`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A2415]/80 dark:text-[#D8C7B8] hover:text-[#47752F] dark:hover:text-[#6BB545] transition-colors"
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
