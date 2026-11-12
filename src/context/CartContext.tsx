import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Coupon, Order } from '../types';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, VALID_COUPONS } from '../data/products';
import {
  sanitizeCartQuantity,
  checkCouponRateLimit,
  recordFailedCouponAttempt,
  resetCouponRateLimit,
  auditInputSecurity,
  SECURITY_RULES,
} from '../utils/security';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variantWeight?: string, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  coupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  totalItemCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  freeShippingRemaining: number;
  lastOrder: Order | null;
  setLastOrder: (order: Order) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'gudbazaar_cart_v1';
const COUPON_STORAGE_KEY = 'gudbazaar_coupon_v1';
const ORDER_STORAGE_KEY = 'gudbazaar_last_order_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [lastOrder, setLastOrderState] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem(ORDER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [couponError, setCouponError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage quota or disabled
    }
  }, [items]);

  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch {
      // storage quota or disabled
    }
  }, [coupon]);

  const setLastOrder = (order: Order) => {
    setLastOrderState(order);
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    } catch {
      // ignore
    }
  };

  const addToCart = (product: Product, variantWeight?: string, rawQuantity = 1) => {
    const qtyCheck = sanitizeCartQuantity(rawQuantity);
    const quantity = qtyCheck.value;

    const selectedVariant = variantWeight
      ? product.variants.find((v) => v.weight === variantWeight) || product.variants[0]
      : product.variants[0];

    const weight = selectedVariant?.weight || product.weight;
    const price = selectedVariant?.price || product.price;
    const mrp = selectedVariant?.mrp || product.mrp;
    const itemId = `${product.id}-${weight}`;

    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === itemId);
      if (existing) {
        const nextQty = Math.min(SECURITY_RULES.MAX_QUANTITY_PER_ITEM, existing.quantity + quantity);
        return prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: nextQty } : item
        );
      }
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.primaryImage,
        weight,
        price,
        mrp,
        quantity,
        category: product.category,
        packagingType: product.packagingType,
      };
      return [...prevItems, newItem];
    });

    setIsDrawerOpen(true);
  };

  const updateQuantity = (itemId: string, rawQuantity: number) => {
    if (rawQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const qtyCheck = sanitizeCartQuantity(rawQuantity);
    const quantity = qtyCheck.value;

    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Validate coupon when subtotal changes
  useEffect(() => {
    if (coupon && subtotal < coupon.minOrderValue) {
      setCoupon(null);
      setCouponError(`Coupon ${coupon.code} removed (minimum order ₹${coupon.minOrderValue} required)`);
    } else {
      setCouponError(null);
    }
  }, [subtotal, coupon]);

  const applyCoupon = (rawCode: string) => {
    // 1. Cybersecurity: Check rate limiter
    const rateCheck = checkCouponRateLimit();
    if (!rateCheck.isAllowed) {
      const err = rateCheck.errorMessage || 'Too many attempts. Please try again later.';
      setCouponError(err);
      return { success: false, message: err };
    }

    // 2. Cybersecurity: Audit for malicious injection tokens
    const secAudit = auditInputSecurity(rawCode, 'Coupon Code');
    if (!secAudit.isSafe) {
      const lockMsg = recordFailedCouponAttempt() || secAudit.errorMessage || 'Invalid input pattern.';
      setCouponError(lockMsg);
      return { success: false, message: lockMsg };
    }

    const cleanCode = rawCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const found = VALID_COUPONS.find((c) => c.code === cleanCode);

    if (!found) {
      const lockMsg = recordFailedCouponAttempt();
      const msg = lockMsg || 'Invalid coupon code. Try SWEET10 or FIRSTGUD';
      setCouponError(msg);
      return { success: false, message: msg };
    }

    if (subtotal < found.minOrderValue) {
      const msg = `Minimum cart subtotal of ₹${found.minOrderValue} required for coupon ${found.code}`;
      setCouponError(msg);
      return { success: false, message: msg };
    }

    resetCouponRateLimit();
    setCoupon(found);
    setCouponError(null);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError(null);
  };

  let discount = 0;
  if (coupon) {
    const rawDiscount = Math.round((subtotal * coupon.discountPercentage) / 100);
    discount = coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
  }

  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shippingFee);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        coupon,
        couponError,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        shippingFee,
        total,
        totalItemCount,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        freeShippingRemaining,
        lastOrder,
        setLastOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
