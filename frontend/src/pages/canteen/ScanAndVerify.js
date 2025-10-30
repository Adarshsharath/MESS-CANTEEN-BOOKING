import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { canteenAPI } from '../../services/api';

const ScanAndVerify = () => {
  const [scanMode, setScanMode] = useState(false);
  const [manualOrderId, setManualOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [scannedOrder, setScannedOrder] = useState(null);
  const [scanner, setScanner] = useState(null);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scanMode && !scanner) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      html5QrcodeScanner.render(onScanSuccess, onScanError);
      setScanner(html5QrcodeScanner);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(err => console.error('Failed to clear scanner', err));
      }
    };
  }, [scanMode]);

  const onScanSuccess = async (decodedText) => {
    try {
      const data = JSON.parse(decodedText);
      if (data.orderId) {
        if (scanner) {
          await scanner.clear();
          setScanner(null);
        }
        await verifyOrder(data.orderId);
      }
    } catch (err) {
      // Try using the decoded text directly as order ID
      if (scanner) {
        await scanner.clear();
        setScanner(null);
      }
      await verifyOrder(decodedText);
    }
  };

  const onScanError = (errorMessage) => {
    // Ignore scan errors as they happen frequently during scanning
    console.log(errorMessage);
  };

  const verifyOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await canteenAPI.verifyOrder(orderId);
      setScannedOrder(response.data.order);
      setMessage({ 
        type: 'success', 
        text: `Order #${response.data.order.orderNumber} verified successfully!` 
      });
      setScanMode(false);
      
      // Clear after 3 seconds
      setTimeout(() => {
        setScannedOrder(null);
        setMessage({ type: '', text: '' });
      }, 5000);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to verify order' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualVerify = async (e) => {
    e.preventDefault();
    if (!manualOrderId.trim()) {
      setMessage({ type: 'error', text: 'Please enter an order ID or number' });
      return;
    }
    await verifyOrder(manualOrderId);
    setManualOrderId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/canteen/dashboard')}
                className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Scan & Verify Orders
              </h1>
              <p className="text-sm text-gray-600 mt-1">Scan QR code or enter order number to mark as served</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          } animate-fadeIn`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {message.type === 'success' ? '✅' : '❌'}
              </span>
              <p className="font-semibold">{message.text}</p>
            </div>
          </div>
        )}

        {/* Scanned Order Details */}
        {scannedOrder && (
          <div className="mb-6 bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order Served Successfully</h3>
                <p className="text-sm text-gray-600">Order #{scannedOrder.orderNumber}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Student USN</p>
                <p className="font-semibold text-gray-900">{scannedOrder.studentUSN}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="font-semibold text-gray-900">₹{scannedOrder.totalAmount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mode Selection */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setScanMode(true)}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
              scanMode
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent text-white shadow-lg transform scale-105'
                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="text-4xl mb-3">📷</div>
            <h3 className="font-bold text-lg mb-1">Scan QR Code</h3>
            <p className="text-sm opacity-90">Use camera to scan</p>
          </button>
          
          <button
            onClick={() => setScanMode(false)}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
              !scanMode
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent text-white shadow-lg transform scale-105'
                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="text-4xl mb-3">⌨️</div>
            <h3 className="font-bold text-lg mb-1">Manual Entry</h3>
            <p className="text-sm opacity-90">Enter order number</p>
          </button>
        </div>

        {/* Scanner or Manual Input */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {scanMode ? (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📷</span>
                QR Code Scanner
              </h3>
              <div id="qr-reader" className="rounded-xl overflow-hidden border-4 border-blue-500 shadow-lg"></div>
              <p className="text-center text-gray-600 mt-4 text-sm">
                Position the QR code within the frame to scan
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>⌨️</span>
                Manual Order Verification
              </h3>
              <form onSubmit={handleManualVerify} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order ID or Order Number
                  </label>
                  <input
                    type="text"
                    value={manualOrderId}
                    onChange={(e) => setManualOrderId(e.target.value)}
                    placeholder="e.g., 23 or M1-20251028-23"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter just the order number (e.g., 23) or the full order ID
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>✓</span>
                      Verify & Mark as Served
                    </span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            How it works
          </h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Student shows their QR code or tells you the order number</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Scan the QR code or manually enter the order number</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Order is automatically marked as "Served" after verification</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ScanAndVerify;
