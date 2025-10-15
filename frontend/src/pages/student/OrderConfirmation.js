import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No order found</h2>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const qrData = JSON.stringify({
    orderId: order.orderId,
    canteenId: order.canteenId,
    studentUSN: order.studentUSN,
    totalAmount: order.totalAmount,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Message */}
        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 mb-6 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Order Confirmed!</h1>
          <p className="text-green-700">Your order has been placed successfully</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-bold text-gray-900">{order.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-bold text-gray-900">#{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Canteen ID:</span>
              <span className="font-bold text-gray-900">{order.canteenId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
              <span>Total Amount:</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Items */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Items Ordered:</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-gray-700">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your QR Code</h2>
          <p className="text-gray-600 mb-4">Show this QR code at the canteen to collect your order</p>
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <QRCodeSVG value={qrData} size={200} />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Or provide your order number: <span className="font-bold text-gray-900">#{order.orderNumber}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/student/orders')}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Print Button */}
        <button
          onClick={() => window.print()}
          className="w-full mt-4 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          🖨️ Print Order Receipt
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
