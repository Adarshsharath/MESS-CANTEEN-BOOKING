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
              <h1 className="text-2xl font-bold text-gray-900">{canteen?.name || 'Menu'}</h1>
              <p className="text-sm text-gray-600">Browse and add items to your cart</p>
            </div>
            <button
              onClick={() => navigate('/student/cart')}
              className="relative bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              🛒 View Cart
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
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
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading menu...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            {filteredItems.length === 0 ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                No items available in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className={`bg-white rounded-xl shadow-md overflow-hidden ${
                      !item.available ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                        <span className="text-lg font-bold text-blue-600">₹{item.price}</span>
                      </div>
                      
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            item.available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.available ? '✓ Available' : '✗ Unavailable'}
                        </span>
                      </div>
                      
                      <button
                        id={`add-btn-${item._id}`}
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.available}
                        className={`w-full py-2 rounded-lg font-semibold transition ${
                          item.available
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {item.available ? 'Add to Cart' : 'Not Available'}
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
