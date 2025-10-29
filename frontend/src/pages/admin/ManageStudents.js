import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllStudents();
      setStudents(response.data);
    } catch (err) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const viewStudentDetails = async (studentId) => {
    try {
      const response = await adminAPI.getStudentDetails(studentId);
      setSelectedStudent(response.data);
    } catch (err) {
      alert('Failed to load student details');
    }
  };

  const handleExport = async () => {
    try {
      const response = await adminAPI.exportStudents();
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
      a.download = `students-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (err) {
      alert('Failed to export data');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
              <p className="text-sm text-gray-600 mt-1">View and monitor student activity</p>
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
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none"
              placeholder="Search by name, USN, or email..."
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">🎓</span>
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Total</span>
            </div>
            <p className="text-white/80 text-sm mb-1">Total Students</p>
            <p className="text-4xl font-bold">{students.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">📦</span>
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Orders</span>
            </div>
            <p className="text-white/80 text-sm mb-1">Total Orders</p>
            <p className="text-4xl font-bold">
              {students.reduce((sum, s) => sum + (s.totalOrders || 0), 0)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">💰</span>
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Revenue</span>
            </div>
            <p className="text-white/80 text-sm mb-1">Total Spent</p>
            <p className="text-4xl font-bold">
              ₹{students.reduce((sum, s) => sum + (s.totalSpent || 0), 0)}
            </p>
          </div>
        </div>

        {/* Students List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'No students match your search' : 'No students registered yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">USN</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Today</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">This Month</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Order</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.department || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-gray-900">{student.usn}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{student.email}</p>
                        <p className="text-xs text-gray-500">{student.phone || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-center">
                          <p className="font-bold text-blue-700">₹{student.todaySpent || 0}</p>
                          <p className="text-xs text-blue-600">{student.todayOrders || 0} orders</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-center">
                          <p className="font-bold text-purple-700">₹{student.monthSpent || 0}</p>
                          <p className="text-xs text-purple-600">{student.monthOrders || 0} orders</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-center">
                          <p className="font-bold text-green-700">₹{student.totalSpent || 0}</p>
                          <p className="text-xs text-green-600">{student.totalOrders || 0} orders</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {student.lastOrder 
                            ? new Date(student.lastOrder).toLocaleDateString()
                            : 'Never'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => viewStudentDetails(student._id)}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-semibold text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl my-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedStudent.student.name}</h3>
                <p className="text-gray-600">USN: {selectedStudent.student.usn}</p>
                <p className="text-sm text-gray-500">{selectedStudent.student.email}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-blue-600 font-semibold mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-blue-700">{selectedStudent.statistics.totalOrders}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-green-600 font-semibold mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-green-700">₹{selectedStudent.statistics.totalSpent}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-xs text-purple-600 font-semibold mb-1">Completed</p>
                <p className="text-2xl font-bold text-purple-700">{selectedStudent.statistics.completedOrders}</p>
              </div>
            </div>

            {/* Order History */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Order History</h4>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {selectedStudent.orders.length > 0 ? (
                  selectedStudent.orders.map((order) => (
                    <div key={order._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.canteenId?.name || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'served' ? 'bg-green-100 text-green-800' :
                            order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {order.status}
                          </span>
                          <p className="font-bold text-gray-900 mt-1">₹{order.totalAmount}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{order.items.length} items • {new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No orders yet</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
