import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { menuAPI, canteenAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';

const MenuPage = () => {
  const { canteenId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [canteen, setCanteen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart, getTotalItems } = useCart();
  const navigate = useNavigate();

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Other'];

  useEffect(() => {
    fetchMenuAndCanteen();
  }, [canteenId]);

  const fetchMenuAndCanteen = async () => {
    try {
      const [menuResponse, canteensResponse] = await Promise.all([
        menuAPI.getMenuByCanteen(canteenId),
        canteenAPI.getActiveCanteens(),
      ]);
      
      setMenuItems(menuResponse.data);
      const currentCanteen = canteensResponse.data.find(c => c.canteenId === canteenId);
      setCanteen(currentCanteen);
    } catch (err) {
      setError('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    if (!item.available) return;
    addToCart(item, canteen);
    // Show a brief success message
    const button = document.getElementById(`add-btn-${item._id}`);
    if (button) {
      const originalText = button.textContent;
      button.textContent = '✓ Added!';
      button.classList.add('bg-green-600');
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-green-600');
      }, 1000);
    }
  };

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="text-primary-600 hover:text-primary-700 mb-3 flex items-center font-semibold group"
              >
                <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{canteen?.name || 'Menu'} 🍽️</h1>
              <p className="text-gray-600 mt-1">Choose your favorites and add to cart</p>
            </div>
            <button
              onClick={() => navigate('/student/cart')}
              className="relative bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-bold"
            >
              🛒 Cart
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="mt-6 text-gray-600 text-lg">Loading delicious menu...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl">
            <p className="font-semibold">{error}</p>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-soft'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            {filteredItems.length === 0 ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-xl">
                <p className="font-semibold">No items available in this category. Try another one! 🍽️</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className={`group bg-white rounded-3xl shadow-soft hover:shadow-glow overflow-hidden transition-all duration-300 ${
                      !item.available ? 'opacity-60' : 'hover:-translate-y-1'
                    }`}
                  >
                    <div className="relative bg-gradient-to-br from-primary-50 to-accent-50 p-6">
                      <div className="absolute top-3 right-3">
                        <span className="text-3xl">🍽️</span>
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 pr-10">{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                            ₹{item.price}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-700 shadow-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                            item.available
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.available ? (
                            <>
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                              Available
                            </>
                          ) : (
                            '✗ Out of Stock'
                          )}
                        </span>
                        <span className="text-gray-500 text-sm">⭐ 4.5</span>
                      </div>
                      
                      <button
                        id={`add-btn-${item._id}`}
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.available}
                        className={`w-full py-3 rounded-xl font-bold transition-all transform ${
                          item.available
                            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:scale-105'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {item.available ? '+ Add to Cart' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MenuPage;
