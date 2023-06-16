const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],
    count: Number,
    total: Number,
    created_at: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;