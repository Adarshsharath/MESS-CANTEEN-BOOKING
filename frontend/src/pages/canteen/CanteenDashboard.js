import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { canteenAPI } from '../../services/api';

const CanteenDashboard = () => {
  const [todayOrders, setTodayOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, ready: 0, served: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayOrders();
    fetchCanteenProfile();
    
    // Poll for status updates every 30 seconds
    const intervalId = setInterval(() => {
      fetchCanteenProfile();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchCanteenProfile = async () => {
    try {
      const response = await canteenAPI.getProfile();
      const profile = response.data;
      
      // Update user context with latest profile data
      updateUser({
        status: profile.status,
        approvalStatus: profile.approvalStatus,
        operatingHours: profile.operatingHours
      });
    } catch (err) {
      console.error('Failed to fetch canteen profile');
    }
  };

  const fetchTodayOrders = async () => {
    try {
      const response = await canteenAPI.getTodayOrders();
      const orders = response.data;
      setTodayOrders(orders);

      // Calculate stats
      const pending = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
      const ready = orders.filter(o => o.status === 'ready').length;
      const served = orders.filter(o => o.status === 'served').length;
      const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

      setStats({
        total: orders.length,
        pending,
        ready,
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
      const response = await canteenAPI.toggleStatus();
      const newStatus = response.data.status;
      updateUser({ status: newStatus });
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const handleMarkReady = async (orderId) => {
    try {
      await canteenAPI.markOrderReady(orderId);
      // Refresh orders to show updated status
      fetchTodayOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark order as ready');
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
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user?.status === 'active' ? '✓ Active' : '✗ Inactive'}
                </span>
                {user?.operatingHours?.enabled && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    ⏰ Auto-Schedule: {user.operatingHours.openTime} - {user.operatingHours.closeTime}
                  </span>
                )}
              </div>
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
                onClick={() => navigate('/canteen/operating-hours')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                ⏰ Operating Hours
              </button>
              <button
                onClick={() => navigate('/canteen/menu')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                📋 Manage Menu
              </button>
              <button
                onClick={() => navigate('/canteen/scan-verify')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-semibold"
              >
                📷 Scan & Verify
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

      {/* Pending Approval Warning */}
      {user?.approvalStatus === 'pending' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-bold">⏳ Pending Approval:</span> Your canteen registration is awaiting admin approval. You won't be visible to students until approved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejected Status Warning */}
      {user?.approvalStatus === 'rejected' && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <span className="font-bold">❌ Registration Rejected:</span> Your canteen registration has been rejected by the admin. Please contact support for more information.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Pending</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Ready</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.ready}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Served</h3>
            <p className="text-3xl font-bold text-green-600">{stats.served}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Revenue</h3>
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student USN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {todayOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">#{order.orderNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.studentUSN}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.items.length} items</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{order.totalAmount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'pending' || order.status === 'confirmed' ? 'bg-orange-100 text-orange-800' : 
                          order.status === 'ready' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3">
                        {(order.status === 'pending' || order.status === 'confirmed') && (
                          <button
                            onClick={() => handleMarkReady(order.orderId)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <span className="text-xs text-blue-600 font-medium">Awaiting Pickup</span>
                        )}
                        {order.status === 'served' && (
                          <span className="text-xs text-green-600 font-medium">✓ Completed</span>
                        )}
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
