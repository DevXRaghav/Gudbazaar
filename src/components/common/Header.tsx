import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ArrowRight, User } from 'lucide-react';
import { LogoLink } from './Logo';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { totalItemCount, openDrawer } = useCart();
  const { user, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchModal(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/shop' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* SECTION A — ANNOUNCEMENT BAR */}
      <div className="bg-[#4A2415] text-[#FFF9EF] text-xs py-2 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <span>Bringing Natural Sweetness to Your Everyday Life.</span>
        <span className="hidden sm:inline text-[#E99A19]">·</span>
        <span className="hidden sm:inline text-[#FFF9EF]/90">Free Delivery across India on orders above ₹499</span>
      </div>

      {/* SECTION B — STICKY NAVIGATION BAR (Strict 3-zone contract) */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E9DDC9]/70 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          
          {/* Zone 1: Brand Wordmark & Motif */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-[#4A2415] hover:text-[#47752F] focus:outline-none"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <LogoLink size="md" />
          </div>

          {/* Zone 2: 4 Clean Single-Line Text Links */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#4A2415]">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                    isActive
                      ? 'border-[#47752F] text-[#47752F] font-semibold'
                      : 'border-transparent text-[#4A2415] hover:text-[#47752F]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Search & Shopping Bag */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => {
                if (onOpenSearch) onOpenSearch();
                else setShowSearchModal(true);
              }}
              className="p-2 text-[#4A2415] hover:text-[#47752F] hover:bg-[#FFF9EF] rounded-full transition-colors focus:outline-none"
              aria-label="Search products"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Customer Account / Sign Up Popup Trigger */}
            <button
              onClick={() => openAuthModal(user ? 'profile' : 'signup')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold transition-all border ${
                user
                  ? 'bg-[#47752F]/10 border-[#47752F]/30 text-[#47752F] hover:bg-[#47752F]/20'
                  : 'bg-[#FFF9EF] hover:bg-[#E9DDC9]/50 border-[#E9DDC9] text-[#4A2415]'
              }`}
              title={user ? `Logged in as ${user.fullName}` : 'Sign Up / Customer Profile'}
              aria-label="Customer Account Profile"
            >
              <User className="w-4 h-4 text-[#47752F]" />
              <span className="hidden sm:inline">
                {user ? user.fullName.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Shopping Bag with Cart Count */}
            <button
              onClick={openDrawer}
              className="relative flex items-center gap-2 py-2 px-3.5 bg-[#FFF9EF] hover:bg-[#E9DDC9]/50 border border-[#E9DDC9] text-[#4A2415] rounded-full text-sm font-medium transition-colors focus:outline-none"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#47752F]" />
              <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">Bag</span>
              <span className="w-5 h-5 rounded-full bg-[#4A2415] text-[#FFF9EF] text-[11px] font-bold flex items-center justify-center tabular-nums">
                {totalItemCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* SEARCH MODAL */}
      {showSearchModal && (
        <div
          className="fixed inset-0 z-50 bg-[#4A2415]/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className="bg-[#FFFFFF] w-full max-w-xl rounded-xl shadow-2xl border border-[#E9DDC9] p-6 text-[#4A2415]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E9DDC9]">
              <span className="text-sm font-semibold text-[#47752F] uppercase tracking-wider">Search Gudbazaar</span>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-[#4A2415]/60 hover:text-[#4A2415]"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="mt-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A2415]/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jaggery blocks, powder, cubes, kakvi..."
                  className="w-full pl-11 pr-24 py-3 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-sm text-[#4A2415] focus:outline-none focus:border-[#47752F] placeholder:text-[#4A2415]/40"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-medium rounded-md transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
            <div className="mt-4 pt-3 flex flex-wrap gap-2 text-xs text-[#4A2415]/70 items-center">
              <span className="font-medium text-[#4A2415]">Popular:</span>
              <button
                onClick={() => {
                  navigate('/shop?q=powder');
                  setShowSearchModal(false);
                }}
                className="hover:text-[#47752F] underline decoration-[#E9DDC9]"
              >
                Jaggery Powder
              </button>
              <span className="text-[#E9DDC9]">·</span>
              <button
                onClick={() => {
                  navigate('/shop?q=blocks');
                  setShowSearchModal(false);
                }}
                className="hover:text-[#47752F] underline decoration-[#E9DDC9]"
              >
                Traditional Blocks
              </button>
              <span className="text-[#E9DDC9]">·</span>
              <button
                onClick={() => {
                  navigate('/shop?q=kakvi');
                  setShowSearchModal(false);
                }}
                className="hover:text-[#47752F] underline decoration-[#E9DDC9]"
              >
                Liquid Kakvi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#4A2415]/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FFFFFF] h-full shadow-2xl p-6 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E9DDC9]">
                <LogoLink size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#4A2415]/70 hover:text-[#4A2415]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Account Banner */}
              <div className="mt-4 p-3 bg-[#FFF9EF] rounded-xl border border-[#E9DDC9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#47752F] text-white flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#4A2415]">
                      {user ? user.fullName : 'Customer Account'}
                    </p>
                    <p className="text-[10px] text-[#47752F] font-semibold">
                      {user ? 'View profile & orders' : 'Sign in & get 15% off'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal(user ? 'profile' : 'signup');
                  }}
                  className="px-3 py-1 bg-[#4A2415] text-[#FFF9EF] text-xs font-bold rounded-lg"
                >
                  {user ? 'Profile' : 'Sign In'}
                </button>
              </div>

              <nav className="mt-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-base font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-[#FFF9EF] text-[#47752F]'
                          : 'text-[#4A2415] hover:bg-[#FFF9EF]'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </NavLink>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-[#E9DDC9]">
                <p className="text-xs font-semibold text-[#47752F] uppercase tracking-wider mb-3">Shop Categories</p>
                <div className="flex flex-col gap-2 text-sm text-[#4A2415]/80">
                  <NavLink to="/shop?category=Jaggery+Blocks" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#47752F] py-1">Jaggery Blocks</NavLink>
                  <NavLink to="/shop?category=Jaggery+Powder" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#47752F] py-1">Jaggery Powder</NavLink>
                  <NavLink to="/shop?category=Jaggery+Cubes" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#47752F] py-1">Jaggery Cubes</NavLink>
                  <NavLink to="/shop?category=Liquid+Jaggery" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#47752F] py-1">Liquid Jaggery (Kakvi)</NavLink>
                  <NavLink to="/shop?category=Jaggery+Specialities" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#47752F] py-1">Festive Specialities</NavLink>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E9DDC9] text-xs text-[#4A2415]/60 flex flex-col gap-2">
              <p className="font-semibold text-[#4A2415]">Gudbazaar Customer Support</p>
              <p>Mon–Sat: 9:00 AM – 7:00 PM IST</p>
              <p>WhatsApp: +91 98200 12345</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
