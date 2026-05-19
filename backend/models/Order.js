const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  nameTelugu: String,
  image: String,
  weight: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestInfo: { name: String, email: String, phone: String },
  items: [orderItemSchema],
  shippingAddress: {
    name: String, phone: String, street: String,
    city: String, state: String, pincode: String, country: String,
  },
  itemsTotal: { type: Number, required: true },
  shippingCharge: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['razorpay', 'cod', 'whatsapp'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  isNRIOrder: { type: Boolean, default: false },
  trackingNumber: String,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
