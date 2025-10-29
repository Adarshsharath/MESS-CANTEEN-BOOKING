# 🍽️ MESS & Canteen Management System

> **Complete Food Ordering Platform for Educational Institutions**

A comprehensive full-stack web application for managing mess and canteen operations with separate portals for Students, Canteens, and Administrators.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🎯 Project Overview

This system streamlines food ordering and management in educational institutions by providing:
- **Students**: Easy food ordering with real-time order tracking
- **Canteens**: Order management, menu control, and automated scheduling
- **Admins**: Complete oversight with approval workflows, analytics, and reporting

---

## ✨ Key Features

### 👨‍🎓 Student Portal
- ✅ Browse approved canteens and menus
- 🛒 Shopping cart with real-time updates
- 📱 QR code generation for order pickup
- 📦 Order history and tracking
- 🔔 Real-time notifications
- 💳 Order confirmation and receipt

### 🏪 Canteen Portal
- ✅ Menu management (CRUD operations)
- 📊 Real-time order dashboard
- ⏰ Automated operating hours
- 🔄 Active/Inactive status toggle
- 📷 QR code scanner for order verification
- 📈 Revenue and order statistics
- 🔔 Pending approval notifications

### 👑 Admin Portal
- ✅ Canteen approval workflow (Approve/Reject/Suspend)
- 📊 Comprehensive analytics dashboard
- 💰 Revenue breakdown (Today/Month/Total)
- 🎓 Student management with spending analytics
- 📥 CSV export for all data
- 📊 Reports & Analytics page
- ⚙️ System settings and configuration
- 🔒 Security and access control

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router v6** - Navigation
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **QRCode.react** - QR code generation

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-cron** - Automated scheduling

---

## 📁 Project Structure

```
MESS-CANTEEN-BOOKING/
├── backend/
│   ├── models/           # Mongoose schemas
│   │   ├── Admin.js
│   │   ├── Canteen.js
│   │   ├── Student.js
│   │   ├── Order.js
│   │   ├── MenuItem.js
│   │   └── Notification.js
│   ├── routes/           # API endpoints
│   │   ├── adminRoutes.js
│   │   ├── auth.js
│   │   ├── canteen.js
│   │   ├── menu.js
│   │   ├── order.js
│   │   └── notification.js
│   ├── controllers/      # Business logic
│   │   └── adminController.js
│   ├── middleware/       # Auth & validation
│   │   └── auth.js
│   ├── schedulers/       # Automated tasks
│   │   └── canteenStatusScheduler.js
│   └── server.js         # Entry point
│
├── frontend/
│   └── src/
│       ├── components/   # Reusable components
│       ├── context/      # React contexts
│       │   ├── AuthContext.js
│       │   └── CartContext.js
│       ├── pages/        # Route pages
│       │   ├── admin/    # Admin pages
│       │   ├── canteen/  # Canteen pages
│       │   └── student/  # Student pages
│       ├── services/     # API services
│       │   └── api.js
│       └── App.js        # Main app
│
└── Documentation/        # Project docs
    ├── README.md         # This file
    ├── QUICKSTART.md     # Setup guide
    ├── APPROVAL_WORKFLOW.md
    ├── ADMIN_ENHANCEMENTS.md
    └── PROJECT_SUMMARY.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd MESS-CANTEEN-BOOKING

# 2. Setup Backend
cd backend
npm install

# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/canteen-booking" > .env
echo "JWT_SECRET=your_secret_key_here" >> .env
echo "PORT=5000" >> .env

# Start backend
npm start

# 3. Setup Frontend (new terminal)
cd ../frontend
npm install
npm start
```

### Default Login Credentials

**Admin:**
- Username: `admin`
- Password: `Admin@123`
- URL: `http://localhost:3000/admin/login`

**Test Canteen:**
- Canteen ID: `M1`
- Email: `vakula@canteen.com`
- Password: `canteen123`

**Test Student:**
- USN: `PES0UG00CS001`
- Password: `student123`

---

## 📊 Core Workflows

### 1. Canteen Registration & Approval
```
1. Canteen registers → Status: Pending
2. Admin reviews and approves
3. Canteen becomes visible to students
4. Canteen can accept orders
```

### 2. Student Food Ordering
```
1. Student browses approved canteens
2. Adds items to cart
3. Places order → Receives QR code
4. Picks up food → Canteen scans QR
5. Order marked as served
```

### 3. Admin Analytics
```
1. View dashboard with real-time stats
2. Monitor revenue (Today/Month/Total)
3. Export reports as CSV
4. Manage canteens and students
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (Student/Canteen/Admin)
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS configuration

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet and desktop optimized
- ✅ Touch-friendly interfaces
- ✅ Modern gradient designs

---

## 🎨 UI/UX Highlights

- **Color-coded indicators** (Blue=Today, Purple=Month, Green=Total)
- **Gradient cards** for better visual hierarchy
- **Real-time updates** with auto-refresh
- **Toast notifications** for user feedback
- **Loading states** and error handling
- **QR code integration** for seamless verification

---

## 📈 Database Schema

### Collections:
1. **admins** - Admin users
2. **canteens** - Canteen details & approval status
3. **students** - Student accounts
4. **menuitems** - Food items per canteen
5. **orders** - Order transactions
6. **notifications** - Real-time alerts

---

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/student/register` - Student signup
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/canteen/register` - Canteen signup (pending approval)
- `POST /api/auth/canteen/login` - Canteen login
- `POST /api/auth/admin/login` - Admin login

### Canteen Operations
- `GET /api/canteens/active` - Get approved canteens only
- `GET /api/menu/:canteenId` - Get canteen menu
- `POST /api/menu/add` - Add menu item
- `PATCH /api/canteens/toggle` - Toggle active status
- `PATCH /api/canteens/operating-hours` - Update operating hours

### Order Management
- `POST /api/orders` - Create order
- `GET /api/orders/student` - Student's orders
- `GET /api/canteens/orders/today` - Today's orders
- `PATCH /api/canteens/orders/:orderId/ready` - Mark ready
- `POST /api/canteens/verify` - Verify order with QR/number

### Admin Operations
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/canteens` - All canteens with filters
- `PUT /api/admin/canteens/:id/approve` - Approve canteen
- `PUT /api/admin/canteens/:id/reject` - Reject canteen
- `PUT /api/admin/canteens/:id/suspend` - Suspend canteen
- `GET /api/admin/students` - All students with analytics
- `GET /api/admin/export/canteens` - Export canteen data (CSV)
- `GET /api/admin/export/students` - Export student data (CSV)
- `GET /api/admin/export/orders` - Export order data (CSV)

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Student registration and login
- [ ] Browse canteens and menus
- [ ] Add items to cart and place order
- [ ] Canteen registration (pending approval)
- [ ] Admin approval workflow
- [ ] Canteen order management
- [ ] QR code generation and scanning
- [ ] Revenue analytics (Today/Month/Total)
- [ ] CSV export functionality
- [ ] Notification system
- [ ] Operating hours automation

---

## 📝 Documentation

Detailed documentation available in:
- `QUICKSTART.md` - Setup and installation
- `APPROVAL_WORKFLOW.md` - Canteen approval process
- `ADMIN_ENHANCEMENTS.md` - Admin features
- `PROJECT_SUMMARY.md` - Complete overview

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed with ❤️ for educational institutions

---

## 🙏 Acknowledgments

- React and Node.js communities
- MongoDB documentation
- TailwindCSS for amazing styling utilities

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Contact the development team

---

**🎉 Happy Ordering! 🍕**
