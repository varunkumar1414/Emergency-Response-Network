const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    emergency: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved', 'in-progress'], default: 'pending' },
    location: { type: String, required: true },
    code: { type: String, enum: ['RED', 'YELLOW', 'GREEN'], required: true }, // RED = High Priority
    assignedTo: { type: String, default: null }, // Username of responder
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, { timestamps: true });

module.exports = mongoose.model('Emergency', emergencySchema);
