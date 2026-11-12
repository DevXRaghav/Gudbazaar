import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerProfile, Order } from '../types';
import {
  checkAuthRateLimit,
  recordFailedAuthAttempt,
  resetAuthRateLimit,
  auditInputSecurity,
  sanitizeText,
} from '../utils/security';

interface AuthContextType {
  user: CustomerProfile | null;
  isAuthModalOpen: boolean;
  authModalMode: 'prompt' | 'signup' | 'signin' | 'profile';
  openAuthModal: (mode?: 'prompt' | 'signup' | 'signin' | 'profile') => void;
  closeAuthModal: () => void;
  register: (data: Omit<CustomerProfile, 'id' | 'createdAt'>) => { success: boolean; message?: string };
  login: (emailOrPhone: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  updateProfile: (updates: Partial<CustomerProfile>) => void;
  savedOrders: Order[];
  addOrderToHistory: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'gudbazaar_customer_user_v1';
const USERS_DB_STORAGE_KEY = 'gudbazaar_registered_users_db_v1';
const ORDERS_HISTORY_STORAGE_KEY = 'gudbazaar_orders_history_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [savedOrders, setSavedOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'prompt' | 'signup' | 'signin' | 'profile'>('prompt');

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_HISTORY_STORAGE_KEY, JSON.stringify(savedOrders));
    } catch {
      // ignore
    }
  }, [savedOrders]);

  // Automatically open the lightweight signup/login prompt popup after website loads if not logged in
  useEffect(() => {
    if (user) return;
    const hasSeen = sessionStorage.getItem('gudbazaar_auto_auth_prompt_seen_v1');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsAuthModalOpen(true);
        setAuthModalMode('prompt');
        sessionStorage.setItem('gudbazaar_auto_auth_prompt_seen_v1', 'true');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  const openAuthModal = (mode: 'prompt' | 'signup' | 'signin' | 'profile' = user ? 'profile' : 'prompt') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const register = (data: Omit<CustomerProfile, 'id' | 'createdAt'>) => {
    // 1. Cybersecurity: Audit for injection scripts
    const nameAudit = auditInputSecurity(data.fullName, 'Full Name');
    if (!nameAudit.isSafe) return { success: false, message: nameAudit.errorMessage };

    const emailAudit = auditInputSecurity(data.email, 'Email Address');
    if (!emailAudit.isSafe) return { success: false, message: emailAudit.errorMessage };

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanMobile = data.mobile.replace(/\D/g, '').slice(0, 10);

    // Check existing registered users database
    let existingUsers: CustomerProfile[] = [];
    try {
      const db = localStorage.getItem(USERS_DB_STORAGE_KEY);
      existingUsers = db ? JSON.parse(db) : [];
    } catch {
      existingUsers = [];
    }

    const alreadyExists = existingUsers.some(
      (u) => u.email.toLowerCase() === cleanEmail || (cleanMobile && u.mobile === cleanMobile)
    );

    if (alreadyExists) {
      return {
        success: false,
        message: 'An account with this email or mobile number already exists. Please Sign In.',
      };
    }

    const newProfile: CustomerProfile = {
      ...data,
      id: `usr_${Date.now()}`,
      fullName: data.fullName.trim().slice(0, 80),
      email: cleanEmail,
      mobile: cleanMobile,
      createdAt: new Date().toISOString(),
    };

    existingUsers.push(newProfile);
    try {
      localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(existingUsers));
    } catch {
      // ignore
    }

    resetAuthRateLimit();
    setUser(newProfile);
    return { success: true };
  };

  const login = (emailOrPhone: string, password?: string) => {
    // 1. Cybersecurity: Rate limit check against brute-force credential stuffing
    const rateCheck = checkAuthRateLimit();
    if (!rateCheck.isAllowed) {
      return { success: false, message: rateCheck.errorMessage };
    }

    // 2. Cybersecurity: Audit injection tokens
    const audit = auditInputSecurity(emailOrPhone, 'Login Identifier');
    if (!audit.isSafe) {
      recordFailedAuthAttempt();
      return { success: false, message: audit.errorMessage };
    }

    const identifier = emailOrPhone.trim().toLowerCase();
    const cleanMobile = emailOrPhone.replace(/\D/g, '').slice(0, 10);

    let existingUsers: CustomerProfile[] = [];
    try {
      const db = localStorage.getItem(USERS_DB_STORAGE_KEY);
      existingUsers = db ? JSON.parse(db) : [];
    } catch {
      existingUsers = [];
    }

    const found = existingUsers.find(
      (u) => u.email.toLowerCase() === identifier || (cleanMobile && u.mobile === cleanMobile)
    );

    if (!found) {
      // Create quick guest-converted account if not found
      const isPhone = /^\d{10}$/.test(cleanMobile);
      const guestProfile: CustomerProfile = {
        id: `usr_${Date.now()}`,
        fullName: isPhone ? 'Valued Customer' : identifier.split('@')[0],
        email: isPhone ? `${cleanMobile}@gudbazaar.com` : identifier,
        mobile: isPhone ? cleanMobile : '9820012345',
        password: password || 'gudbazaar123',
        createdAt: new Date().toISOString(),
      };
      existingUsers.push(guestProfile);
      try {
        localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(existingUsers));
      } catch {
        // ignore
      }
      resetAuthRateLimit();
      setUser(guestProfile);
      return { success: true };
    }

    // Verify password if specified
    if (found.password && password && found.password !== password) {
      const lockMsg = recordFailedAuthAttempt();
      return {
        success: false,
        message: lockMsg || 'Incorrect password. Security attempt logged. Please try again.',
      };
    }

    resetAuthRateLimit();
    setUser(found);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthModalOpen(false);
  };

  const updateProfile = (updates: Partial<CustomerProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);

    // Update in DB as well
    try {
      const db = localStorage.getItem(USERS_DB_STORAGE_KEY);
      if (db) {
        const existingUsers: CustomerProfile[] = JSON.parse(db);
        const idx = existingUsers.findIndex((u) => u.id === user.id);
        if (idx !== -1) {
          existingUsers[idx] = updated;
          localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(existingUsers));
        }
      }
    } catch {
      // ignore
    }
  };

  const addOrderToHistory = (order: Order) => {
    setSavedOrders((prev) => [order, ...prev.filter((o) => o.orderId !== order.orderId)]);
  };

  return (
    <AuthContext.Provider
      value={{
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
        addOrderToHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
