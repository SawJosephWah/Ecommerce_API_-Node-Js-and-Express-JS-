const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    subcats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcat' }],
    created_at: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;