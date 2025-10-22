const mongoose = require('mongoose');
const DocumentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mimeType: String,
    extractedText: { type: String, default: '' },
    size: Number
}, { timestamps: true });
module.exports = mongoose.model('Document', DocumentSchema);
