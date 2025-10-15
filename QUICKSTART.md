# 🚀 Quick Start Guide

## Prerequisites Check
- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running
- [ ] npm or yarn installed

## Step-by-Step Setup

### 1️⃣ Install Backend Dependencies
```bash
cd backend
npm install
```

### 2️⃣ Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 3️⃣ Start MongoDB
**Option A: Command Line**
```bash
mongod
```

**Option B: MongoDB Compass**
- Open MongoDB Compass
- Connect to: `mongodb://127.0.0.1:27017`

### 4️⃣ Start Backend Server
Open a new terminal:
```bash
cd backend
npm start
```
✅ Backend running at: **http://localhost:5000**

### 5️⃣ Start Frontend
Open another terminal:
```bash
cd frontend
npm start
```
✅ Frontend running at: **http://localhost:3000**

## 🎉 You're Ready!

### Test the Application

#### As a Student:
1. Go to http://localhost:3000
2. Click "Student Register"
3. Fill in details:
   - USN: `1MS21CS001`
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
4. Login and explore!

#### As a Canteen:
1. Go to http://localhost:3000
2. Click "Canteen Register"
3. Fill in details:
   - Canteen ID: `M1`
   - Name: `Main Canteen`
   - Email: `canteen@example.com`
   - Password: `password123`
4. Login and add menu items!

## 🔧 Common Issues

### Port Already in Use
**Backend (5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Frontend (3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### MongoDB Not Running
```bash
# Start MongoDB service
# Windows: Start MongoDB service from Services
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Module Not Found
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 Test Credentials

### Sample Student
- USN: `1MS21CS001`
- Email: `student@test.com`
- Password: `test123`

### Sample Canteen
- Canteen ID: `M1`
- Email: `canteen@test.com`
- Password: `test123`

## 🎯 Quick Test Flow

1. **Register Canteen** → Add menu items → Activate canteen
2. **Register Student** → Browse canteens → Add items to cart
3. **Place Order** → Get QR code and order number
4. **Canteen Verify** → Enter order number → Mark as served

## 📞 Need Help?

Check the main [README.md](README.md) for detailed documentation.

---

**Happy Coding! 🎉**
