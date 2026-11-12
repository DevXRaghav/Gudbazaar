import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ArrowRight, User, Sun, Moon } from 'lucide-react';
import { LogoLink } from './Logo';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { totalItemCount, openDrawer } = useCart();
  const { user, openAuthModal } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
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
      <div className="bg-[#4A2415] dark:bg-[#1E1109] text-[#FFF9EF] text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 text-center tracking-wide font-medium flex items-center justify-center gap-1.5 sm:gap-2 overflow-hidden border-b border-[#3B2519]/40">
        <span className="truncate">🌿 100% Organic & Prepared Fresh · Sourced from the Roots of Uttar Pradesh (Govt. of India Recognized Sugarcane Belt)</span>
        <span className="hidden sm:inline text-[#E99A19]">·</span>
        <span className="hidden sm:inline text-[#FFF9EF]/90">Free Delivery above ₹499</span>
      </div>

      {/* SECTION B — STICKY NAVIGATION BAR (Strict 3-zone contract) */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] dark:bg-[#180E08]/95 border-b border-[#E9DDC9]/70 dark:border-[#3B2519] backdrop-blur-md bg-white/95 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-17 md:h-18 flex items-center justify-between gap-2 sm:gap-3 md:gap-4 lg:gap-8">
          
          {/* Zone 1: Brand Wordmark & Motif */}
          <div className="shrink-0 flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-1 text-[#4A2415] dark:text-[#F5EBE1] hover:text-[#47752F] dark:hover:text-[#6BB545] hover:bg-[#FFF9EF] dark:hover:bg-[#261810] active:bg-[#E9DDC9]/50 rounded-lg transition-colors focus:outline-none touch-manipulation"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <LogoLink size="md" />
          </div>

          {/* Zone 2: 4 Clean Single-Line Text Links */}
          <nav className="hidden md:flex items-center gap-3.5 md:gap-4.5 lg:gap-8 text-sm lg:text-[15px] font-medium text-[#4A2415] dark:text-[#F5EBE1]">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                    isActive
                      ? 'border-[#47752F] text-[#47752F] dark:border-[#6BB545] dark:text-[#6BB545] font-semibold'
                      : 'border-transparent text-[#4A2415] dark:text-[#F5EBE1] hover:text-[#47752F] dark:hover:text-[#6BB545]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Search, Theme Toggle, Customer Account & Shopping Bag */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-2.5 lg:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => {
                if (onOpenSearch) onOpenSearch();
                else setShowSearchModal(true);
              }}
              className="p-2 text-[#4A2415] dark:text-[#F5EBE1] hover:text-[#47752F] dark:hover:text-[#6BB545] hover:bg-[#FFF9EF] dark:hover:bg-[#261810] active:bg-[#E9DDC9]/40 rounded-full transition-colors focus:outline-none touch-manipulation"
              aria-label="Search products"
              title="Search products"
            >
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-[#4A2415] dark:text-[#F5EBE1] hover:text-[#47752F] dark:hover:text-[#E99A19] hover:bg-[#FFF9EF] dark:hover:bg-[#261810] active:scale-95 rounded-full transition-all focus:outline-none touch-manipulation"
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#F5AA28]" />
              ) : (
                <Moon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#4A2415]" />
              )}
            </button>

            {/* Customer Account / Sign Up Popup Trigger */}
            <button
              onClick={() => openAuthModal(user ? 'profile' : 'prompt')}
              className={`flex items-center gap-1.5 p-2 sm:py-1.5 sm:px-3 rounded-full text-xs font-semibold transition-all border touch-manipulation ${
                user
                  ? 'bg-[#47752F]/10 dark:bg-[#6BB545]/15 border-[#47752F]/30 dark:border-[#6BB545]/40 text-[#47752F] dark:text-[#6BB545] hover:bg-[#47752F]/20'
                  : 'bg-[#FFF9EF] dark:bg-[#261810] hover:bg-[#E9DDC9]/50 dark:hover:bg-[#322016] border-[#E9DDC9] dark:border-[#3B2519] text-[#4A2415] dark:text-[#F5EBE1]'
              }`}
              title={user ? `Logged in as ${user.fullName}` : 'Sign Up / Customer Profile'}
              aria-label="Customer Account Profile"
            >
              <User className="w-4 h-4 text-[#47752F] dark:text-[#6BB545]" />
              <span className="hidden sm:inline">
                {user ? user.fullName.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Shopping Bag with Cart Count */}
            <button
              onClick={openDrawer}
              className="relative flex items-center gap-1.5 sm:gap-2 py-1.5 px-2.5 sm:py-2 sm:px-3.5 bg-[#FFF9EF] dark:bg-[#261810] hover:bg-[#E9DDC9]/50 dark:hover:bg-[#322016] active:bg-[#E9DDC9]/70 border border-[#E9DDC9] dark:border-[#3B2519] text-[#4A2415] dark:text-[#F5EBE1] rounded-full text-xs sm:text-sm font-medium transition-colors focus:outline-none touch-manipulation"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#47752F] dark:text-[#6BB545]" />
              <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">Bag</span>
              <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#4A2415] dark:bg-[#F5AA28] text-[#FFF9EF] dark:text-[#120A06] text-[10px] sm:text-[11px] font-bold flex items-center justify-center tabular-nums">
                {totalItemCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* SEARCH MODAL */}
      {showSearchModal && (
        <div
          className="fixed inset-0 z-50 bg-[#4A2415]/60 dark:bg-black/75 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className="bg-[#FFFFFF] dark:bg-[#1C110B] w-full max-w-xl rounded-xl shadow-2xl border border-[#E9DDC9] dark:border-[#3B2519] p-6 text-[#4A2415] dark:text-[#F5EBE1]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E9DDC9] dark:border-[#3B2519]">
              <span className="text-sm font-semibold text-[#47752F] dark:text-[#6BB545] uppercase tracking-wider">Search Gudbazaar</span>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-[#4A2415]/60 dark:text-[#D8C7B8]/60 hover:text-[#4A2415] dark:hover:text-[#F5EBE1]"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="mt-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A2415]/50 dark:text-[#D8C7B8]/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jaggery blocks, powder, cubes, kakvi..."
                  className="w-full pl-11 pr-24 py-3 bg-[#FFF9EF] dark:bg-[#261810] border border-[#E9DDC9] dark:border-[#42291C] rounded-lg text-sm text-[#4A2415] dark:text-[#F5EBE1] focus:outline-none focus:border-[#47752F] dark:focus:border-[#6BB545] placeholder:text-[#4A2415]/40 dark:placeholder:text-[#D8C7B8]/40"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#4A2415] dark:bg-[#6BB545] hover:bg-[#47752F] dark:hover:bg-[#5aa038] text-[#FFF9EF] dark:text-[#120A06] text-xs font-bold rounded-md transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
            <div className="mt-4 pt-3 flex flex-wrap gap-2 text-xs text-[#4A2415]/70 dark:text-[#D8C7B8]/70 items-center">
              <span className="font-medium text-[#4A2415] dark:text-[#F5EBE1]">Popular:</span>
              <button
                onClick={() => {
                  navigate('/shop?q=powder');
                  setShowSearchModal(false);
                }}
                className="hover:text-[#47752F] dark:hover:text-[#6BB545] underline decoration-[#E9DDC9] dark:decoration-[#3B2519]"
              >
                Jaggery Powder
              </button>
              <span className="text-[#E9DDC9] dark:text-[#3B2519]">·</span>
              <button
                onClick={() => {
                  navigate('/shop?q=blocks');
                  setShowSearchModal(false);
                }}
                className="hover:text-[#47752F] dark:hover:text-[#6BB545] underline decoration-[#E9DDC9] dark:decoration-[#3B2519]"
              >
                Traditional Blocks
              </button>
              <span className="text-[#E9DDC9] dark:text-[#3B2519]">·</span>
              <button
                onClick={() => {
                  navigate('/shop?q=kakvi');
                  setShowSearchModal(false);
                }}
                className="hover:text-[#47752F] dark:hover:text-[#6BB545] underline decoration-[#E9DDC9] dark:decoration-[#3B2519]"
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
            className="fixed inset-0 bg-[#4A2415]/50 dark:bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FFFFFF] dark:bg-[#1C110B] h-full shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto border-r border-[#E9DDC9] dark:border-[#3B2519] text-[#4A2415] dark:text-[#F5EBE1]">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E9DDC9] dark:border-[#3B2519]">
                <LogoLink size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#4A2415]/70 dark:text-[#D8C7B8]/70 hover:text-[#4A2415] dark:hover:text-[#F5EBE1]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Account Banner */}
              <div className="mt-4 p-3 bg-[#FFF9EF] dark:bg-[#261810] rounded-xl border border-[#E9DDC9] dark:border-[#3B2519] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#47752F] dark:bg-[#6BB545] text-white dark:text-[#120A06] flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#4A2415] dark:text-[#F5EBE1]">
                      {user ? user.fullName : 'Customer Account'}
                    </p>
                    <p className="text-[10px] text-[#47752F] dark:text-[#6BB545] font-semibold">
                      {user ? 'View profile & orders' : 'Sign in & get 15% off'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal(user ? 'profile' : 'prompt');
                  }}
                  className="px-3 py-1 bg-[#4A2415] dark:bg-[#6BB545] text-[#FFF9EF] dark:text-[#120A06] text-xs font-bold rounded-lg"
                >
                  {user ? 'Profile' : 'Sign In'}
                </button>
              </div>

              {/* Navigation Links */}

              <nav className="mt-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-base font-semibold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-[#FFF9EF] dark:bg-[#261810] text-[#47752F] dark:text-[#6BB545]'
                          : 'text-[#4A2415] dark:text-[#F5EBE1] hover:bg-[#FFF9EF] dark:hover:bg-[#261810]'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </NavLink>
                ))}
              </nav>

              <div className="mt-6 pt-5 border-t border-[#E9DDC9] dark:border-[#3B2519]">
                <p className="text-xs font-semibold text-[#47752F] dark:text-[#6BB545] uppercase tracking-wider mb-3">Shop Categories (1kg)</p>
                <div className="flex flex-col gap-2 text-sm text-[#4A2415]/80 dark:text-[#D8C7B8]/80">
                  <NavLink to="/shop?category=Raw+Gud" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#47752F] dark:hover:text-[#6BB545] py-1">Raw Gud</NavLink>
                  <NavLink to="/shop?category=Gud+Cubes" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#47752F] dark:hover:text-[#6BB545] py-1">Gud Cubes (Raw, Dryfruits, Peanut, All-in-One)</NavLink>
                  <NavLink to="/shop?category=Pure+Desi+Khand" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#47752F] dark:hover:text-[#6BB545] py-1">Pure Desi Khand</NavLink>
                  <NavLink to="/shop?category=Pure+Organic+Shakkar" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#47752F] dark:hover:text-[#6BB545] py-1">Pure Organic Shakkar</NavLink>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E9DDC9] dark:border-[#3B2519] text-xs text-[#4A2415]/60 dark:text-[#D8C7B8]/60 flex flex-col gap-1.5 safe-pb">
              <p className="font-semibold text-[#4A2415] dark:text-[#F5EBE1]">Gudbazaar Customer Support</p>
              <p>Mon–Sat: 9:00 AM – 7:00 PM IST</p>
              <p>WhatsApp: +91 98200 12345</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
