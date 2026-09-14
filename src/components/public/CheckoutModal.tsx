import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  ShoppingBag,
  CreditCard,
  Banknote
} from 'lucide-react';
import { CartItem, Order, OrderItem } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onPlaceOrder: (newOrder: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onPlaceOrder,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Cash on Delivery (COD)');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const FREE_SHIPPING_LIMIT = 5000;
  const shippingFee = subtotal >= FREE_SHIPPING_LIMIT || subtotal === 0 ? 0 : 250;
  const grandTotal = subtotal + shippingFee;

  const formatPKR = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    const orderItems: OrderItem[] = cart.map((c) => ({
      productId: c.productId,
      name: c.name,
      price: c.price,
      size: c.size,
      color: c.color,
      quantity: c.quantity,
      image: c.image,
    }));

    const orderId = `ord-${Date.now().toString(36)}`;
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `PK-${randomDigits}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      address: address.trim(),
      city,
      postalCode: postalCode.trim() || undefined,
      notes: notes.trim() || undefined,
      paymentMethod,
      items: orderItems,
      subtotal,
      shippingFee,
      totalPrice: grandTotal,
      orderDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending',
    };

    setPlacedOrder(newOrder);
    onPlaceOrder(newOrder);
    onClearCart();
    setStep('confirmed');
  };

  const handleFinish = () => {
    setStep('form');
    setPlacedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <h3 className="font-serif font-bold text-lg text-stone-900">
              {step === 'form' ? 'Checkout & Nationwide Delivery' : 'Order Received'}
            </h3>
          </div>

          <button
            id="close-checkout-modal"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-950 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'form' ? (
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              
              {/* Customer Contact */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  1. Contact Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fatima Ali"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Mobile Number (for Courier & SMS updates) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0300 1234567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. fatima@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-3 border-t border-stone-200">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  2. Shipping Address in Pakistan
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Gujranwala">Gujranwala</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Other">Other Pakistani City</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      disabled
                      value="Pakistan (Nationwide Express Delivery)"
                      className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-lg text-stone-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Complete Street Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="House/Apartment #, Street #, Sector / Colony, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call before delivery, deliver after 2 PM"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3 pt-3 border-t border-stone-200">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  3. Payment Method
                </span>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-300 bg-stone-50/80 cursor-pointer">
                    <input
                      type="radio"
                      name="checkoutPayment"
                      checked={paymentMethod === 'Cash on Delivery (COD)'}
                      onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                      className="text-stone-900"
                    />
                    <Banknote className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div className="text-xs">
                      <strong className="text-stone-900 block font-semibold">Cash on Delivery (COD)</strong>
                      <span className="text-stone-500">Pay cash in PKR to the courier rider upon delivery.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-white cursor-pointer">
                    <input
                      type="radio"
                      name="checkoutPayment"
                      checked={paymentMethod === 'Bank Transfer / Raast'}
                      onChange={() => setPaymentMethod('Bank Transfer / Raast')}
                      className="text-stone-900"
                    />
                    <CreditCard className="w-4 h-4 text-stone-600 shrink-0" />
                    <div className="text-xs">
                      <strong className="text-stone-900 block font-semibold">Bank Transfer / Raast / JazzCash</strong>
                      <span className="text-stone-500">Account details will be sent via SMS / WhatsApp.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary & Submit */}
              <div className="pt-4 border-t border-stone-200 bg-stone-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPKR(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Total Amount Payable</span>
                  <span className="text-stone-950">{formatPKR(grandTotal)}</span>
                </div>

                <button
                  type="submit"
                  id="submit-order-button"
                  className="w-full mt-3 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  Place Order ({formatPKR(grandTotal)})
                </button>
              </div>

            </form>
          ) : (
            /* Order Confirmed Screen */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-2xl text-stone-900">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Shukriya, {placedOrder?.customerName}! Your order has been registered in our system.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-stone-500">Order Number:</span>
                  <strong className="text-stone-900">{placedOrder?.orderNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Payable:</span>
                  <strong className="text-stone-900">{formatPKR(placedOrder?.totalPrice || 0)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment:</span>
                  <span className="text-stone-800">{placedOrder?.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Delivery Destination:</span>
                  <span className="text-stone-800">{placedOrder?.city}, Pakistan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Estimated Delivery:</span>
                  <span className="text-emerald-700 font-semibold">2 - 4 Working Days</span>
                </div>
              </div>

              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                You will receive an automated confirmation SMS on <strong>{placedOrder?.customerPhone}</strong> once your parcel is handed over to the courier service.
              </p>

              <button
                type="button"
                onClick={handleFinish}
                className="px-8 py-3 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors shadow-md"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
