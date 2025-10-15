# 📝 Useful Commands Reference

## 🚀 Installation Commands

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## ▶️ Running Commands

### Start MongoDB
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Start Backend Server
```bash
cd backend
npm start              # Production mode
npm run dev           # Development mode with nodemon
```

### Start Frontend
```bash
cd frontend
npm start             # Development server
npm run build         # Production build
```

## 🧹 Cleanup Commands

### Remove node_modules and reinstall
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Clear MongoDB Database
```bash
# Connect to MongoDB shell
mongosh

# Use the database
use canteenBooking

# Drop all collections
db.students.drop()
db.canteens.drop()
db.menuitems.drop()
db.orders.drop()
db.dailycounters.drop()

# Or drop entire database
db.dropDatabase()
```

## 🔍 Debugging Commands

### Check if ports are in use
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Mac/Linux
lsof -ti:5000
lsof -ti:3000
```

### Kill process on port
```bash
# Windows
taskkill /PID <PID> /F

# Mac/Linux
kill -9 <PID>
# or
lsof -ti:5000 | xargs kill -9
```

### Check MongoDB status
```bash
# Windows
net start MongoDB

# Mac
brew services list

# Linux
sudo systemctl status mongod
```

## 📊 MongoDB Commands

### Connect to MongoDB
```bash
mongosh
# or
mongo
```

### View all databases
```bash
show dbs
```

### Use canteen database
```bash
use canteenBooking
```

### View all collections
```bash
show collections
```

### Query collections
```bash
# View all students
db.students.find().pretty()

# View all canteens
db.canteens.find().pretty()

# View all orders
db.orders.find().pretty()

# Count documents
db.orders.countDocuments()

# Find specific order
db.orders.findOne({ orderId: "M1-20251015-23" })

# View today's orders for a canteen
db.orders.find({ canteenId: "M1", date: "20251015" }).pretty()
```

### Update documents
```bash
# Update canteen status
db.canteens.updateOne(
  { canteenId: "M1" },
  { $set: { status: "active" } }
)

# Update menu item availability
db.menuitems.updateOne(
  { name: "Dosa" },
  { $set: { available: true } }
)
```

### Delete documents
```bash
# Delete a specific order
db.orders.deleteOne({ orderId: "M1-20251015-23" })

# Delete all orders for a canteen
db.orders.deleteMany({ canteenId: "M1" })

# Delete old orders (example)
db.orders.deleteMany({ date: { $lt: "20251001" } })
```

## 🧪 Testing API with curl

### Test Backend Health
```bash
curl http://localhost:5000
```

### Student Registration
```bash
curl -X POST http://localhost:5000/api/auth/student/register \
  -H "Content-Type: application/json" \
  -d '{
    "usn": "1MS21CS001",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Student Login
```bash
curl -X POST http://localhost:5000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "usn": "1MS21CS001",
    "password": "password123"
  }'
```

### Get Active Canteens
```bash
curl http://localhost:5000/api/canteens/active
```

### Get Menu (replace M1 with canteen ID)
```bash
curl http://localhost:5000/api/menu/M1
```

## 🔐 Environment Variables

### Backend .env
```env
MONGO_URI=mongodb://127.0.0.1:27017/canteenBooking
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

## 📦 Package Management

### Update all packages
```bash
# Backend
cd backend
npm update

# Frontend
cd frontend
npm update
```

### Check for outdated packages
```bash
npm outdated
```

### Install specific version
```bash
npm install package-name@version
```

## 🐛 Common Fixes

### Fix npm permission errors
```bash
# Windows: Run as Administrator
# Mac/Linux:
sudo npm install -g npm
```

### Clear npm cache
```bash
npm cache clean --force
```

### Fix React port conflict
```bash
# Create .env in frontend folder
echo "PORT=3001" > .env
```

### Reinstall React Scripts
```bash
cd frontend
npm install react-scripts@latest
```

## 📱 Development Tools

### Install nodemon globally (for backend dev)
```bash
npm install -g nodemon
```

### Install MongoDB Compass
Download from: https://www.mongodb.com/try/download/compass

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (API testing)
- Prettier - Code formatter

## 🎯 Quick Commands Summary

```bash
# Full setup (run once)
cd backend && npm install
cd ../frontend && npm install

# Start everything (3 terminals)
Terminal 1: mongod
Terminal 2: cd backend && npm start
Terminal 3: cd frontend && npm start

# Access application
Frontend: http://localhost:3000
Backend: http://localhost:5000
MongoDB: mongodb://127.0.0.1:27017
```

## 🔄 Git Commands (Optional)

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MERN Canteen Booking System"

# Add remote and push
git remote add origin <your-repo-url>
git push -u origin main
```

---

**Keep this file handy for quick reference! 📌**
