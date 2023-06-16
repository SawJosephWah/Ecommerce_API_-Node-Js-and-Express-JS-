const mongoose = require('mongoose');
const { Schema } = mongoose;

const childCatSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    subCatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcat' },
    created_at: { type: Date, default: Date.now }
});

const ChildCat = mongoose.model('ChildCat', childCatSchema);

module.exports = ChildCat;