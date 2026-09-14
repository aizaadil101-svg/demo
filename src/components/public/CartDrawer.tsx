import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const FREE_SHIPPING_LIMIT = 5000;
  const shippingFee = subtotal >= FREE_SHIPPING_LIMIT || subtotal === 0 ? 0 : 250;
  const grandTotal = subtotal + shippingFee;
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_LIMIT) * 100));

  const formatPKR = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Your Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>

          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-950 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        {cart.length > 0 && (
          <div className="bg-[#FAF8F5] px-5 py-2.5 border-b border-stone-200 text-xs">
            <div className="flex items-center justify-between text-stone-700 font-medium mb-1">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-800" />
                {subtotal >= FREE_SHIPPING_LIMIT ? (
                  <strong className="text-emerald-700">You unlocked FREE Nationwide Delivery!</strong>
                ) : (
                  <span>Add <strong>{formatPKR(FREE_SHIPPING_LIMIT - subtotal)}</strong> more for Free Shipping</span>
                )}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-stone-900 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif font-bold text-stone-800 text-base">Your Bag is Empty</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our everyday stitched kurtis, printed 2-piece coordinates, and seasonal lawn collections.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-lg border border-stone-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm truncate">
                      {item.name}
                    </h4>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Size: <strong className="text-stone-800">{item.size}</strong> • Color: <strong className="text-stone-800">{item.color}</strong>
                    </div>
                    <div className="text-xs font-bold text-stone-900 mt-1">
                      {formatPKR(item.price)}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-300 rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with totals */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50/70 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700">FREE</strong>
                  ) : (
                    formatPKR(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="text-stone-950">{formatPKR(grandTotal)}</span>
              </div>
            </div>

            <button
              id="cart-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure Pakistani Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
