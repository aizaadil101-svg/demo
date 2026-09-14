import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Search, 
  Tag, 
  Sparkles, 
  AlertCircle, 
  Check, 
  X, 
  ExternalLink, 
  LogOut, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Sliders, 
  Upload, 
  ImageIcon,
  ArrowUpDown,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw
} from 'lucide-react';
import { Product, Order, OrderStatus, ProductSize } from '../../types';
import { DEMO_PRESET_IMAGES } from '../../data/initialData';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onDuplicateProduct: (product: Product) => void;
  onUpdateStock: (id: string, newStock: number) => void;
  onToggleStatus: (id: string, field: 'isNewArrival' | 'isOnSale' | 'isOutOfStock' | 'isFeatured', value?: boolean) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
  onResetDefaults?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onSaveProduct,
  onDeleteProduct,
  onDuplicateProduct,
  onUpdateStock,
  onToggleStatus,
  onUpdateOrderStatus,
  onLogout,
  onViewPublicSite,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'inventory' | 'orders'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modal state for Add/Edit
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Product['category']>('Stitched Kurtis');
  const [formFabric, setFormFabric] = useState('100% Breathable Cotton Lawn');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(3890);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(4890);
  const [formIsOnSale, setFormIsOnSale] = useState(false);
  const [formIsNewArrival, setFormIsNewArrival] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsOutOfStock, setFormIsOutOfStock] = useState(false);
  const [formStock, setFormStock] = useState<number>(15);
  const [formSizes, setFormSizes] = useState<ProductSize[]>(['S', 'M', 'L']);
  const [formColors, setFormColors] = useState<string[]>(['Sage Green', 'Pure White']);
  const [newColorInput, setNewColorInput] = useState('');
  const [formPrimaryImage, setFormPrimaryImage] = useState(DEMO_PRESET_IMAGES[0].url);
  const [formGalleryImages, setFormGalleryImages] = useState<string[]>([DEMO_PRESET_IMAGES[0].url]);
  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  // Order search/filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Format PKR
  const formatPKR = (amount: number) => `Rs. ${amount.toLocaleString('en-PK')}`;

  // Metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const outOfStockCount = products.filter(p => p.isOutOfStock || p.stock <= 0).length;
  const onSaleCount = products.filter(p => p.isOnSale).length;
  const newArrivalsCount = products.filter(p => p.isNewArrival).length;

  // Open modal to add product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Stitched Kurtis');
    setFormFabric('100% Breathable Cotton Lawn');
    setFormDescription('Effortless modern stitched pret cut with delicate finishings.');
    setFormPrice(3990);
    setFormOriginalPrice(4990);
    setFormIsOnSale(false);
    setFormIsNewArrival(true);
    setFormIsFeatured(false);
    setFormIsOutOfStock(false);
    setFormStock(15);
    setFormSizes(['S', 'M', 'L']);
    setFormColors(['Classic White', 'Pastel Lilac']);
    setFormPrimaryImage(DEMO_PRESET_IMAGES[1].url);
    setFormGalleryImages([DEMO_PRESET_IMAGES[1].url]);
    setIsProductModalOpen(true);
  };

  // Open modal to edit product
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormFabric(product.fabric);
    setFormDescription(product.description);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice || Math.round(product.price * 1.25));
    setFormIsOnSale(product.isOnSale);
    setFormIsNewArrival(product.isNewArrival);
    setFormIsFeatured(product.isFeatured);
    setFormIsOutOfStock(product.isOutOfStock || product.stock <= 0);
    setFormStock(product.stock);
    setFormSizes(product.sizes);
    setFormColors(product.colors || ['Original']);
    setFormPrimaryImage(product.primaryImage);
    setFormGalleryImages(product.galleryImages || [product.primaryImage]);
    setIsProductModalOpen(true);
  };

  // Save product from modal
  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter a product name.');
      return;
    }

    const calculatedOutOfStock = formIsOutOfStock || formStock <= 0;

    const updatedProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      fabric: formFabric.trim(),
      description: formDescription.trim(),
      price: Number(formPrice),
      originalPrice: formIsOnSale ? Number(formOriginalPrice) : undefined,
      isOnSale: formIsOnSale,
      isNewArrival: formIsNewArrival,
      isFeatured: formIsFeatured,
      isOutOfStock: calculatedOutOfStock,
      stock: Number(formStock),
      sizes: formSizes.length > 0 ? formSizes : ['Unstitched'],
      colors: formColors.length > 0 ? formColors : ['Original'],
      primaryImage: formPrimaryImage.trim(),
      galleryImages: formGalleryImages.length > 0 ? formGalleryImages : [formPrimaryImage.trim()],
      createdAt: editingProduct ? editingProduct.createdAt : Date.now(),
    };

    onSaveProduct(updatedProduct);
    setIsProductModalOpen(false);
  };

  // Handle image upload from computer (converts to base64 data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormPrimaryImage(dataUrl);
        if (!formGalleryImages.includes(dataUrl)) {
          setFormGalleryImages([dataUrl, ...formGalleryImages]);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Toggle size in form
  const toggleSizeInForm = (size: ProductSize) => {
    if (formSizes.includes(size)) {
      setFormSizes(formSizes.filter(s => s !== size));
    } else {
      setFormSizes([...formSizes, size]);
    }
  };

  // Add color in form
  const handleAddColor = () => {
    if (!newColorInput.trim()) return;
    if (!formColors.includes(newColorInput.trim())) {
      setFormColors([...formColors, newColorInput.trim()]);
    }
    setNewColorInput('');
  };

  // Remove color from form
  const handleRemoveColor = (col: string) => {
    setFormColors(formColors.filter(c => c !== col));
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.fabric.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerPhone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#1E232A] text-stone-100 flex flex-col">
      
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#181C22] border-b border-stone-800 px-4 sm:px-8 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-stone-950 flex items-center justify-center font-bold">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-base sm:text-lg text-white">
                RAWAN Admin Portal
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-800 text-[#D4AF37] border border-stone-700 uppercase tracking-wider">
                Store Owner
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Direct inventory, pricing, catalog & order controls
            </p>
          </div>
        </div>

        {/* Right actions: View Customer Store & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onViewPublicSite}
            className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700"
            title="Open customer-facing website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">View Public Store</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-800/60"
            title="Log out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex-1 space-y-6">
        
        {/* KPI Metric Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#181C22] p-4 rounded-xl border border-stone-800 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
              Total Revenue
            </span>
            <div className="text-xl sm:text-2xl font-bold text-white font-serif">
              {formatPKR(totalRevenue)}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              From {orders.length} orders
            </span>
          </div>

          <div className="bg-[#181C22] p-4 rounded-xl border border-stone-800 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
              Live Products
            </span>
            <div className="text-xl sm:text-2xl font-bold text-white font-serif">
              {products.length}
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              {newArrivalsCount} New • {onSaleCount} on Sale
            </span>
          </div>

          <div className="bg-[#181C22] p-4 rounded-xl border border-stone-800 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
              Out of Stock
            </span>
            <div className={`text-xl sm:text-2xl font-bold font-serif ${outOfStockCount > 0 ? 'text-amber-400' : 'text-stone-200'}`}>
              {outOfStockCount}
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              {outOfStockCount > 0 ? 'Action required in Inventory' : 'All items in stock'}
            </span>
          </div>

          <div className="bg-[#181C22] p-4 rounded-xl border border-stone-800 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
              Pending Orders
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#D4AF37] font-serif">
              {orders.filter(o => o.status === 'Pending').length}
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              {orders.filter(o => o.status === 'Confirmed').length} Confirmed / In Delivery
            </span>
          </div>
        </div>

        {/* Tab Navigation & Primary Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2 bg-[#181C22] p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'products'
                  ? 'bg-[#D4AF37] text-stone-950 shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Product Catalog & Statuses ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'inventory'
                  ? 'bg-[#D4AF37] text-stone-950 shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Inventory Manager
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#D4AF37] text-stone-950 shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>

          {/* Primary "+ Add Product" Button */}
          <div className="flex items-center gap-2">
            <button
              id="admin-add-product-btn"
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-[#E5C158] transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </button>

            {onResetDefaults && (
              <button
                onClick={onResetDefaults}
                className="p-2.5 rounded-xl bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700 transition-colors"
                title="Reset sample collection"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: PRODUCTS & STATUS CONTROLS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search dresses, fabrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#181C22] border border-stone-800 rounded-xl text-white placeholder:text-stone-500"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                {['All', 'Stitched Kurtis', '2-Piece Ensembles', '3-Piece Festive Lawn', 'Daily Pret', 'Casual Solids'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-stone-700 text-white'
                        : 'bg-[#181C22] text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Instruction Callout for Owner */}
            <div className="p-3 bg-[#181C22] border border-stone-800 rounded-xl text-xs text-stone-400 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  <strong>Instant Status Switches:</strong> Toggle New Arrival, Sale, Out of Stock, or Best Seller. Changes instantly apply to the public store.
                </span>
              </div>
              <span className="text-[11px] text-stone-500">
                Showing {filteredProducts.length} dresses
              </span>
            </div>

            {/* Products Table */}
            <div className="bg-[#181C22] rounded-xl border border-stone-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#13161B] text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-800">
                    <tr>
                      <th className="py-3 px-4">Dress / Details</th>
                      <th className="py-3 px-4">Price (PKR)</th>
                      <th className="py-3 px-4 text-center">New Arrival</th>
                      <th className="py-3 px-4 text-center">On Sale</th>
                      <th className="py-3 px-4 text-center">Out of Stock</th>
                      <th className="py-3 px-4 text-center">Best Seller</th>
                      <th className="py-3 px-4 text-center">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {filteredProducts.map((p) => {
                      const isStockZero = p.stock <= 0;
                      const isOOS = p.isOutOfStock || isStockZero;

                      return (
                        <tr key={p.id} className="hover:bg-stone-800/40 transition-colors">
                          
                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.primaryImage}
                                alt={p.name}
                                className="w-12 h-14 object-cover rounded-lg border border-stone-700 bg-stone-900 shrink-0"
                              />
                              <div>
                                <div className="font-serif font-bold text-white text-sm line-clamp-1">
                                  {p.name}
                                </div>
                                <div className="text-[11px] text-stone-400 mt-0.5">
                                  {p.category} • {p.fabric}
                                </div>
                                <div className="text-[10px] text-stone-500 mt-0.5">
                                  Sizes: {p.sizes.join(', ')}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-bold text-stone-200">
                              {formatPKR(p.price)}
                            </div>
                            {p.isOnSale && p.originalPrice && (
                              <div className="text-[11px] text-stone-500 line-through">
                                {formatPKR(p.originalPrice)}
                              </div>
                            )}
                          </td>

                          {/* Status Switch 1: New Arrival */}
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => onToggleStatus(p.id, 'isNewArrival', !p.isNewArrival)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                p.isNewArrival ? 'bg-[#D4AF37]' : 'bg-stone-700'
                              }`}
                              title={p.isNewArrival ? 'Turn OFF New Arrival' : 'Turn ON New Arrival'}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  p.isNewArrival ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>

                          {/* Status Switch 2: Sale */}
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => onToggleStatus(p.id, 'isOnSale', !p.isOnSale)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                p.isOnSale ? 'bg-red-600' : 'bg-stone-700'
                              }`}
                              title={p.isOnSale ? 'Turn OFF Sale' : 'Turn ON Sale'}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  p.isOnSale ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>

                          {/* Status Switch 3: Out of Stock */}
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => onToggleStatus(p.id, 'isOutOfStock', !isOOS)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                isOOS ? 'bg-amber-600' : 'bg-stone-700'
                              }`}
                              title={isOOS ? 'Mark In Stock' : 'Mark Out of Stock'}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  isOOS ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>

                          {/* Status Switch 4: Featured / Best Seller */}
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => onToggleStatus(p.id, 'isFeatured', !p.isFeatured)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                p.isFeatured ? 'bg-emerald-600' : 'bg-stone-700'
                              }`}
                              title={p.isFeatured ? 'Remove from Best Sellers' : 'Add to Best Sellers'}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  p.isFeatured ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>

                          {/* Current Stock */}
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              isOOS ? 'bg-red-950 text-red-300' : 'bg-stone-800 text-stone-300'
                            }`}>
                              {p.stock} units
                            </span>
                          </td>

                          {/* Actions: Edit, Duplicate, Delete */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                              </button>

                              <button
                                onClick={() => onDuplicateProduct(p)}
                                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                                title="Duplicate Product"
                              >
                                <Copy className="w-3.5 h-3.5 text-sky-400" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                    onDeleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-900/60 text-stone-400 hover:text-red-200 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#181C22] border border-stone-800 rounded-xl text-xs text-stone-300 space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-[#D4AF37]" />
                Inventory Stock Control
              </div>
              <p className="text-stone-400 text-[11px]">
                Update units on hand instantly. If stock drops to <strong>0</strong>, the item will automatically be switched to <strong>Out of Stock</strong> on the public store, preventing overselling.
              </p>
            </div>

            <div className="bg-[#181C22] rounded-xl border border-stone-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#13161B] text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-800">
                    <tr>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Current Stock</th>
                      <th className="py-3 px-4">Quick Adjust</th>
                      <th className="py-3 px-4 text-right">Quick Stock Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {products.map((p) => {
                      const isActuallyOutOfStock = p.isOutOfStock || p.stock <= 0;
                      return (
                        <tr key={p.id} className="hover:bg-stone-800/40">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={p.primaryImage} alt="" className="w-9 h-11 object-cover rounded-md" />
                              <span className="font-bold text-white">{p.name}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-stone-400">{p.category}</td>

                          <td className="py-3 px-4">
                            {isActuallyOutOfStock ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-800">
                                Out of Stock
                              </span>
                            ) : p.stock <= 5 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                                Low Stock ({p.stock})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                                In Stock
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 font-bold text-stone-200">
                            {p.stock} units
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 1))}
                                className="w-7 h-7 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center font-bold"
                                title="Decrease by 1"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={p.stock}
                                onChange={(e) => onUpdateStock(p.id, parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 text-center bg-stone-900 border border-stone-700 rounded-md text-white text-xs font-bold"
                              />
                              <button
                                onClick={() => onUpdateStock(p.id, p.stock + 1)}
                                className="w-7 h-7 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center font-bold"
                                title="Increase by 1"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => onToggleStatus(p.id, 'isOutOfStock', !isActuallyOutOfStock)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                isActuallyOutOfStock
                                  ? 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700'
                                  : 'bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800'
                              }`}
                            >
                              {isActuallyOutOfStock ? 'Mark Available' : 'Mark Out of Stock'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter orders */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by customer name, phone, order #..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#181C22] border border-stone-800 rounded-xl text-white placeholder:text-stone-500"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-[#D4AF37] text-stone-950 font-bold'
                        : 'bg-[#181C22] text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-[#181C22] p-12 rounded-xl border border-stone-800 text-center space-y-2">
                <ShoppingBag className="w-10 h-10 text-stone-600 mx-auto" />
                <h4 className="font-bold text-white text-sm">No Orders Found</h4>
                <p className="text-xs text-stone-400">
                  Customer orders placed on the public website will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div 
                    key={ord.id}
                    className="bg-[#181C22] p-5 rounded-xl border border-stone-800 space-y-4"
                  >
                    {/* Order Top Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-base text-white">
                          Order {ord.orderNumber}
                        </span>
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {ord.orderDate}
                        </span>
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400 font-medium">Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                            ord.status === 'Pending'
                              ? 'bg-amber-950 text-amber-200 border-amber-800'
                              : ord.status === 'Confirmed'
                              ? 'bg-blue-950 text-blue-200 border-blue-800'
                              : ord.status === 'Shipped'
                              ? 'bg-purple-950 text-purple-200 border-purple-800'
                              : ord.status === 'Delivered'
                              ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
                              : 'bg-red-950 text-red-200 border-red-800'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Destination Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-500 block mb-0.5">
                          Customer
                        </span>
                        <div className="font-bold text-white">{ord.customerName}</div>
                        <div className="text-stone-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#D4AF37]" />
                          {ord.customerPhone}
                        </div>
                        {ord.customerEmail && (
                          <div className="text-stone-500">{ord.customerEmail}</div>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-500 block mb-0.5">
                          Shipping Address
                        </span>
                        <div className="text-stone-300 font-medium">{ord.address}</div>
                        <div className="text-stone-400 mt-0.5">{ord.city}, Pakistan</div>
                        {ord.notes && (
                          <div className="text-amber-400/90 italic text-[11px] mt-1">
                            Note: {ord.notes}
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-500 block mb-0.5">
                          Payment & Total
                        </span>
                        <div className="font-bold text-[#D4AF37] text-sm">
                          {formatPKR(ord.totalPrice)}
                        </div>
                        <div className="text-stone-400 mt-0.5">{ord.paymentMethod}</div>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="pt-2 border-t border-stone-800/80">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block mb-2">
                        Ordered Items ({ord.items.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-stone-900/60 border border-stone-800">
                            <img src={item.image} alt="" className="w-10 h-12 object-cover rounded-md" />
                            <div className="text-xs">
                              <div className="font-semibold text-stone-200 line-clamp-1">{item.name}</div>
                              <div className="text-stone-400 text-[11px]">
                                Size: <strong className="text-stone-300">{item.size}</strong> • Color: <strong className="text-stone-300">{item.color}</strong> • Qty: <strong className="text-white">{item.quantity}</strong>
                              </div>
                              <div className="text-[#D4AF37] font-bold text-[11px]">
                                {formatPKR(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div 
            className="relative bg-[#181C22] border border-stone-700 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-white">
                  {editingProduct ? 'Edit Dress Details' : 'Add New Dress to Store'}
                </h3>
                <p className="text-xs text-stone-400">
                  Changes will automatically reflect on the public website.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProductForm} className="space-y-5">
              
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Dress Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Schiffli Embroidered Lawn Kurti"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Product['category'])}
                    className="w-full px-3.5 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white"
                  >
                    <option value="Stitched Kurtis">Stitched Kurtis</option>
                    <option value="2-Piece Ensembles">2-Piece Ensembles</option>
                    <option value="3-Piece Festive Lawn">3-Piece Festive Lawn</option>
                    <option value="Daily Pret">Daily Pret</option>
                    <option value="Casual Solids">Casual Solids</option>
                  </select>
                </div>
              </div>

              {/* Fabric & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Fabric Composition
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Breathable Lawn"
                    value={formFabric}
                    onChange={(e) => setFormFabric(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe cuts, sleeves, embroidery, and styling notes..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white"
                />
              </div>

              {/* Pricing & Sale Section */}
              <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                    Pricing & Sale
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsOnSale}
                      onChange={(e) => setFormIsOnSale(e.target.checked)}
                      className="rounded-sm bg-stone-800 text-red-600"
                    />
                    <span className="text-xs font-bold text-red-400">Put this item on SALE</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">
                      {formIsOnSale ? 'Sale Price (PKR) *' : 'Regular Price (PKR) *'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-white font-bold"
                    />
                  </div>

                  {formIsOnSale && (
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">
                        Original Price Before Discount (PKR) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-300 line-through"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Status Switches Grid (The 4 Controls Requested by User) */}
              <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">
                  Product Visibility & Status Switches
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Switch 1: New Arrival */}
                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-stone-950 border border-stone-800 cursor-pointer">
                    <div>
                      <strong className="text-stone-200 block">New Arrival</strong>
                      <span className="text-[11px] text-stone-500">Appears in New Arrivals tab</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formIsNewArrival}
                      onChange={(e) => setFormIsNewArrival(e.target.checked)}
                      className="w-4 h-4 text-[#D4AF37]"
                    />
                  </label>

                  {/* Switch 2: Featured / Best Seller */}
                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-stone-950 border border-stone-800 cursor-pointer">
                    <div>
                      <strong className="text-stone-200 block">Best Seller / Featured</strong>
                      <span className="text-[11px] text-stone-500">Shown in featured grid</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-emerald-500"
                    />
                  </label>

                  {/* Switch 3: Out of Stock */}
                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-stone-950 border border-stone-800 cursor-pointer sm:col-span-2">
                    <div>
                      <strong className="text-stone-200 block">Mark Out of Stock</strong>
                      <span className="text-[11px] text-stone-500">
                        Disables customer "Add to Cart" button and shows Out of Stock badge
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formIsOutOfStock || formStock <= 0}
                      onChange={(e) => setFormIsOutOfStock(e.target.checked)}
                      className="w-4 h-4 text-amber-500"
                    />
                  </label>
                </div>
              </div>

              {/* Sizes Selection */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Available Sizes
                </span>
                <div className="flex flex-wrap gap-2">
                  {(['XS', 'S', 'M', 'L', 'XL', 'Unstitched'] as ProductSize[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSizeInForm(sz)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                        formSizes.includes(sz)
                          ? 'bg-[#D4AF37] text-stone-950 border-[#D4AF37]'
                          : 'bg-stone-900 text-stone-400 border-stone-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Available Colors
                </span>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formColors.map((col) => (
                    <span 
                      key={col}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-800 border border-stone-700 rounded-lg text-xs text-stone-200"
                    >
                      {col}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveColor(col)} 
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add color name (e.g. Sage Green)..."
                    value={newColorInput}
                    onChange={(e) => setNewColorInput(e.target.value)}
                    className="px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1.5 bg-stone-800 text-stone-200 rounded-lg text-xs font-semibold hover:bg-stone-700"
                  >
                    Add Color
                  </button>
                </div>
              </div>

              {/* Product Images (Primary + Preset Picker + Upload) */}
              <div className="space-y-3 p-4 bg-stone-900 rounded-xl border border-stone-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                    Product Photography
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPresetPicker(!showPresetPicker)}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    {showPresetPicker ? 'Hide Demo Presets' : 'Choose from Curated Presets'}
                  </button>
                </div>

                {/* Preset Picker Dropdown */}
                {showPresetPicker && (
                  <div className="grid grid-cols-4 gap-2 p-2 bg-stone-950 rounded-xl border border-stone-800 max-h-40 overflow-y-auto">
                    {DEMO_PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormPrimaryImage(preset.url);
                          if (!formGalleryImages.includes(preset.url)) {
                            setFormGalleryImages([...formGalleryImages, preset.url]);
                          }
                        }}
                        className="group relative aspect-3/4 rounded-lg overflow-hidden border border-stone-700 hover:border-[#D4AF37]"
                      >
                        <img src={preset.url} alt="" className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white p-1 text-center font-bold">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Image URL Input & File Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-9">
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Image URL (Paste from Google or any web URL)
                    </label>
                    <input
                      type="url"
                      required
                      value={formPrimaryImage}
                      onChange={(e) => setFormPrimaryImage(e.target.value)}
                      className="w-full px-3 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Or Upload File
                    </label>
                    <label className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center gap-1 border border-stone-700">
                      <Upload className="w-3.5 h-3.5" />
                      Browse
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Preview Thumbnail */}
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={formPrimaryImage}
                    alt="Preview"
                    className="w-12 h-16 object-cover rounded-lg border border-stone-700 bg-black"
                  />
                  <span className="text-xs text-stone-400">
                    Active Primary Display Image
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="admin-save-product-btn"
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-[#E5C158] transition-all shadow-md active:scale-95"
                >
                  {editingProduct ? 'Save Product Changes' : 'Publish Product to Store'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
