const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// ✅ GET /api/cart/:userId
router.get('/:userId', async (req, res) => {
  console.log("GET /api/cart/" + req.params.userId);
  try {
    const existingCart = await Cart.findOne({ userId: req.params.userId });

    console.log("Cart:", existingCart);

    if (!existingCart) {
      return res.status(404).json({ message: 'No cart found or cart is empty' });
    }

    res.json(existingCart);
  } catch (err) {
    console.error("❌ Error fetching cart:", err);
    res.status(500).json({ message: 'Server error fetching cart', error: err.message });
  }
});

// ✅ POST /api/cart
router.post('/', async (req, res) => {
  try {
    const { userId, items } = req.body;
    console.log("UserId for Cart Post", userId);
    if (!userId || !Array.isArray(items)) {
      return res.status(400).json({ message: 'userId and items are required' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      console.log("New cart created");
      cart = new Cart({ userId, items: [] });
    }

    console.log("Existing cart", cart);

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number') {
        continue; // skip bad item
      }

      const index = cart.items.findIndex(i => i.productId.toString() === item.productId);

      if (index !== -1) {
        cart.items[index].quantity += 1;
      } else {
        cart.items.push(item);
      }
    }

    

    const savedCart = await cart.save();

    console.log("Cart created:" , savedCart);

    res.status(201).json({ message: 'Cart updated successfully', savedCart });

  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    res.status(500).json({ message: 'Server error adding to cart', error: err.message });
  }
});

// ✅ DELETE /api/cart/:userId --> body: { productId: "..." }
router.delete('/:userId', async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required in the request body' });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { items: { productId: productId } } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }

    res.json({ message: 'Item removed from cart', updatedCart });
  } catch (err) {
    console.error("❌ Error deleting item from cart:", err);
    res.status(500).json({ message: 'Server error deleting item', error: err.message });
  }
});



module.exports = router;
