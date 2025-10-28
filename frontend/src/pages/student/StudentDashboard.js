import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { canteenAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import NotificationBell from '../../components/NotificationBell';

const StudentDashboard = () => {
  const [canteens, setCanteens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCanteens();
  }, []);

  const fetchCanteens = async () => {
    try {
      const response = await canteenAPI.getActiveCanteens();
      setCanteens(response.data);
    } catch (err) {
      setError('Failed to load canteens');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Hey, {user?.name}! 👋
                </h1>
                <p className="text-sm text-gray-600">{user?.usn}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <NotificationBell />
              <button
                onClick={() => navigate('/student/cart')}
                className="relative bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-semibold"
              >
                🛒 Cart
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate('/student/orders')}
                className="bg-white border-2 border-primary-500 text-primary-600 px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-all font-semibold"
              >
                📦 Orders
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Explore Canteens 🍴</h2>
          <p className="text-lg text-gray-600">Discover delicious food from our campus canteens</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="mt-6 text-gray-600 text-lg">Finding delicious food for you...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl">
            <p className="font-semibold">{error}</p>
          </div>
        ) : canteens.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-xl">
            <p className="font-semibold">No active canteens available at the moment. Check back later! 🍽️</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {canteens.map((canteen) => (
              <div
                key={canteen._id}
                className="group bg-white rounded-3xl shadow-soft hover:shadow-glow overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                onClick={() => navigate(`/student/menu/${canteen.canteenId}`)}
              >
                <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 p-8 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  <div className="relative z-10">
                    <div className="text-5xl mb-4">🍽️</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{canteen.name}</h3>
                    <p className="text-primary-100 text-sm">ID: {canteen.canteenId}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Open Now
                    </span>
                    <span className="text-gray-500 text-sm">⭐ 4.5</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-xl hover:shadow-lg transform group-hover:scale-105 transition-all font-bold">
                    Browse Menu →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
