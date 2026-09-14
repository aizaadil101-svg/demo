export type ProductCategory = 
  | 'All'
  | 'Daily Pret'
  | 'Stitched Kurtis'
  | '2-Piece Ensembles'
  | '3-Piece Festive Lawn'
  | 'Casual Solids';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Unstitched';

export interface Product {
  id: string;
  name: string;
  category: 'Daily Pret' | 'Stitched Kurtis' | '2-Piece Ensembles' | '3-Piece Festive Lawn' | 'Casual Solids';
  fabric: string;
  description: string;
  price: number; // Regular/current price in PKR
  originalPrice?: number; // Previous price if on sale
  isOnSale: boolean;
  isNewArrival: boolean;
  isFeatured: boolean; // Best seller
  isOutOfStock: boolean;
  stock: number;
  sizes: ProductSize[];
  colors: string[];
  primaryImage: string;
  galleryImages: string[];
  createdAt: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: ProductSize;
  color: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
  paymentMethod: 'Cash on Delivery (COD)' | 'Bank Transfer / Raast' | 'Debit/Credit Card';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalPrice: number;
  orderDate: string; // ISO or formatted
  status: OrderStatus;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: ProductSize;
  color: string;
  quantity: number;
  stock: number;
  isOutOfStock: boolean;
}

export type PublicPage = 
  | 'home'
  | 'shop'
  | 'new-arrivals'
  | 'sale'
  | 'about'
  | 'contact'
  | 'cart'
  | 'checkout';
