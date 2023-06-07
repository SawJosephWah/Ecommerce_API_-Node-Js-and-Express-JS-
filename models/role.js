const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
    name: String,
    permits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permit' }]
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;