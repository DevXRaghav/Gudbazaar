import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Tag, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FREE_SHIPPING_THRESHOLD } from '../data/products';
import { SEOHead } from '../components/seo/SEOHead';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    total,
    freeShippingRemaining,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res.message);
    if (res.success) {
      setCouponInput('');
    }
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <div className="bg-[#FFF9EF] dark:bg-[#120A06] min-h-screen py-8 sm:py-12 transition-colors duration-200">
      <SEOHead
        title="Your Shopping Bag | Gudbazaar"
        description="Review items in your Gudbazaar shopping bag and apply seasonal discounts."
        canonicalPath="/cart"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#4A2415]/70 dark:text-[#D8C7B8]/70 mb-6">
          <Link to="/" className="hover:text-[#47752F] dark:hover:text-[#6BB545]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#47752F] dark:hover:text-[#6BB545]">Shop</Link>
          <span>/</span>
          <span className="text-[#4A2415] dark:text-[#F5EBE1] font-semibold">Shopping Bag</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A2415] dark:text-[#F5EBE1] tracking-tight mb-8">
          Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)} items)
        </h1>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-[#1C110B] rounded-2xl border border-[#E9DDC9] dark:border-[#3B2519] p-12 text-center max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FFF9EF] dark:bg-[#261810] border border-[#E9DDC9] dark:border-[#3B2519] text-[#47752F] dark:text-[#6BB545] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[#4A2415] dark:text-[#F5EBE1]">Your bag is completely empty</h2>
            <p className="text-xs text-[#4A2415]/70 dark:text-[#D8C7B8]/70 mt-1 max-w-sm mx-auto">
              You have not added any natural jaggery products yet. Explore our bestselling collections and add authentic sweetness to your home.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#4A2415] dark:bg-[#6BB545] hover:bg-[#47752F] dark:hover:bg-[#5aa038] text-[#FFF9EF] dark:text-[#120A06] text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start">
            
            {/* Left Items Column */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
              
              {/* Free Shipping Progress */}
              <div className="bg-white dark:bg-[#1C110B] p-4 sm:p-5 rounded-xl border border-[#E9DDC9] dark:border-[#3B2519] shadow-xs">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  {freeShippingRemaining > 0 ? (
                    <span className="text-[#4A2415] dark:text-[#F5EBE1]">
                      Add <strong className="text-[#47752F] dark:text-[#6BB545]">₹{freeShippingRemaining}</strong> more for <strong>FREE Delivery</strong> across India
                    </span>
                  ) : (
                    <span className="text-[#47752F] dark:text-[#6BB545] flex items-center gap-1 font-bold">
                      <Sparkles className="w-4 h-4 text-[#E99A19] dark:text-[#F5AA28]" /> Congratulations! You have unlocked FREE Shipping
                    </span>
                  )}
                  <span className="tabular-nums text-[#4A2415]/70 dark:text-[#D8C7B8]/70">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#FFF9EF] dark:bg-[#261810] border border-[#E9DDC9] dark:border-[#3B2519] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#47752F] dark:bg-[#6BB545] rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Freshness & Moisture Reminder */}
              <div className="bg-[#FFF9EF] dark:bg-[#261810] p-3.5 rounded-xl border border-[#E9DDC9] dark:border-[#3B2519] flex items-center gap-3 text-xs text-[#4A2415] dark:text-[#F5EBE1]">
                <Sparkles className="w-4 h-4 text-[#47752F] dark:text-[#6BB545] shrink-0" />
                <span><strong>Fresh Batch Guarantee:</strong> All items are prepared fresh from organic UP sugarcane. To preserve peak taste, keep away from moisture and store in a sealed pack container, airtight jar, or packet.</span>
              </div>

              {/* Items Card */}
              <div className="bg-white dark:bg-[#1C110B] rounded-xl border border-[#E9DDC9] dark:border-[#3B2519] divide-y divide-[#E9DDC9]/70 dark:divide-[#3B2519] shadow-xs overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 lg:p-6 flex flex-col sm:flex-row md:flex-col xl:flex-row gap-4 sm:items-center md:items-stretch xl:items-center justify-between">
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-[#FFF9EF] dark:bg-[#261810] border border-[#E9DDC9] dark:border-[#3B2519] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-semibold text-[#47752F] dark:text-[#6BB545] uppercase tracking-wider block">
                          {item.category}
                        </span>
                        <Link
                          to={`/product/${item.slug}`}
                          className="text-sm sm:text-base font-bold text-[#4A2415] dark:text-[#F5EBE1] hover:text-[#47752F] dark:hover:text-[#6BB545] transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[#4A2415]/70 dark:text-[#D8C7B8]/70 mt-0.5">
                          Pack Size: <span className="font-semibold text-[#4A2415] dark:text-[#F5EBE1]">{item.weight}</span>
                        </p>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-sm font-bold text-[#4A2415] dark:text-[#F5EBE1] tabular-nums">
                            ₹{item.price}
                          </span>
                          {item.mrp > item.price && (
                            <span className="text-xs text-[#4A2415]/40 dark:text-[#D8C7B8]/40 line-through tabular-nums">
                              ₹{item.mrp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end md:justify-between xl:justify-end gap-4 sm:gap-6 pt-2 sm:pt-0 md:pt-3 xl:pt-0 border-t sm:border-t-0 md:border-t xl:border-t-0 border-[#E9DDC9]/50 dark:border-[#3B2519] shrink-0">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E9DDC9] dark:border-[#3B2519] rounded-lg bg-[#FFF9EF] dark:bg-[#261810]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-sm font-bold text-[#4A2415] dark:text-[#F5EBE1] hover:bg-[#E9DDC9]/50 dark:hover:bg-[#322016] rounded-l-lg touch-manipulation"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3.5 py-1 text-xs font-bold tabular-nums text-[#4A2415] dark:text-[#F5EBE1]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-sm font-bold text-[#4A2415] dark:text-[#F5EBE1] hover:bg-[#E9DDC9]/50 dark:hover:bg-[#322016] rounded-r-lg touch-manipulation"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-base font-extrabold text-[#4A2415] dark:text-[#F5EBE1] tabular-nums">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#4A2415]/40 dark:text-[#D8C7B8]/50 hover:text-red-700 dark:hover:text-red-400 p-1.5 transition-colors touch-manipulation"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between text-xs">
                <Link
                  to="/shop"
                  className="font-semibold text-[#47752F] dark:text-[#6BB545] hover:text-[#4A2415] dark:hover:text-[#F5EBE1] flex items-center gap-1"
                >
                  <span>← Continue Shopping</span>
                </Link>
                <button
                  onClick={clearCart}
                  className="text-[#4A2415]/60 dark:text-[#D8C7B8]/60 hover:text-red-700 dark:hover:text-red-400 underline touch-manipulation"
                >
                  Clear Entire Bag
                </button>
              </div>

            </div>

            {/* Right Summary Column */}
            <div className="md:col-span-5 lg:col-span-4 [@media(min-width:1024px)_and_(min-height:760px)]:sticky [@media(min-width:1024px)_and_(min-height:760px)]:top-24 bg-white dark:bg-[#1C110B] rounded-xl border border-[#E9DDC9] dark:border-[#3B2519] p-5 md:p-4 lg:p-6 shadow-xs space-y-5 md:space-y-4 lg:space-y-5 transition-colors min-w-0">
              <h2 className="text-base font-bold text-[#4A2415] dark:text-[#F5EBE1] pb-3 border-b border-[#E9DDC9] dark:border-[#3B2519]">
                Order Summary
              </h2>

              {/* Coupon Engine */}
              <div>
                <label className="block text-xs font-semibold text-[#4A2415] dark:text-[#F5EBE1] mb-1.5">
                  Have a Coupon Code?
                </label>
                {coupon ? (
                  <div className="flex items-center justify-between bg-[#FFF9EF] dark:bg-[#261810] px-3 py-2 rounded-lg border border-[#47752F]/40 dark:border-[#6BB545]/40 text-xs">
                    <div className="flex items-center gap-1.5 text-[#47752F] dark:text-[#6BB545] font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{coupon.code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#47752F] dark:text-[#6BB545] tabular-nums">-₹{discount}</span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-red-700 dark:text-red-400 hover:underline touch-manipulation"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. SWEET10, FIRSTGUD"
                      className="flex-1 min-w-0 w-full px-3 py-2 bg-[#FFF9EF] dark:bg-[#261810] border border-[#E9DDC9] dark:border-[#42291C] rounded-lg text-xs uppercase tracking-wider text-[#4A2415] dark:text-[#F5EBE1] focus:outline-none focus:border-[#47752F] dark:focus:border-[#6BB545]"
                    />
                    <button
                      type="submit"
                      className="shrink-0 px-3.5 lg:px-4 py-2 bg-[#4A2415] dark:bg-[#6BB545] hover:bg-[#47752F] dark:hover:bg-[#5aa038] text-white dark:text-[#120A06] text-xs font-bold rounded-lg transition-colors touch-manipulation cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {(couponFeedback || couponError) && !coupon && (
                  <p className="mt-1.5 text-[11px] text-red-700 dark:text-red-400 font-medium">
                    {couponError || couponFeedback}
                  </p>
                )}

                {/* Available Offers hint */}
                <div className="mt-2 text-[11px] text-[#4A2415]/70 dark:text-[#D8C7B8]/70 bg-[#FFF9EF] dark:bg-[#261810] p-2.5 rounded-lg border border-[#E9DDC9]/60 dark:border-[#3B2519]">
                  <span className="font-bold text-[#47752F] dark:text-[#6BB545] block">Available Coupons:</span>
                  <p>• <strong>SWEET10</strong>: 10% off above ₹299</p>
                  <p>• <strong>FIRSTGUD</strong>: 15% off first order (above ₹450)</p>
                  <p>• <strong>PUREJAGGERY</strong>: 20% off above ₹799</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-[#4A2415]/85 dark:text-[#D8C7B8] pt-3 border-t border-[#E9DDC9] dark:border-[#3B2519]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-[#4A2415] dark:text-[#F5EBE1] tabular-nums">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#47752F] dark:text-[#6BB545]">
                    <span>Coupon Discount</span>
                    <span className="font-bold tabular-nums">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-bold tabular-nums">
                    {shippingFee === 0 ? (
                      <span className="text-[#47752F] dark:text-[#6BB545]">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#4A2415] dark:text-[#F5EBE1] pt-3 border-t border-[#E9DDC9] dark:border-[#3B2519]">
                  <span>Total Amount</span>
                  <span className="tabular-nums">₹{total}</span>
                </div>
                <p className="text-[10px] text-[#4A2415]/60 dark:text-[#D8C7B8]/60 text-right">Includes all applicable GST taxes</p>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-[#4A2415] dark:bg-[#6BB545] hover:bg-[#47752F] dark:hover:bg-[#5aa038] text-[#FFF9EF] dark:text-[#120A06] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98 touch-manipulation cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#4A2415]/60 dark:text-[#D8C7B8]/60 text-center">
                <ShieldCheck className="w-4 h-4 text-[#47752F] dark:text-[#6BB545]" />
                <span>Safe & Secure Indian Payment Gateways</span>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
