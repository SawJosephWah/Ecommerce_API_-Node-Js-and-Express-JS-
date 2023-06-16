const mongoose = require('mongoose');
const { Schema } = mongoose;

const deliverySchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    remarks: {
        type: [String],
        required: true
    },
    created_at: { type: Date, default: Date.now }
});

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;