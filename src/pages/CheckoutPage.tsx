import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, Lock, AlertCircle, ArrowLeft, Check, Sparkles, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PINCODE_DELIVERY_DATA } from '../data/products';
import { INDIAN_STATES_AND_UT } from '../data/indianStates';
import { CustomerAddress, Order } from '../types';
import { SEOHead } from '../components/seo/SEOHead';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, discount, shippingFee, total, coupon, clearCart, setLastOrder } = useCart();
  const { user, openAuthModal, addOrderToHistory } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CustomerAddress>({
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    addressLine: user?.addressLine || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    landmark: user?.landmark || '',
    addressType: 'home',
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill city and state when user enters 6-digit Indian PIN
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => {
      const updated = { ...prev, pincode: val };
      if (val.length === 6 && PINCODE_DELIVERY_DATA[val]) {
        updated.city = PINCODE_DELIVERY_DATA[val].city;
        updated.state = PINCODE_DELIVERY_DATA[val].state;
      }
      return updated;
    });
    if (errors.pincode) {
      setErrors((prev) => ({ ...prev, pincode: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.addressLine.trim()) newErrors.addressLine = 'Flat / House No. and Street address required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit PIN code';
    }
    if (paymentMethod === 'UPI' && upiId && !upiId.includes('@')) {
      newErrors.upi = 'Enter a valid UPI ID (e.g., username@okaxis)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      navigate('/shop');
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate order creation
    setTimeout(() => {
      const generatedOrderId = `GB-${Date.now().toString().slice(-6)}`;
      const deliveryDays = PINCODE_DELIVERY_DATA[formData.pincode]?.days || 3;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

      const newOrder: Order = {
        orderId: generatedOrderId,
        items: [...items],
        subtotal,
        discount,
        shippingFee,
        total,
        couponCode: coupon?.code,
        customerAddress: formData,
        paymentMethod,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        estimatedDeliveryDate: deliveryDate.toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      setLastOrder(newOrder);
      addOrderToHistory(newOrder);
      clearCart();
      setIsSubmitting(false);
      navigate('/order-confirmation');
    }, 900);
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FFF9EF] min-h-screen py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-[#4A2415]">Your bag is empty</h2>
        <p className="text-xs text-[#4A2415]/70 mt-2">Add items to proceed to checkout.</p>
        <Link
          to="/shop"
          className="mt-4 inline-block px-5 py-2.5 bg-[#4A2415] text-[#FFF9EF] text-xs font-semibold rounded-lg"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9EF] min-h-screen py-8 sm:py-12">
      <SEOHead
        title="Secure Checkout | Gudbazaar"
        description="Complete your order for authentic Indian jaggery with secure delivery."
        canonicalPath="/checkout"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#47752F] hover:text-[#4A2415]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Bag</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4A2415]/70">
            <Lock className="w-3.5 h-3.5 text-[#47752F]" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Delivery Address & Payment */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Customer Contact & Address Form */}
              <div className="bg-white rounded-xl border border-[#E9DDC9] p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E9DDC9]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#47752F]" />
                    <h2 className="text-base font-bold text-[#4A2415]">Delivery Details</h2>
                  </div>
                  {user ? (
                    <span className="text-[11px] font-semibold text-[#47752F] bg-[#47752F]/10 px-2 py-0.5 rounded">
                      Autofilled from {user.fullName.split(' ')[0]}'s Profile
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openAuthModal('signin')}
                      className="text-xs font-semibold text-[#47752F] hover:underline"
                    >
                      Have an account? Sign in
                    </button>
                  )}
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#4A2415] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Raghav Sharma"
                      className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                    />
                    {errors.fullName && <p className="text-red-700 text-[11px] mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#4A2415] mb-1">
                        Mobile Number *
                      </label>
                      <div className="flex">
                        <span className="px-3 py-2.5 bg-[#E9DDC9]/50 border border-r-0 border-[#E9DDC9] rounded-l-lg text-[#4A2415] font-semibold">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                          placeholder="9820012345"
                          className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-r-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                        />
                      </div>
                      {errors.mobile && <p className="text-red-700 text-[11px] mt-1">{errors.mobile}</p>}
                    </div>

                    <div>
                      <label className="block font-semibold text-[#4A2415] mb-1">
                        Email Address (for invoice & tracking) *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                      />
                      {errors.email && <p className="text-red-700 text-[11px] mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A2415] mb-1">
                      Complete Street Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.addressLine}
                      onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                      placeholder="House / Flat No., Apartment Name, Street, Locality"
                      className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                    />
                    {errors.addressLine && <p className="text-red-700 text-[11px] mt-1">{errors.addressLine}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-[#4A2415] mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handlePincodeChange}
                        placeholder="e.g. 400001"
                        className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                      />
                      {errors.pincode && <p className="text-red-700 text-[11px] mt-1">{errors.pincode}</p>}
                    </div>

                    <div>
                      <label className="block font-semibold text-[#4A2415] mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Mumbai"
                        className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                      />
                      {errors.city && <p className="text-red-700 text-[11px] mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block font-semibold text-[#4A2415] mb-1">
                        State / Union Territory *
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F] cursor-pointer appearance-none pr-8"
                        >
                          <option value="">Select State or UT</option>
                          <optgroup label="States (28)">
                            {INDIAN_STATES_AND_UT.slice(0, 28).map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Union Territories (8)">
                            {INDIAN_STATES_AND_UT.slice(28).map((ut) => (
                              <option key={ut} value={ut}>
                                {ut}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#4A2415]/60">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                      {errors.state && <p className="text-red-700 text-[11px] mt-1">{errors.state}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#4A2415] mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.landmark || ''}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                        placeholder="Near Metro Station, opposite park"
                        className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#4A2415] mb-1">
                        Address Type
                      </label>
                      <div className="flex gap-4 pt-1.5">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="addressType"
                            checked={formData.addressType === 'home'}
                            onChange={() => setFormData({ ...formData, addressType: 'home' })}
                            className="accent-[#47752F]"
                          />
                          <span>Home (All-day delivery)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="addressType"
                            checked={formData.addressType === 'work'}
                            onChange={() => setFormData({ ...formData, addressType: 'work' })}
                            className="accent-[#47752F]"
                          />
                          <span>Work (10 AM - 6 PM)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Payment Methods Section (Razorpay / Indian Payment Gateway Architecture) */}
              <div className="bg-white rounded-xl border border-[#E9DDC9] p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E9DDC9]">
                  <h2 className="text-base font-bold text-[#4A2415]">Payment Method</h2>
                  <span className="text-[11px] font-semibold text-[#47752F]">100% Encrypted</span>
                </div>

                {/* Important Demo Disclaimer per prompt specification */}
                <div className="p-3 bg-[#FFF9EF] rounded-lg border border-[#E99A19]/50 text-xs text-[#4A2415] mb-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#E99A19] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#4A2415]">Payment Gateway Integration Preview</strong>
                    <span className="text-[#4A2415]/75">
                      This checkout simulates Indian payment gateway flows (Razorpay / Cashfree / UPI). No actual bank charges will be incurred in this preview.
                    </span>
                  </div>
                </div>

                {/* Payment Option Selector */}
                <div className="space-y-3 text-xs">
                  
                  {/* UPI */}
                  <label
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-[#47752F] bg-[#FFF9EF]'
                        : 'border-[#E9DDC9] hover:border-[#47752F]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'UPI'}
                          onChange={() => setPaymentMethod('UPI')}
                          className="accent-[#47752F] w-4 h-4"
                        />
                        <div>
                          <span className="font-bold text-[#4A2415] block">Instant UPI (GPay, PhonePe, Paytm, BHIM)</span>
                          <span className="text-[11px] text-[#4A2415]/60">Instant confirmation · Zero convenience fees</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#47752F] bg-white px-2 py-0.5 rounded border border-[#47752F]/30">
                        Recommended
                      </span>
                    </div>

                    {paymentMethod === 'UPI' && (
                      <div className="mt-3 pt-3 border-t border-[#E9DDC9] flex flex-col gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="Enter your VPA / UPI ID (e.g., yourname@okhdfcbank)"
                          className="px-3 py-2 bg-white border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                        />
                        <span className="text-[10px] text-[#4A2415]/60">You can also scan a QR code on next step.</span>
                      </div>
                    )}
                  </label>

                  {/* Cards */}
                  <label
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'Card'
                        ? 'border-[#47752F] bg-[#FFF9EF]'
                        : 'border-[#E9DDC9] hover:border-[#47752F]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'Card'}
                        onChange={() => setPaymentMethod('Card')}
                        className="accent-[#47752F] w-4 h-4"
                      />
                      <div>
                        <span className="font-bold text-[#4A2415] block">Credit / Debit Card</span>
                        <span className="text-[11px] text-[#4A2415]/60">Visa, MasterCard, RuPay, Maestro</span>
                      </div>
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'NetBanking'
                        ? 'border-[#47752F] bg-[#FFF9EF]'
                        : 'border-[#E9DDC9] hover:border-[#47752F]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'NetBanking'}
                        onChange={() => setPaymentMethod('NetBanking')}
                        className="accent-[#47752F] w-4 h-4"
                      />
                      <div>
                        <span className="font-bold text-[#4A2415] block">Net Banking</span>
                        <span className="text-[11px] text-[#4A2415]/60">All major Indian banks supported (HDFC, ICICI, SBI, Axis)</span>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-[#47752F] bg-[#FFF9EF]'
                        : 'border-[#E9DDC9] hover:border-[#47752F]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="accent-[#47752F] w-4 h-4"
                      />
                      <div>
                        <span className="font-bold text-[#4A2415] block">Cash on Delivery (COD)</span>
                        <span className="text-[11px] text-[#4A2415]/60">Pay cash or UPI at your doorstep upon arrival</span>
                      </div>
                    </div>
                  </label>

                </div>

              </div>

            </div>

            {/* Right Column: Order Summary & Place Order */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-[#E9DDC9] p-6 shadow-xs space-y-5 sticky top-24">
              <h2 className="text-base font-bold text-[#4A2415] pb-3 border-b border-[#E9DDC9]">
                Order Items ({items.length})
              </h2>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-md bg-[#FFF9EF] border border-[#E9DDC9] shrink-0"
                      />
                      <div>
                        <p className="font-bold text-[#4A2415] line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-[#47752F]">
                          {item.weight} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[#4A2415] tabular-nums shrink-0">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="space-y-2 text-xs text-[#4A2415]/85 pt-3 border-t border-[#E9DDC9]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#4A2415] tabular-nums">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#47752F]">
                    <span>Coupon Discount ({coupon?.code})</span>
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
                  <span>Total Payable</span>
                  <span className="tabular-nums">₹{total}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Place Order — ₹{total}</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-[#4A2415]/60 text-center leading-relaxed">
                By placing your order, you agree to Gudbazaar’s <Link to="/policies?tab=terms" className="underline hover:text-[#47752F]">Terms & Conditions</Link> and <Link to="/policies?tab=shipping" className="underline hover:text-[#47752F]">Shipping Policy</Link>.
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
