import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { canteenAPI } from '../../services/api';

const VerifyOrder = () => {
  const [orderIdentifier, setOrderIdentifier] = useState('');
  const [verifiedOrder, setVerifiedOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setVerifiedOrder(null);
    setLoading(true);

    try {
      const response = await canteenAPI.verifyOrder(orderIdentifier);
      setVerifiedOrder(response.data.order);
      setSuccess('Order verified and marked as served!');
      setOrderIdentifier('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={() => navigate('/canteen/dashboard')}
                className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Verify Orders</h1>
              <p className="text-sm text-gray-600">Scan QR code or enter order number</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Verification Form */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Enter Order Information</h2>
          
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Number or Full Order ID
              </label>
              <input
                type="text"
                value={orderIdentifier}
                onChange={(e) => setOrderIdentifier(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="e.g., 23 or M1-20251015-23"
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter just the order number (e.g., 23) or the full order ID (e.g., M1-20251015-23)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 text-lg"
            >
              {loading ? 'Verifying...' : 'Verify Order'}
            </button>
          </form>

          {/* Success Message */}
          {success && (
            <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">✓</span>
                <span className="font-semibold">{success}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">✗</span>
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Verified Order Details */}
        {verifiedOrder && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-bold text-gray-900">{verifiedOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-bold text-gray-900">#{verifiedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Student USN:</span>
                <span className="font-bold text-gray-900">{verifiedOrder.studentUSN}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {verifiedOrder.status}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                <span>Total Amount:</span>
                <span>₹{verifiedOrder.totalAmount}</span>
              </div>
            </div>

            {/* Items */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Items:</h3>
              <div className="space-y-2">
                {verifiedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-gray-700 bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium">{item.name} x {item.quantity}</span>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 How to Verify Orders</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• <strong>Quick Entry:</strong> Just enter the order number (e.g., 23) for today's orders</li>
            <li>• <strong>Full ID:</strong> Enter the complete order ID (e.g., M1-20251015-23) for any order</li>
            <li>• <strong>QR Code:</strong> Scan the student's QR code to auto-fill the order information</li>
            <li>• <strong>Auto-mapping:</strong> System automatically maps order numbers to today's date</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default VerifyOrder;
