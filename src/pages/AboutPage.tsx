import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, HeartHandshake, Sparkles, Award } from 'lucide-react';
import { STORY_FARM_IMG, HERO_IMAGE, JAGGERY_BLOCKS_IMG } from '../data/products';
import { SEOHead } from '../components/seo/SEOHead';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#FFF9EF] min-h-screen py-10 sm:py-16">
      <SEOHead
        title="Our Story & Sugarcane Heritage | Gudbazaar"
        description="Learn how Gudbazaar partners with Indian sugarcane farmers to produce 100% chemical-free, traditional artisanal jaggery."
        canonicalPath="/about"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-[#47752F] uppercase tracking-wider">Our Heritage</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4A2415] tracking-tight mt-2 leading-tight">
            Rooted in Tradition. Made for Today.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#4A2415]/80 leading-relaxed">
            Gudbazaar was founded with one clear mission: to restore the integrity of authentic Indian jaggery, bringing chemical-free, single-origin sweetness to modern households.
          </p>
        </div>

        {/* Story Visual & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-20">
          <div className="lg:col-span-6 relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-[#E9DDC9]">
              <img
                src={STORY_FARM_IMG}
                alt="Sugarcane fields in rural India at sunrise"
                referrerPolicy="no-referrer"
                className="w-full aspect-16/10 object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-[#4A2415]/85 leading-relaxed">
            <h2 className="text-2xl font-extrabold text-[#4A2415]">
              The Forgotten Soul of Indian Sweetness
            </h2>
            <p>
              In traditional Indian ayurvedic kitchens, <em>Gud</em> was never just a sweet treat. It was an essential daily digestive, a natural winter protector, and a restorative source of organic iron and potassium.
            </p>
            <p>
              However, modern commercial sugar processing strips sugarcane of nearly 95% of its natural nutrients through harsh carbonation and sulfur bleaching. Even in local markets, industrial jaggery often contains sodium hydrosulphite to artificially produce a bright yellow cosmetic hue.
            </p>
            <p className="font-medium text-[#47752F]">
              At Gudbazaar, we refused these shortcuts. We partner directly with multigenerational cane farmers in Kolhapur, Mandya, and western Uttar Pradesh who harvest mature cane and boil it in open iron pans using only natural plant-based clarifiers.
            </p>
          </div>
        </div>

        {/* Comparison: Industrial Sugar vs Pure Gudbazaar Jaggery */}
        <div className="bg-white rounded-2xl border border-[#E9DDC9] p-6 sm:p-10 mb-20 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-[#47752F] uppercase tracking-wider">Purity Comparison</span>
            <h2 className="text-2xl font-extrabold text-[#4A2415] mt-1">Why Choose Gudbazaar?</h2>
            <p className="text-xs text-[#4A2415]/70 mt-1">The difference between commercial sweetening and authentic sugarcane craft.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Commercial */}
            <div className="p-6 bg-[#FFF9EF]/50 rounded-xl border border-[#E9DDC9]/70 space-y-3">
              <h3 className="text-base font-bold text-[#4A2415]/60 flex items-center justify-between">
                <span>Refined White Sugar / Bleached Jaggery</span>
                <span className="text-xs font-normal text-red-700">Commercial Process</span>
              </h3>
              <ul className="space-y-2 text-xs text-[#4A2415]/70">
                <li className="flex items-start gap-2">
                  <span className="text-red-700 font-bold">✕</span>
                  <span>Bleached with sulfur dioxide and bone char filtration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-700 font-bold">✕</span>
                  <span>Stripped of iron, magnesium, potassium, and vitamins.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-700 font-bold">✕</span>
                  <span>Artificial coloring agents added to simulate traditional golden tones.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-700 font-bold">✕</span>
                  <span>Rapid blood glucose spikes with empty calories.</span>
                </li>
              </ul>
            </div>

            {/* Gudbazaar */}
            <div className="p-6 bg-[#FFF9EF] rounded-xl border-2 border-[#47752F] space-y-3 relative">
              <h3 className="text-base font-bold text-[#4A2415] flex items-center justify-between">
                <span>Gudbazaar Pure Desi Jaggery</span>
                <span className="text-xs font-bold text-[#47752F]">Single Origin</span>
              </h3>
              <ul className="space-y-2 text-xs text-[#4A2415]">
                <li className="flex items-start gap-2">
                  <span className="text-[#47752F] font-bold">✓</span>
                  <span>Clarified purely with vegetable mucilage (natural Okra plant extract).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#47752F] font-bold">✓</span>
                  <span>Rich in whole sugarcane iron (up to 14mg per 100g) and natural electrolytes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#47752F] font-bold">✓</span>
                  <span>Authentic deep amber color reflecting true caramel crystallization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#47752F] font-bold">✓</span>
                  <span>Gentle, sustained glycemic release with warming digestive qualities.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sourcing & Sustainability Commitments */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
          <div className="p-6 bg-white rounded-xl border border-[#E9DDC9] text-center">
            <HeartHandshake className="w-8 h-8 mx-auto text-[#47752F] mb-3" />
            <h3 className="text-base font-bold text-[#4A2415]">Direct Farmer Prosperity</h3>
            <p className="text-xs text-[#4A2415]/75 mt-2 leading-relaxed">
              We pay 20% higher than local mandi base rates directly to grower families, supporting sustainable agroforestry.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#E9DDC9] text-center">
            <ShieldCheck className="w-8 h-8 mx-auto text-[#47752F] mb-3" />
            <h3 className="text-base font-bold text-[#4A2415]">Batch Lab Verification</h3>
            <p className="text-xs text-[#4A2415]/75 mt-2 leading-relaxed">
              Every production lot undergoes independent testing for zero chemical residues, heavy metals, and moisture stability.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#E9DDC9] text-center">
            <Leaf className="w-8 h-8 mx-auto text-[#47752F] mb-3" />
            <h3 className="text-base font-bold text-[#4A2415]">Zero Waste Milling</h3>
            <p className="text-xs text-[#4A2415]/75 mt-2 leading-relaxed">
              Spent sugarcane fiber (bagasse) is dried in the sun to fuel the boiling pans, eliminating fossil fuel consumption.
            </p>
          </div>
        </div>

        {/* CTA to Shop */}
        <div className="text-center bg-[#4A2415] text-[#FFF9EF] p-10 sm:p-14 rounded-2xl border border-[#4A2415]">
          <span className="text-xs font-semibold text-[#8CD36C] uppercase tracking-wider">Taste the Difference</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFF9EF] mt-2">
            Bring Pure Indian Goodness to Your Home Today
          </h2>
          <p className="text-xs sm:text-sm text-[#E9DDC9]/80 mt-2 max-w-md mx-auto">
            Experience our 12 curated jaggery items, backed by fast Pan-India shipping and our purity guarantee.
          </p>
          <div className="mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#E99A19] hover:bg-[#E99A19]/90 text-[#4A2415] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
