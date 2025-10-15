import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { canteenAPI } from '../../services/api';

const CanteenDashboard = () => {
  const [todayOrders, setTodayOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, served: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayOrders();
  }, []);

  const fetchTodayOrders = async () => {
    try {
      const response = await canteenAPI.getTodayOrders();
      const orders = response.data;
      setTodayOrders(orders);

      // Calculate stats
      const confirmed = orders.filter(o => o.status === 'confirmed').length;
      const served = orders.filter(o => o.status === 'served').length;
      const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

      setStats({
        total: orders.length,
        confirmed,
        served,
        revenue,
      });
    } catch (err) {
      console.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await canteenAPI.toggleStatus();
      window.location.reload();
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-sm text-gray-600">Canteen ID: {user?.canteenId}</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                user?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user?.status === 'active' ? '✓ Active' : '✗ Inactive'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  user?.status === 'active'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {user?.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => navigate('/canteen/menu')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Manage Menu
              </button>
              <button
                onClick={() => navigate('/canteen/verify')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Verify Orders
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Orders Today</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Pending</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Served</h3>
            <p className="text-3xl font-bold text-green-600">{stats.served}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Revenue Today</h3>
            <p className="text-3xl font-bold text-purple-600">₹{stats.revenue}</p>
          </div>
        </div>

        {/* Today's Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Orders</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : todayOrders.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No orders yet today</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student USN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {todayOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.orderId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.studentUSN}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.items.length} items</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{order.totalAmount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CanteenDashboard;
