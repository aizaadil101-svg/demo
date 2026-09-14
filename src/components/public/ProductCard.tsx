import React, { useState } from 'react';
import { ShoppingBag, Eye, Check, Tag, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onAddToCart,
}) => {
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.primaryImage);

  const isActuallyOutOfStock = product.isOutOfStock || product.stock <= 0;

  const formatPKR = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActuallyOutOfStock) return;

    onAddToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onOpenDetails(product)}
      className="group flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md hover:border-stone-300 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-3/4 w-full bg-stone-100 overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => {
            setImgSrc('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80');
          }}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Status Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start z-10">
          
          {/* Out of Stock Badge */}
          {isActuallyOutOfStock ? (
            <span className="px-2.5 py-1 text-[11px] font-bold bg-stone-900/90 text-white rounded-md tracking-wider uppercase backdrop-blur-xs">
              Out of Stock
            </span>
          ) : (
            <>
              {/* Sale Badge */}
              {product.isOnSale && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold bg-[#B91C1C] text-white rounded-md tracking-wide uppercase shadow-xs">
                  <Tag className="w-3 h-3" />
                  Sale
                </span>
              )}

              {/* New Arrival Badge */}
              {product.isNewArrival && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-[#2D3B36] text-[#FAF8F5] rounded-md tracking-wider uppercase">
                  <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                  New
                </span>
              )}
            </>
          )}

        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="w-full py-2 bg-white/95 backdrop-blur-md hover:bg-white text-stone-900 text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-stone-700" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Fabric */}
          <div className="text-[11px] text-stone-500 font-medium uppercase tracking-wider mb-1">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-[#8C6D3B] transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
            {product.fabric}
          </p>

          {/* Price & Sale Price */}
          <div className="mt-2.5 flex items-baseline gap-2 flex-wrap">
            <span className={`text-sm sm:text-base font-bold ${product.isOnSale ? 'text-[#B91C1C]' : 'text-stone-900'}`}>
              {formatPKR(product.price)}
            </span>

            {product.isOnSale && product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                {formatPKR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Add to Cart Button */}
        <div className="mt-3 pt-3 border-t border-stone-100">
          <button
            type="button"
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleQuickAdd}
            disabled={isActuallyOutOfStock}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isActuallyOutOfStock
                ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-900 hover:bg-stone-800 text-white active:scale-98'
            }`}
          >
            {isActuallyOutOfStock ? (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                Out of Stock
              </>
            ) : addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added to Bag!
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
