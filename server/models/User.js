const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, sparse: true },
    avatar: String
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);