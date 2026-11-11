export type ProductCategory =
  | 'All'
  | 'Jaggery Blocks'
  | 'Jaggery Powder'
  | 'Jaggery Cubes'
  | 'Liquid Jaggery'
  | 'Jaggery Specialities';

export interface ProductVariant {
  weight: string;
  price: number;
  mrp: number;
  inStock: boolean;
  sku: string;
}

export interface NutritionalInfo {
  servingSize: string;
  energy: string;
  carbohydrates: string;
  naturalSugars: string;
  protein: string;
  iron: string;
  potassium: string;
  magnesium: string;
  calcium: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  primaryImage: string;
  galleryImages: string[];
  weight: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  inStock: boolean;
  stockCount: number;
  sku: string;
  variants: ProductVariant[];
  ingredients: string[];
  storageInstructions: string;
  nutritionalInfo: NutritionalInfo;
  shippingInfo: string;
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  harvestOrigin?: string;
  tagline?: string;
}

export interface CartItem {
  id: string; // product.id + '-' + variant.weight
  productId: string;
  name: string;
  slug: string;
  image: string;
  weight: string;
  price: number;
  mrp: number;
  quantity: number;
  category: ProductCategory;
}

export interface CustomerAddress {
  fullName: string;
  mobile: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  addressType: 'home' | 'work';
}

export interface Order {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
  customerAddress: CustomerAddress;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  estimatedDeliveryDate: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  maxDiscount?: number;
  minOrderValue: number;
  description: string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  password?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  sweetenerPreference?: 'Daily Tea & Beverages' | 'Ayurvedic & Health' | 'Traditional Cooking' | 'Baking & Gourmet';
  createdAt: string;
}

