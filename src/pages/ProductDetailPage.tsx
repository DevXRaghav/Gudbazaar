import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { PRODUCTS, PINCODE_DELIVERY_DATA } from '../data/products';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/common/ProductCard';
import { SEOHead } from '../components/seo/SEOHead';
import { validateIndianPincode } from '../utils/pincodeValidator';
import { sanitizeSlug, sanitizeCartQuantity, SECURITY_RULES, auditInputSecurity } from '../utils/security';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const safeSlug = sanitizeSlug(slug || '');
  const product = PRODUCTS.find((p) => p.slug === safeSlug) || PRODUCTS[0];

  // Active Image and Gallery Zoom state
  const [activeImage, setActiveImage] = useState(product.primaryImage);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  // Selected Variant and Quantity
  const [selectedWeight, setSelectedWeight] = useState(
    product.variants[0]?.weight || product.weight
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'nutrition' | 'storage' | 'shipping'>('desc');

  // Pincode Delivery Checker
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{
    valid: boolean;
    city?: string;
    state?: string;
    days?: number;
    message?: string;
  } | null>(null);

  // When product changes (e.g. clicking related product)
  React.useEffect(() => {
    setActiveImage(product.primaryImage);
    setSelectedWeight(product.variants[0]?.weight || product.weight);
    setQuantity(1);
    setPincodeResult(null);
  }, [product]);

  const activeVariant =
    product.variants.find((v) => v.weight === selectedWeight) || product.variants[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedWeight, quantity);
    navigate('/checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateIndianPincode(pincodeInput);
    if (result.isValid) {
      setPincodeResult({
        valid: true,
        city: result.city,
        state: result.state,
        days: result.days,
        message: result.message,
      });
    } else {
      setPincodeResult({
        valid: false,
        message: result.message,
      });
    }
  };

  // Related products from same category or complement
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  // Structured Data Schema for Rich Google Snippet
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.primaryImage,
    description: product.description,
    sku: activeVariant?.sku || product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Gudbazaar',
    },
    offers: {
      '@type': 'Offer',
      url: `https://gudbazaar.com/product/${product.slug}`,
      priceCurrency: 'INR',
      price: activeVariant?.price || product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <div className="bg-[#FFF9EF] min-h-screen py-8 sm:py-12">
      <SEOHead
        title={`${product.name} — Pure Indian Jaggery | Gudbazaar`}
        description={product.shortDescription}
        canonicalPath={`/product/${product.slug}`}
        ogImage={product.primaryImage}
        schema={productSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#4A2415]/60 mb-6">
          <Link to="/" className="hover:text-[#47752F]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#47752F]">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#47752F]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#4A2415] font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Layout (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white rounded-2xl border border-[#E9DDC9] p-6 sm:p-8 lg:p-10 shadow-xs">
          
          {/* Left Column: Image Gallery with Interactive Zoom */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Main Interactive Zoom Box */}
            <div
              className="relative aspect-4/3 w-full bg-[#FFF9EF] rounded-xl overflow-hidden border border-[#E9DDC9] cursor-crosshair group shadow-inner"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center transition-transform duration-200 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : undefined
                }
                onError={(e) => {
                  e.currentTarget.src = '/images/hero_jaggery_display.jpg';
                }}
              />

              {/* Zoom Instruction Hint */}
              <div className="absolute bottom-3 left-3 bg-[#4A2415]/75 text-white text-[10px] px-2.5 py-1 rounded-md opacity-80 group-hover:opacity-0 transition-opacity pointer-events-none">
                Hover to magnify
              </div>

              {product.discountPercentage > 0 && (
                <div className="absolute top-3 left-3 bg-[#E99A19] text-white text-xs font-bold px-2.5 py-0.5 rounded-sm">
                  {product.discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {product.galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === img
                        ? 'border-[#47752F] shadow-sm'
                        : 'border-[#E9DDC9] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/hero_jaggery_display.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Highlights under imagery */}
            <div className="mt-4 pt-4 border-t border-[#E9DDC9]/60 grid grid-cols-3 gap-3 text-center text-xs text-[#4A2415]">
              <div className="p-2.5 bg-[#FFF9EF] rounded-lg">
                <ShieldCheck className="w-4 h-4 mx-auto text-[#47752F] mb-1" />
                <span className="font-semibold block text-[11px]">100% Organic</span>
                <span className="text-[10px] text-[#4A2415]/60">Zero chemicals</span>
              </div>
              <div className="p-2.5 bg-[#FFF9EF] rounded-lg">
                <Truck className="w-4 h-4 mx-auto text-[#47752F] mb-1" />
                <span className="font-semibold block text-[11px]">Roots of UP</span>
                <span className="text-[10px] text-[#4A2415]/60">Govt. Recognized</span>
              </div>
              <div className="p-2.5 bg-[#FFF9EF] rounded-lg">
                <RotateCcw className="w-4 h-4 mx-auto text-[#47752F] mb-1" />
                <span className="font-semibold block text-[11px]">Prepared Fresh</span>
                <span className="text-[10px] text-[#4A2415]/60">Small farm batch</span>
              </div>
            </div>

          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & Origin: Clean unboxed text */}
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#47752F] mb-2">
                <span>{product.category}</span>
                <span className="text-[#E9DDC9]">·</span>
                <span className="text-[#4A2415]/70 normal-case font-medium">{product.harvestOrigin}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A2415] leading-snug">
                {product.name}
              </h1>

              {/* Tagline */}
              {product.tagline && (
                <p className="mt-1 text-xs text-[#47752F] font-medium">
                  {product.tagline}
                </p>
              )}

              {/* Rating & Real Reviews Display */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center text-[#E99A19]">
                  {'★'.repeat(5)}
                </div>
                <span className="text-xs font-bold text-[#4A2415] tabular-nums">
                  {product.rating}
                </span>
                <span className="text-xs text-[#4A2415]/60">
                  ({product.reviewCount} customer reviews)
                </span>
              </div>

              {/* Price Row */}
              <div className="mt-4 pt-4 border-t border-[#E9DDC9]/70 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#4A2415] tabular-nums">
                  ₹{activeVariant?.price || product.price}
                </span>
                {(activeVariant?.mrp || product.mrp) > (activeVariant?.price || product.price) && (
                  <span className="text-base text-[#4A2415]/40 line-through tabular-nums">
                    ₹{activeVariant?.mrp || product.mrp}
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <span className="text-xs font-bold text-[#E99A19] bg-[#FFF9EF] px-2.5 py-1 rounded border border-[#E99A19]/30">
                    Save ₹{(activeVariant?.mrp || product.mrp) - (activeVariant?.price || product.price)} ({product.discountPercentage}%)
                  </span>
                )}
              </div>
              {/* 100% Fresh Organic & Moisture Care Banner */}
              <div className="mt-4 p-3.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-xl flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#47752F] shrink-0 mt-0.5" />
                <div className="text-xs text-[#4A2415]">
                  <p className="font-bold text-[#47752F]">100% Freshly Prepared Batch · Certified Organic</p>
                  <p className="text-[11px] text-[#4A2415]/80 mt-0.5">
                    Sourced from the roots of Uttar Pradesh (Govt. of India recognized). <strong>Keep away from moisture!</strong> Always store in a sealed pack container, airtight jar, or sealed packet. Avoid wet spoons.
                  </p>
                </div>
              </div>

              {/* Packaging Type Switcher: Packet vs Jar */}
              <div className="mt-5 pt-4 border-t border-[#E9DDC9]/70">
                <label className="text-xs font-bold text-[#4A2415] uppercase tracking-wider block mb-2">
                  Packaging Type: <span className="text-[#47752F]">{product.packagingType === 'Jar' ? 'Airtight Jar' : 'Airtight Packet'}</span>
                </label>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (product.packagingType === 'Jar' && product.linkedVariantSlug) {
                        navigate(`/product/${product.linkedVariantSlug}`);
                      }
                    }}
                    className={`py-2 px-4 rounded-lg text-xs font-semibold border transition-all ${
                      product.packagingType === 'Packet'
                        ? 'bg-[#47752F] text-white border-[#47752F] shadow-xs'
                        : 'bg-[#FFF9EF] text-[#4A2415] border-[#E9DDC9] hover:border-[#47752F]'
                    }`}
                  >
                    Airtight Packet
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (product.packagingType === 'Packet' && product.linkedVariantSlug) {
                        navigate(`/product/${product.linkedVariantSlug}`);
                      }
                    }}
                    className={`py-2 px-4 rounded-lg text-xs font-semibold border transition-all ${
                      product.packagingType === 'Jar'
                        ? 'bg-[#47752F] text-white border-[#47752F] shadow-xs'
                        : 'bg-[#FFF9EF] text-[#4A2415] border-[#E9DDC9] hover:border-[#47752F]'
                    }`}
                  >
                    Airtight Jar
                  </button>
                </div>
              </div>

              {/* Quantity Options (500g / 1000g) Selector */}
              {product.variants.length > 1 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#4A2415] uppercase tracking-wider">
                      Quantity Option: <span className="text-[#47752F]">{selectedWeight}</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.sku}
                        type="button"
                        onClick={() => setSelectedWeight(v.weight)}
                        className={`py-2 px-4 rounded-lg text-xs font-semibold border transition-all ${
                          selectedWeight === v.weight
                            ? 'bg-[#4A2415] text-[#FFF9EF] border-[#4A2415] shadow-xs'
                            : 'bg-[#FFF9EF] text-[#4A2415] border-[#E9DDC9] hover:border-[#47752F]'
                        }`}
                      >
                        {v.weight} — ₹{v.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper with Cybersecurity Bounds */}
              <div className="mt-6 flex items-center gap-4">
                <label className="text-xs font-bold text-[#4A2415] uppercase tracking-wider">Units:</label>
                <div className="flex items-center border border-[#E9DDC9] rounded-lg bg-[#FFF9EF]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-sm font-bold text-[#4A2415] hover:bg-[#E9DDC9]/50 rounded-l-lg"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold tabular-nums text-[#4A2415]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(SECURITY_RULES.MAX_QUANTITY_PER_ITEM, q + 1))}
                    className="px-3 py-1.5 text-sm font-bold text-[#4A2415] hover:bg-[#E9DDC9]/50 rounded-r-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#47752F] font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock & Fresh
                </span>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-[#47752F] text-white shadow-sm'
                      : 'bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] shadow-md hover:shadow-lg active:scale-98'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag — ₹{(activeVariant?.price || product.price) * quantity}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 bg-[#E99A19] hover:bg-[#E99A19]/90 text-[#4A2415] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Delivery PIN Code Checker */}
              <div className="mt-8 p-4 bg-[#FFF9EF] rounded-xl border border-[#E9DDC9]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4A2415] mb-2">
                  <MapPin className="w-4 h-4 text-[#47752F]" />
                  <span>Check Delivery PIN Code</span>
                </div>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit PIN (e.g. 400001, 110001)"
                    className="flex-1 px-3 py-1.5 bg-white border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#4A2415] hover:bg-[#47752F] text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Check
                  </button>
                </form>

                {pincodeResult && (
                  <div
                    className={`mt-3 p-2.5 rounded-lg text-xs flex items-start gap-2 border transition-all ${
                      pincodeResult.valid
                        ? 'bg-[#47752F]/10 border-[#47752F]/30 text-[#47752F]'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {pincodeResult.valid ? (
                      <Check className="w-4 h-4 shrink-0 text-[#47752F] mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    )}
                    <span className="leading-relaxed font-medium">{pincodeResult.message}</span>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Below Product Section: Tabbed Specifications */}
        <div className="mt-12 bg-white rounded-2xl border border-[#E9DDC9] p-6 sm:p-8 lg:p-10 shadow-xs">
          
          {/* Tabs Bar */}
          <div className="flex items-center gap-2 sm:gap-4 border-b border-[#E9DDC9] overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'desc', label: 'Product Description' },
              { id: 'ingredients', label: 'Ingredients & Purity' },
              { id: 'nutrition', label: 'Nutritional Information' },
              { id: 'storage', label: 'Storage Instructions' },
              { id: 'shipping', label: 'Shipping & Returns' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-[10px] ${
                  activeTab === tab.id
                    ? 'border-[#47752F] text-[#47752F]'
                    : 'border-transparent text-[#4A2415]/70 hover:text-[#4A2415]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="mt-8 text-xs sm:text-sm text-[#4A2415]/85 leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-3xl">
                <p className="text-base text-[#4A2415] font-medium leading-relaxed">
                  {product.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E9DDC9]/50">
                  <div className="bg-[#FFF9EF] p-4 rounded-xl border border-[#E9DDC9]/70">
                    <h4 className="font-bold text-[#4A2415] mb-1">Harvest & Terroir</h4>
                    <p className="text-xs text-[#4A2415]/80">{product.harvestOrigin} — single origin cane harvested during peak sugar concentration season.</p>
                  </div>
                  <div className="bg-[#FFF9EF] p-4 rounded-xl border border-[#E9DDC9]/70">
                    <h4 className="font-bold text-[#4A2415] mb-1">Traditional Method</h4>
                    <p className="text-xs text-[#4A2415]/80">Open iron pans heated over dried bagasse fire. Natural skimming preserves whole plant micronutrients.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="max-w-2xl space-y-4">
                <p className="font-bold text-[#4A2415]">Full List of Ingredients:</p>
                <ul className="space-y-2">
                  {product.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-[#FFF9EF] p-3 rounded-lg border border-[#E9DDC9]/60">
                      <Sparkles className="w-4 h-4 text-[#47752F]" />
                      <span className="font-medium text-[#4A2415]">{ing}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-3 bg-[#47752F]/10 rounded-lg text-xs text-[#47752F] font-medium">
                  Guaranteed zero synthetic clarifiers, zero sodium hydrosulphite, zero added refined sugars, zero artificial colors.
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="max-w-xl">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E9DDC9]">
                  <span className="font-bold text-[#4A2415]">Nutritional Facts</span>
                  <span className="text-xs text-[#4A2415]/60">Per {product.nutritionalInfo.servingSize}</span>
                </div>
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-[#E9DDC9]/50">
                    <tr>
                      <td className="py-2 font-medium text-[#4A2415]">Energy / Calories</td>
                      <td className="py-2 text-right font-bold tabular-nums text-[#4A2415]">{product.nutritionalInfo.energy}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-[#4A2415]">Carbohydrates</td>
                      <td className="py-2 text-right font-bold tabular-nums text-[#4A2415]">{product.nutritionalInfo.carbohydrates}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-[#4A2415]">Natural Cane Sugars</td>
                      <td className="py-2 text-right font-bold tabular-nums text-[#4A2415]">{product.nutritionalInfo.naturalSugars}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-[#4A2415]">Plant Protein</td>
                      <td className="py-2 text-right font-bold tabular-nums text-[#4A2415]">{product.nutritionalInfo.protein}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-[#47752F]">Bioavailable Iron</td>
                      <td className="py-2 text-right font-bold tabular-nums text-[#47752F]">{product.nutritionalInfo.iron}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-[#4A2415]">Potassium</td>
                      <td className="py-2 text-right font-bold tabular-nums text-[#4A2415]">{product.nutritionalInfo.potassium}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-[#4A2415]">Magnesium</td>
                      <td className="py-2 text-right font-bold tabular-nums text-[#4A2415]">{product.nutritionalInfo.magnesium}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-[#4A2415]">Calcium</td>
                      <td className="py-2 text-right font-bold tabular-nums text-[#4A2415]">{product.nutritionalInfo.calcium}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="max-w-2xl space-y-3">
                <p className="font-semibold text-[#4A2415]">{product.storageInstructions}</p>
                <div className="p-4 bg-[#FFF9EF] rounded-xl border border-[#E9DDC9] text-xs text-[#4A2415]/80 space-y-2">
                  <p><strong>Warm Season Tip:</strong> Pure jaggery is naturally hygroscopic (it naturally absorbs atmospheric moisture). Always use a dry spoon and close the seal tightly.</p>
                  <p><strong>Monsoon Care:</strong> Transfer to an airtight glass jar or preserve in the refrigerator vegetable drawer to maintain crisp crumbly consistency.</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-2xl space-y-3">
                <p className="font-semibold text-[#4A2415]">{product.shippingInfo}</p>
                <div className="space-y-2 text-xs text-[#4A2415]/80">
                  <p>• <strong>Pan-India Delivery:</strong> Dispatched from our central humidity-controlled fulfillment centers.</p>
                  <p>• <strong>Free Shipping:</strong> On all orders of ₹499 or above.</p>
                  <p>• <strong>Damage Replacement Guarantee:</strong> If your package arrives damaged, share a photo via WhatsApp within 24 hours for instant reshipment.</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold text-[#47752F] uppercase tracking-wider">Pair With</span>
              <h2 className="text-2xl font-extrabold text-[#4A2415] tracking-tight mt-0.5">
                Related Jaggery Products
              </h2>
            </div>
            <Link to="/shop" className="text-xs font-bold text-[#47752F] hover:text-[#4A2415] flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
