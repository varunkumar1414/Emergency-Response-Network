const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    report: { type: String, required: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID
    location: { type: String, required: true },
    emergency: { type: String, enum: ['RED', 'YELLOW', 'GREEN'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
