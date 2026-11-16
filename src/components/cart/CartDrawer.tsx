import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, Share2, Truck, Tag, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { PRODUCTS, FREE_SHIPPING_THRESHOLD, HERO_IMAGE } from '../../data/products';
import { SECURITY_RULES } from '../../utils/security';

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

  // Mobile tab state: 'cart' or'addons'
  const [mobileTab, setMobileTab] = useState<'cart' |'addons'>('cart');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [shareFeedback, setShareFeedback] = useState(false);

  if (!isDrawerOpen) return null;

  // Pick recommendations from fresh organic products
  const cartProductIds = new Set(items.map((i) => i.productId));
  const recommendationList = [
    ...PRODUCTS.filter((p) => !cartProductIds.has(p.id)),
    ...PRODUCTS.filter((p) => cartProductIds.has(p.id)),
  ];

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
  const isFreeShippingUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD;
  const isDiscountUnlocked = subtotal >= DISCOUNT_THRESHOLD;

  let progressPercentage = 0;
  if (subtotal <= 0) {
    progressPercentage = 0;
  } else if (subtotal < FREE_SHIPPING_THRESHOLD) {
    progressPercentage = Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 50);
  } else if (subtotal < DISCOUNT_THRESHOLD) {
    const extra = subtotal - FREE_SHIPPING_THRESHOLD;
    const span = DISCOUNT_THRESHOLD - FREE_SHIPPING_THRESHOLD;
    progressPercentage = 50 + Math.round((extra / span) * 50);
  } else {
    progressPercentage = 100;
  }

  const freeShippingAway = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const discountAway = Math.max(0, DISCOUNT_THRESHOLD - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2E1810]/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl bg-[#FFFFFF] h-full max-h-full shadow-2xl flex flex-col overflow-hidden z-10 text-[#2E1810]">
       
        {/* Top Header Bar matching reference */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 md:px-5 lg:px-7 border-b border-[#EFE7DA] bg-[#FFFFFF] flex items-center justify-between transition-colors shrink-0">
          <h2 className="text-base sm:text-lg md:text-lg lg:text-xl font-bold tracking-tight text-[#2E1810] uppercase">
            YOUR CART
          </h2>

          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
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
                <span className="absolute -bottom-7 right-0 text-[10px] bg-[#2E1810] text-[#FFF9EF] px-2 py-0.5 rounded shadow whitespace-nowrap z-20 font-bold">
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
                className="px-3.5 sm:px-4 py-1.5 bg-[#4A2415] hover:bg-[#381a0e] text-[#FFF9EF] text-xs sm:text-sm font-semibold rounded-xs transition-colors flex items-center gap-1.5"
              >
                <span>{user.fullName.split('')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="px-4 sm:px-5 py-1.5 bg-[#4A2415] hover:bg-[#381a0e] text-[#FFF9EF] text-xs sm:text-sm font-semibold rounded-xs transition-colors shadow-xs"
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
        <div className="md:hidden flex border-b border-[#EFE7DA] bg-[#FAF5EE] text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setMobileTab('cart')}
            className={`flex-1 py-3 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 touch-manipulation cursor-pointer ${
              mobileTab ==='cart'
                ?'border-[#4A2415] text-[#4A2415] bg-white font-bold'
                : 'border-transparent text-[#2E1810]/60 hover:text-[#2E1810]'
            }`}
          >
            <span>Cart Items</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                mobileTab ==='cart'
                  ?'bg-[#4A2415] text-[#FFF9EF]'
                  : 'bg-[#EFE7DA] text-[#4A2415]'
              }`}
            >
              {totalItemCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('addons')}
            className={`flex-1 py-3 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 touch-manipulation cursor-pointer ${
              mobileTab ==='addons'
                ?'border-[#47752F] text-[#47752F] bg-white font-bold'
                : 'border-transparent text-[#2E1810]/60 hover:text-[#2E1810]'
            }`}
          >
            <span>Grab These Too!</span>
            <span className="text-sm">🌿</span>
          </button>
        </div>

        {/* Main 2-Column Body */}
        <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col md:flex-row">
         
          {/* LEFT COLUMN: Recommendations */}
          <div
            className={`w-full md:w-5/12 lg:w-1/2 flex-1 md:flex-none min-h-0 bg-[#FAF5EE] border-b md:border-b-0 md:border-r border-[#EFE7DA] flex-col overflow-hidden ${
              mobileTab ==='cart' ?'hidden md:flex' : 'flex'
            }`}
          >
            {/* Header with Title & Sourcing Badge */}
            <div className="px-3.5 py-2.5 sm:px-4 md:px-4 lg:px-6 sm:pt-3.5 sm:pb-3 border-b border-[#EFE7DA] bg-[#FAF5EE] shrink-0">
              <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                <h3 className="text-[#47752F] font-bold text-xs sm:text-sm md:text-xs lg:text-base tracking-tight truncate">
                  Great Choice! Grab these too!
                </h3>
                <span className="text-[10px] font-semibold text-[#8D5B18] bg-[#E99A19]/10 px-2 py-0.5 rounded-full border border-[#E99A19]/25 shrink-0 whitespace-nowrap">
                  100% Organic UP
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#2E1810]/60 mt-0.5 line-clamp-1">
                Quickly add pure organic jaggery, cubes, khand & shakkar to your bag
              </p>
            </div>

            {/* Recommendations Vertical Scrollable List strictly bounded */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-4 md:px-3.5 lg:px-6 py-2.5 sm:pb-5 space-y-2.5 divide-y divide-[#EFE7DA]/60">
              {recommendationList.map((product) => {
                const isJustAdded = addedItemIds[product.id];
                return (
                  <div
                    key={product.id}
                    className="pt-2.5 first:pt-0 flex items-center justify-between gap-2 sm:gap-2.5 md:gap-2 lg:gap-3 group"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-lg bg-white border border-[#E8DEC8]/80 overflow-hidden shrink-0 shadow-xs">
                      <img
                        src={product.primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.currentTarget.src = HERO_IMAGE;
                        }}
                      />
                    </div>

                    {/* Product Details with strict text containment */}
                    <div className="flex-1 min-w-0 pr-1">
                      <h4 className="text-xs sm:text-[13px] md:text-xs lg:text-sm font-semibold text-[#2E1810] leading-tight line-clamp-2 break-words">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs sm:text-[13px] md:text-xs lg:text-sm font-bold text-[#47752F] tabular-nums shrink-0">
                          ₹{product.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-[#2E1810]/60 bg-white/80 px-1.5 py-0.5 rounded border border-[#E8DEC8]/60 truncate max-w-[100px] md:max-w-[85px] lg:max-w-[120px]">
                          {product.packagingType ||'Packet'} · {product.weight}
                        </span>
                      </div>
                    </div>

                    {/* Touch-Friendly Add Button */}
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      disabled={isJustAdded}
                      className={`min-h-[32px] md:min-h-[30px] lg:min-h-[36px] min-w-[58px] md:min-w-[56px] lg:min-w-[76px] px-2.5 md:px-2 lg:px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 shrink-0 touch-manipulation cursor-pointer active:scale-95 shadow-xs flex items-center justify-center ${
                        isJustAdded
                          ?'bg-[#47752F] text-white'
                          : 'bg-[#4A2415] hover:bg-[#35190e] text-white'
                      }`}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      {isJustAdded ? (
                        <span className="flex items-center gap-1 font-bold text-[11px] lg:text-xs">
                          <Check className="w-3 h-3 lg:w-3.5 lg:h-3.5" /> Added
                        </span>
                      ) : (
                       '+ Add'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Sticky Checkout Bar in Recommendations on small screens when items exist */}
            {items.length > 0 && (
              <div className="md:hidden shrink-0 p-3 bg-white border-t border-[#EFE7DA] flex items-center justify-between gap-2 shadow-xs pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div>
                  <span className="text-[10px] text-[#2E1810]/60 block leading-tight">Total ({totalItemCount} item{totalItemCount === 1 ?'' : 's'})</span>
                  <span className="text-xs sm:text-sm font-bold text-[#2E1810] tabular-nums">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMobileTab('cart')}
                    className="md:hidden px-2.5 py-1.5 bg-[#FAF5EE] hover:bg-[#EFE7DA] text-[#4A2415] text-xs font-semibold rounded-lg border border-[#E8DEC8]/80 transition-colors"
                  >
                    View Bag
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="px-3.5 py-1.5 bg-[#4A2415] hover:bg-[#35190e] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Milestones, Cart Items & Checkout */}
          <div
            className={`w-full md:w-7/12 lg:w-1/2 flex-1 md:flex-none min-h-0 bg-[#FFFFFF] flex-col overflow-hidden ${
              mobileTab ==='addons' ?'hidden md:flex' : 'flex'
            }`}
          >
            {/* Top Milestones Section */}
            <div className="shrink-0 p-3.5 sm:p-4 md:p-3.5 lg:p-6 border-b border-[#EFE7DA] bg-[#FFFFFF]">
              {/* Milestone Icons & Labels */}
              <div className="flex items-center justify-between text-xs text-[#6B5E54] mb-2 px-0.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-5.5 h-5.5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center transition-colors ${
                      isFreeShippingUnlocked
                        ?'bg-[#47752F] text-white'
                        : 'bg-[#F2ECE1] text-[#4A2415]'
                    }`}
                  >
                    {isFreeShippingUnlocked ? (
                      <Check className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                    ) : (
                      <Truck className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                    )}
                  </div>
                  <span
                    className={`font-medium text-[11px] lg:text-xs ${
                      isFreeShippingUnlocked ?'text-[#47752F] font-bold' : 'text-[#6B5E54]'
                    }`}
                  >
                    Free Shipping
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-5.5 h-5.5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center transition-colors ${
                      isDiscountUnlocked
                        ?'bg-[#47752F] text-white'
                        : 'bg-[#F2ECE1] text-[#4A2415]'
                    }`}
                  >
                    {isDiscountUnlocked ? (
                      <Check className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                    ) : (
                      <Tag className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                    )}
                  </div>
                  <span
                    className={`font-medium text-[11px] lg:text-xs ${
                      isDiscountUnlocked ?'text-[#47752F] font-bold' : 'text-[#6B5E54]'
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

              {/* Dynamic Milestone Copy */}
              <div className="text-center mt-2 text-xs sm:text-xs md:text-xs lg:text-sm text-[#2E1810]">
                {subtotal <= 0 ? (
                  <span>Add items to unlock <strong>FREE SHIPPING</strong>!</span>
                ) : !isFreeShippingUnlocked ? (
                  <span>
                    You are ₹{freeShippingAway.toFixed(2)} away from{''}
                    <strong className="font-bold">FREE SHIPPING!</strong>
                  </span>
                ) : !isDiscountUnlocked ? (
                  <span>
                    You unlocked <strong>FREE SHIPPING!</strong> Add ₹{discountAway.toFixed(2)} more for{''}
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
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3.5 sm:p-4 md:p-3.5 lg:p-6 space-y-3.5 lg:space-y-4">
              {items.length === 0 ? (
                <div className="min-h-full flex flex-col items-center justify-center text-center p-6 text-[#2E1810]">
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
                    className="flex items-start gap-2.5 sm:gap-3 md:gap-2.5 lg:gap-4 pb-3.5 border-b border-[#EFE7DA]/70 last:border-b-0"
                  >
                    {/* Square Image */}
                    <div className="w-14 h-14 sm:w-15 sm:h-15 md:w-13 md:h-13 lg:w-20 lg:h-20 rounded-md bg-[#FAF5EE] border border-[#EFE7DA] overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = HERO_IMAGE;
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                        <div>
                          <h4 className="text-xs sm:text-[13px] md:text-xs lg:text-sm font-semibold text-[#2E1810] line-clamp-2 leading-snug">
                            {item.name}
                          </h4>
                          <span className="text-[10px] md:text-[10px] lg:text-[11px] text-[#2E1810]/60 block mt-0.5">
                            Pack: {item.weight}
                          </span>
                        </div>

                        {/* Trash Delete Icon */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8C827A] hover:text-red-700 p-1 -mr-1 transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2.5 lg:mt-3">
                        {/* Stepper */}
                        <div className="inline-flex items-center border border-[#D6C7B2] rounded-md bg-white text-xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 lg:px-2.5 lg:py-1 text-[#2E1810] hover:bg-[#FAF5EE] transition-colors font-medium touch-manipulation"
                            aria-label="Decrease quantity"
                          >
                            —
                          </button>
                          <span className="px-2 lg:px-3 py-0.5 lg:py-1 text-xs font-semibold tabular-nums text-[#2E1810] min-w-[20px] lg:min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, Math.min(SECURITY_RULES.MAX_QUANTITY_PER_ITEM, item.quantity + 1))}
                            className="px-2 py-0.5 lg:px-2.5 lg:py-1 text-[#2E1810] hover:bg-[#FAF5EE] transition-colors font-medium touch-manipulation"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs sm:text-[13px] md:text-xs lg:text-sm font-semibold text-[#2E1810] tabular-nums">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Checkout Section with iOS safe-area padding (shrink-0 pinned) */}
            <div className="shrink-0 p-3.5 sm:p-4 md:p-3.5 lg:p-6 border-t border-[#EFE7DA] bg-[#FFFFFF] space-y-2.5 lg:space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg z-20">
              <div className="flex items-center justify-between text-xs sm:text-xs md:text-xs lg:text-sm text-[#2E1810]">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">
                    Subtotal ({totalItemCount} item{totalItemCount === 1 ?'' : 's'})
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileTab('addons')}
                    className="md:hidden text-[11px] font-bold text-[#47752F] underline ml-2 cursor-pointer touch-manipulation"
                  >
                    + Add More
                  </button>
                </div>
                <span className="text-xs sm:text-sm md:text-xs lg:text-base font-semibold text-[#2E1810] tabular-nums">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button (Bottom Right) */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="w-full py-3 lg:py-3.5 bg-[#47752F] hover:bg-[#3d6826] disabled:bg-[#4A2415] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm md:text-xs lg:text-base tracking-wide flex items-center justify-center gap-1.5 rounded-xl transition-all shadow-md touch-manipulation active:scale-[0.99] cursor-pointer"
              >
                <span>
                  {items.length > 0 ?`Checkout (₹${subtotal.toFixed(0)})` : 'Checkout'}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
