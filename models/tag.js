const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;