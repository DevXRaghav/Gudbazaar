import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, FileText } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';

export const PoliciesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') ||'shipping';
  const [activeTab, setActiveTab] = useState(currentTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="bg-[#FFF9EF] min-h-screen py-10 sm:py-16 transition-colors duration-200">
      <SEOHead
        title="Policies, Shipping & Returns | Gudbazaar"
        description="Read Gudbazaar’s shipping guidelines, returns, privacy policy, and terms of service."
        canonicalPath="/policies"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
       
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-[#47752F] uppercase tracking-wider">Legal & Transparency</span>
          <h1 className="text-3xl font-extrabold text-[#4A2415] tracking-tight mt-1">
            Gudbazaar Customer Policies
          </h1>
          <p className="mt-2 text-xs text-[#4A2415]/70">
            Clear, transparent policies crafted to protect our community of conscious consumers.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-center gap-2 bg-white p-1.5 rounded-xl border border-[#E9DDC9] mb-10 overflow-x-auto shadow-xs scrollbar-none transition-colors">
          <button
            type="button"
            onClick={() => handleTabChange('shipping')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap touch-manipulation ${
              activeTab ==='shipping'
                ?'bg-[#4A2415] text-[#FFF9EF] shadow-xs'
                : 'text-[#4A2415]/75 hover:bg-[#FFF9EF]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Shipping Policy</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('returns')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap touch-manipulation ${
              activeTab ==='returns'
                ?'bg-[#4A2415] text-[#FFF9EF] shadow-xs'
                : 'text-[#4A2415]/75 hover:bg-[#FFF9EF]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Returns & Refunds</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('privacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap touch-manipulation ${
              activeTab ==='privacy'
                ?'bg-[#4A2415] text-[#FFF9EF] shadow-xs'
                : 'text-[#4A2415]/75 hover:bg-[#FFF9EF]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('terms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap touch-manipulation ${
              activeTab ==='terms'
                ?'bg-[#4A2415] text-[#FFF9EF] shadow-xs'
                : 'text-[#4A2415]/75 hover:bg-[#FFF9EF]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white rounded-2xl border border-[#E9DDC9] p-6 sm:p-10 shadow-xs text-xs sm:text-sm text-[#4A2415]/85 leading-relaxed space-y-6 transition-colors">
         
          {activeTab ==='shipping' && (
            <div>
              <h2 className="text-xl font-bold text-[#4A2415] mb-4">Shipping & Delivery Policy</h2>
             
              <div className="space-y-4">
                <section>
                  <h3 className="font-bold text-[#4A2415] text-sm mb-1">1. Processing Time</h3>
                  <p>All Gudbazaar orders are freshly packed and dispatched within 24 to 48 business hours from our temperature and humidity controlled central packaging facility in Western Uttar Pradesh.</p>
                </section>

                <section>
                  <h3 className="font-bold text-[#4A2415] text-sm mb-1">2. Shipping Charges</h3>
                  <p>• <strong>Free Delivery:</strong> All orders with a final cart value of ₹499 or more qualify for zero shipping charges across India.</p>
                  <p>• <strong>Standard Shipping:</strong> For orders below ₹499, a nominal flat rate of ₹49 is charged to cover secure protective packaging.</p>
                </section>

                <section>
                  <h3 className="font-bold text-[#4A2415] text-sm mb-1">3. Delivery Timelines</h3>
                  <p>• <strong>Tier 1 Metro Cities:</strong> 2 to 3 business days.</p>
                  <p>• <strong>Tier 2 & 3 Cities:</strong> 3 to 5 business days.</p>
                  <p>• <strong>North-East & Remote Regions:</strong> 5 to 7 business days.</p>
                </section>

                <section>
                  <h3 className="font-bold text-[#4A2415] text-sm mb-1">4. Order Tracking</h3>
                  <p>Once dispatched, you will receive an automated email and SMS notification containing the courier tracking number and real-time transit link.</p>
                </section>
              </div>
            </div>
          )}

          {activeTab ==='returns' && (
            <div>
              <h2 className="text-xl font-bold text-[#4A2415] mb-4">Returns, Replacements & Refunds</h2>
             
              <div className="space-y-4">
                <section>
                  <h3 className="font-bold text-[#4A2415] text-sm mb-1">1. Food Safety & Natural Storage</h3>
                  <p>Because Gudbazaar products are 100% organic, freshly prepared food items free from chemical preservatives, we do not accept returns once a package has been unsealed, in compliance with food safety and hygiene guidelines.</p>
                  <p className="mt-1 text-xs text-[#4A2415]/75"><strong>Moisture & Storage Guidelines:</strong> Pure jaggery is naturally hygroscopic. Always keep away from moisture and store in a sealed pack container, airtight jar, or sealed packet in a cool, dry place. Avoid using wet spoons.</p>
                </section>

                <section>
                  <h3 className="font-bold text-[#4A2415] text-sm mb-1">2. Damaged or Tampered Deliveries</h3>
                  <p>If your order arrives damaged, leaking, or in a compromised package, please notify us within 48 hours of delivery. Simply take a quick photo of the outer box and products and WhatsApp us at +91 98200 12345 or email support@gudbazaar.com.</p>
                  <p className="mt-1 font-semibold text-[#47752F]">We will immediately issue a free replacement or 100% refund without any hassle.</p>
                </section>

                <section>
                  <h3 className="font-bold text-[#4A2415] text-sm mb-1">3. Refund Processing</h3>
                  <p>Approved refunds are processed back to the original source method (UPI, credit/debit card, or bank account) within 3–5 working days.</p>
                </section>
              </div>
            </div>
          )}

          {activeTab ==='privacy' && (
            <div>
              <h2 className="text-xl font-bold text-[#4A2415] mb-4">Privacy & Data Protection</h2>
             
              <div className="space-y-4">
                <section>
                  <h3 className="font-bold text-[#4A2415] text-sm mb-1">1. Information We Collect</h3>
                  <p>We only collect information necessary to fulfill your order and provide customer support: your name, shipping address, mobile phone number, and email address.</p>
                </section>

                <section>
                  <h3 className="font-bold text-[#4A2415] text-sm mb-1">2. Payment Security</h3>
                  <p>Gudbazaar does not store or process your credit card numbers, CVV, or banking passwords. All financial transactions are encrypted through RBI-compliant, PCI-DSS certified payment gateways.</p>
                </section>

                <section>
                  <h3 className="font-bold text-[#4A2415] text-sm mb-1">3. No Third-Party Data Selling</h3>
                  <p>We strictly do not sell, rent, or lease customer data to advertising brokers. Your information is solely utilized to process your delivery and notify you of your orders.</p>
                </section>
              </div>
            </div>
          )}

          {activeTab ==='terms' && (
            <div>
              <h2 className="text-xl font-bold text-[#4A2415] mb-4">Terms & Conditions</h2>
             
              <div className="space-y-4">
                <section>
                  <h3 className="font-bold text-[#4A2415] text-sm mb-1">1. Authenticity of Information</h3>
                  <p>By placing an order on Gudbazaar, you confirm that all details provided (including name, mobile number, and delivery PIN code) are accurate.</p>
                </section>

                <section>
                  <h3 className="font-bold text-[#4A2415] text-sm mb-1">2. Natural Characteristics of Artisanal Jaggery</h3>
                  <p>As our jaggery is 100% natural and handcrafted in small agricultural batches without synthetic dyes, slight variations in shade (ranging from golden amber to deep mahogany) are a hallmark of authentic unbleached sugarcane.</p>
                </section>

                <section>
                  <h3 className="font-bold text-[#4A2415] text-sm mb-1">3. Governing Law</h3>
                  <p>These terms and conditions are governed by and construed in accordance with the laws of India, subject to the jurisdiction of courts in Mumbai, Maharashtra.</p>
                </section>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
