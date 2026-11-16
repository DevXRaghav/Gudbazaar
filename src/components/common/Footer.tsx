import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, HeartHandshake, Instagram, Facebook, Youtube } from 'lucide-react';
import { GudbazaarLogo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#4A2415] text-[#FFF9EF] border-t border-[#4A2415] pt-16 pb-12 safe-pb mt-20">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#FFF9EF]/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#47752F]/30 text-[#8CD36C] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#8CD36C]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FFF9EF]">100% Chemical Free</h4>
              <p className="text-xs text-[#E9DDC9]/70 mt-0.5">Zero added synthetic clarifiers or dyes</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#47752F]/30 text-[#8CD36C] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#8CD36C]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FFF9EF]">Pan-India Express</h4>
              <p className="text-xs text-[#E9DDC9]/70 mt-0.5">Free delivery on orders over ₹499</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#47752F]/30 text-[#8CD36C] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 text-[#8CD36C]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FFF9EF]">Direct Farm Sourcing</h4>
              <p className="text-xs text-[#E9DDC9]/70 mt-0.5">Fair returns to rural cane growers</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#47752F]/30 text-[#8CD36C] flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-[#8CD36C]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FFF9EF]">Purity Guaranteed</h4>
              <p className="text-xs text-[#E9DDC9]/70 mt-0.5">Authentic aroma and natural minerals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-10">
       
        {/* Brand Information */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <GudbazaarLogo variant="light" size="md" />
          <p className="text-xs leading-relaxed text-[#E9DDC9]/80 max-w-sm">
            Gudbazaar celebrates India’s traditional sugarcane heritage. We bring together the familiar warmth of authentic desi gud with modern, hygienic, single-origin quality for everyday wellness.
          </p>
          <div className="flex items-center gap-3 pt-2 text-[#E9DDC9]">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              className="w-8 h-8 rounded-full bg-[#FFF9EF]/10 hover:bg-[#47752F] flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer noopener"
              className="w-8 h-8 rounded-full bg-[#FFF9EF]/10 hover:bg-[#47752F] flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer noopener"
              className="w-8 h-8 rounded-full bg-[#FFF9EF]/10 hover:bg-[#47752F] flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-xs font-semibold tracking-wider uppercase text-[#E99A19] mb-4">Quick Links</h5>
          <ul className="space-y-2.5 text-xs text-[#E9DDC9]/80">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Shop All Products</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Our Story & Heritage</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Customer Care</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">View Cart & Offers</Link></li>
          </ul>
        </div>

        {/* Customer Support & Policies */}
        <div>
          <h5 className="text-xs font-semibold tracking-wider uppercase text-[#E99A19] mb-4">Customer Support</h5>
          <ul className="space-y-2.5 text-xs text-[#E9DDC9]/80">
            <li><Link to="/policies?tab=shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            <li><Link to="/policies?tab=returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
            <li><Link to="/policies?tab=privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/policies?tab=terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Track Your Order</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h5 className="text-xs font-semibold tracking-wider uppercase text-[#E99A19] mb-4">Reach Us</h5>
          <div className="space-y-2 text-xs text-[#E9DDC9]/80 leading-relaxed">
            <p className="font-medium text-white">Gudbazaar Natural Foods Pvt. Ltd.</p>
            <p>108 Sugarcane Heritage Lane, Bandra West, Mumbai 400050, India</p>
            <p className="pt-1">Email: <a href="mailto:support@gudbazaar.com" className="hover:text-[#E99A19] underline">support@gudbazaar.com</a></p>
            <p>WhatsApp: <span className="text-white">+91 98200 12345</span></p>
            <p className="text-[11px] text-[#E9DDC9]/60">Mon to Sat, 9:00 AM - 7:00 PM IST</p>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#FFF9EF]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E9DDC9]/60">
        <p>© {new Date().getFullYear()} Gudbazaar. All rights reserved. Pure Jaggery.</p>
        <p className="flex items-center gap-4">
          <span>Made with pride in India</span>
          <span>·</span>
          <span>Natural & Chemical-Free</span>
        </p>
      </div>
    </footer>
  );
};
