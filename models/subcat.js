const mongoose = require('mongoose');
const { Schema } = mongoose;

const subCatSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    catId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    childs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChildCat' }],
    created_at: { type: Date, default: Date.now }
});

const SubCat = mongoose.model('Subcat', subCatSchema);

module.exports = SubCat;