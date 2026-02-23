const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

// Ensure environment variables are loaded here too, incase this route is required early
require("dotenv").config();

const router = express.Router();

let razorpayInstance;
try {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} catch (error) {
  console.error("Razorpay initialization failed:", error);
}

// @route POST /api/checkout/:id/create-razorpay-order
// @desc Create a razorpay order for a checkout session
// @access Private
router.post("/:id/create-razorpay-order", protect, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid checkout ID" });
  }

  try {
    const checkout = await Checkout.findById(id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to create order for this checkout" });
    }

    if (checkout.isPaid) {
      return res.status(400).json({ message: "Checkout is already paid" });
    }

    const options = {
      amount: Math.round(checkout.totalPrice * 100), // amount in the smallest currency unit (paise)
      currency: "INR", // Change to appropriate currency if needed
      receipt: `receipt_order_${checkout._id}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    // Ensure each item includes quantity
    const itemsWithQuantity = checkoutItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity || 1, // default to 1 if not provided
    }));

    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: itemsWithQuantity,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });

    console.log(`Checkout created for user: ${req.user._id}`);
    return res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { id } = req.params;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid checkout ID" });
  }

  try {
    const checkout = await Checkout.findById(id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this checkout" });
    }

    const crypto = require("crypto");
    const hmac = crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    );

    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      checkout.isPaid = true;
      checkout.paymentStatus = "paid";
      checkout.paymentDetails = {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      };
      checkout.paidAt = Date.now();

      await checkout.save();
      return res.status(200).json(checkout);
    } else {
      return res.status(400).json({ message: "Invalid Payment Signature" });
    }
  } catch (error) {
    console.error("Error updating payment:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid checkout ID" });
  }

  try {
    const checkout = await Checkout.findById(id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to finalize this checkout" });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      // Use checkoutItems as-is; quantity is already saved
      const orderItems = checkout.checkoutItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      await Cart.findOneAndDelete({ user: checkout.user });

      return res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    } else {
      return res.status(400).json({ message: "Checkout is not paid" });
    }
  } catch (error) {
    console.error("Finalize checkout error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
