import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (type) => {
    try {
      let response;
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (type === 'canteens') {
        response = await adminAPI.exportCanteens();
      } else if (type === 'students') {
        response = await adminAPI.exportStudents();
      } else if (type === 'orders') {
        response = await adminAPI.exportOrders();
      }

      const csvData = response.data;
      const headers = Object.keys(csvData[0]).join(',');
      const rows = csvData.map(row => Object.values(row).join(','));
      const csv = [headers, ...rows].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report-${timestamp}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading Reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-indigo-600 hover:text-indigo-800 mb-2 flex items-center gap-2 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-sm text-gray-600 mt-1">View comprehensive system reports and download data</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl mb-2">🏪</div>
            <p className="text-white/80 text-sm">Total Canteens</p>
            <p className="text-4xl font-bold">{stats?.totalCanteens || 0}</p>
            <p className="text-white/70 text-xs mt-1">{stats?.activeCanteens || 0} active</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl mb-2">🎓</div>
            <p className="text-white/80 text-sm">Total Students</p>
            <p className="text-4xl font-bold">{stats?.totalStudents || 0}</p>
            <p className="text-white/70 text-xs mt-1">Registered users</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl mb-2">📦</div>
            <p className="text-white/80 text-sm">Total Orders</p>
            <p className="text-4xl font-bold">{stats?.totalOrders || 0}</p>
            <p className="text-white/70 text-xs mt-1">{stats?.todayOrders || 0} today</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-white/80 text-sm">Total Revenue</p>
            <p className="text-4xl font-bold">₹{stats?.totalRevenue || 0}</p>
            <p className="text-white/70 text-xs mt-1">₹{stats?.todayRevenue || 0} today</p>
          </div>
        </div>

        {/* Download Reports Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📥</span>
            Download Reports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-indigo-200 rounded-xl p-6 hover:border-indigo-400 transition-all hover:shadow-lg">
              <div className="text-4xl mb-3">🏪</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Canteen Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete canteen data with revenue breakdown (today, month, total) and order statistics
              </p>
              <button
                onClick={() => handleDownloadReport('canteens')}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Download CSV
              </button>
            </div>

            <div className="border-2 border-green-200 rounded-xl p-6 hover:border-green-400 transition-all hover:shadow-lg">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Student Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Student data with spending breakdown (today, month, total) and order history
              </p>
              <button
                onClick={() => handleDownloadReport('students')}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Download CSV
              </button>
            </div>

            <div className="border-2 border-orange-200 rounded-xl p-6 hover:border-orange-400 transition-all hover:shadow-lg">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Orders Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete order history with canteen and student details, status, and amounts
              </p>
              <button
                onClick={() => handleDownloadReport('orders')}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Download CSV
              </button>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Canteens */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏆</span>
              Top Performing Canteens
            </h2>
            <div className="space-y-3">
              {stats?.topCanteens && stats.topCanteens.length > 0 ? (
                stats.topCanteens.slice(0, 10).map((canteen, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
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

          {/* Revenue Insights */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💡</span>
              Revenue Insights
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-600 font-semibold mb-1">Today's Performance</p>
                <p className="text-2xl font-bold text-blue-700">₹{stats?.todayRevenue || 0}</p>
                <p className="text-xs text-blue-600">{stats?.todayOrders || 0} orders processed</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <p className="text-sm text-purple-600 font-semibold mb-1">Average Order Value</p>
                <p className="text-2xl font-bold text-purple-700">
                  ₹{stats?.totalOrders ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}
                </p>
                <p className="text-xs text-purple-600">Per order average</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <p className="text-sm text-green-600 font-semibold mb-1">Total System Revenue</p>
                <p className="text-2xl font-bold text-green-700">₹{stats?.totalRevenue || 0}</p>
                <p className="text-xs text-green-600">All-time earnings</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
