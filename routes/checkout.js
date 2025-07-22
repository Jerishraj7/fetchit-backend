const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/User"); // adjust path if needed
const Cart = require("../models/Cart");

router.post("/checkout", async (req, res) => {
  const { userId } = req.body;

  try {
    // 1. Get user info
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Get user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 3. Generate a random voucher code
    const voucherCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    // 4. Compose the email
    const itemList = cart.items.map((item, i) => `Item ${i + 1}: Product ID - ${item.productId}, Quantity - ${item.quantity}`).join('\n');
    const emailText = `
      Hello ${user.name},

      Thank you for your purchase at FetchIt 🎉
      
      Your unique voucher code is: ${voucherCode}

      Purchased items:
      ${itemList}

      Please present this code at your selected store to redeem your gift card.

      Regards,
      FetchIt Team
    `;

    // 5. Send the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail ID
        pass: process.env.EMAIL_PASS  // Gmail App Password
      }
    });

    await transporter.sendMail({
      from: `"FetchIt" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: " Your FetchIt Voucher Code",
      text: emailText
    });

module.exports = router;
