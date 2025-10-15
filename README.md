# 🍽️ Canteen/Mess Booking System (MERN Stack)

A full-stack web application for college students and canteen staff to manage food orders with QR code generation and verification.

## 🎯 Features

### 👨‍🎓 Student Features
- Login/Register with USN, Email, and Password
- View all active canteens
- Browse canteen menus by category
- Add items to cart and place orders
- Dummy payment system (no real transactions)
- Get unique Order ID and QR code for each order
- View order history
- Track order status (Confirmed/Served)

### 👨‍🍳 Canteen Features
- Login/Register with Canteen ID, Email, and Password
- Toggle canteen status (Active/Inactive)
- Manage menu items (Add/Edit/Delete)
- View today's orders in real-time
- Verify orders by:
  - Order number (e.g., 23)
  - Full Order ID (e.g., M1-20251015-23)
  - QR code scanning
- Auto-mapping of order numbers to full IDs
- Daily order counter (resets automatically)

## 🏗️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **qrcode** - QR code generation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **qrcode.react** - QR code display
- **Context API** - State management

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally)
- npm or yarn

### 1. Clone the Repository
```bash
cd MESS-CANTEEN-BOOKING
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory (already created):
```env
MONGO_URI=mongodb://127.0.0.1:27017/canteenBooking
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### 1. Start MongoDB
Make sure MongoDB is running on your local machine:
```bash
mongod
```

Or use MongoDB Compass to connect to `mongodb://127.0.0.1:27017`

### 2. Start Backend Server
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```
Backend will run on: **http://localhost:5000**

### 3. Start Frontend
```bash
cd frontend
npm start
```
Frontend will run on: **http://localhost:3000**

## 📊 Database Collections

### students
```javascript
{
  usn: String (unique),
  name: String,
  email: String (unique),
  passwordHash: String
}
```

### canteens
```javascript
{
  canteenId: String (unique),
  name: String,
  email: String (unique),
  passwordHash: String,
  status: String (active/inactive)
}
```

### menuitems
```javascript
{
  canteenId: String,
  name: String,
  price: Number,
  available: Boolean,
  category: String,
  description: String
}
```

### orders
```javascript
{
  orderId: String (unique),
  orderNumber: Number,
  canteenId: String,
  studentUSN: String,
  items: Array,
  totalAmount: Number,
  status: String,
  date: String,
  qrCode: String
}
```

### dailycounters
```javascript
{
  canteenId: String,
  date: String,
  lastOrderCount: Number
}
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/student/register` - Register student
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/canteen/register` - Register canteen
- `POST /api/auth/canteen/login` - Canteen login

### Canteens
- `GET /api/canteens/active` - Get all active canteens
- `PATCH /api/canteens/toggle` - Toggle canteen status (Auth)
- `GET /api/canteens/profile` - Get canteen profile (Auth)
- `GET /api/canteens/orders/today` - Get today's orders (Auth)
- `POST /api/canteens/verify` - Verify order (Auth)

### Menu
- `GET /api/menu/:canteenId` - Get menu by canteen
- `GET /api/menu/my/items` - Get canteen's menu items (Auth)
- `POST /api/menu/add` - Add menu item (Auth)
- `PUT /api/menu/update/:itemId` - Update menu item (Auth)
- `DELETE /api/menu/delete/:itemId` - Delete menu item (Auth)

### Orders
- `POST /api/orders/create` - Create order (Auth)
- `GET /api/orders/my-orders` - Get student's orders (Auth)
- `GET /api/orders/:orderId` - Get specific order (Auth)

## 🎨 Order ID Format

Orders follow this format: `<canteenId>-<YYYYMMDD>-<orderNumber>`

**Example:** `M1-20251015-23`
- `M1` - Canteen ID
- `20251015` - Date (October 15, 2025)
- `23` - Order number (23rd order of the day)

## 🔄 Order Flow

1. **Student** browses canteens and adds items to cart
2. **Student** confirms order (dummy payment)
3. **System** generates:
   - Unique Order ID
   - Sequential order number for the day
   - QR code with order details
4. **Student** receives order confirmation with QR code
5. **Student** shows QR code or order number at canteen
6. **Canteen** verifies order and marks as served

## 📱 Usage Guide

### For Students
1. Register/Login with USN, email, and password
2. Browse active canteens from dashboard
3. Click on a canteen to view menu
4. Add items to cart
5. Go to cart and confirm order
6. Get QR code and order number
7. Show at canteen for pickup

### For Canteens
1. Register/Login with Canteen ID, email, and password
2. Manage menu items (add/edit/delete)
3. Toggle status to active/inactive
4. View today's orders on dashboard
5. Use "Verify Orders" to scan QR or enter order number
6. System marks order as served

## 🛠️ Development

### Backend Structure
```
backend/
├── config/
│   └── db.js
├── models/
│   ├── Student.js
│   ├── Canteen.js
│   ├── MenuItem.js
│   ├── Order.js
│   └── DailyCounter.js
├── routes/
│   ├── auth.js
│   ├── canteen.js
│   ├── menu.js
│   └── order.js
├── middleware/
│   └── auth.js
├── .env
├── package.json
└── server.js
```

### Frontend Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── ProtectedRoute.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── student/
│   │   │   ├── StudentLogin.js
│   │   │   ├── StudentRegister.js
│   │   │   ├── StudentDashboard.js
│   │   │   ├── MenuPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── OrderConfirmation.js
│   │   │   └── MyOrders.js
│   │   └── canteen/
│   │       ├── CanteenLogin.js
│   │       ├── CanteenRegister.js
│   │       ├── CanteenDashboard.js
│   │       ├── ManageMenu.js
│   │       └── VerifyOrder.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes with role-based access
- Token stored in localStorage
- CORS enabled for local development

## 🎯 Future Enhancements
- Real payment gateway integration
- Email notifications
- SMS alerts
- Order scheduling
- Menu item images
- Rating and reviews
- Analytics dashboard
- Mobile app version

## 📝 Notes
- This is a **local-only** application (no hosting)
- **Dummy payment** system (no real transactions)
- Daily order counters reset automatically at midnight
- QR codes contain order details in JSON format
- All data stored in local MongoDB

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify port 27017 is not in use

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Set PORT in environment or kill process on 3000

### CORS Issues
- Ensure backend is running on port 5000
- Check API_BASE_URL in `frontend/src/services/api.js`

## 👥 Contributors
Built as a MERN Stack project for college canteen management.

## 📄 License
This project is for educational purposes.

---

**Happy Ordering! 🍕🍔🍟**
