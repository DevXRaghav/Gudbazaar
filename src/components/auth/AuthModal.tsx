import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Lock, MapPin, Sparkles, Check, LogOut, Package, ArrowRight, ArrowLeft, Eye, EyeOff, Tag, Heart, ChevronDown, UserPlus, LogIn } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { PINCODE_DELIVERY_DATA } from '../../data/products';
import { INDIAN_STATES_AND_UT } from '../../data/indianStates';
import { GudbazaarLogo } from '../common/Logo';
import { CustomerProfile } from '../../types';
import { validateIndianPincode } from '../../utils/pincodeValidator';

export const AuthModal: React.FC = () => {
  const {
    user,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    register,
    login,
    logout,
    updateProfile,
    savedOrders,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'prompt' | 'signup' | 'signin' | 'profile'>(
    user ? 'profile' : authModalMode
  );

  // Sync tab with external open trigger
  useEffect(() => {
    if (user) {
      setActiveTab('profile');
    } else {
      setActiveTab(authModalMode === 'profile' ? 'prompt' : authModalMode);
    }
  }, [authModalMode, user]);

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [preference, setPreference] = useState<CustomerProfile['sweetenerPreference']>('Daily Tea & Beverages');
  
  // Signin form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Editing profile state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddressLine, setEditAddressLine] = useState(user?.addressLine || '');
  const [editCity, setEditCity] = useState(user?.city || '');
  const [editState, setEditState] = useState(user?.state || '');
  const [editPincode, setEditPincode] = useState(user?.pincode || '');

  // Feedback messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  // Auto-fill city and state from PIN code on signup
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    if (val.length === 6) {
      const check = validateIndianPincode(val);
      if (check.isValid) {
        if (check.city) setCity(check.city);
        if (check.state) setState(check.state);
        setErrorMessage(null);
      }
    }
  };

  const handleEditPincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setEditPincode(val);
    if (val.length === 6) {
      const check = validateIndianPincode(val);
      if (check.isValid) {
        if (check.city) setEditCity(check.city);
        if (check.state) setEditState(check.state);
        setErrorMessage(null);
      }
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!/^\d{10}$/.test(cleanMobile)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    // If pincode is provided, enforce strict Indian postal validation
    if (pincode.trim()) {
      const pinCheck = validateIndianPincode(pincode);
      if (!pinCheck.isValid) {
        setErrorMessage(pinCheck.message);
        return;
      }
    }

    const res = register({
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: cleanMobile,
      password,
      pincode,
      city,
      state,
      sweetenerPreference: preference,
    });

    if (res.success) {
      setSuccessMessage('Account created! Welcome to the Gudbazaar family.');
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#4A2415', '#47752F', '#E99A19', '#FFF9EF'],
        });
      } catch {
        // ignore
      }
      setTimeout(() => {
        setSuccessMessage(null);
        setActiveTab('profile');
      }, 1200);
    } else {
      setErrorMessage(res.message || 'Registration failed');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please enter your email or mobile number');
      return;
    }

    const res = login(loginIdentifier, loginPassword);
    if (res.success) {
      setSuccessMessage('Signed in successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        setActiveTab('profile');
      }, 800);
    } else {
      setErrorMessage(res.message || 'Login failed');
    }
  };

  const handleSaveProfileAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      addressLine: editAddressLine,
      city: editCity,
      state: editState,
      pincode: editPincode,
    });
    setIsEditingAddress(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#4A2415]/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={closeAuthModal}
    >
      <div
        className={`relative w-full ${
          activeTab === 'prompt' ? 'max-w-md' : 'max-w-md sm:max-w-lg'
        } bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E9DDC9] overflow-hidden flex flex-col max-h-[92vh] text-[#4A2415] transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-[#FFF9EF] p-4 sm:p-5 border-b border-[#E9DDC9] flex items-center justify-between">
          {!user && activeTab === 'prompt' ? (
            <div className="flex items-center gap-2">
              <GudbazaarLogo size="sm" />
            </div>
          ) : !user && (activeTab === 'signup' || activeTab === 'signin') ? (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('prompt');
                  setErrorMessage(null);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-[#47752F] hover:text-[#4A2415] transition-colors py-1 px-2 -ml-1 rounded-lg hover:bg-[#E9DDC9]/40 active:scale-95"
                title="Go back to options"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="h-4 w-px bg-[#E9DDC9]" />
              <h2 className="text-sm font-bold text-[#4A2415]">
                {activeTab === 'signup' ? 'Create Customer Profile' : 'Customer Sign In'}
              </h2>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#47752F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#4A2415]">
                  Welcome, {user?.fullName.split(' ')[0]}
                </h2>
                <p className="text-[11px] text-[#47752F] font-semibold">
                  Pure Jaggery · Natural Wellness Profile
                </p>
              </div>
            </div>
          )}

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full hover:bg-[#E9DDC9]/60 text-[#4A2415]/70 hover:text-[#4A2415] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Only visible when user has entered Sign Up or Sign In form) */}
        {!user && (activeTab === 'signup' || activeTab === 'signin') && (
          <div className="grid grid-cols-2 p-1.5 bg-[#FFF9EF] border-b border-[#E9DDC9]/70 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-[#4A2415] shadow-xs'
                  : 'text-[#4A2415]/60 hover:text-[#4A2415]'
              }`}
            >
              Sign Up (15% Off)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'signin'
                  ? 'bg-white text-[#4A2415] shadow-xs'
                  : 'text-[#4A2415]/60 hover:text-[#4A2415]'
              }`}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-[#47752F]/10 border border-[#47752F]/30 rounded-xl text-[#47752F] text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* TAB 0: COMPACT INITIAL CHOICE PROMPT */}
          {!user && activeTab === 'prompt' && (
            <div className="space-y-4 py-1">
              
              {/* Highlight Welcome Discount Banner */}
              <div className="p-4 bg-gradient-to-br from-[#4A2415] to-[#633520] text-white rounded-xl shadow-xs border border-[#E99A19]/30">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[#E99A19] font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>Welcome to Gudbazaar</span>
                  </div>
                  <span className="text-[10px] bg-[#E99A19] text-[#4A2415] px-2 py-0.5 rounded-full font-extrabold uppercase shrink-0">
                    15% OFF
                  </span>
                </div>
                <p className="text-xs text-[#FFF9EF] font-medium mt-1.5 leading-snug">
                  Experience traditional single-origin Indian jaggery, crafted naturally with zero chemicals.
                </p>
                <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] text-[#FFF9EF]/90">
                  <span>First Order Code: <strong className="text-[#E99A19] font-mono tracking-wider font-bold">FIRSTGUD</strong></span>
                  <span className="text-[#FFF9EF]/70">Free Shipping on ₹499+</span>
                </div>
              </div>

              {/* Action Prompt Headline */}
              <div className="text-center pt-1 pb-0.5">
                <h3 className="text-sm font-bold text-[#4A2415]">
                  Sign up or Log in to continue
                </h3>
                <p className="text-[11px] text-[#4A2415]/70 mt-0.5">
                  Choose an option below to access member discounts and tracking:
                </p>
              </div>

              {/* Choice 1: Sign Up (Opens the bigger form) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMessage(null);
                }}
                className="w-full p-3.5 sm:p-4 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] rounded-xl transition-all shadow-md group flex items-center justify-between text-left active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5 text-[#E99A19]" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                      <span>Create New Account (Sign Up)</span>
                      <span className="text-[10px] bg-[#E99A19] text-[#4A2415] px-1.5 py-0.2 rounded font-extrabold uppercase">
                        Save 15%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#FFF9EF]/80 mt-0.5">
                      New to Gudbazaar · Quick 30-sec profile setup
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#E99A19] group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              {/* Choice 2: Log In */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage(null);
                }}
                className="w-full p-3.5 bg-[#FFF9EF] hover:bg-[#E9DDC9]/50 border border-[#E9DDC9] rounded-xl transition-all group flex items-center justify-between text-left active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E9DDC9]/50 flex items-center justify-center shrink-0">
                    <LogIn className="w-4 h-4 text-[#47752F]" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#4A2415]">
                      Log In to Existing Account
                    </div>
                    <p className="text-[11px] text-[#4A2415]/70 mt-0.5">
                      Sign in using your mobile number or email
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#4A2415]/50 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              {/* Continue as Guest */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="text-xs text-[#4A2415]/60 hover:text-[#4A2415] hover:underline"
                >
                  Continue browsing as guest →
                </button>
              </div>

            </div>
          )}
          
          {/* TAB 1: SIGN UP FORM */}
          {!user && activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              
              {/* Promotional Welcome Perk */}
              <div className="p-3 bg-[#FFF9EF] rounded-xl border border-[#E99A19]/50 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#E99A19] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#4A2415] block">Welcome Perk: 15% OFF First Order</span>
                  <p className="text-[11px] text-[#4A2415]/75 mt-0.5">
                    Register your customer profile today and unlock coupon code <strong className="text-[#47752F]">FIRSTGUD</strong> for your first delivery!
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-bold text-[#4A2415] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A2415]/40" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Raghav Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                  />
                </div>
              </div>

              {/* Mobile & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#4A2415] mb-1">
                    Mobile Number *
                  </label>
                  <div className="flex">
                    <span className="px-2.5 py-2 bg-[#E9DDC9]/50 border border-r-0 border-[#E9DDC9] rounded-l-lg text-[#4A2415] font-semibold text-xs">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="9820012345"
                      className="w-full px-3 py-2 bg-[#FFF9EF] border border-[#E9DDC9] rounded-r-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#4A2415] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A2415]/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-bold text-[#4A2415] mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A2415]/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A2415]/50 hover:text-[#4A2415]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Location: PIN Code, City, and State / UT Dropdown */}
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#4A2415] mb-1">
                      Delivery PIN Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={handlePincodeChange}
                      placeholder="e.g. 400001"
                      className="w-full px-3 py-2 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#4A2415] mb-1">
                      City / District
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai, Pune, Jaipur"
                      className="w-full px-3 py-2 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#4A2415] mb-1">
                    State / Union Territory
                  </label>
                  <div className="relative">
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F] cursor-pointer appearance-none pr-8"
                    >
                      <option value="">Select State or Union Territory</option>
                      <optgroup label="States (28)">
                        {INDIAN_STATES_AND_UT.slice(0, 28).map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Union Territories (8)">
                        {INDIAN_STATES_AND_UT.slice(28).map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#4A2415]/60">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Sweetener Preference */}
              <div>
                <label className="block font-bold text-[#4A2415] mb-1.5">
                  How do you use Jaggery mostly?
                </label>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    'Daily Tea & Beverages',
                    'Ayurvedic & Health',
                    'Traditional Cooking',
                    'Baking & Gourmet',
                  ].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPreference(p as any)}
                      className={`p-2 rounded-lg border text-left font-medium transition-all ${
                        preference === p
                          ? 'border-[#47752F] bg-[#FFF9EF] text-[#47752F] font-bold shadow-2xs'
                          : 'border-[#E9DDC9] hover:bg-[#FFF9EF] text-[#4A2415]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Create Customer Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-[#4A2415]/60 text-center">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="font-bold text-[#47752F] hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}

          {/* TAB 2: SIGN IN FORM */}
          {!user && activeTab === 'signin' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <p className="text-xs text-[#4A2415]/75">
                Sign in using your registered mobile number or email address.
              </p>

              <div>
                <label className="block font-bold text-[#4A2415] mb-1">
                  Email or 10-Digit Mobile Number *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A2415]/40" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. 9820012345 or you@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#4A2415]">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('For this demo preview, you can sign in with any registered password or use quick test signin!')}
                    className="text-[11px] text-[#47752F] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A2415]/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A2415]/50 hover:text-[#4A2415]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-[#4A2415]/70">New customer? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-xs font-bold text-[#47752F] hover:underline"
                >
                  Create an account & get 15% off
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: LOGGED-IN CUSTOMER PROFILE */}
          {user && (
            <div className="space-y-5">
              
              {/* Profile Card Summary */}
              <div className="p-4 bg-[#FFF9EF] rounded-xl border border-[#E9DDC9] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#4A2415]">{user.fullName}</h3>
                  <p className="text-xs text-[#4A2415]/75 mt-0.5">{user.email}</p>
                  <p className="text-xs text-[#47752F] font-semibold mt-0.5">+91 {user.mobile}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#47752F] bg-white px-2 py-0.5 rounded border border-[#47752F]/30 block mb-1">
                    Member
                  </span>
                  <span className="text-[10px] text-[#4A2415]/60">
                    Since {new Date(user.createdAt).getFullYear()}
                  </span>
                </div>
              </div>

              {/* First-Order Exclusive Coupon Banner */}
              <div className="p-3.5 bg-gradient-to-r from-[#4A2415] to-[#6B3E26] text-white rounded-xl shadow-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[#E99A19] font-bold text-xs">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Your Welcome Discount</span>
                  </div>
                  <p className="text-[11px] text-[#FFF9EF]/85 mt-0.5">Use code at checkout for 15% off</p>
                </div>
                <div className="px-3 py-1 bg-white/15 rounded-lg border border-white/20 font-bold tracking-wider text-xs">
                  FIRSTGUD
                </div>
              </div>

              {/* Saved Delivery Address */}
              <div className="p-4 bg-white rounded-xl border border-[#E9DDC9] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#4A2415]">
                    <MapPin className="w-4 h-4 text-[#47752F]" />
                    <span>Saved Delivery Address</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-xs font-semibold text-[#47752F] hover:underline"
                  >
                    {isEditingAddress ? 'Cancel' : user.addressLine ? 'Edit' : '+ Add Address'}
                  </button>
                </div>

                {isEditingAddress ? (
                  <form onSubmit={handleSaveProfileAddress} className="pt-2 space-y-2 text-xs">
                    <input
                      type="text"
                      required
                      value={editAddressLine}
                      onChange={(e) => setEditAddressLine(e.target.value)}
                      placeholder="Street address, house / apartment number"
                      className="w-full px-3 py-1.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-[#4A2415]"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={editPincode}
                        onChange={handleEditPincodeChange}
                        placeholder="PIN code"
                        className="px-3 py-1.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-[#4A2415]"
                      />
                      <input
                        type="text"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        placeholder="City"
                        className="px-3 py-1.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-[#4A2415]"
                      />
                      <select
                        value={editState}
                        onChange={(e) => setEditState(e.target.value)}
                        className="px-2 py-1.5 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-[#4A2415] text-xs cursor-pointer"
                      >
                        <option value="">State / UT</option>
                        <optgroup label="States">
                          {INDIAN_STATES_AND_UT.slice(0, 28).map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Union Territories">
                          {INDIAN_STATES_AND_UT.slice(28).map((ut) => (
                            <option key={ut} value={ut}>{ut}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#47752F] text-white rounded-lg font-bold text-xs"
                    >
                      Save Address
                    </button>
                  </form>
                ) : user.addressLine ? (
                  <p className="text-xs text-[#4A2415]/80 leading-relaxed">
                    {user.addressLine}, {user.city}, {user.state} — {user.pincode}
                  </p>
                ) : (
                  <p className="text-xs text-[#4A2415]/50 italic">
                    No default address saved. Add one for rapid 1-click checkout.
                  </p>
                )}
              </div>

              {/* Sweetener Preference */}
              {user.sweetenerPreference && (
                <div className="p-3 bg-[#FFF9EF] rounded-xl border border-[#E9DDC9] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#4A2415]">Preferred Jaggery Profile:</span>
                  <span className="font-bold text-[#47752F]">{user.sweetenerPreference}</span>
                </div>
              )}

              {/* Order History link / preview */}
              <div className="p-4 bg-white rounded-xl border border-[#E9DDC9]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#4A2415]">
                    <Package className="w-4 h-4 text-[#47752F]" />
                    <span>Recent Orders</span>
                  </div>
                  <span className="text-[11px] text-[#4A2415]/60 tabular-nums">
                    {savedOrders.length} order(s)
                  </span>
                </div>

                {savedOrders.length === 0 ? (
                  <p className="text-xs text-[#4A2415]/60">
                    No past orders yet. Your confirmed orders will show here for instant tracking.
                  </p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {savedOrders.slice(0, 2).map((o) => (
                      <div
                        key={o.orderId}
                        className="p-2.5 bg-[#FFF9EF] rounded-lg border border-[#E9DDC9] flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-[#4A2415]">#{o.orderId}</p>
                          <p className="text-[11px] text-[#4A2415]/70">
                            {o.items.length} item(s) · {o.paymentMethod}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#47752F] tabular-nums">₹{o.total}</span>
                          <span className="block text-[10px] text-[#4A2415]/60 capitalize">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sign Out CTA */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-900"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>

                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="px-5 py-2 bg-[#4A2415] hover:bg-[#47752F] text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
