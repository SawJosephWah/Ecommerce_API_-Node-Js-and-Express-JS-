const mongoose = require('mongoose');
const { Schema } = mongoose;

const permitSchema = new Schema({
    name: String,
});

const Permit = mongoose.model('Permit', permitSchema);

module.exports = Permit;