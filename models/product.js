const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    price: Number,
    brand: String,
    cat: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subcat: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcat' },
    childcat: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildCat' },
    tag: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag' },
    discount: { type: Number, default: 0 },
    features: { type: [String], required: true },
    desc: String,
    details: String,
    status: Boolean,
    delivery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' }],
    warrenty: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Warrenty' }],
    colors: { type: [String], required: true },
    size: String,
    rating: { type: String, default: "0" },
    images: { type: [String], required: true },
    created_at: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;