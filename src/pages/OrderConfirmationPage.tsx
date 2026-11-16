import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, MapPin, Calendar, ArrowRight, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { SEOHead } from '../components/seo/SEOHead';

export const OrderConfirmationPage: React.FC = () => {
  const { lastOrder } = useCart();

  useEffect(() => {
    // Trigger celebratory confetti burst on successful checkout
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4A2415','#47752F','#E99A19','#FFF9EF'],
      });
    } catch {
      // ignore
    }
  }, []);

  if (!lastOrder) {
    return (
      <div className="bg-[#FFF9EF] min-h-screen py-20 px-4 text-center transition-colors">
        <h2 className="text-xl font-bold text-[#4A2415]">No Recent Order Found</h2>
        <p className="text-xs text-[#4A2415]/70 mt-2">Browse our collection to place a fresh order.</p>
        <Link
          to="/shop"
          className="mt-5 inline-block px-5 py-2.5 bg-[#4A2415] text-[#FFF9EF] text-xs font-semibold rounded-lg"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#FFF9EF] min-h-screen py-10 sm:py-16 transition-colors duration-200">
      <SEOHead
        title={`Order ${lastOrder.orderId} Confirmed | Gudbazaar`}
        description="Thank you for your order with Gudbazaar. Your pure jaggery is being prepared for shipment."
        canonicalPath="/order-confirmation"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
       
        {/* Success Card Header */}
        <div className="bg-white rounded-2xl border border-[#E9DDC9] p-6 sm:p-10 shadow-sm text-center mb-8 transition-colors">
          <div className="w-16 h-16 rounded-full bg-[#47752F]/15 text-[#47752F] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-[#8D5B18] uppercase tracking-wider px-3 py-1 rounded-full bg-[#E99A19]/10 border border-[#E99A19]/20 inline-block mb-2">
            {lastOrder.paymentMethod ==='COD'
              ?'Cash on Delivery Placed · Verification Pending'
              : 'Order Request Registered · Payment Gateway Pending'}
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A2415] tracking-tight mt-1">
            Thank you for choosing pure sweetness!
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-[#4A2415]/75 max-w-lg mx-auto leading-relaxed">
            We have securely registered your order <strong>#{lastOrder.orderId}</strong>. A notification summary has been prepared for <strong>{lastOrder.customerAddress.email}</strong>.
          </p>

          {lastOrder.paymentMethod !=='COD' && (
            <div className="mt-3 p-2.5 rounded-lg bg-[#4A2415]/5 border border-[#E9DDC9] text-[11px] text-[#4A2415]/70 max-w-md mx-auto">
              <span className="font-semibold text-[#4A2415]">Development Security Notice:</span> Live payment gateway is not yet integrated. No real payment was charged. Order is recorded as a pending draft.
            </div>
          )}

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 text-xs text-[#4A2415]/80 bg-[#FFF9EF] px-5 py-2.5 rounded-xl border border-[#E9DDC9]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#47752F]" />
              <span>Est. Delivery: <strong>{lastOrder.estimatedDeliveryDate}</strong></span>
            </div>
            <span className="text-[#E9DDC9]">·</span>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#47752F]" />
              <span>Payment Mode: <strong>{lastOrder.paymentMethod}</strong> ({lastOrder.paymentStatus.replace(/_/g,'')})</span>
            </div>
          </div>
        </div>

        {/* Order Tracking Progress Steps */}
        <div className="bg-white rounded-2xl border border-[#E9DDC9] p-6 sm:p-8 shadow-xs mb-8 transition-colors">
          <h2 className="text-sm font-bold text-[#4A2415] mb-6 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#47752F]" />
            <span>Fulfillment Timeline</span>
          </h2>

          <div className="grid grid-cols-4 text-center text-xs relative">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#47752F] text-white flex items-center justify-center font-bold text-xs mb-2 shadow-xs">
                ✓
              </div>
              <span className="font-bold text-[#4A2415] text-[11px] sm:text-xs">Order Registered</span>
              <span className="text-[10px] text-[#4A2415]/50 mt-0.5">Today</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#FFF9EF] border-2 border-[#47752F] text-[#47752F] flex items-center justify-center font-bold text-xs mb-2">
                2
              </div>
              <span className="font-semibold text-[#4A2415] text-[11px] sm:text-xs">Processing at Mill</span>
              <span className="text-[10px] text-[#4A2415]/50 mt-0.5">Within 24 hrs</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#FFF9EF] border-2 border-[#E9DDC9] text-[#4A2415]/40 flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <span className="text-[#4A2415]/60 text-[11px] sm:text-xs">Logistics Dispatch</span>
              <span className="text-[10px] text-[#4A2415]/40 mt-0.5">Modular Partner</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#FFF9EF] border-2 border-[#E9DDC9] text-[#4A2415]/40 flex items-center justify-center font-bold text-xs mb-2">
                4
              </div>
              <span className="text-[#4A2415]/60 text-[11px] sm:text-xs">Delivered</span>
              <span className="text-[10px] text-[#4A2415]/40 mt-0.5">{lastOrder.estimatedDeliveryDate}</span>
            </div>
          </div>
        </div>

        {/* Detailed Order Receipt & Address */}
        <div className="bg-white rounded-2xl border border-[#E9DDC9] p-6 sm:p-8 shadow-xs mb-8 transition-colors">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E9DDC9]">
            <h2 className="text-base font-bold text-[#4A2415]">Receipt & Item Breakdown</h2>
            <button
              onClick={handlePrint}
              className="text-xs font-semibold text-[#47752F] hover:text-[#4A2415] flex items-center gap-1 touch-manipulation"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>

          {/* Items */}
          <div className="divide-y divide-[#E9DDC9]/50 mb-6">
            {lastOrder.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover bg-[#FFF9EF] border border-[#E9DDC9]"
                  />
                  <div>
                    <p className="font-bold text-[#4A2415]">{item.name}</p>
                    <p className="text-[11px] text-[#4A2415]/60">Pack: {item.weight} × {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-[#4A2415] tabular-nums">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Financials */}
          <div className="space-y-1.5 text-xs text-[#4A2415]/80 pt-4 border-t border-[#E9DDC9]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#4A2415] tabular-nums">₹{lastOrder.subtotal}</span>
            </div>
            {lastOrder.discount > 0 && (
              <div className="flex justify-between text-[#47752F]">
                <span>Discount Applied ({lastOrder.couponCode})</span>
                <span className="font-bold tabular-nums">-₹{lastOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="font-semibold text-[#4A2415]">
                {lastOrder.shippingFee === 0 ?'FREE' : `₹${lastOrder.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#4A2415] pt-3 border-t border-[#E9DDC9]">
              <span>Total Paid</span>
              <span className="tabular-nums">₹{lastOrder.total}</span>
            </div>
          </div>

          {/* Shipping Address Summary */}
          <div className="mt-8 pt-6 border-t border-[#E9DDC9]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4A2415] mb-2">
              <MapPin className="w-4 h-4 text-[#47752F]" />
              <span>Shipping Destination</span>
            </div>
            <div className="p-4 bg-[#FFF9EF] rounded-xl text-xs text-[#4A2415]/80 leading-relaxed">
              <p className="font-bold text-[#4A2415]">{lastOrder.customerAddress.fullName}</p>
              <p>{lastOrder.customerAddress.addressLine}</p>
              {lastOrder.customerAddress.landmark && <p>Near: {lastOrder.customerAddress.landmark}</p>}
              <p>{lastOrder.customerAddress.city}, {lastOrder.customerAddress.state} — {lastOrder.customerAddress.pincode}</p>
              <p className="mt-1 text-[11px] text-[#4A2415]/60">Mobile: +91 {lastOrder.customerAddress.mobile}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg touch-manipulation"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
