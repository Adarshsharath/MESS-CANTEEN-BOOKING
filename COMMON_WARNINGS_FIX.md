# 🔧 Common Warnings & Fixes

Guide to fix common warnings in MERN stack projects.

---

## ⚠️ Backend Warnings

### 1. DeprecationWarning: Mongoose `strictQuery`
```
Warning: (node:xxxxx) DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7.
```

**Fix in `backend/server.js`:**
```javascript
import mongoose from 'mongoose';

// Add this before mongoose.connect()
mongoose.set('strictQuery', false);

await mongoose.connect(process.env.MONGO_URI);
```

---

### 2. DeprecationWarning: `punycode` module
```
Warning: (node:xxxxx) [DEP0040] DeprecationWarning: The `punycode` module is deprecated.
```

**Fix:**
This is from URL parsing in older Node.js versions. Update dependencies:
```bash
cd backend
npm update
```

Or add to `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

### 3. Warning: Accessing non-existent property
```
Warning: Accessing non-existent property 'X' of module exports inside circular dependency
```

**Fix:** Check your import/export statements. Ensure:
```javascript
// Use named exports
export const functionName = () => {};

// Instead of
module.exports = { functionName };
```

---

### 4. MongoDB Connection Warnings
```
Warning: Current Server Discovery and Monitoring engine is deprecated
```

**Fix in connection string:**
```javascript
// Add these options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(process.env.MONGO_URI, options);
```

---

## ⚠️ Frontend Warnings

### 1. React Hook Dependencies Warning
```
Warning: React Hook useEffect has missing dependencies
```

**Fix:** Add missing dependencies or use ESLint disable comment:
```javascript
useEffect(() => {
  fetchData();
}, [fetchData]); // Add dependency

// OR if intentional:
useEffect(() => {
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

---

### 2. Console.log in Production
```
Warning: Unexpected console statement (no-console)
```

**Fix:** Remove console.logs or disable for specific lines:
```javascript
// For debugging, use:
if (process.env.NODE_ENV !== 'production') {
  console.log('Debug info');
}

// Or disable ESLint for that line:
// eslint-disable-next-line no-console
console.log('Important info');
```

---

### 3. Unused Variables
```
Warning: 'variable' is assigned a value but never used
```

**Fix:** Remove unused variables or prefix with underscore:
```javascript
// Remove if not needed
const unusedVar = 'value'; // Remove this

// Or prefix with _ if intentionally unused
const _unusedVar = 'value';
```

---

### 4. Key Prop Missing in Lists
```
Warning: Each child in a list should have a unique "key" prop
```

**Fix:**
```javascript
// Add unique key prop
{items.map((item, index) => (
  <div key={item.id}> {/* Use unique ID */}
    {item.name}
  </div>
))}

// Or use index only if items don't change order
{items.map((item, index) => (
  <div key={index}>
    {item.name}
  </div>
))}
```

---

### 5. Img Alt Attribute Warning
```
Warning: img elements must have an alt prop
```

**Fix:**
```javascript
// Add alt attribute
<img src={image} alt="Description" />

// Or use empty alt for decorative images
<img src={icon} alt="" />
```

---

### 6. Anchor Tag href Warning
```
Warning: The href attribute is required for an anchor to be keyboard accessible
```

**Fix:**
```javascript
// Use button instead of anchor if no navigation
<button onClick={handleClick}>Click me</button>

// Or add href
<a href="#section" onClick={handleClick}>Link</a>

// For external links
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>
```

---

## ⚠️ Package Warnings

### 1. Peer Dependency Warnings
```
Warning: EPENDENCY peer eslint@"^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-config-react-app
```

**Fix:**
```bash
# Update packages
npm update

# Or install specific version
npm install eslint@^8.0.0

# Or use --legacy-peer-deps flag
npm install --legacy-peer-deps
```

---

### 2. Deprecated Package Warnings
```
Warning: Package 'xyz' is deprecated
```

**Fix:**
```bash
# Find replacement package
npm outdated

# Update to latest version
npm install package@latest

# Or check package documentation for alternatives
```

---

### 3. High Severity Vulnerabilities
```
Warning: found X high severity vulnerabilities
```

**Fix:**
```bash
# Audit packages
npm audit

# Try automatic fix
npm audit fix

# For breaking changes
npm audit fix --force

# Update specific package
npm install package@latest
```

---

## ⚠️ Environment Variable Warnings

### 1. Missing Environment Variables
```
Warning: Environment variable 'MONGO_URI' is not defined
```

**Fix:**
```bash
# Create .env file in backend/
MONGO_URI=mongodb://localhost:27017/canteen-booking
JWT_SECRET=your_secret_key
PORT=5000

# For frontend, prefix with REACT_APP_
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 2. .env Not Loading
```
Warning: Cannot read properties of undefined
```

**Fix:**
```javascript
// Ensure dotenv is loaded at top of server.js
import dotenv from 'dotenv';
dotenv.config();

// Then access variables
const port = process.env.PORT || 5000;
```

---

## ⚠️ Build Warnings

### 1. Source Map Warnings
```
Warning: Failed to parse source map
```

**Fix in `frontend/.env`:**
```
GENERATE_SOURCEMAP=false
```

---

### 2. Bundle Size Warnings
```
Warning: The bundle size is significantly larger than recommended
```

**Fix:**
```javascript
// Use code splitting
const Component = React.lazy(() => import('./Component'));

// Use React.Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Component />
</Suspense>

// Analyze bundle
npm install --save-dev webpack-bundle-analyzer
```

---

## ⚠️ CORS Warnings

### 1. CORS Policy Error
```
Warning: Access to fetch at 'http://localhost:5000/api' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Fix in `backend/server.js`:**
```javascript
import cors from 'cors';

// Allow specific origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🔧 Quick Fixes Script

Create `fix-warnings.sh`:
```bash
#!/bin/bash

echo "Fixing common warnings..."

# Backend fixes
cd backend
npm update
npm audit fix

# Frontend fixes
cd ../frontend
npm update
npm audit fix

echo "Done! Restart your servers."
```

Make executable and run:
```bash
chmod +x fix-warnings.sh
./fix-warnings.sh
```

---

## 📋 Warning Prevention Checklist

### Before Committing Code:
- [ ] Remove all console.log statements
- [ ] Add keys to all mapped elements
- [ ] Add alt attributes to images
- [ ] Check for unused variables
- [ ] Review useEffect dependencies
- [ ] Test CORS with different origins
- [ ] Run `npm audit`
- [ ] Check .env file is in .gitignore

### Before Deployment:
- [ ] Build production bundle
- [ ] Check build warnings
- [ ] Test in production mode
- [ ] Verify environment variables
- [ ] Check bundle size
- [ ] Run security audit
- [ ] Test all API endpoints

---

## 🎯 Clean Code Practices

### 1. ESLint Configuration
```json
// .eslintrc.json
{
  "extends": ["react-app"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### 2. Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 🐛 Debug Mode

To see all warnings:
```bash
# Backend
NODE_ENV=development npm start

# Frontend
REACT_APP_DEBUG=true npm start
```

To hide warnings temporarily:
```bash
# Backend
NODE_NO_WARNINGS=1 npm start

# Frontend (not recommended)
DISABLE_ESLINT_PLUGIN=true npm start
```

---

## 📞 Still Have Warnings?

1. **Check the exact warning message**
2. **Search on Stack Overflow**
3. **Check package documentation**
4. **Update all dependencies**
5. **Clear node_modules and reinstall**

```bash
# Nuclear option (fixes most issues)
rm -rf node_modules package-lock.json
npm install
```

---

**Most warnings are safe to ignore in development, but fix them before production!**
