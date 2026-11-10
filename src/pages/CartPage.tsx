import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Tag, Check, Sparkles, ShieldCheck } from 'lucide-react';
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
    <div className="bg-[#FFF9EF] min-h-screen py-8 sm:py-12">
      <SEOHead
        title="Your Shopping Bag | Gudbazaar"
        description="Review items in your Gudbazaar shopping bag and apply seasonal discounts."
        canonicalPath="/cart"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#4A2415]/60 mb-6">
          <Link to="/" className="hover:text-[#47752F]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#47752F]">Shop</Link>
          <span>/</span>
          <span className="text-[#4A2415] font-semibold">Shopping Bag</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A2415] tracking-tight mb-8">
          Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)} items)
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E9DDC9] p-12 text-center max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FFF9EF] border border-[#E9DDC9] text-[#47752F] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[#4A2415]">Your bag is completely empty</h2>
            <p className="text-xs text-[#4A2415]/70 mt-1 max-w-sm mx-auto">
              You have not added any natural jaggery products yet. Explore our bestselling collections and add authentic sweetness to your home.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Items Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Free Shipping Progress */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E9DDC9] shadow-xs">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  {freeShippingRemaining > 0 ? (
                    <span className="text-[#4A2415]">
                      Add <strong className="text-[#47752F]">₹{freeShippingRemaining}</strong> more for <strong>FREE Delivery</strong> across India
                    </span>
                  ) : (
                    <span className="text-[#47752F] flex items-center gap-1 font-bold">
                      <Sparkles className="w-4 h-4 text-[#E99A19]" /> Congratulations! You have unlocked FREE Shipping
                    </span>
                  )}
                  <span className="tabular-nums text-[#4A2415]/70">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#FFF9EF] border border-[#E9DDC9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#47752F] rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-xl border border-[#E9DDC9] divide-y divide-[#E9DDC9]/70 shadow-xs overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-[#FFF9EF] border border-[#E9DDC9] shrink-0"
                      />
                      <div>
                        <span className="text-[11px] font-semibold text-[#47752F] uppercase tracking-wider block">
                          {item.category}
                        </span>
                        <Link
                          to={`/product/${item.slug}`}
                          className="text-sm sm:text-base font-bold text-[#4A2415] hover:text-[#47752F] transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[#4A2415]/70 mt-0.5">
                          Pack Size: <span className="font-semibold text-[#4A2415]">{item.weight}</span>
                        </p>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-sm font-bold text-[#4A2415] tabular-nums">
                            ₹{item.price}
                          </span>
                          {item.mrp > item.price && (
                            <span className="text-xs text-[#4A2415]/40 line-through tabular-nums">
                              ₹{item.mrp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E9DDC9]/50">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E9DDC9] rounded-lg bg-[#FFF9EF]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-sm font-bold text-[#4A2415] hover:bg-[#E9DDC9]/50 rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="px-3.5 py-1 text-xs font-bold tabular-nums text-[#4A2415]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-sm font-bold text-[#4A2415] hover:bg-[#E9DDC9]/50 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-base font-extrabold text-[#4A2415] tabular-nums">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#4A2415]/40 hover:text-red-700 p-1.5 transition-colors"
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
                  className="font-semibold text-[#47752F] hover:text-[#4A2415] flex items-center gap-1"
                >
                  <span>← Continue Shopping</span>
                </Link>
                <button
                  onClick={clearCart}
                  className="text-[#4A2415]/60 hover:text-red-700 underline"
                >
                  Clear Entire Bag
                </button>
              </div>

            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-[#E9DDC9] p-6 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-[#4A2415] pb-3 border-b border-[#E9DDC9]">
                Order Summary
              </h2>

              {/* Coupon Engine */}
              <div>
                <label className="block text-xs font-semibold text-[#4A2415] mb-1.5">
                  Have a Coupon Code?
                </label>
                {coupon ? (
                  <div className="flex items-center justify-between bg-[#FFF9EF] px-3 py-2 rounded-lg border border-[#47752F]/40 text-xs">
                    <div className="flex items-center gap-1.5 text-[#47752F] font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{coupon.code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#47752F] tabular-nums">-₹{discount}</span>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-red-700 hover:underline"
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
                      className="flex-1 px-3 py-2 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs uppercase tracking-wider text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#4A2415] hover:bg-[#47752F] text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {(couponFeedback || couponError) && !coupon && (
                  <p className="mt-1.5 text-[11px] text-red-700 font-medium">
                    {couponError || couponFeedback}
                  </p>
                )}

                {/* Available Offers hint */}
                <div className="mt-2 text-[11px] text-[#4A2415]/70 bg-[#FFF9EF] p-2.5 rounded-lg border border-[#E9DDC9]/60">
                  <span className="font-bold text-[#47752F] block">Available Coupons:</span>
                  <p>• <strong>SWEET10</strong>: 10% off above ₹299</p>
                  <p>• <strong>FIRSTGUD</strong>: 15% off first order (above ₹450)</p>
                  <p>• <strong>PUREJAGGERY</strong>: 20% off above ₹799</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-[#4A2415]/85 pt-3 border-t border-[#E9DDC9]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-[#4A2415] tabular-nums">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#47752F]">
                    <span>Coupon Discount</span>
                    <span className="font-bold tabular-nums">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-bold tabular-nums">
                    {shippingFee === 0 ? (
                      <span className="text-[#47752F]">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#4A2415] pt-3 border-t border-[#E9DDC9]">
                  <span>Total Amount</span>
                  <span className="tabular-nums">₹{total}</span>
                </div>
                <p className="text-[10px] text-[#4A2415]/60 text-right">Includes all applicable GST taxes</p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#4A2415]/60 text-center">
                <ShieldCheck className="w-4 h-4 text-[#47752F]" />
                <span>Safe & Secure Indian Payment Gateways</span>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
