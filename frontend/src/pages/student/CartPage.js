import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orderAPI } from '../../services/api';

const CartPage = () => {
  const { cart, selectedCanteen, updateQuantity, removeFromCart, clearCart, getTotalAmount } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const orderData = {
        canteenId: selectedCanteen.canteenId,
        items: cart.map(item => ({
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: getTotalAmount(),
      };

      const response = await orderAPI.createOrder(orderData);
      clearCart();
      navigate('/student/order-confirmation', { state: { order: response.data.order } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              ← Back to Dashboard
            </button>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Browse Canteens
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
              <p className="text-sm text-gray-600">Review your items and confirm order</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Canteen Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900">Ordering from: {selectedCanteen?.name}</h3>
          <p className="text-sm text-blue-700">Canteen ID: {selectedCanteen?.canteenId}</p>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {cart.map((item) => (
            <div key={item._id} className="p-6 border-b last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price} each</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition font-bold"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-lg font-bold text-gray-900">₹{item.price * item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{getTotalAmount()}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax & Fees</span>
              <span>₹0</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>₹{getTotalAmount()}</span>
            </div>
          </div>
          <button
            onClick={handleConfirmOrder}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Confirm Order (Dummy Payment)'}
          </button>
          <p className="text-sm text-gray-500 text-center mt-2">
            This is a dummy payment. No actual transaction will occur.
          </p>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
