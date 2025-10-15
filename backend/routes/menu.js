import express from 'express';
import MenuItem from '../models/MenuItem.js';
import Canteen from '../models/Canteen.js';
import { authenticateCanteen } from '../middleware/auth.js';

const router = express.Router();

// Get menu for a specific canteen (public route)
router.get('/:canteenId', async (req, res) => {
  try {
    const { canteenId } = req.params;
    const menuItems = await MenuItem.find({ canteenId }).sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add menu item (canteen only)
router.post('/add', authenticateCanteen, async (req, res) => {
  try {
    const { name, price, category, description, available } = req.body;
    const canteen = await Canteen.findById(req.userId);

    const menuItem = new MenuItem({
      canteenId: canteen.canteenId,
      name,
      price,
      category,
      description,
      available: available !== undefined ? available : true
    });

    await menuItem.save();

    res.status(201).json({
      message: 'Menu item added successfully',
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update menu item (canteen only)
router.put('/update/:itemId', authenticateCanteen, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, price, category, description, available } = req.body;
    const canteen = await Canteen.findById(req.userId);

    const menuItem = await MenuItem.findById(itemId);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.canteenId !== canteen.canteenId) {
      return res.status(403).json({ message: 'You can only update your own menu items' });
    }

    // Update fields
    if (name) menuItem.name = name;
    if (price !== undefined) menuItem.price = price;
    if (category) menuItem.category = category;
    if (description !== undefined) menuItem.description = description;
    if (available !== undefined) menuItem.available = available;

    await menuItem.save();

    res.json({
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete menu item (canteen only)
router.delete('/delete/:itemId', authenticateCanteen, async (req, res) => {
  try {
    const { itemId } = req.params;
    const canteen = await Canteen.findById(req.userId);

    const menuItem = await MenuItem.findById(itemId);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.canteenId !== canteen.canteenId) {
      return res.status(403).json({ message: 'You can only delete your own menu items' });
    }

    await MenuItem.findByIdAndDelete(itemId);

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get menu items for logged-in canteen
router.get('/my/items', authenticateCanteen, async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.userId);
    const menuItems = await MenuItem.find({ canteenId: canteen.canteenId }).sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
