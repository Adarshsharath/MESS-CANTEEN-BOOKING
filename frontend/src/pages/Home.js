import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">🍽️ Canteen Booking System</h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Mess/Canteen Booking
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Order food from your college canteen with ease. Get QR codes for quick pickup!
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
              <div className="text-6xl mb-4">👨‍🎓</div>
              <h3 className="text-3xl font-bold mb-2">Student</h3>
              <p className="text-blue-100">Browse menus, order food, and get QR codes</p>
            </div>
            <div className="p-8">
              <ul className="space-y-3 mb-6 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>View all active canteens</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Browse menus and add to cart</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Get QR code for order pickup</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Track your order history</span>
                </li>
              </ul>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/student/login')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Student Login
                </button>
                <button
                  onClick={() => navigate('/student/register')}
                  className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Student Register
                </button>
              </div>
            </div>
          </div>

          {/* Canteen Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 text-white">
              <div className="text-6xl mb-4">👨‍🍳</div>
              <h3 className="text-3xl font-bold mb-2">Canteen</h3>
              <p className="text-orange-100">Manage your canteen and verify orders</p>
            </div>
            <div className="p-8">
              <ul className="space-y-3 mb-6 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Manage menu items (Add/Edit/Delete)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>View today's orders in real-time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Verify orders via QR or order number</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Toggle canteen active/inactive status</span>
                </li>
              </ul>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/canteen/login')}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
                >
                  Canteen Login
                </button>
                <button
                  onClick={() => navigate('/canteen/register')}
                  className="w-full bg-white border-2 border-orange-600 text-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
                >
                  Canteen Register
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📱</div>
              <h4 className="font-semibold text-gray-900 mb-2">QR Code Orders</h4>
              <p className="text-gray-600 text-sm">Get a unique QR code for each order for quick verification</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔢</div>
              <h4 className="font-semibold text-gray-900 mb-2">Daily Order Numbers</h4>
              <p className="text-gray-600 text-sm">Sequential order numbers reset daily for easy tracking</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-time Updates</h4>
              <p className="text-gray-600 text-sm">Instant order confirmation and status updates</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600">
          <p>© 2025 Canteen Booking System - MERN Stack Project</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
