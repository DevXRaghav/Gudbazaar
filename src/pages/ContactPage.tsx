import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle2, ChevronDown } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderId: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        orderId: '',
        subject: 'General Inquiry',
        message: '',
      });
    }
  };

  const faqs = [
    {
      q: 'How long does Gudbazaar jaggery stay fresh?',
      a: 'Our natural jaggery products have a tested shelf life of 12 months from packing when kept in an airtight, dry container. Because our products contain zero chemical preservatives, during humid monsoon months we recommend keeping them in airtight glass containers or the refrigerator.',
    },
    {
      q: 'What is the estimated delivery time?',
      a: 'Orders are processed within 24 business hours. Deliveries to Metro cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune) take 2–3 business days. Other regions take 3–5 business days.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is supported across all major serviceable Indian pin codes. You can select Cash on Delivery directly on the checkout screen.',
    },
    {
      q: 'Can I place bulk or corporate gifting orders?',
      a: 'Absolutely! We curate custom gift hampers for festive occasions, weddings, and corporate gifting. Please reach out to us at corporate@gudbazaar.com or via WhatsApp at +91 98200 12345.',
    },
  ];

  return (
    <div className="bg-[#FFF9EF] min-h-screen py-10 sm:py-16">
      <SEOHead
        title="Contact Us & Customer Support | Gudbazaar"
        description="Reach out to Gudbazaar for order inquiries, delivery status, and bulk gifting assistance."
        canonicalPath="/contact"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold text-[#47752F] uppercase tracking-wider">Get in Touch</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4A2415] tracking-tight mt-1">
            We’d Love to Hear From You
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#4A2415]/75">
            Whether you have a question regarding an ongoing order, feedback on our products, or special festive requirements, our customer support team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          
          {/* Left: Contact Info & Reach Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E9DDC9] p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFF9EF] border border-[#E9DDC9] text-[#47752F] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#4A2415]">Email Support</h3>
                  <p className="text-xs text-[#4A2415]/70 mt-0.5">Quick responses within 2–4 hours</p>
                  <a href="mailto:support@gudbazaar.com" className="text-xs font-semibold text-[#47752F] hover:underline mt-1 block">
                    support@gudbazaar.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-[#E9DDC9]/60">
                <div className="w-10 h-10 rounded-xl bg-[#FFF9EF] border border-[#E9DDC9] text-[#47752F] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#4A2415]">Phone & WhatsApp</h3>
                  <p className="text-xs text-[#4A2415]/70 mt-0.5">Mon to Sat, 9:00 AM – 7:00 PM IST</p>
                  <p className="text-xs font-bold text-[#4A2415] mt-1">+91 98200 12345</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-[#E9DDC9]/60">
                <div className="w-10 h-10 rounded-xl bg-[#FFF9EF] border border-[#E9DDC9] text-[#47752F] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#4A2415]">Registered Office</h3>
                  <p className="text-xs text-[#4A2415]/70 mt-0.5 leading-relaxed">
                    Gudbazaar Natural Foods Pvt. Ltd.<br />
                    108 Sugarcane Heritage Lane, Bandra West,<br />
                    Mumbai, Maharashtra 400050, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-[#E9DDC9]/60">
                <div className="w-10 h-10 rounded-xl bg-[#FFF9EF] border border-[#E9DDC9] text-[#47752F] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#4A2415]">Working Hours</h3>
                  <p className="text-xs text-[#4A2415]/70 mt-0.5">
                    Monday to Saturday: 9:00 AM – 7:00 PM<br />
                    Sunday: Closed (Orders dispatched next business day)
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E9DDC9] p-6 sm:p-8 lg:p-10 shadow-xs">
            <h2 className="text-lg font-bold text-[#4A2415] mb-2">Send Us a Message</h2>
            <p className="text-xs text-[#4A2415]/70 mb-6">
              Fill out the form below and an authentic team member will contact you.
            </p>

            {submitted ? (
              <div className="p-6 bg-[#FFF9EF] rounded-xl border border-[#47752F]/40 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#47752F] mx-auto" />
                <h3 className="text-base font-bold text-[#4A2415]">Message Received</h3>
                <p className="text-xs text-[#4A2415]/75">
                  Thank you for contacting Gudbazaar. We will reply to your registered email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-semibold text-[#47752F] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#4A2415] mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ananya Sen"
                      className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#4A2415] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ananya@example.com"
                      className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#4A2415] mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98200 00000"
                      className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#4A2415] mb-1">Order ID (If applicable)</label>
                    <input
                      type="text"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      placeholder="e.g. GB-12345"
                      className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A2415] mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                  >
                    <option value="General Inquiry">General Product Inquiry</option>
                    <option value="Order Tracking">Order Tracking & Shipping</option>
                    <option value="Product Quality">Product Quality & Feedback</option>
                    <option value="Bulk/Festive">Bulk & Corporate Gifting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A2415] mb-1">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist you today?"
                    className="w-full px-3.5 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98"
                >
                  Send Inquiry
                </button>
              </form>
            )}

          </div>

        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-2xl border border-[#E9DDC9] p-6 sm:p-10 shadow-xs max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold text-[#47752F] uppercase tracking-wider">Quick Answers</span>
            <h2 className="text-2xl font-extrabold text-[#4A2415] mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="divide-y divide-[#E9DDC9]/70">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-[#4A2415] focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#47752F] transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <p className="mt-2.5 text-xs text-[#4A2415]/80 leading-relaxed pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
