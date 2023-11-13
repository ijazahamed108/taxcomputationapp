const mongoose = require('mongoose');

const AuditRecordChangeLogSchema = new mongoose.Schema({
  auditRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'taxAuditRecord',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  changes: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const AuditRecordHistory = mongoose.model('auditRecordChangeLog', AuditRecordChangeLogSchema);

module.exports = AuditRecordHistory;
