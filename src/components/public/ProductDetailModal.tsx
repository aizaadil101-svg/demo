import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Tag, 
  Sparkles, 
  AlertCircle, 
  Ruler, 
  Truck, 
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Product, ProductSize } from '../../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: ProductSize, color: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const isActuallyOutOfStock = product.isOutOfStock || product.stock <= 0;

  // Active image selector
  const allImages = [product.primaryImage, ...(product.galleryImages || [])];
  const [selectedImage, setSelectedImage] = useState(allImages[0]);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes[0] || 'Unstitched'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0] || 'Original'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.primaryImage);
      setSelectedSize(product.sizes[0] || 'Unstitched');
      setSelectedColor(product.colors[0] || 'Original');
      setQuantity(1);
    }
  }, [product]);

  const formatPKR = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
  };

  const handleAdd = () => {
    if (isActuallyOutOfStock) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-6 sm:p-8">
          
          {/* Left: Multiple Product Images */}
          <div className="md:col-span-6 flex flex-col gap-3">
            {/* Main Active Image */}
            <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />

              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                {isActuallyOutOfStock ? (
                  <span className="px-3 py-1 bg-stone-900 text-white text-xs font-bold rounded-md uppercase tracking-wider">
                    Out of Stock
                  </span>
                ) : (
                  <>
                    {product.isOnSale && (
                      <span className="px-2.5 py-1 bg-[#B91C1C] text-white text-xs font-bold rounded-md uppercase tracking-wide flex items-center gap-1 shadow-xs">
                        <Tag className="w-3 h-3" />
                        Sale
                      </span>
                    )}

                    {product.isNewArrival && (
                      <span className="px-2.5 py-1 bg-[#2D3B36] text-[#FAF8F5] text-xs font-bold rounded-md uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        New Arrival
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-stone-900 ring-2 ring-stone-900/20'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Information & Controls */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Category */}
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {product.category}
              </span>

              {/* Product Name */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1 leading-snug">
                {product.name}
              </h2>

              <p className="text-xs text-stone-600 mt-1 font-medium">
                Fabric: <span className="text-stone-900 font-semibold">{product.fabric}</span>
              </p>

              {/* Price & Sale Price */}
              <div className="mt-3.5 flex items-baseline gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className={`text-2xl font-bold ${product.isOnSale ? 'text-[#B91C1C]' : 'text-stone-900'}`}>
                  {formatPKR(product.price)}
                </span>

                {product.isOnSale && product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatPKR(product.originalPrice)}
                  </span>
                )}

                {product.isOnSale && product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                    Save {formatPKR(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              {/* Stock Status Indicator */}
              <div className="mt-3">
                {isActuallyOutOfStock ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200">
                    <AlertCircle className="w-4 h-4 text-stone-500" />
                    Currently Out of Stock
                  </div>
                ) : product.stock <= 5 ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Low Stock: Only {product.stock} pieces remaining
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                    <Check className="w-4 h-4" />
                    In Stock ({product.stock} units available)
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Colors Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                    Select Color: <strong className="text-stone-900">{selectedColor}</strong>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                          selectedColor === c
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Select Size: <strong className="text-stone-900">{selectedSize}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(!showSizeChart)}
                    className="text-xs text-stone-600 hover:text-stone-900 underline flex items-center gap-1"
                  >
                    <Ruler className="w-3 h-3" />
                    Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        selectedSize === sz
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {/* Size Guide Table */}
                {showSizeChart && (
                  <div className="mt-2.5 p-3 bg-stone-100 rounded-lg text-[11px] text-stone-700 border border-stone-200">
                    <div className="font-bold mb-1 text-stone-900">Standard Pret Sizing (Inches):</div>
                    <div className="grid grid-cols-4 gap-1 text-center bg-white p-2 rounded-sm border border-stone-200">
                      <span className="font-semibold">Size</span>
                      <span className="font-semibold">Chest</span>
                      <span className="font-semibold">Waist</span>
                      <span className="font-semibold">Length</span>
                      <span>XS</span><span>36"</span><span>32"</span><span>38"</span>
                      <span>S</span><span>38"</span><span>34"</span><span>39"</span>
                      <span>M</span><span>41"</span><span>37"</span><span>40"</span>
                      <span>L</span><span>44"</span><span>40"</span><span>41"</span>
                      <span>XL</span><span>48"</span><span>44"</span><span>42"</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Controls (Only if in stock) */}
              {!isActuallyOutOfStock && (
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Quantity:</span>
                  <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-sm hover:bg-stone-100 text-stone-700"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold text-stone-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1 text-sm hover:bg-stone-100 text-stone-700"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Add to Cart button */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <button
                type="button"
                id="modal-add-to-cart-button"
                onClick={handleAdd}
                disabled={isActuallyOutOfStock}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                  isActuallyOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
                    : addedAnimation
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-900 hover:bg-stone-800 text-white active:scale-98'
                }`}
              >
                {isActuallyOutOfStock ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Out of Stock
                  </>
                ) : addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Bag!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    Add to Cart • {formatPKR(product.price * quantity)}
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-700" />
                  <span>Nationwide COD Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>100% Guaranteed Fabric</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
