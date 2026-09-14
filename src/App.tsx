import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Tag, 
  ArrowRight, 
  SlidersHorizontal, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { Product, Order, CartItem, PublicPage, ProductSize, OrderStatus } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/initialData';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { ProductCard } from './components/public/ProductCard';
import { ProductDetailModal } from './components/public/ProductDetailModal';
import { CartDrawer } from './components/public/CartDrawer';
import { CheckoutModal } from './components/public/CheckoutModal';
import { AboutPage } from './components/public/AboutPage';
import { ContactPage } from './components/public/ContactPage';
import { Footer } from './components/public/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

const STORAGE_KEY_PRODUCTS = 'rawan_pakistan_products_v2';
const STORAGE_KEY_ORDERS = 'rawan_pakistan_orders_v2';
const STORAGE_KEY_CART = 'rawan_pakistan_cart_v2';
const STORAGE_KEY_ADMIN_AUTH = 'rawan_admin_authenticated_v2';

export default function App() {
  // 1. Database Persistence: Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  // 2. Database Persistence: Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading orders from localStorage', e);
    }
    return INITIAL_ORDERS;
  });

  // 3. Persistence: Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading cart', e);
    }
    return [];
  });

  // 4. Admin Portal State (Completely separate from public site)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    // Check URL hash or query
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      return hash === '#admin' || hash === '#/admin' || search.includes('admin=true');
    }
    return false;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // 5. Customer-facing Navigation & Page State
  const [currentPage, setCurrentPage] = useState<PublicPage>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modals & Drawers
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  // Listen to URL hash changes and keyboard shortcut (Ctrl+Alt+A or Alt+A) for Brand Owner access
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#/admin') {
        setIsAdminMode(true);
      } else if (hash === '' || hash === '#home') {
        setIsAdminMode(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret owner shortcut: Ctrl + Alt + A or Alt + Shift + A
      if ((e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) ||
          (e.altKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setIsAdminMode((prev) => !prev);
        if (!isAdminMode) {
          window.location.hash = '#admin';
        } else {
          window.location.hash = '';
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdminMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: ProductSize = 'M',
    color: string = 'Original',
    quantity: number = 1
  ) => {
    const isOutOfStock = product.isOutOfStock || product.stock <= 0;
    if (isOutOfStock) {
      showToast('Sorry, this item is currently Out of Stock.');
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${size}-${color}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.primaryImage,
          size,
          color,
          quantity: Math.min(product.stock, quantity),
          stock: product.stock,
          isOutOfStock: false,
        };
        return [...prevCart, newItem];
      }
    });

    showToast(`Added ${product.name} (${size}) to your bag`);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Place Order from Checkout (creates order, reduces stock)
  const handlePlaceOrder = (newOrder: Order) => {
    // 1. Add to orders list
    setOrders((prev) => [newOrder, ...prev]);

    // 2. Reduce stock of ordered products
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const orderedItem = newOrder.items.find((item) => item.productId === p.id);
        if (orderedItem) {
          const updatedStock = Math.max(0, p.stock - orderedItem.quantity);
          const isOutOfStock = updatedStock === 0 || p.isOutOfStock;
          return {
            ...p,
            stock: updatedStock,
            isOutOfStock,
          };
        }
        return p;
      })
    );

    showToast(`Order ${newOrder.orderNumber} placed successfully!`);
  };

  // Admin Operations: Save Product (Add or Edit)
  const handleSaveProduct = (savedProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      }
      return [savedProduct, ...prev];
    });
    showToast(`Product "${savedProduct.name}" saved to store catalog.`);
  };

  // Admin: Delete Product
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from store.');
  };

  // Admin: Duplicate Product
  const handleDuplicateProduct = (sourceProduct: Product) => {
    const duplicated: Product = {
      ...sourceProduct,
      id: `prod-${Date.now()}`,
      name: `${sourceProduct.name} (Copy)`,
      createdAt: Date.now(),
    };
    setProducts((prev) => [duplicated, ...prev]);
    showToast(`Duplicated "${sourceProduct.name}".`);
  };

  // Admin: Update Stock Inline
  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const isOutOfStock = newStock <= 0;
          return { ...p, stock: newStock, isOutOfStock };
        }
        return p;
      })
    );
  };

  // Admin: Toggle Status Switches (New Arrival, Sale, Out of Stock, Featured)
  const handleToggleProductStatus = (
    productId: string,
    field: 'isNewArrival' | 'isOnSale' | 'isOutOfStock' | 'isFeatured',
    value?: boolean
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextVal = value !== undefined ? value : !p[field];
          const updated = { ...p, [field]: nextVal };
          // If toggled out of stock to false but stock is 0, bump stock to 10
          if (field === 'isOutOfStock' && !nextVal && p.stock === 0) {
            updated.stock = 10;
          }
          // If stock is 0, must be out of stock
          if (updated.stock <= 0) {
            updated.isOutOfStock = true;
          }
          return updated;
        }
        return p;
      })
    );
  };

  // Admin: Update Order Status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order status updated to "${newStatus}".`);
  };

  // Admin Auth Handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    setIsAdminMode(false);
    window.location.hash = '';
  };

  const handleViewPublicStore = () => {
    setIsAdminMode(false);
    window.location.hash = '';
  };

  // Reset to initial demo collection
  const handleResetDefaults = () => {
    if (confirm('Reset dresses and orders to standard demo data?')) {
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      showToast('Store reset to initial demo products & orders.');
    }
  };

  // Public Catalog Filtering & Sorting
  const filteredCatalogProducts = useMemo(() => {
    return products.filter((p) => {
      // Page filter
      if (currentPage === 'new-arrivals' && !p.isNewArrival) return false;
      if (currentPage === 'sale' && !p.isOnSale) return false;

      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      // In-stock filter
      if (inStockOnly && (p.isOutOfStock || p.stock <= 0)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchFabric = p.fabric.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchFabric && !matchDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      // Default: featured first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [products, currentPage, selectedCategory, inStockOnly, searchQuery, sortBy]);

  // Section collections for Homepage
  const newArrivalsList = useMemo(
    () => products.filter((p) => p.isNewArrival).slice(0, 4),
    [products]
  );
  const bestSellersList = useMemo(
    () => products.filter((p) => p.isFeatured).slice(0, 4),
    [products]
  );
  const saleItemsList = useMemo(
    () => products.filter((p) => p.isOnSale).slice(0, 4),
    [products]
  );
  const saleCount = useMemo(
    () => products.filter((p) => p.isOnSale).length,
    [products]
  );

  // ==========================================
  // VIEW ROUTING: PRIVATE ADMIN PORTAL
  // ==========================================
  if (isAdminMode) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToStore={handleViewPublicStore}
        />
      );
    }

    return (
      <AdminDashboard
        products={products}
        orders={orders}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onDuplicateProduct={handleDuplicateProduct}
        onUpdateStock={handleUpdateStock}
        onToggleStatus={handleToggleProductStatus}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onLogout={handleAdminLogout}
        onViewPublicSite={handleViewPublicStore}
        onResetDefaults={handleResetDefaults}
      />
    );
  }

  // ==========================================
  // VIEW ROUTING: CUSTOMER-FACING WEBSITE
  // (Strictly NO admin links or buttons anywhere)
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans selection:bg-[#D4AF37]/30">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-700 text-xs sm:text-sm font-medium flex items-center gap-2 animate-slideUp">
          <Check className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Customer-Facing Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        saleCount={saleCount}
      />

      {/* Main Body Pages */}
      <main className="flex-1">
        
        {/* 1. HOME PAGE */}
        {currentPage === 'home' && (
          <div className="space-y-16 sm:space-y-24">
            
            {/* Hero Section */}
            <Hero onNavigate={setCurrentPage} />

            {/* Section 1: New Arrivals */}
            {newArrivalsList.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C6D3B] mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Fresh from Our Atelier
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-stone-900">
                      New Arrivals
                    </h2>
                  </div>

                  <button
                    onClick={() => setCurrentPage('new-arrivals')}
                    className="text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-stone-950 flex items-center gap-1.5 group"
                  >
                    View All New Arrivals
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {newArrivalsList.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onOpenDetails={setSelectedProductForDetail}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Mid-Page Promotional Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#2D3B36] text-[#FAF8F5] rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
                <div className="relative z-10 max-w-xl space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                    Seasonal Craft Spotlight
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
                    Pure Combed Cotton & Schiffli Needlework
                  </h3>
                  <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
                    Specially woven for the Pakistani climate with high-tensile yarns, ensuring maximum breathability, color retention, and effortless drape.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSelectedCategory('Stitched Kurtis');
                        setCurrentPage('shop');
                      }}
                      className="px-6 py-3 rounded-full bg-white text-stone-900 font-semibold text-xs uppercase tracking-wider hover:bg-stone-100 transition-all"
                    >
                      Shop Stitched Kurtis
                    </button>
                  </div>
                </div>

                {/* Subtle decorative background detail */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 hidden md:block bg-radial from-white/30 to-transparent" />
              </div>
            </section>

            {/* Section 2: Best-Selling Dresses */}
            {bestSellersList.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#8C6D3B] mb-1">
                      Customer Favorites
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-stone-900">
                      Best-Selling Dresses
                    </h2>
                  </div>

                  <button
                    onClick={() => setCurrentPage('shop')}
                    className="text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-stone-950 flex items-center gap-1.5 group"
                  >
                    Browse Entire Collection
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {bestSellersList.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onOpenDetails={setSelectedProductForDetail}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section 3: Seasonal Sale Section */}
            {saleItemsList.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="p-6 sm:p-8 bg-red-50/70 border border-red-200/80 rounded-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
                        <Tag className="w-3 h-3" />
                        Limited Time Offers
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-red-950 mt-1">
                        Seasonal Sale & Markdowns
                      </h2>
                    </div>

                    <button
                      onClick={() => setCurrentPage('sale')}
                      className="text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-900 flex items-center gap-1.5 group"
                    >
                      View All Sale Items ({saleCount})
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {saleItemsList.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onOpenDetails={setSelectedProductForDetail}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

          </div>
        )}

        {/* 2. SHOP / ALL DRESSES / NEW ARRIVALS / SALE PAGES */}
        {(currentPage === 'shop' || currentPage === 'new-arrivals' || currentPage === 'sale') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
            
            {/* Header Title */}
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D3B]">
                {currentPage === 'new-arrivals'
                  ? 'Latest Drops'
                  : currentPage === 'sale'
                  ? 'Exclusive Markdowns'
                  : 'Complete Collection'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 tracking-tight">
                {currentPage === 'new-arrivals'
                  ? 'New Arrivals'
                  : currentPage === 'sale'
                  ? 'Seasonal Sale'
                  : 'Shop All Pakistani Dresses'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600">
                {currentPage === 'new-arrivals'
                  ? 'Discover fresh designs, contemporary silhouettes, and breathable everyday fabrics.'
                  : currentPage === 'sale'
                  ? 'Enjoy discounts on our stitched pret, printed suits, and festive lawn ensembles.'
                  : 'Browse our full catalog of stitched kurtis, 2-piece coordinates, and 3-piece luxury pret.'}
              </p>
            </div>

            {/* Filter & Sort Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['All', 'Stitched Kurtis', '2-Piece Ensembles', '3-Piece Festive Lawn', 'Daily Pret', 'Casual Solids'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Secondary Controls: Search, In Stock Toggle, Sort */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-stone-100">
                
                {/* Search in page */}
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search within dresses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
                  />
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                  {/* In Stock only switch */}
                  <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 font-medium">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded-sm bg-white border-stone-300 text-stone-900"
                    />
                    <span>In-Stock Only</span>
                  </label>

                  {/* Sort dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800"
                    >
                      <option value="featured">Featured First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>

              </div>

            </div>

            {/* Product Grid */}
            {filteredCatalogProducts.length === 0 ? (
              <div className="bg-white p-16 rounded-2xl border border-stone-200 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-stone-800">
                  No dresses match your selected filters
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try clearing your search query or selecting "All" to view all Pakistani dresses in our collection.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setInStockOnly(false);
                  }}
                  className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-xs text-stone-500 font-medium">
                  Showing <strong>{filteredCatalogProducts.length}</strong> items
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredCatalogProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onOpenDetails={setSelectedProductForDetail}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* 3. ABOUT US PAGE */}
        {currentPage === 'about' && <AboutPage onNavigate={setCurrentPage} />}

        {/* 4. CONTACT US PAGE */}
        {currentPage === 'contact' && <ContactPage />}

      </main>

      {/* Customer Footer */}
      <Footer onNavigate={setCurrentPage} />

      {/* MODALS & DRAWERS */}
      
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onPlaceOrder={handlePlaceOrder}
        onClearCart={handleClearCart}
      />

    </div>
  );
}
