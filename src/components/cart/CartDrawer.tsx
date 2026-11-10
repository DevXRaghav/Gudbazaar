import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { FREE_SHIPPING_THRESHOLD } from '../../data/products';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
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

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res.message);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#4A2415]/60 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#FFFFFF] h-full shadow-2xl flex flex-col z-10 text-[#4A2415]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E9DDC9] flex items-center justify-between bg-[#FFF9EF]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#47752F]" />
            <h2 className="text-base font-bold text-[#4A2415]">Your Shopping Bag</h2>
            <span className="text-xs bg-[#4A2415] text-[#FFF9EF] px-2 py-0.5 rounded-full font-bold tabular-nums">
              {items.length}
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-full hover:bg-[#E9DDC9]/60 text-[#4A2415]/70 hover:text-[#4A2415] transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#FFF9EF] px-5 py-3 border-b border-[#E9DDC9]">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            {freeShippingRemaining > 0 ? (
              <span>
                Add <span className="font-bold text-[#47752F]">₹{freeShippingRemaining}</span> more for <strong className="text-[#4A2415]">FREE Shipping</strong>
              </span>
            ) : (
              <span className="text-[#47752F] font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E99A19]" /> You have unlocked FREE Shipping!
              </span>
            )}
            <span className="text-[11px] text-[#4A2415]/60 tabular-nums">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#E9DDC9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#47752F] transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#4A2415]">
              <div className="w-16 h-16 rounded-full bg-[#FFF9EF] border border-[#E9DDC9] flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-[#47752F]/60" />
              </div>
              <h3 className="text-base font-bold text-[#4A2415]">Your bag is empty</h3>
              <p className="text-xs text-[#4A2415]/70 mt-1 max-w-xs">
                Explore our pure jaggery collection and experience natural sweetness in your everyday life.
              </p>
              <button
                onClick={() => {
                  closeDrawer();
                  navigate('/shop');
                }}
                className="mt-5 px-6 py-2.5 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-semibold rounded-lg transition-colors"
              >
                Shop All Products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-xl border border-[#E9DDC9]/70 bg-white hover:border-[#47752F]/40 transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg bg-[#FFF9EF] shrink-0 border border-[#E9DDC9]/50"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={closeDrawer}
                        className="text-xs sm:text-sm font-bold text-[#4A2415] hover:text-[#47752F] line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#4A2415]/40 hover:text-red-700 p-1 -mr-1"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-[#47752F] font-medium block mt-0.5">
                      Pack: {item.weight}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E9DDC9]/30">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-[#E9DDC9] rounded-md bg-[#FFF9EF]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs font-semibold text-[#4A2415] hover:bg-[#E9DDC9]/50"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold tabular-nums text-[#4A2415]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs font-semibold text-[#4A2415] hover:bg-[#E9DDC9]/50"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#4A2415] tabular-nums">
                        ₹{item.price * item.quantity}
                      </span>
                      {item.mrp > item.price && (
                        <span className="block text-[10px] text-[#4A2415]/40 line-through tabular-nums">
                          ₹{item.mrp * item.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Coupon & Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#E9DDC9] bg-[#FFF9EF] space-y-3">
            
            {/* Coupon Code Section */}
            {coupon ? (
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-[#47752F]/40 text-xs">
                <div className="flex items-center gap-1.5 text-[#47752F] font-semibold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Coupon {coupon.code} Applied</span>
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
              <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A2415]/50" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (e.g. SWEET10)"
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E9DDC9] rounded-lg text-xs uppercase tracking-wider text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#4A2415] hover:bg-[#47752F] text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {(couponFeedback || couponError) && !coupon && (
              <p className="text-[11px] text-red-700 font-medium">
                {couponError || couponFeedback}
              </p>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#4A2415]/80 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums text-[#4A2415]">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#47752F]">
                  <span>Discount ({coupon?.code})</span>
                  <span className="font-semibold tabular-nums">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold tabular-nums">
                  {shippingFee === 0 ? (
                    <span className="text-[#47752F] font-bold">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#4A2415] pt-2 border-t border-[#E9DDC9]">
                <span>Total Amount</span>
                <span className="text-base tabular-nums text-[#4A2415]">₹{total}</span>
              </div>
            </div>

            {/* Checkout & View Bag Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  closeDrawer();
                  navigate('/cart');
                }}
                className="w-full py-2 text-center text-xs font-semibold text-[#47752F] hover:text-[#4A2415] transition-colors"
              >
                View Full Cart & Detailed Bill
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
