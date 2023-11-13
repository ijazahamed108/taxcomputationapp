const mongoose = require('mongoose');

const TaxAuditRecordSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    upiId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    financialYear: {
        type: String,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
});

const TaxAuditRecord = mongoose.model('TaxAuditRecord', TaxAuditRecordSchema);

module.exports = TaxAuditRecord;