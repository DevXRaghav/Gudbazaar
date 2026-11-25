import React from 'react';
import { Leaf, ShieldCheck, Sparkles, Sun, PackageCheck, Award } from 'lucide-react';

const PROMISE_ITEMS = [
  { icon: Leaf, text: '100% Natural & Unrefined' },
  { icon: ShieldCheck, text: 'Zero Added Sugar · Zero Palm Oil' },
  { icon: Sparkles, text: 'Chemical Free & Preservative Free' },
  { icon: Sun, text: 'Direct from Roots of Uttar Pradesh' },
  { icon: PackageCheck, text: 'Airtight Resealable Pouches & PET Jars' },
  { icon: Award, text: 'Rich in Natural Iron & Minerals' },
];

export const TrustMarqueeStrip: React.FC = () => {
  return (
    <div
      aria-label="Gudbazaar purity highlights"
      className="relative w-full bg-[#2E541B] text-[#FFF9EF] border-y border-[#1F3A12] overflow-hidden select-none gb-marquee-container"
    >
      <div className="py-3.5 flex w-max animate-gb-marquee-slow">
        {[0, 1].map((dupIdx) => (
          <div
            key={dupIdx}
            aria-hidden={dupIdx === 1}
            className="flex items-center shrink-0"
          >
            {PROMISE_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${dupIdx}-${idx}`}
                  className="flex items-center gap-2.5 px-6 sm:px-8 whitespace-nowrap"
                >
                  <Icon className="w-3.5 h-3.5 text-[#E99A19] shrink-0" aria-hidden="true" />
                  <span className="text-xs sm:text-[13px] font-medium tracking-wide text-[#FFF9EF]/95">
                    {item.text}
                  </span>
                  <span className="ml-6 sm:ml-8 text-[#E99A19]/60" aria-hidden="true">
                    ·
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
