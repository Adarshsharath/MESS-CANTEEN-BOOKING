import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await adminAPI.getDashboardStats();
        console.log('Dashboard Stats Response:', response.data);
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        console.error('Error details:', err.response?.data);
        // Set empty stats to show 0 values instead of nothing
        setStats({
          totalCanteens: 0,
          activeCanteens: 0,
          pendingCanteens: 0,
          totalStudents: 0,
          totalOrders: 0,
          todayOrders: 0,
          totalRevenue: 0,
          todayRevenue: 0,
          recentOrders: [],
          topCanteens: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const StatCard = ({ icon, title, value, subtitle, color, trend }) => (
    <div className={`bg-gradient-to-br ${color} rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 hover:shadow-xl`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl`}>
          {icon}
        </div>
        {trend && (
          <span className="text-white/90 text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-white/80 text-sm font-medium mb-1">{title}</h3>
      <p className="text-white text-3xl font-bold mb-1">{value}</p>
      {subtitle && <p className="text-white/70 text-xs">{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  // Ensure stats is never null
  const safeStats = stats || {
    totalCanteens: 0,
    activeCanteens: 0,
    pendingCanteens: 0,
    totalStudents: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    recentOrders: [],
    topCanteens: []
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-4xl">👑</span>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
                <p className="text-indigo-100">Welcome back, {user?.name || user?.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/admin/canteens')}
                className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-semibold transition-all backdrop-blur-sm border border-white/30"
              >
                🏪 Canteens
              </button>
              <button
                onClick={() => navigate('/admin/students')}
                className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-semibold transition-all backdrop-blur-sm border border-white/30"
              >
                🎓 Students
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span>
            System Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon="🏪"
              title="Total Canteens"
              value={safeStats.totalCanteens}
              subtitle={`${safeStats.activeCanteens} active`}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              icon="🎓"
              title="Total Students"
              value={safeStats.totalStudents}
              subtitle="Registered users"
              color="from-green-500 to-green-600"
            />
            <StatCard
              icon="📦"
              title="Total Orders"
              value={safeStats.totalOrders}
              subtitle={`${safeStats.todayOrders} today`}
              color="from-purple-500 to-purple-600"
              trend={`+${safeStats.todayOrders}`}
            />
            <StatCard
              icon="💰"
              title="Total Revenue"
              value={`₹${safeStats.totalRevenue}`}
              subtitle={`₹${safeStats.todayRevenue} today`}
              color="from-orange-500 to-pink-500"
              trend="Live"
            />
          </div>
        </div>

        {/* Pending Approvals Alert */}
        {safeStats.pendingCanteens > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Pending Approvals</h3>
                  <p className="text-white/90">{safeStats.pendingCanteens} canteen(s) waiting for approval</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/canteens', { state: { filter: 'pending' } })}
                className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Review Now →
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performing Canteens */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏆</span>
              Top Performing Canteens
            </h3>
            <div className="space-y-3">
              {safeStats.topCanteens && safeStats.topCanteens.length > 0 ? (
                safeStats.topCanteens.slice(0, 5).map((canteen, index) => (
                  <div key={canteen._id?._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                        index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                        index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                        'bg-gray-300'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{canteen._id?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-600">{canteen._id?.canteenId || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{canteen.revenue || 0}</p>
                      <p className="text-xs text-gray-500">{canteen.orders || 0} orders</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No data available</p>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📋</span>
              Recent Orders
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {safeStats.recentOrders && safeStats.recentOrders.length > 0 ? (
                safeStats.recentOrders.map((order) => (
                  <div key={order._id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.canteenId?.name || 'N/A'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'served' ? 'bg-green-100 text-green-800' :
                        order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{order.studentId?.usn || order.studentUSN}</span>
                      <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent orders</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>⚡</span>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/canteens')}
              className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all text-left group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏪</div>
              <h4 className="font-bold text-gray-900 mb-1">Manage Canteens</h4>
              <p className="text-sm text-gray-600">Approve, suspend, or view canteens</p>
            </button>

            <button
              onClick={() => navigate('/admin/students')}
              className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all text-left group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎓</div>
              <h4 className="font-bold text-gray-900 mb-1">Manage Students</h4>
              <p className="text-sm text-gray-600">View student data and activity</p>
            </button>

            <button
              onClick={() => navigate('/admin/reports')}
              className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all text-left group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
              <h4 className="font-bold text-gray-900 mb-1">View Reports</h4>
              <p className="text-sm text-gray-600">Analytics and revenue reports</p>
            </button>

            <button
              onClick={() => navigate('/admin/settings')}
              className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all text-left group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
              <h4 className="font-bold text-gray-900 mb-1">System Settings</h4>
              <p className="text-sm text-gray-600">Configure system preferences</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
