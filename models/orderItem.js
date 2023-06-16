const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    count: { type: Number, default: 1 },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' },
    price: Number,
    status: { type: String, enum: ["PENDING", "ACCEPT", "DELIVERED"] },
    created_at: { type: Date, default: Date.now }
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;