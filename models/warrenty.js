const mongoose = require('mongoose');
const { Schema } = mongoose;

const warrentySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    remarks: {
        type: [String],
        required: true
    },
    created_at: { type: Date, default: Date.now }
});

const Warrnety = mongoose.model('Warrenty', warrentySchema);

module.exports = Warrnety;