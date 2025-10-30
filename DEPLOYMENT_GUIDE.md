# 🚀 Deployment Guide - MESS & Canteen Management System

Complete guide for deploying your application to production.

---

## 📋 Pre-Deployment Checklist

### Code Review
- [x] All features tested locally
- [x] No console.log statements in production code (optional cleanup)
- [x] Environment variables properly configured
- [x] Error handling implemented
- [x] Security best practices followed

### Performance
- [x] Database queries optimized
- [x] Frontend bundle size optimized
- [x] Images and assets compressed
- [x] API response times acceptable

---

## 🗄️ Database Deployment (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create new cluster (Free tier available)
4. Wait for cluster to be created (2-5 minutes)
```

### 2. Configure Database Access
```
1. Go to Database Access → Add New Database User
2. Create username and strong password
3. Set user privileges to "Read and write to any database"
4. Save credentials securely
```

### 3. Configure Network Access
```
1. Go to Network Access → Add IP Address
2. For development: Add "0.0.0.0/0" (Allow from anywhere)
3. For production: Add specific server IPs
```

### 4. Get Connection String
```
1. Go to Database → Connect → Connect your application
2. Choose Node.js driver
3. Copy connection string
4. Replace <password> with your actual password
5. Replace <dbname> with your database name

Example:
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/canteen-booking?retryWrites=true&w=majority
```

---

## 🖥️ Backend Deployment (Heroku/Railway/Render)

### Option 1: Deploy to Render (Recommended - Free tier)

#### 1. Prepare Backend
```bash
cd backend

# Add start script to package.json (already exists)
# Ensure you have:
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

#### 2. Create Render Account
```
1. Go to https://render.com
2. Sign up with GitHub
3. Connect your repository
```

#### 3. Create Web Service
```
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - Name: mess-canteen-backend
   - Environment: Node
   - Region: Choose nearest
   - Branch: main
   - Root Directory: backend
   - Build Command: npm install
   - Start Command: npm start
```

#### 4. Set Environment Variables
```
In Render dashboard → Environment:

MONGO_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<generate-strong-secret-key>
PORT=5000
NODE_ENV=production
```

#### 5. Deploy
```
Click "Create Web Service"
Wait for deployment to complete (5-10 minutes)
Copy your backend URL (e.g., https://mess-canteen-backend.onrender.com)
```

### Option 2: Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
cd backend
railway init

# Add environment variables
railway variables set MONGO_URI=<your-mongodb-uri>
railway variables set JWT_SECRET=<your-jwt-secret>

# Deploy
railway up
```

---

## 🌐 Frontend Deployment (Netlify/Vercel)

### Option 1: Deploy to Netlify (Recommended)

#### 1. Prepare Frontend
```bash
cd frontend

# Update API URL in src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

# Create .env file for production
echo "REACT_APP_API_URL=https://your-backend-url.onrender.com/api" > .env.production
```

#### 2. Build Production Bundle
```bash
npm run build
# This creates an optimized build folder
```

#### 3. Deploy to Netlify

**Option A: Using Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Follow prompts:
# - Publish directory: build
# - Site name: mess-canteen-management
```

**Option B: Using Netlify Dashboard**
```
1. Go to https://www.netlify.com
2. Sign up/Login with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub repository
5. Configure:
   - Base directory: frontend
   - Build command: npm run build
   - Publish directory: frontend/build
6. Add environment variable:
   - REACT_APP_API_URL=https://your-backend-url.onrender.com/api
7. Click "Deploy site"
```

### Option 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend folder
cd frontend
vercel

# Set environment variable
vercel env add REACT_APP_API_URL production
# Enter: https://your-backend-url.onrender.com/api

# Deploy to production
vercel --prod
```

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS in Backend
```javascript
// backend/server.js
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-netlify-site.netlify.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### 2. Update Frontend API URL
```javascript
// frontend/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend.onrender.com/api';
```

### 3. Create Admin Account in Production
```bash
# Option 1: Use MongoDB Compass
1. Connect to your Atlas cluster
2. Go to admins collection
3. Insert document with hashed password

# Option 2: Create signup endpoint (temporarily)
POST https://your-backend.onrender.com/api/admin/register
{
  "username": "admin",
  "email": "admin@yourdomain.com",
  "password": "YourStrongPassword123!",
  "name": "Administrator"
}

# Remove the signup endpoint after creating admin
```

---

## 🔒 Security Best Practices

### Environment Variables
```bash
# Never commit these to GitHub:
✅ MONGO_URI
✅ JWT_SECRET
✅ API keys
✅ Passwords

# Use strong values:
JWT_SECRET: Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Additional Security
```javascript
// 1. Enable helmet for security headers
npm install helmet

// backend/server.js
import helmet from 'helmet';
app.use(helmet());

// 2. Rate limiting
npm install express-rate-limit

import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

---

## 📊 Monitoring & Logging

### 1. Error Tracking (Sentry)
```bash
# Install Sentry
npm install @sentry/node @sentry/react

# Backend: server.js
import * as Sentry from '@sentry/node';
Sentry.init({ dsn: process.env.SENTRY_DSN });

# Frontend: index.js
import * as Sentry from '@sentry/react';
Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
```

### 2. Analytics (Google Analytics)
```bash
# Install react-ga4
npm install react-ga4

# Add to App.js
import ReactGA from 'react-ga4';
ReactGA.initialize('G-XXXXXXXXXX');
```

---

## 🧪 Testing in Production

### 1. Smoke Tests
```
✅ Home page loads
✅ Student registration works
✅ Student login works
✅ Canteen registration works
✅ Admin login works
✅ API responses are fast (<2s)
✅ No console errors
✅ Mobile responsive
```

### 2. Integration Tests
```
✅ Place order end-to-end
✅ QR code generation
✅ Order verification
✅ Admin approval workflow
✅ CSV export
✅ Notifications
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          netlify deploy --prod --dir=build
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 📝 Domain Configuration (Optional)

### Custom Domain with Netlify
```
1. Buy domain from Namecheap/GoDaddy
2. In Netlify: Domain settings → Add custom domain
3. Update DNS records:
   - Type: A, Name: @, Value: 75.2.60.5
   - Type: CNAME, Name: www, Value: your-site.netlify.app
4. Enable HTTPS (automatic with Netlify)
```

---

## 🐛 Troubleshooting

### Common Issues

#### CORS Errors
```javascript
// Ensure backend allows frontend origin
const allowedOrigins = ['https://your-frontend.netlify.app'];
app.use(cors({ origin: allowedOrigins }));
```

#### Database Connection Fails
```
1. Check MongoDB Atlas IP whitelist
2. Verify connection string is correct
3. Ensure password doesn't contain special characters
4. Check MongoDB Atlas cluster status
```

#### Environment Variables Not Working
```
1. Restart deployment after adding variables
2. Check variable names match exactly
3. Verify .env.production exists for React
```

#### Build Fails
```
1. Check Node version compatibility
2. Clear npm cache: npm cache clean --force
3. Delete node_modules and reinstall
4. Check for missing dependencies
```

---

## 📈 Performance Optimization

### Frontend
```bash
# Code splitting
# Lazy loading
# Image optimization
# Minification (automatic in production build)
```

### Backend
```bash
# Database indexing
db.canteens.createIndex({ canteenId: 1 })
db.orders.createIndex({ studentUSN: 1 })
db.orders.createIndex({ canteenId: 1, createdAt: -1 })

# Response caching
# Connection pooling
# Load balancing
```

---

## 💰 Cost Estimation

### Free Tier (Hobby Projects)
```
MongoDB Atlas: Free (512MB)
Render: Free (750 hours/month)
Netlify: Free (100GB bandwidth)
Total: $0/month
```

### Paid Tier (Production)
```
MongoDB Atlas Shared: $9/month
Render Starter: $7/month
Netlify Pro: $19/month
Total: ~$35/month
```

---

## 📋 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user and password set
- [ ] Connection string obtained
- [ ] Backend deployed to Render/Railway
- [ ] Environment variables configured
- [ ] Backend URL obtained
- [ ] Frontend API URL updated
- [ ] Frontend built successfully
- [ ] Frontend deployed to Netlify/Vercel
- [ ] CORS configured correctly
- [ ] Admin account created
- [ ] All features tested in production
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled
- [ ] Monitoring set up (optional)

---

## 🎉 Success!

Your application is now live!

**Backend**: https://your-backend.onrender.com  
**Frontend**: https://your-frontend.netlify.app

---

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints manually
4. Check database connectivity
5. Review error messages

---

**Happy Deploying! 🚀**
