import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const ManageCanteens = () => {
  const [canteens, setCanteens] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if filter was passed from navigation
    if (location.state?.filter) {
      setFilter(location.state.filter);
    }
    fetchCanteens();
  }, [location.state]);

  const fetchCanteens = async (status = null) => {
    setLoading(true);
    try {
      const params = {};
      if (status && status !== 'all') params.approvalStatus = status;
      
      const response = await adminAPI.getAllCanteens(params);
      setCanteens(response.data);
    } catch (err) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanteens(filter === 'all' ? null : filter);
  }, [filter]);

  const handleApprove = async (canteenId) => {
    setActionLoading(canteenId);
    try {
      await adminAPI.approveCanteen(canteenId);
      fetchCanteens(filter === 'all' ? null : filter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve canteen');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (canteenId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setActionLoading(canteenId);
    try {
      await adminAPI.rejectCanteen(canteenId, { reason: rejectionReason });
      setShowRejectModal(null);
      setRejectionReason('');
      fetchCanteens(filter === 'all' ? null : filter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject canteen');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (canteenId) => {
    setActionLoading(canteenId);
    try {
      await adminAPI.toggleCanteenStatus(canteenId);
      fetchCanteens(filter === 'all' ? null : filter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = async () => {
    try {
      const response = await adminAPI.exportCanteens();
      const csvData = response.data;
      
      // Convert to CSV
      const headers = Object.keys(csvData[0]).join(',');
      const rows = csvData.map(row => Object.values(row).join(','));
      const csv = [headers, ...rows].join('\n');
      
      // Download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `canteens-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (err) {
      alert('Failed to export data');
    }
  };

  const getStatusBadge = (approvalStatus, status) => {
    if (approvalStatus === 'pending') {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">⏳ Pending</span>;
    }
    if (approvalStatus === 'rejected') {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">❌ Rejected</span>;
    }
    if (status === 'active') {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">✓ Active</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">⊗ Inactive</span>;
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Canteen Management</h1>
              <p className="text-sm text-gray-600 mt-1">Approve, manage, and monitor all canteens</p>
            </div>
            <button
              onClick={handleExport}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Data
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                filter === tab
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'pending' && canteens.filter(c => c.approvalStatus === 'pending').length > 0 && (
                <span className="ml-2 bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full text-xs font-bold">
                  {canteens.filter(c => c.approvalStatus === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Canteens List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading canteens...</p>
          </div>
        ) : canteens.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Canteens Found</h3>
            <p className="text-gray-600">No canteens match the selected filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {canteens.map((canteen) => (
              <div key={canteen._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl">
                        🏪
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{canteen.name}</h3>
                        <p className="text-gray-600">ID: {canteen.canteenId}</p>
                        <p className="text-sm text-gray-500">{canteen.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(canteen.approvalStatus, canteen.status)}
                      {canteen.operatingHours?.enabled && (
                        <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          ⏰ Auto: {canteen.operatingHours.openTime}-{canteen.operatingHours.closeTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Revenue Breakdown */}
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-3">📊 Revenue & Orders</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                        <p className="text-xs text-blue-600 font-semibold mb-1">Today</p>
                        <p className="text-lg font-bold text-blue-700">₹{canteen.todayRevenue || 0}</p>
                        <p className="text-xs text-blue-600">{canteen.todayOrders || 0} orders</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                        <p className="text-xs text-purple-600 font-semibold mb-1">This Month</p>
                        <p className="text-lg font-bold text-purple-700">₹{canteen.monthRevenue || 0}</p>
                        <p className="text-xs text-purple-600">{canteen.monthOrders || 0} orders</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                        <p className="text-xs text-green-600 font-semibold mb-1">Total</p>
                        <p className="text-lg font-bold text-green-700">₹{canteen.calculatedRevenue || 0}</p>
                        <p className="text-xs text-green-600">{canteen.calculatedOrderCount || 0} orders</p>
                      </div>
                    </div>
                  </div>

                  {/* Other Info */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <p className="text-sm font-semibold text-gray-900">{canteen.contactPhone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Registered</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(canteen.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Operating Hours</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {canteen.operatingHours?.enabled 
                          ? `${canteen.operatingHours.openTime}-${canteen.operatingHours.closeTime}`
                          : 'Manual'}
                      </p>
                    </div>
                  </div>

                  {canteen.address && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Address</p>
                      <p className="text-sm text-gray-700">{canteen.address}</p>
                    </div>
                  )}

                  {canteen.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                      <p className="text-xs font-semibold text-red-800 mb-1">Rejection Reason:</p>
                      <p className="text-sm text-red-700">{canteen.rejectionReason}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {canteen.approvalStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(canteen._id)}
                          disabled={actionLoading === canteen._id}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === canteen._id ? 'Processing...' : '✓ Approve'}
                        </button>
                        <button
                          onClick={() => setShowRejectModal(canteen._id)}
                          disabled={actionLoading === canteen._id}
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ✗ Reject
                        </button>
                      </>
                    )}

                    {canteen.approvalStatus === 'approved' && (
                      <button
                        onClick={() => handleToggleStatus(canteen._id)}
                        disabled={actionLoading === canteen._id}
                        className={`flex-1 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          canteen.status === 'active'
                            ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                            : 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                        }`}
                      >
                        {actionLoading === canteen._id ? 'Processing...' : 
                         canteen.status === 'active' ? '⊗ Suspend' : '✓ Activate'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Reject Canteen</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this canteen registration:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none mb-4"
              rows="4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectionReason('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectionReason.trim()}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCanteens;
