import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    emailNotifications: true,
    autoApproveCanteens: false,
    maxOrdersPerStudent: 10,
    systemMaintenanceMode: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In real implementation, this would save to backend
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const SettingCard = ({ icon, title, description, children }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );

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
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Configure system preferences and policies</p>
            </div>
            <button
              onClick={handleSave}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Profile */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              👑
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name || user?.username}</h2>
              <p className="text-indigo-100">{user?.email}</p>
              <p className="text-sm text-indigo-200 mt-1">Role: {user?.role || 'Admin'}</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Notifications */}
          <SettingCard
            icon="🔔"
            title="Notifications"
            description="Manage how you receive notifications about system events"
          >
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-700">Push Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => setSettings({...settings, notificationsEnabled: e.target.checked})}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-700">Email Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </label>
            </div>
          </SettingCard>

          {/* Canteen Management */}
          <SettingCard
            icon="🏪"
            title="Canteen Management"
            description="Configure canteen approval and management settings"
          >
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <span className="font-medium text-gray-700">Auto-Approve Canteens</span>
                  <p className="text-xs text-gray-500">Automatically approve canteen registrations</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoApproveCanteens}
                  onChange={(e) => setSettings({...settings, autoApproveCanteens: e.target.checked})}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </label>
            </div>
          </SettingCard>

          {/* Order Management */}
          <SettingCard
            icon="📦"
            title="Order Management"
            description="Set limits and rules for order processing"
          >
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block font-medium text-gray-700 mb-2">
                  Max Orders Per Student (Daily)
                </label>
                <input
                  type="number"
                  value={settings.maxOrdersPerStudent}
                  onChange={(e) => setSettings({...settings, maxOrdersPerStudent: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  min="1"
                  max="50"
                />
                <p className="text-xs text-gray-500 mt-1">Set to 0 for unlimited orders</p>
              </div>
            </div>
          </SettingCard>

          {/* System Configuration */}
          <SettingCard
            icon="⚙️"
            title="System Configuration"
            description="Advanced system settings and maintenance"
          >
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <span className="font-medium text-gray-700">Maintenance Mode</span>
                  <p className="text-xs text-gray-500">Disable student and canteen access temporarily</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.systemMaintenanceMode}
                  onChange={(e) => setSettings({...settings, systemMaintenanceMode: e.target.checked})}
                  className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                />
              </label>
            </div>
          </SettingCard>

          {/* Data Management */}
          <SettingCard
            icon="💾"
            title="Data Management"
            description="Backup and data management options"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left">
                <p className="font-semibold text-blue-700 mb-1">📥 Backup Data</p>
                <p className="text-xs text-blue-600">Create system backup</p>
              </button>
              <button className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left">
                <p className="font-semibold text-green-700 mb-1">📊 Export Analytics</p>
                <p className="text-xs text-green-600">Download all reports</p>
              </button>
              <button className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left">
                <p className="font-semibold text-purple-700 mb-1">🗑️ Clear Cache</p>
                <p className="text-xs text-purple-600">Clear system cache</p>
              </button>
              <button className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left">
                <p className="font-semibold text-orange-700 mb-1">🔄 Reset Statistics</p>
                <p className="text-xs text-orange-600">Reset all counters</p>
              </button>
            </div>
          </SettingCard>

          {/* Security */}
          <SettingCard
            icon="🔒"
            title="Security Settings"
            description="Manage security and access control"
          >
            <div className="space-y-3">
              <button className="w-full p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors text-left">
                <p className="font-semibold text-indigo-700 mb-1">🔑 Change Password</p>
                <p className="text-xs text-indigo-600">Update your admin password</p>
              </button>
              <button className="w-full p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left">
                <p className="font-semibold text-green-700 mb-1">👥 Manage Admins</p>
                <p className="text-xs text-green-600">Add or remove admin accounts</p>
              </button>
              <button className="w-full p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors text-left">
                <p className="font-semibold text-yellow-700 mb-1">📋 View Activity Log</p>
                <p className="text-xs text-yellow-600">Check admin activity history</p>
              </button>
            </div>
          </SettingCard>
        </div>

        {/* Save Button (Bottom) */}
        <div className="mt-8">
          <button
            onClick={handleSave}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {saved ? '✓ Settings Saved Successfully!' : '💾 Save All Changes'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
