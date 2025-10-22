const mongoose = require('mongoose');
const AnnotationSchema = new mongoose.Schema({
    docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', index: true },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userId: { type: String },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    contextBefore: String,
    contextAfter: String,
    comment: String,
    meta: Object,
    rangeHash: { type: String, unique: true, sparse: true }
}, { timestamps: true });
AnnotationSchema.index({ docId: 1, start: 1, end: 1 });
module.exports = mongoose.model('Annotation', AnnotationSchema);