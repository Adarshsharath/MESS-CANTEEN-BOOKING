# 🧪 Sample Data for Testing

Use this sample data to quickly test the application.

## 👨‍🎓 Sample Students

### Student 1
```json
{
  "usn": "1MS21CS001",
  "name": "Rahul Kumar",
  "email": "rahul@college.edu",
  "password": "student123"
}
```

### Student 2
```json
{
  "usn": "1MS21CS002",
  "name": "Priya Sharma",
  "email": "priya@college.edu",
  "password": "student123"
}
```

### Student 3
```json
{
  "usn": "1MS21EC015",
  "name": "Amit Patel",
  "email": "amit@college.edu",
  "password": "student123"
}
```

## 👨‍🍳 Sample Canteens

### Main Canteen (M1)
```json
{
  "canteenId": "M1",
  "name": "Main Canteen",
  "email": "main.canteen@college.edu",
  "password": "canteen123"
}
```

### Mess 2 (M2)
```json
{
  "canteenId": "M2",
  "name": "North Block Mess",
  "email": "north.mess@college.edu",
  "password": "canteen123"
}
```

### Cafeteria (C1)
```json
{
  "canteenId": "C1",
  "name": "College Cafeteria",
  "email": "cafeteria@college.edu",
  "password": "canteen123"
}
```

## 🍽️ Sample Menu Items

### For Main Canteen (M1)

#### Breakfast
```json
[
  {
    "name": "Idli Sambar",
    "price": 30,
    "category": "Breakfast",
    "description": "Soft idlis with sambar and chutney",
    "available": true
  },
  {
    "name": "Masala Dosa",
    "price": 40,
    "category": "Breakfast",
    "description": "Crispy dosa with potato filling",
    "available": true
  },
  {
    "name": "Poha",
    "price": 25,
    "category": "Breakfast",
    "description": "Flattened rice with vegetables",
    "available": true
  },
  {
    "name": "Vada",
    "price": 20,
    "category": "Breakfast",
    "description": "Crispy lentil fritters (2 pieces)",
    "available": true
  }
]
```

#### Lunch
```json
[
  {
    "name": "Veg Thali",
    "price": 60,
    "category": "Lunch",
    "description": "Rice, 2 rotis, dal, sabzi, curd",
    "available": true
  },
  {
    "name": "Paneer Butter Masala",
    "price": 80,
    "category": "Lunch",
    "description": "Paneer in rich tomato gravy",
    "available": true
  },
  {
    "name": "Chole Bhature",
    "price": 70,
    "category": "Lunch",
    "description": "Spicy chickpeas with fried bread",
    "available": true
  },
  {
    "name": "Biryani",
    "price": 90,
    "category": "Lunch",
    "description": "Aromatic rice with vegetables",
    "available": true
  }
]
```

#### Snacks
```json
[
  {
    "name": "Samosa",
    "price": 15,
    "category": "Snacks",
    "description": "Crispy pastry with potato filling (2 pieces)",
    "available": true
  },
  {
    "name": "Pav Bhaji",
    "price": 50,
    "category": "Snacks",
    "description": "Spicy vegetable curry with bread",
    "available": true
  },
  {
    "name": "Sandwich",
    "price": 35,
    "category": "Snacks",
    "description": "Grilled vegetable sandwich",
    "available": true
  },
  {
    "name": "Pakora",
    "price": 30,
    "category": "Snacks",
    "description": "Mixed vegetable fritters",
    "available": true
  }
]
```

#### Beverages
```json
[
  {
    "name": "Tea",
    "price": 10,
    "category": "Beverages",
    "description": "Hot masala tea",
    "available": true
  },
  {
    "name": "Coffee",
    "price": 15,
    "category": "Beverages",
    "description": "Hot filter coffee",
    "available": true
  },
  {
    "name": "Cold Coffee",
    "price": 40,
    "category": "Beverages",
    "description": "Chilled coffee with ice cream",
    "available": true
  },
  {
    "name": "Lassi",
    "price": 30,
    "category": "Beverages",
    "description": "Sweet yogurt drink",
    "available": true
  },
  {
    "name": "Fresh Juice",
    "price": 35,
    "category": "Beverages",
    "description": "Seasonal fruit juice",
    "available": true
  }
]
```

### For North Block Mess (M2)

```json
[
  {
    "name": "Roti Sabzi",
    "price": 40,
    "category": "Lunch",
    "description": "4 rotis with seasonal vegetable curry",
    "available": true
  },
  {
    "name": "Dal Rice",
    "price": 45,
    "category": "Lunch",
    "description": "Steamed rice with dal tadka",
    "available": true
  },
  {
    "name": "Paratha",
    "price": 30,
    "category": "Breakfast",
    "description": "Stuffed paratha with curd",
    "available": true
  },
  {
    "name": "Upma",
    "price": 25,
    "category": "Breakfast",
    "description": "Semolina with vegetables",
    "available": true
  }
]
```

### For College Cafeteria (C1)

```json
[
  {
    "name": "Burger",
    "price": 50,
    "category": "Snacks",
    "description": "Veg burger with fries",
    "available": true
  },
  {
    "name": "Pizza Slice",
    "price": 60,
    "category": "Snacks",
    "description": "Cheese pizza slice",
    "available": true
  },
  {
    "name": "Pasta",
    "price": 70,
    "category": "Lunch",
    "description": "White sauce pasta",
    "available": true
  },
  {
    "name": "Maggi",
    "price": 30,
    "category": "Snacks",
    "description": "Instant noodles",
    "available": true
  },
  {
    "name": "Soft Drink",
    "price": 20,
    "category": "Beverages",
    "description": "Chilled soft drink",
    "available": true
  }
]
```

## 🧪 Testing Scenarios

### Scenario 1: Complete Order Flow
1. **Register Canteen**: Use M1 data
2. **Login as Canteen**: Add breakfast items
3. **Activate Canteen**: Toggle status to active
4. **Register Student**: Use Student 1 data
5. **Login as Student**: Browse M1 canteen
6. **Add to Cart**: Idli Sambar (2), Tea (1)
7. **Place Order**: Confirm order
8. **Get QR Code**: Note order number (e.g., 1)
9. **Switch to Canteen**: Login as M1
10. **Verify Order**: Enter order number "1"
11. **Mark Served**: Order status updated

### Scenario 2: Multiple Canteens
1. Register M1, M2, C1 canteens
2. Add menu items to each
3. Activate all canteens
4. Student browses all three
5. Orders from M1
6. Views order history

### Scenario 3: Cart Management
1. Student adds items from M1
2. Tries to add from M2 (cart clears)
3. Adds multiple items from M2
4. Updates quantities
5. Removes items
6. Places order

### Scenario 4: Menu Management
1. Canteen adds 10 menu items
2. Edits prices and descriptions
3. Marks some as unavailable
4. Deletes outdated items
5. Student sees only available items

## 📊 Sample Order Data

### Order 1
```json
{
  "orderId": "M1-20251015-1",
  "orderNumber": 1,
  "canteenId": "M1",
  "studentUSN": "1MS21CS001",
  "items": [
    {
      "name": "Idli Sambar",
      "price": 30,
      "quantity": 2
    },
    {
      "name": "Tea",
      "price": 10,
      "quantity": 1
    }
  ],
  "totalAmount": 70,
  "status": "confirmed",
  "date": "20251015"
}
```

### Order 2
```json
{
  "orderId": "M1-20251015-2",
  "orderNumber": 2,
  "canteenId": "M1",
  "studentUSN": "1MS21CS002",
  "items": [
    {
      "name": "Masala Dosa",
      "price": 40,
      "quantity": 1
    },
    {
      "name": "Coffee",
      "price": 15,
      "quantity": 2
    }
  ],
  "totalAmount": 70,
  "status": "confirmed",
  "date": "20251015"
}
```

## 🎯 Quick Test Commands

### Register Student via API
```bash
curl -X POST http://localhost:5000/api/auth/student/register \
  -H "Content-Type: application/json" \
  -d '{
    "usn": "1MS21CS001",
    "name": "Rahul Kumar",
    "email": "rahul@college.edu",
    "password": "student123"
  }'
```

### Register Canteen via API
```bash
curl -X POST http://localhost:5000/api/auth/canteen/register \
  -H "Content-Type: application/json" \
  -d '{
    "canteenId": "M1",
    "name": "Main Canteen",
    "email": "main.canteen@college.edu",
    "password": "canteen123"
  }'
```

## 💡 Tips for Testing

1. **Start with one canteen**: Register M1, add 5-6 items, test complete flow
2. **Use simple passwords**: "student123" and "canteen123" for easy testing
3. **Test order numbers**: Place 3-4 orders, verify sequential numbering
4. **Test QR codes**: Generate and verify using order number
5. **Test cart**: Add items, update quantities, remove items
6. **Test menu CRUD**: Add, edit, delete menu items
7. **Test status toggle**: Switch canteen active/inactive
8. **Test filters**: Browse menu by category
9. **Test order history**: Place multiple orders, view in "My Orders"
10. **Test verification**: Try both order number and full order ID

---

**Use this data to quickly populate and test your application! 🚀**
