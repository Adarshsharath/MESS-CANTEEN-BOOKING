import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-2xl">🍽️</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">FoodHub</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <div className="inline-block mb-6">
            <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">🎉 Order Smart, Eat Happy</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Your Campus
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent"> Food Hub</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Skip the queue, order ahead & collect with QR codes ⚡
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-20">
          {/* Student Card */}
          <div className="group bg-white rounded-3xl shadow-soft hover:shadow-glow overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
            <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 p-10 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
              <div className="relative z-10">
                <div className="text-7xl mb-4 transform group-hover:scale-110 transition-transform">👨‍🎓</div>
                <h3 className="text-4xl font-bold mb-3">I'm a Student</h3>
                <p className="text-primary-100 text-lg">Order delicious food from campus canteens</p>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Browse all active canteens</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Add items to cart & checkout</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Get instant QR code</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Track order history</span>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/student/login')}
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Login as Student
                </button>
                <button
                  onClick={() => navigate('/student/register')}
                  className="w-full bg-white border-2 border-primary-500 text-primary-600 py-4 rounded-xl font-bold hover:bg-primary-50 transition-all duration-200"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>

          {/* Canteen Card */}
          <div className="group bg-white rounded-3xl shadow-soft hover:shadow-glow overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
            <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-10 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
              <div className="relative z-10">
                <div className="text-7xl mb-4 transform group-hover:scale-110 transition-transform">👨‍🍳</div>
                <h3 className="text-4xl font-bold mb-3">I'm a Canteen</h3>
                <p className="text-orange-100 text-lg">Manage menu & verify orders seamlessly</p>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Manage menu items easily</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">View real-time orders</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Verify via QR or number</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Toggle active status</span>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/canteen/login')}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Login as Canteen
                </button>
                <button
                  onClick={() => navigate('/canteen/register')}
                  className="w-full bg-white border-2 border-orange-500 text-orange-600 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all duration-200"
                >
                  Register Canteen
                </button>
              </div>
            </div>
          </div>

          {/* Admin Card */}
          <div className="group bg-white rounded-3xl shadow-soft hover:shadow-glow overflow-hidden transform hover:-translate-y-2 transition-all duration-300 lg:col-span-1 md:col-span-2">
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-10 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
              <div className="relative z-10">
                <div className="text-7xl mb-4 transform group-hover:scale-110 transition-transform">👑</div>
                <h3 className="text-4xl font-bold mb-3">Admin Portal</h3>
                <p className="text-indigo-100 text-lg">Manage the entire system with authority</p>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Approve canteen registrations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">View analytics & revenue</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Monitor student activity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Export detailed reports</span>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/login')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  👑 Admin Access
                </button>
                <p className="text-xs text-center text-gray-500">Authorized Personnel Only</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose FoodHub?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📱</span>
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">QR Code Magic</h4>
              <p className="text-gray-600">Get instant QR codes for contactless order pickup. No more waiting in queues!</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚡</span>
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">Lightning Fast</h4>
              <p className="text-gray-600">Order in seconds with our streamlined checkout process. Quick & easy!</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔔</span>
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">Real-time Tracking</h4>
              <p className="text-gray-600">Track your order status in real-time. Know exactly when it's ready!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2025 FoodHub - Making campus dining delightful ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
