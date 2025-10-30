# Admin Panel - Complete Feature Guide

## Overview
A comprehensive Admin Portal has been added to manage the entire Canteen Booking System with full authority over canteens, students, orders, and analytics.

---

## 🎯 Admin Features

### 1. **Canteen Management**
- ✅ **Approve/Reject Registrations** - Review and approve new canteen registrations
- ✅ **View All Canteens** - See complete list with filters (pending, approved, rejected)
- ✅ **Suspend/Activate Canteens** - Toggle canteen active status
- ✅ **View Revenue & Statistics** - See total orders and revenue per canteen
- ✅ **Export Canteen Data** - Download complete canteen information as CSV

### 2. **Student Management**
- ✅ **View All Students** - Complete student database with search functionality
- ✅ **Student Details** - View individual student profiles with order history
- ✅ **Order Statistics** - See total orders and spending per student
- ✅ **Activity Monitoring** - Track last order dates and activity patterns
- ✅ **Export Student Data** - Download student information and statistics as CSV

### 3. **Dashboard & Analytics**
- ✅ **System Overview** - Total canteens, students, orders, and revenue
- ✅ **Today's Statistics** - Real-time today's orders and revenue
- ✅ **Top Performing Canteens** - Leaderboard of highest revenue canteens
- ✅ **Recent Orders** - Live feed of latest orders across all canteens
- ✅ **Pending Approvals Alert** - Notification for canteens waiting approval

### 4. **Reports & Export**
- ✅ **Export Canteens** - CSV with all canteen details, revenue, and orders
- ✅ **Export Students** - CSV with student info, spending, and order counts
- ✅ **Export Orders** - CSV with complete order history and filtering
- ✅ **Revenue Reports** - Analytics by time period (day/week/month)
- ✅ **Canteen-wise Revenue** - Breakdown of revenue by each canteen

### 5. **Additional Admin Powers**
- ✅ **Rejection with Reason** - Provide detailed feedback when rejecting canteens
- ✅ **Quick Actions** - Fast navigation to key management areas
- ✅ **Real-time Data** - All statistics update automatically
- ✅ **Search & Filter** - Find specific students or canteens quickly

---

## 📁 File Structure

### Backend Files Created/Modified:
```
backend/
├── models/
│   ├── Admin.js (NEW) - Admin user model
│   └── Canteen.js (MODIFIED) - Added approval system
├── controllers/
│   └── adminController.js (NEW) - All admin operations
├── routes/
│   └── adminRoutes.js (NEW) - Admin API routes
├── middleware/
│   └── auth.js (MODIFIED) - Added admin authentication
└── server.js (MODIFIED) - Added admin routes
```

### Frontend Files Created/Modified:
```
frontend/src/
├── pages/admin/
│   ├── AdminLogin.js (NEW) - Admin login page
│   ├── AdminDashboard.js (NEW) - Main dashboard with analytics
│   ├── ManageCanteens.js (NEW) - Canteen management interface
│   └── ManageStudents.js (NEW) - Student management interface
├── services/
│   └── api.js (MODIFIED) - Added admin API endpoints
├── pages/
│   └── Home.js (MODIFIED) - Added admin portal option
└── App.js (MODIFIED) - Added admin routes
```

---

## 🔐 Admin Authentication

### Login Credentials
- **Route**: `/admin/login`
- **Required**: Username & Password
- **Roles**: `admin` or `super_admin`

### Permissions System
Admins can have granular permissions:
- `canApproveCanteens` - Approve/reject canteen registrations
- `canManageStudents` - View and manage student data
- `canViewReports` - Access analytics and export reports
- `canManageAdmins` - Create/manage other admin accounts (super admin only)

---

## 🛣️ Admin Routes

### Public Routes:
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Register new admin (protected in production)

### Protected Routes (Require Admin Auth):
- `GET /api/admin/profile` - Get admin profile
- `GET /api/admin/dashboard/stats` - Dashboard statistics

#### Canteen Management:
- `GET /api/admin/canteens` - Get all canteens (with filters)
- `PUT /api/admin/canteens/:id/approve` - Approve canteen
- `PUT /api/admin/canteens/:id/reject` - Reject canteen
- `PUT /api/admin/canteens/:id/toggle-status` - Suspend/activate

#### Student Management:
- `GET /api/admin/students` - Get all students
- `GET /api/admin/students/:id` - Get student details

#### Orders & Reports:
- `GET /api/admin/orders` - Get all orders (with filters)
- `GET /api/admin/reports/revenue` - Revenue analytics
- `GET /api/admin/export/canteens` - Export canteen data
- `GET /api/admin/export/students` - Export student data
- `GET /api/admin/export/orders` - Export order data

---

## 🚀 Getting Started

### 1. Create First Admin (One-time Setup)
```bash
# Use POST /api/admin/register with this payload:
{
  "username": "admin",
  "email": "admin@foodhub.com",
  "password": "secure_password",
  "name": "System Administrator",
  "role": "super_admin"
}
```

**Note**: In production, protect the `/api/admin/register` route or remove it after creating the first admin.

### 2. Access Admin Portal
1. Navigate to homepage: `http://localhost:3000`
2. Click on "Admin Portal" card
3. Login with admin credentials
4. Access full dashboard

---

## 📊 Key Admin Workflows

### Approving New Canteens:
1. Login to admin dashboard
2. Yellow alert shows pending approvals
3. Click "Review Now" or navigate to Canteens
4. Filter by "Pending"
5. Review canteen details
6. Click "Approve" or "Reject" (with reason)

### Monitoring Revenue:
1. Dashboard shows total & today's revenue
2. View "Top Performing Canteens" section
3. Navigate to specific canteen for details
4. Export data for detailed analysis

### Managing Students:
1. Go to "Manage Students"
2. Search by name, USN, or email
3. Click "View Details" to see order history
4. Export complete student database

### Generating Reports:
1. Click "Export Data" on any management page
2. CSV file downloads automatically
3. Import into Excel/Google Sheets for analysis

---

## 🎨 UI Design

### Color Scheme:
- **Admin Theme**: Indigo/Purple/Pink gradient
- **Primary Actions**: Green (approve), Red (reject/suspend)
- **Status Badges**: Color-coded (pending=yellow, active=green, rejected=red)

### Key Components:
- **Stat Cards**: Gradient cards with icons showing key metrics
- **Tables**: Sortable, searchable data tables
- **Modals**: For detailed views and confirmations
- **Alerts**: Prominent notifications for pending actions

---

## 🔒 Security Features

1. **Role-based Access Control** - Only admin role can access admin routes
2. **JWT Authentication** - Secure token-based authentication
3. **Protected Routes** - Frontend route guards
4. **Password Hashing** - bcrypt encryption for admin passwords
5. **Permission System** - Granular control over admin capabilities

---

## 📈 Future Enhancements (Optional)

- **Activity Logs** - Track all admin actions
- **Notification System** - Email alerts for pending approvals
- **Advanced Analytics** - Graphs and charts for trends
- **Bulk Operations** - Approve/reject multiple canteens at once
- **Role Management UI** - Manage admin roles from dashboard
- **Settings Panel** - System-wide configuration options

---

## 🐛 Important Notes

### Canteen Approval Flow:
1. Canteen registers → Status: `pending`
2. Admin reviews → Approves/Rejects
3. If approved → Status: `approved`, canteen becomes visible to students
4. If rejected → Status: `rejected`, admin provides reason

### Data Export Format:
All exports are in CSV format with these benefits:
- ✅ Easy to open in Excel/Google Sheets
- ✅ Can be imported into other systems
- ✅ Includes all relevant fields
- ✅ Timestamped filenames for organization

---

## 🎯 Admin Dashboard Quick Stats

The dashboard provides at-a-glance metrics:
- **Total Canteens** - All registered canteens (with active count)
- **Total Students** - All registered students
- **Total Orders** - System-wide order count (with today's count)
- **Total Revenue** - Complete revenue (with today's revenue)
- **Pending Approvals** - Count of canteens awaiting approval

---

## ✅ Complete Feature Checklist

- [x] Admin authentication & authorization
- [x] Canteen approval/rejection system
- [x] View all canteens with filters
- [x] Suspend/activate canteens
- [x] View all students with search
- [x] Student detail view with order history
- [x] Dashboard with analytics
- [x] Top performing canteens
- [x] Recent orders feed
- [x] Export canteen data (CSV)
- [x] Export student data (CSV)
- [x] Export order data (CSV)
- [x] Revenue analytics
- [x] Responsive UI design
- [x] Protected routes
- [x] Permission system

---

**Admin Panel is now fully operational! 🎉**

Access it at: `http://localhost:3000/admin/login`
