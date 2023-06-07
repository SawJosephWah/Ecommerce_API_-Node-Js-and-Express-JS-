const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    permits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permit' }],
    created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;