export type ProductCategory =
  | 'All'
  | 'Raw Gud'
  | 'Gud Cubes'
  | 'Pure Desi Khand'
  | 'Pure Organic Shakkar';

export type PackagingType = 'Packet' | 'Jar';

export interface ProductVariant {
  weight: string; // '500g' | '1000g'
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
  packagingType: PackagingType;
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
  linkedVariantSlug?: string; // e.g. switches to Jar version from Packet or vice-versa
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
  packagingType?: PackagingType;
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

