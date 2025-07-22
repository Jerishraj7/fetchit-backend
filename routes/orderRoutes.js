const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// POST: Create Order
router.post('/', async (req, res) => {
  try {
    const { userId, shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty or not found." });
    }

    // Calculate total amount from product prices × quantity
    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      const itemTotal = item.productId.price * item.quantity;
      totalAmount += itemTotal;

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
        itemTotal
      };
    });

    // Create new order
    const order = new Order({
      userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount
    });

    await order.save();

    res.status(201).json({ message: "✅ Order created successfully", order });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Orders by userId
router.get('/:userId', async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId }).populate('items.productId');
    res.json(order);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
