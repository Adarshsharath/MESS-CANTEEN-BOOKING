import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { canteenAPI } from '../../services/api';

const OperatingHours = () => {
  const [operatingHours, setOperatingHours] = useState({
    enabled: false,
    openTime: '09:00',
    closeTime: '17:00'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOperatingHours();
    
    // Poll for updates every 30 seconds to sync with scheduler
    const intervalId = setInterval(() => {
      fetchOperatingHours();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchOperatingHours = async () => {
    try {
      const response = await canteenAPI.getOperatingHours();
      setOperatingHours(response.data);
      
      // Also sync with user context
      updateUser({ operatingHours: response.data });
    } catch (err) {
      console.error('Failed to load operating hours');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async () => {
    const newEnabled = !operatingHours.enabled;
    setOperatingHours({ ...operatingHours, enabled: newEnabled });
    
    try {
      await canteenAPI.updateOperatingHours({ enabled: newEnabled });
      
      // Update user's operatingHours in context
      updateUser({ 
        operatingHours: { 
          ...operatingHours, 
          enabled: newEnabled 
        } 
      });
      
      setMessage({
        type: 'success',
        text: newEnabled 
          ? 'Automatic scheduling enabled! Your canteen will now activate/deactivate based on the set timings.' 
          : 'Automatic scheduling disabled. You can now manually control your canteen status.'
      });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      setOperatingHours({ ...operatingHours, enabled: !newEnabled });
      setMessage({ type: 'error', text: 'Failed to update scheduling settings' });
    }
  };

  const handleSaveTimings = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await canteenAPI.updateOperatingHours({
        openTime: operatingHours.openTime,
        closeTime: operatingHours.closeTime
      });
      
      setOperatingHours(response.data.operatingHours);
      
      // Update user's operatingHours in context
      updateUser({ operatingHours: response.data.operatingHours });
      
      setMessage({ 
        type: 'success', 
        text: 'Operating hours updated successfully!' 
      });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update operating hours' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Operating Hours</h1>
              <p className="text-sm text-gray-600">{user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/canteen/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Back to Dashboard
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Automatic Scheduling Toggle */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Automatic Scheduling</h2>
              <p className="text-gray-600">
                {operatingHours.enabled 
                  ? 'Your canteen will automatically activate and deactivate based on the operating hours below.'
                  : 'Enable automatic scheduling to activate/deactivate your canteen based on set timings.'}
              </p>
            </div>
            <button
              onClick={handleToggleEnabled}
              className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
                operatingHours.enabled ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-10 w-10 transform rounded-full bg-white transition-transform ${
                  operatingHours.enabled ? 'translate-x-12' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Operating Hours Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Set Operating Hours</h2>
          
          <form onSubmit={handleSaveTimings}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Open Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={operatingHours.openTime}
                  onChange={(e) => setOperatingHours({ ...operatingHours, openTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Canteen will automatically activate at this time
                </p>
              </div>

              {/* Close Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={operatingHours.closeTime}
                  onChange={(e) => setOperatingHours({ ...operatingHours, closeTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Canteen will automatically deactivate at this time
                </p>
              </div>
            </div>

            {/* Current Schedule Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Current Schedule</h3>
              <p className="text-blue-800">
                Your canteen will be <span className="font-bold">active</span> from{' '}
                <span className="font-bold">{operatingHours.openTime}</span> to{' '}
                <span className="font-bold">{operatingHours.closeTime}</span> daily.
              </p>
              {operatingHours.enabled && (
                <p className="text-blue-700 mt-2 text-sm">
                  ✓ Automatic scheduling is currently enabled
                </p>
              )}
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Operating Hours'}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">ℹ️ How it works</h4>
            <ul className="text-yellow-800 text-sm space-y-1 list-disc list-inside">
              <li>The system checks every minute if your canteen should be active or inactive</li>
              <li>Your canteen status will automatically change based on the current time</li>
              <li>You can still manually toggle your status at any time</li>
              <li>Manual changes will be overridden by the schedule when the next time window arrives</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OperatingHours;
