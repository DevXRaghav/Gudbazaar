import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, Share2, Truck, Tag, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { PRODUCTS, FREE_SHIPPING_THRESHOLD } from '../../data/products';

const DISCOUNT_THRESHOLD = 999; // 5% discount milestone threshold

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    addToCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItemCount,
  } = useCart();

  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  // Mobile tab state: 'cart' or 'addons'
  const [mobileTab, setMobileTab] = useState<'cart' | 'addons'>('cart');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [shareFeedback, setShareFeedback] = useState(false);

  if (!isDrawerOpen) return null;

  // Selected quick-add recommendations
  const recommendedSlugs = [
    'brown-desi-khand-1kg',
    'jaggery-cubes-gur-ki-dali-650gm',
    'sulphurless-desi-khand-1kg',
    'gur-chana-roasted-chickpeas-200gm',
    'peanut-chikki-cookies-healthy-jaggery-snack-200g',
    'palm-jaggery-270g',
    'natural-desi-jaggery-block',
    'liquid-jaggery-syrup-kakvi',
  ];

  // Pick recommendations that match or fall back to any available PRODUCTS
  const recommendationList = recommendedSlugs
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is (typeof PRODUCTS)[0] => Boolean(p));

  const handleQuickAdd = (product: (typeof PRODUCTS)[0]) => {
    addToCart(product, product.variants[0]?.weight || product.weight, 1);
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Gudbazaar - Pure Natural Jaggery & Desi Khand',
          text: 'Check out authentic artisanal jaggery handcrafted from single-origin sugarcane!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 2000);
      }
    } catch {
      // User cancelled share
    }
  };

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  // Milestone Progress Calculations
  // Step 1: Free Shipping (₹499)
  // Step 2: 5% Discount (₹999)
  const isFreeShippingUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD;
  const isDiscountUnlocked = subtotal >= DISCOUNT_THRESHOLD;

  let progressPercentage = 0;
  if (subtotal <= 0) {
    progressPercentage = 0;
  } else if (subtotal < FREE_SHIPPING_THRESHOLD) {
    // 0% to 50%
    progressPercentage = Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 50);
  } else if (subtotal < DISCOUNT_THRESHOLD) {
    // 50% to 100%
    const extra = subtotal - FREE_SHIPPING_THRESHOLD;
    const span = DISCOUNT_THRESHOLD - FREE_SHIPPING_THRESHOLD;
    progressPercentage = 50 + Math.round((extra / span) * 50);
  } else {
    progressPercentage = 100;
  }

  const freeShippingAway = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const discountAway = Math.max(0, DISCOUNT_THRESHOLD - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2E1810]/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Container: wide 2-column modal as shown in reference */}
      <div className="relative w-full max-w-full md:max-w-4xl lg:max-w-5xl bg-[#FFFFFF] h-full shadow-2xl flex flex-col z-10 text-[#2E1810] animate-in slide-in-from-right duration-300">
        
        {/* Top Header Bar matching reference: "YOUR CART", Share, Login, Close */}
        <div className="px-5 py-4 sm:px-7 sm:py-5 border-b border-[#EFE7DA] bg-[#FFFFFF] flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#2E1810] uppercase">
            YOUR CART
          </h2>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Share Button */}
            <div className="relative">
              <button
                onClick={handleShare}
                className="p-1.5 text-[#2E1810]/70 hover:text-[#2E1810] transition-colors rounded-md hover:bg-[#FAF5EE]"
                title="Share Gudbazaar"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {shareFeedback && (
                <span className="absolute -bottom-7 right-0 text-[10px] bg-[#2E1810] text-[#FFF9EF] px-2 py-0.5 rounded shadow whitespace-nowrap z-20">
                  Link copied!
                </span>
              )}
            </div>

            {/* Login / Customer Profile CTA button */}
            {user ? (
              <button
                onClick={() => {
                  closeDrawer();
                  openAuthModal('profile');
                }}
                className="px-4 py-1.5 bg-[#4A2415] hover:bg-[#381a0e] text-[#FFF9EF] text-xs sm:text-sm font-semibold rounded-xs transition-colors flex items-center gap-1.5"
              >
                <span>{user.fullName.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="px-5 py-1.5 bg-[#4A2415] hover:bg-[#381a0e] text-[#FFF9EF] text-xs sm:text-sm font-semibold rounded-xs transition-colors shadow-xs"
              >
                Login
              </button>
            )}

            {/* Close (X) Button */}
            <button
              onClick={closeDrawer}
              className="p-1.5 text-[#2E1810]/70 hover:text-[#2E1810] transition-colors rounded-md hover:bg-[#FAF5EE]"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile View Toggle Switch (< md screens) */}
        <div className="md:hidden flex border-b border-[#EFE7DA] bg-[#FAF5EE] text-xs font-semibold">
          <button
            onClick={() => setMobileTab('cart')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              mobileTab === 'cart'
                ? 'border-[#4A2415] text-[#4A2415] bg-white'
                : 'border-transparent text-[#2E1810]/60'
            }`}
          >
            Cart Items ({totalItemCount})
          </button>
          <button
            onClick={() => setMobileTab('addons')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              mobileTab === 'addons'
                ? 'border-[#47752F] text-[#47752F] bg-white'
                : 'border-transparent text-[#2E1810]/60'
            }`}
          >
            Grab These Too! 🌿
          </button>
        </div>

        {/* Main 2-Column Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* ================= LEFT COLUMN: "Great Choice! Grab these too!" ================= */}
          <div
            className={`w-full md:w-[48%] bg-[#FAF5EE] border-b md:border-b-0 md:border-r border-[#EFE7DA] flex flex-col min-h-0 ${
              mobileTab === 'cart' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="px-5 pt-4 pb-2.5 sm:px-6 sm:pt-5 sm:pb-3">
              <h3 className="text-[#47752F] font-bold text-sm sm:text-base tracking-tight">
                Great Choice! Grab these too!
              </h3>
            </div>

            {/* Recommendations Vertical List */}
            <div className="flex-1 overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6 space-y-3.5 divide-y divide-[#EFE7DA]/50">
              {recommendationList.map((product) => {
                const isJustAdded = addedItemIds[product.id];
                return (
                  <div
                    key={product.id}
                    className="pt-3.5 first:pt-0 flex items-center justify-between gap-3 group"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xs bg-white border border-[#E8DEC8]/80 overflow-hidden shrink-0">
                      <img
                        src={product.primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.currentTarget.src = '/images/hero_jaggery_display.jpg';
                        }}
                      />
                    </div>

                    {/* Product Name & Price */}
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs sm:text-sm font-medium text-[#2E1810] leading-snug line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-xs sm:text-sm font-normal text-[#2E1810] mt-1">
                        ₹{product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Dark Brown "Add" Button matching reference screenshot */}
                    <button
                      onClick={() => handleQuickAdd(product)}
                      disabled={isJustAdded}
                      className={`px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-xs transition-all duration-150 shrink-0 ${
                        isJustAdded
                          ? 'bg-[#47752F] text-white'
                          : 'bg-[#4A2415] hover:bg-[#35190e] text-white shadow-xs'
                      }`}
                    >
                      {isJustAdded ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Added
                        </span>
                      ) : (
                        'Add'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Milestones, Cart Items & Checkout ================= */}
          <div
            className={`w-full md:w-[52%] bg-[#FFFFFF] flex flex-col justify-between min-h-0 ${
              mobileTab === 'addons' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Top Milestones Section */}
            <div className="p-4 sm:p-6 border-b border-[#EFE7DA] bg-[#FFFFFF]">
              {/* Milestone Icons & Labels */}
              <div className="flex items-center justify-between text-xs text-[#6B5E54] mb-2 px-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isFreeShippingUnlocked
                        ? 'bg-[#47752F] text-white'
                        : 'bg-[#F2ECE1] text-[#4A2415]'
                    }`}
                  >
                    {isFreeShippingUnlocked ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Truck className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span
                    className={`font-medium ${
                      isFreeShippingUnlocked ? 'text-[#47752F] font-bold' : 'text-[#6B5E54]'
                    }`}
                  >
                    Free Shipping
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isDiscountUnlocked
                        ? 'bg-[#47752F] text-white'
                        : 'bg-[#F2ECE1] text-[#4A2415]'
                    }`}
                  >
                    {isDiscountUnlocked ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Tag className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span
                    className={`font-medium ${
                      isDiscountUnlocked ? 'text-[#47752F] font-bold' : 'text-[#6B5E54]'
                    }`}
                  >
                    5% Discount
                  </span>
                </div>
              </div>

              {/* Dual-Tier Progress Bar */}
              <div className="w-full h-1.5 bg-[#EFE7DA] rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-[#4A2415] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Dynamic Milestone Copy matching screenshot */}
              <div className="text-center mt-2 text-xs sm:text-sm text-[#2E1810]">
                {subtotal <= 0 ? (
                  <span>Add items to unlock <strong>FREE SHIPPING</strong>!</span>
                ) : !isFreeShippingUnlocked ? (
                  <span>
                    You are ₹{freeShippingAway.toFixed(2)} away from{' '}
                    <strong className="font-bold">FREE SHIPPING!</strong>
                  </span>
                ) : !isDiscountUnlocked ? (
                  <span>
                    You unlocked <strong>FREE SHIPPING!</strong> Add ₹{discountAway.toFixed(2)} more for{' '}
                    <strong className="text-[#47752F] font-bold">5% DISCOUNT!</strong>
                  </span>
                ) : (
                  <span className="text-[#47752F] font-bold">
                    🎉 You unlocked FREE SHIPPING & 5% DISCOUNT!
                  </span>
                )}
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#2E1810]">
                  <div className="w-16 h-16 rounded-full bg-[#FAF5EE] border border-[#EFE7DA] flex items-center justify-center mb-3">
                    <ShoppingBag className="w-8 h-8 text-[#47752F]/70" />
                  </div>
                  <h3 className="text-base font-bold text-[#2E1810]">Your cart is empty</h3>
                  <p className="text-xs text-[#2E1810]/70 mt-1 max-w-xs">
                    Choose from our selection on the left to quickly add items to your cart!
                  </p>
                  <button
                    onClick={() => setMobileTab('addons')}
                    className="md:hidden mt-4 px-4 py-2 bg-[#4A2415] text-white text-xs font-semibold rounded-xs"
                  >
                    View Recommended Items
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 sm:gap-4 pb-4 border-b border-[#EFE7DA]/70 last:border-b-0"
                  >
                    {/* Square Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xs bg-[#FAF5EE] border border-[#EFE7DA] overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/hero_jaggery_display.jpg';
                        }}
                      />
                    </div>

                    {/* Details: Title & Trash on top, Stepper & Price below */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-[#2E1810] line-clamp-2 leading-snug">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-[#2E1810]/60 block mt-0.5">
                            Pack: {item.weight}
                          </span>
                        </div>

                        {/* Trash Delete Icon matching reference */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8C827A] hover:text-red-700 p-1 -mr-1 transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Boxed Stepper matching reference screenshot: [ - ] 1 [ + ] */}
                        <div className="inline-flex items-center border border-[#D6C7B2] rounded-xs bg-white text-xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-[#2E1810] hover:bg-[#FAF5EE] transition-colors font-medium"
                            aria-label="Decrease quantity"
                          >
                            —
                          </button>
                          <span className="px-3 py-1 text-xs font-semibold tabular-nums text-[#2E1810] min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-[#2E1810] hover:bg-[#FAF5EE] transition-colors font-medium"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Price formatted with decimals matching screenshot */}
                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-semibold text-[#2E1810] tabular-nums">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Checkout Section matching reference screenshot */}
            <div className="p-4 sm:p-6 border-t border-[#EFE7DA] bg-[#FFFFFF] space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm text-[#2E1810]">
                <span className="font-medium">
                  Subtotal ({totalItemCount} item{totalItemCount === 1 ? '' : 's'})
                </span>
                <span className="text-sm sm:text-base font-semibold text-[#2E1810] tabular-nums">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              {/* Prominent Full-Width Dark Brown "Checkout →" Button */}
              <button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="w-full py-3.5 bg-[#4A2415] hover:bg-[#35190e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm sm:text-base tracking-wide flex items-center justify-center gap-1.5 rounded-xs transition-colors shadow-xs"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
